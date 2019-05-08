<?php

namespace App\Repositories;

use App\Interfaces\EventInterface;
use App\Interfaces\EventTeamInterface;
use App\Interfaces\FacilityInterface;
use App\Interfaces\LineInterface;
use App\Interfaces\EventRuleInterface;
use App\Jobs\SendReplacementUser;
use App\Models\Event;
use App\Models\EventTeamSubAssignment;
use App\Models\EventTeamUser;
use App\Models\EventTeamUserAvailability;
use App\Models\User;
use App\Models\EventDoNotMatchTeam;
use App\Models\RsvpToken;
use App\Models\FacilitySurface;
use App\Models\Facility;
use App\Models\Line;
use App\Models\Pair;
use App\Models\Match;
use App\Library\UserGroupCalculator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\App;
use App\Jobs\SendRemovedParticipant;

class EventRepository implements EventInterface{

	private $s3_client;

	private $event_teams, $lines, $event_rules, $facilities;

	private $user_group_calculator;

	public function __construct(EventTeamInterface $event_teams, LineInterface $lines, EventRuleInterface $event_rules, FacilityInterface $facilities){

		$this->s3_client = App::make('aws')->createClient('s3');

		$this->event_teams = $event_teams;
		$this->lines = $lines;
		$this->event_rules = $event_rules;
		$this->facilities = $facilities;

		$this->user_group_calculator = new UserGroupCalculator();

	}

	// Find a user's ID given his / her username
	private function find_user_id($username, $facility_id){

		$user = User::where('username', '=', $username)->whereHas('facilities', function($query)use($facility_id){
			$query->where('id', '=', $facility_id);
		})->get();
		return count($user) > 0 ? $user[0]->id : false;

	}

	// Remove extra surfaces we have associated with an event if the max playing surface value provided is lower than the current number of associated surfaces
	private function remove_extra_surfaces($event, $request){

		if(isset($request['max_playing_surfaces']) && !empty($request['max_playing_surfaces'])){
			$current_surfaces_count = count($event->facility_surfaces->toArray());
			$num_of_surfaces_to_remove = $current_surfaces_count - $request['max_playing_surfaces'];
			if($num_of_surfaces_to_remove > 0){
				$associated_facility_surfaces = $event->facility_surfaces()->pluck('id')->toArray();
				rsort($associated_facility_surfaces);
				for($i = 0; $i < $num_of_surfaces_to_remove; $i++){
					$event->facility_surfaces()->detach($associated_facility_surfaces[$i]);
				}
			}
		}

	}

	// Create our lines tables array for social events
	private function parse_social_lines_tables($lines){

		$lines_tables_array = array();
		$lines_count = count($lines);
		if($lines_count > 8){
			$last_line_start_time = $lines[0]['start_time'];
			$last_line_sex = substr($lines[0]['line_play_time'], 0, 1);
			$table_lines_array = array();
			$index = 0;
			foreach($lines as $line){
				$sex = substr($line['line_play_type'], 0, 1);
				if(($line['start_time'] === $last_line_start_time && $sex === $last_line_sex) && $index != $lines_count - 1){
					array_push($table_lines_array, $line);
					$last_line_start_time = $line['start_time'];
					$last_line_sex = $sex;
				}
				else{
					if($index != $lines_count - 1){
						array_push($lines_tables_array, $table_lines_array);
						$table_lines_array = array($line);
					}
					else{
						array_push($table_lines_array, $line);
						array_push($lines_tables_array, $table_lines_array);
					}
					$last_line_start_time = $line['start_time'];
					$last_line_sex = $sex;
				}
				$index = $index + 1;
			}
		}
		else{
			array_push($lines_tables_array, $lines);
		}
		return $lines_tables_array;

	}

	// Create our lines tables array for league events
	private function parse_league_lines_tables($lines){

		$lines_tables_array = array();
		$table_lines_array = array();
		// Sort by match ID, then line play type, then line play type number
		$line_play_type_order = ['wd', 'ws', 'md', 'ms', 'xd', 'xs'];
		$lines = $lines->sort(function($a, $b)use($line_play_type_order){
			if($a->match_id === $b->match_id){
				if($a->line_play_type === $b->line_play_type){
					return $a->line_play_type_number < $b->line_play_type_number ? -1 : 1;
				}
				return array_search($a->line_play_type, $line_play_type_order);
			}
			return $a->match_id < $b->match_id ? -1 : 1;
		});
		$lines_count = count($lines);
		$current_match_id = null;
		$index = 1;
		foreach($lines as $line){
			if($line->match_id === $current_match_id || $current_match_id === null){
				array_push($table_lines_array, $line);
			}
			else{
				array_push($lines_tables_array, $table_lines_array);
				$table_lines_array = array($line);
			}
			if($index == $lines_count){
				array_push($lines_tables_array, $table_lines_array);
			}
			$current_match_id = $line->match_id;
			$index = $index + 1;
		}
		return $lines_tables_array;

	}

	// Set surfaces for lines for league events
	private function set_league_default_lines_surfaces($current_start_time, $current_round, $num_of_surfaces, $lines, $selected_surfaces){

		$count = 0;
		foreach($lines as $line){
			if($current_start_time !== $line->start_time || $current_round !== $line->matches->round){
				$count = 0;
			}
			$current_start_time = $line->start_time;
			$current_round = $line->matches->round;
			$line->update(array(
				'event_surface_number' => $selected_surfaces[$count]['event_surface_number']
			));
			$count = $count + 1;
			if($count === $num_of_surfaces){
				$count = 0;
			}
		}

	}

	// Set surfaces for lines for non-league events
	private function set_non_league_default_lines_surfaces($current_start_time, $num_of_surfaces, $lines, $selected_surfaces){

		$count = 0;
		foreach($lines as $line){
			if($current_start_time !== $line->start_time){
				$count = 0;
			}
			$current_start_time = $line->start_time;
			$line->update(array(
				'event_surface_number' => $selected_surfaces[$count]['event_surface_number']
			));
			$count = $count + 1;
			if($count === $num_of_surfaces){
				$count = 0;
			}
		}

	}

	// Set default surfaces for lines associated with an event
	private function set_default_lines_surfaces($event, $selected_surfaces){

		$num_of_surfaces = count($selected_surfaces);
		$lines = Line::with('matches')->where('event_id', '=', $event->id)->orderBy('start_time', 'ASC')->orderBy('id', 'ASC')->get();
		$current_start_time = $lines->min('start_time');
		$current_round = Match::where('event_id', '=', $event->id)->min('round');
		if($event->event_type === 'league'){
			$this->set_league_default_lines_surfaces($current_start_time, $current_round, $num_of_surfaces, $lines, $selected_surfaces);
		}
		else{
			$this->set_non_league_default_lines_surfaces($current_start_time, $num_of_surfaces, $lines, $selected_surfaces);
		}

	}

	// Sends an e-mail informing our event leader a user has been removed
	private function send_removed_participant_notification($event, $removed_user_id, $replacement_user){

		$removed_user = User::find($removed_user_id);
		$removed_user_name = $removed_user->first_name . ' ' . $removed_user->last_name;
		$event_leaders = $event->event_leaders()->select('email')->get()->toArray();
		$facility = Facility::find($event->facility_id);
		$facility_leaders = $facility->facility_leaders()->select('email')->get()->toArray();
		$leaders = array_values(array_merge($event_leaders, $facility_leaders));
		$leader_emails = array_unique(array_column($leaders, 'email'));
		foreach($leader_emails as $leader_email){
			dispatch(new SendRemovedParticipant($event, $removed_user_name, $replacement_user, $leader_email));
		}

	}

	// Get and parse lines per round by type
	private function get_lines_per_round($event){

		$match = Match::where('event_id', '=', $event->id)->first();
		$lines_per_round = Line::where('event_id', '=', $event->id)->where('match_id', '=', $match->id)->get();
		$line_play_types = array(
			'wd' => 0,
			'ws' => 0,
			'md' => 0,
			'ms' => 0,
			'xd' => 0,
			'xs' => 0
		);
		foreach($lines_per_round as $line){
			$line_play_types[$line['line_play_type']] = $line_play_types[$line['line_play_type']] + 1;
		};
		$event['line_play_types'] = $line_play_types;
		return $event;

	}

	// Turns array into CSV
	private function array_to_csv(array &$array){

		if(count($array) == 0){
			return null;
		}
		ob_start();
		$df = fopen('php://output', 'w');
		foreach($array as $row){
			fputcsv($df, $row);
		}
		fclose($df);
		return ob_get_clean();

	}

	// Select a replacement user for our user being replaced
	private function set_replacement_user($user_id, $event){

		$user = User::find($user_id);
		if($event->ranked == 0){
			$replacement_user = $event->users()->where('sex', '=', $user->sex)->wherePivot('waitlisted', '=', 1)->wherePivot('confirmed', '=', 0)
											   ->wherePivot('unavailable', '=', 0)->select('id', 'first_name', 'last_name', 'email')->orderBy('rsvped', 'ASC')->first();
			if(!empty($replacement_user)){
				$event->users()->updateExistingPivot($replacement_user->id, array(
					'confirmed' => 1,
					'waitlisted' => 0,
					'substitute' => 0,
					'unavailable' => 0
				));
				dispatch(new SendReplacementUser($event, $replacement_user));
			}
		}
		else{
			$replacement_user = null;
		}
		$this->send_removed_participant_notification($event, $user_id, $replacement_user);
		return $replacement_user;

	}

	// Replace user in a list of lines
	private function remove_user_in_lines($user_id, $replacement_user_id, $lines){

		foreach($lines as $line){
			if($line->line_type === 'singles'){
				if($line->pair_one_id == $user_id){
					Line::find($line->id)->update(array(
						'pair_one_id' => $replacement_user_id
					));
				}
				else if($line->pair_two_id == $user_id){
					Line::find($line->id)->update(array(
						'pair_two_id' => $replacement_user_id
					));
				}
			}
			else if($line->line_type === 'doubles'){
				$pair_ids = array(
					$line->pair_one_id,
					$line->pair_two_id
				);
				$pairs = Pair::whereIn('id', $pair_ids)->get();
				foreach($pairs as $pair){
					if($pair->user_one_id == $user_id){
						Pair::find($pair->id)->update(array(
							'user_one_id' => $replacement_user_id
						));
						break;
					}
					else if($pair->user_two_id == $user_id){
						Pair::find($pair->id)->update(array(
							'user_two_id' => $replacement_user_id
						));
						break;
					}
				}
			}
		}

	}

	// Get lines participant has been assigned to
	private function get_participant_lines($id, $user_id){

		// Get singles lines user is playing in
		$singles = Line::where('event_id', '=', $id)->where('line_type', '=', 'singles')->where(function($query)use($user_id){
			$query->where('pair_one_id', '=', $user_id)->orWhere('pair_two_id', '=', $user_id);
		})->get();
		// Get doubles lines user is playing in
		$user_pair_ids = Pair::where('user_one_id', '=', $user_id)->orWhere('user_two_id', '=', $user_id)->pluck('id');
		$doubles = Line::where('event_id', '=', $id)->where('line_type', '=', 'doubles')->where(function($query)use($user_pair_ids){
			$query->whereIn('pair_one_id', $user_pair_ids)->orWhereIn('pair_two_id', $user_pair_ids);
		})->get();
		return $doubles->merge($singles)->values();

	}

	// Creates an event team user record
	private function create_event_team_user($event_id, $event_team_id, $group_number, $sex, $user_id, $captain){

		return EventTeamUser::create(array(
			'event_id' => $event_id,
			'event_team_id' => $event_team_id,
			'group_number' => $group_number,
			'sex' => $sex,
			'user_id' => $user_id,
			'captain' => $captain
		));

	}

	// Set participant as a team captain
	private function set_participant_as_captain($event, $user){

		if($event->event_type === 'multifacility'){
			EventTeamUser::where('event_id', '=', $event->id)->where('captain', '=', 1)->update(array(
				'captain' => 0
			));
		}
		$event_team_user = EventTeamUser::where('event_id', '=', $event->id)->where('user_id', '=', $user->id)->get();
		if($event_team_user->count() > 0){
			$event_team_user->first()->update(array(
				'captain' => 1
			));
		}
		else{
			$this->create_event_team_user($event->id, null, null, $user->sex, $user->id, 1);
		}

	}

	// Add or update user event record for a substitute and then return the substitute's status
	private function add_or_update_user_event_substitute_record($event, $user_id){

		$all_participants = $this->get_all_participants($event->id);
		$participant = $all_participants->filter(function($participant)use($user_id){
			return $participant->id == $user_id;
		})->first();
		if($participant){
			$event->users()->updateExistingPivot($user_id, array(
				'substitute' => 1,
				'unavailable' => 0
			));
			$status = 'unavailable';
		}
		else{
			$event->users()->sync(array(
				$user_id => array(
					'confirmed' => 0,
					'waitlisted' => 0,
					'substitute' => 1,
					'unavailable' => 0
				)
			), false);
			$status = 'available';
		}
		return $status;

	}

	// Create event team user availability record
	private function create_event_team_user_availability_record($event, $event_team_user, $i, $status){

		$days_from_today = ($i - 1) * $event->rounds_interval;
		EventTeamUserAvailability::create(array(
			'event_team_user_id' => $event_team_user->id,
			'round' => $i,
			'date' => Date('Y-m-d', strtotime($event->start_date . " +$days_from_today days")),
			'status' => $status
		));

	}

	// Remove a user from a league when he has been assigned to a team and lines
	private function remove_user_from_league($event, $user){

		// Reset our event team user and event team user availability records
		$event_team_user = EventTeamUser::where('event_id', '=', $event->id)->where('user_id', '=', $user['user_id']);
		if($event_team_user->exists()){
			$event_team_user = $event_team_user->first();
			$event_team_user->update(array(
				'user_id' => null
			));
			EventTeamUserAvailability::where('event_team_user_id', '=', $event_team_user->id)->update(array(
				'line_id' => null
			));
		}
		// Update our singles lines
		Line::where('event_id', '=', $event->id)->where('line_type', '=', 'singles')->where('pair_one_id', '=', $user['user_id'])->whereHas('matches', function($query){
			$query->where('date', '>', date('Y-m-d'));
		})->update(array(
			'pair_one_id' => null
		));
		Line::where('event_id', '=', $event->id)->where('line_type', '=', 'singles')->where('pair_two_id', '=', $user['user_id'])->whereHas('matches', function($query){
			$query->where('date', '>', date('Y-m-d'));
		})->update(array(
			'pair_two_id' => null
		));
		// Update our doubles lines
		Pair::where('event_id', '=', $event->id)->where('user_one_id', '=', $user['user_id'])->where(function($query){
			$query->whereHas('line_pair_one.matches', function($query){
				$query->where('date', '>', date('Y-m-d'));
			})->orWhereHas('line_pair_two.matches', function($query){
				$query->where('date', '>', date('Y-m-d'));
			});
		})->update(array(
			'user_one_id' => null
		));
		Pair::where('event_id', '=', $event->id)->where('user_two_id', '=', $user['user_id'])->where(function($query){
			$query->whereHas('line_pair_one.matches', function($query){
				$query->where('date', '>', date('Y-m-d'));
			})->orWhereHas('line_pair_two.matches', function($query){
				$query->where('date', '>', date('Y-m-d'));
			});
		})->update(array(
			'user_two_id' => null
		));

	}

	/*
     * Check whether a user is a confirmed participant for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_event_participant($event_id, $user_id){

		return Event::find($event_id)->users()->where('id', '=', $user_id)->wherePivot('confirmed', '=', 1)->get()->count();

	}

	/*
     * Check whether a user is a captain for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_multifacility_captain($event_id, $user_id){

		return ($event_id && (Event::find($event_id)->event_type === 'multifacility') && (EventTeamUser::where('event_id', '=', $event_id)->where('user_id', '=', $user_id)->where('captain', '=', 1)->get()->count() > 0));

	}

	/*
     * Get all events associated with a user
     *
     * @param 	int	 	$user_id		Get events this user is related to
	 * @param	string	$privilege		Privilege of calling user
     *
     * @return  collection
     *
     */
	public function get($user_id, $privilege){

		if($privilege === 'participant'){
			return Event::whereHas('event_leaders', function($query)use($user_id){
				$query->where('id', '=', $user_id);
			})->orWhereHas('users', function($query)use($user_id){
				$query->where('id', '=', $user_id);
			})->with(array(
				'event_leaders' => function($query)use($user_id){
					$query->where('id', '=', $user_id);
				},
				'users' => function($query)use($user_id){
					$query->where('id', '=', $user_id);
				}
			))->with('facility_surfaces', 'event_team_users')->get();
		}
		else if($privilege === 'facility leader'){
			$user = User::with('facilities')->find($user_id);
			$user_facility_ids = $user->facilities->pluck('id')->toArray();
			return Event::with('facility_surfaces', 'event_team_users')->whereHas('facilities', function($query)use($user_facility_ids){
				$query->whereIn('id', $user_facility_ids);
			})->get();
		}
		else{
			return array();
		}

	}

	/*
     * Get info about an event
     *
     * @param 	int	 	$id							ID of event
	 * @param	boolean	$all_associated_users		Tells us whether to return all users who have RSVPed regardless of status
     *
     * @return  object
     *
     */
	public function get_by_id($id, $all_associated_users = false){

		$event = Event::with('event_leaders', 'facilities.activities', 'event_team_users')->find($id);
		$event['users'] = User::with(array(
			'events' => function($query)use($id, $all_associated_users){
				$query->where('event_id', '=', $id)->where('rsvped', '!=', null);
				if($all_associated_users === false){
					$query->where('unavailable', '=', 0);
				}
			}
		))->whereHas('events', function($query)use($id, $all_associated_users){
			$query->where('event_id', '=', $id)->where('rsvped', '!=', null);
			if($all_associated_users === false){
				$query->where('unavailable', '=', 0);
			}
		})->get();
		if($event->event_type === 'multifacility' && $event->comb_play !== null){
			$event = $this->get_lines_per_round($event);
		}
		return $event;

	}

	/*
     * Uodate the event start date
     *
     * @param 	int	 	$id							ID of event
	 * @param	date	$start_date		            Value to update event start date with
     *
     * @return  boolean
     *
     */
	public function update_start_date($id, $start_date){

        $event = Event::find($id);
		$event->update(array(
		    'start_date' => $start_date
        ));
        return true;

	}

	/*
     * Get info about an event using a RSVP token
     *
     * @param 	string	$token		RSVP token
     *
     * @return  mixed
     *
     */
	public function get_by_rsvp_token($token){

		$result = RsvpToken::where('token', '=', $token);
		if($result->exists()){
			$user = User::find($result->get()[0]->user_id);
			$event_id = $result->get()[0]->event_id;
			$event = Event::with('activities')->find($event_id);
			$available_start_times = array($event['start_time']);
			for($i = 1; $i < $event['num_of_start_times']; $i++){
				$minutes_from_start_time = $i * $event['standard_line_duration'];
				$additional_start_time = date('H:i:s', strtotime("+$minutes_from_start_time minutes", strtotime($event['start_time'])));
				array_push($available_start_times, $additional_start_time);
			}
			return array(
				'user_first_name' => $user->first_name,
				'user_last_name' => $user->last_name,
				'username' => $user->username,
				'name' => $event->name,
				'activity' => $event->activities->name,
				'event_type' => $event->event_type,
				'start_date' => $event->start_date,
				'start_time' => $event->start_time,
				'available_start_times' => $available_start_times
			);
		}
		else{
			return false;
		}

	}

	/*
     * Get all users associated with an event regardless of their status or RSVP response
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_all_participants($id){

		$event = Event::with('users')->find($id);
		return $event->users;

	}

	/*
     * Get a list of all participants corresponding to an event in CSV format
     *
     * @param 	int	 	$id				ID of event to look up
     * @param	array	$request		Values to narrow down search by
     *
     * @return  file
     *
     */
	public function get_participants_export($id, $request){

		$data = array(array('First Name', 'Last Name', 'Username', 'E-Mail', 'Team'));
		$event = Event::find($id);
		// Users considered as participants differ depending on whether complete event setup has occurred
		$users = $event->comb_play === null ? $this->get_confirmed_participants($id) : $this->get_confirmed_participants_with_lines($id);
		foreach($users as $user){
			if($request['gender'] != 'both' && $user->sex != $request['gender']){
				continue;
			}
			if($request['membership'] != 'both' && $user->membership_type != $request['membership']){
				continue;
			}
			if($request['age'] != 'both' && $user->age_type != $request['age']){
				continue;
			}
			if($request['status'] != 'both' && $user->active != ($request['status'] == 'active')){
				continue;
			}
			if($request['affiliation'] != 'all' && strpos(strtolower($user->affiliation), strtolower($request['affiliationValue'])) === false){
				continue;
			}
			$user_array = array($user->first_name, $user->last_name, $user->username, $user->email);
			$event_team_user = EventTeamUser::with('event_teams')->where('event_id', '=', $id)->where('user_id', '=', $user->id);
			if($event_team_user->exists()){
				$event_team_user = $event_team_user->first();
				array_push($user_array, $event_team_user->event_teams->name);
			}
			array_push($data, $user_array);
		}
		return $this->array_to_csv($data);

	}

	/*
     * Get all users not confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_non_confirmed_participants($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('rsvped', '=', null);
			}
		))->find($id);
		return $event->users;

	}

	/*
     * Get all users confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_confirmed_participants($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('unavailable', '=', 0)->wherePivot('rsvped', '!=', null);
			}
		))->find($id);
		return $event->users;

	}

	/*
     * Get all users confirmed for an event who have been assigned lines
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_confirmed_participants_with_lines($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('confirmed', '=', 1)->wherePivot('waitlisted', '=', 0)->wherePivot('unavailable', '=', 0)->wherePivot('rsvped', '!=', null);
			}
		))->find($id);
		return $event->users;

	}

    /*
     * Gets all participants who have not dropped for a specific event.  These are any
     * participants that have confirmed, even if they are unavailable
     *
	 * @param	int		 $id					ID of event
	 *
     * @return  boolean
     *
     */
	public function get_non_dropped_participants($id){

		$event = Event::find($id);
		if($event->event_type === 'multifacility' || $event->event_type === 'ladder'){
			return Event::with(array(
				'users' => function($query){
					$query->wherePivot('confirmed', '=', 1);
				}
			))->find($id);
		}
		else{
			return Event::with(array(
				'users' => function($query){
					$query->wherePivot('rsvped', '!=', null)->wherePivot('unavailable','=',0);
				}
			))->find($id);
		}

	}

	/*
     * Get all users waitlisted for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_waitlisted_participants($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('confirmed', '=', 0)->wherePivot('waitlisted', '=', 1)->wherePivot('unavailable', '=', 0)->wherePivot('rsvped', '!=', null);
			}
		))->find($id);
		return $event->users;

	}

	/*
     * Get only events where user is an event leader
     *
     * @param 	int	 	$user_id		Get events this user is leading
     *
     * @return  collection
     *
     */
	public function get_as_event_leader($user_id){

		return Event::whereHas('event_leaders', function($query)use($user_id){
			$query->where('id', '=', $user_id);
		})->get();

	}

	/*
     * Get only events where user is a captain
     *
     * @param 	int	 	$user_id		Get events this user is captain
     *
     * @return  collection
     *
     */
	public function get_as_captain($user_id){

		return Event::whereHas('event_team_users', function($query)use($user_id){
			$query->where('user_id', '=', $user_id)->where('captain', '=', 1);
		})->get();

	}

	/*
     * Get leaders for an event
     *
     * @param 	int	 	$id				ID of event
     *
     * @return  collection
     *
     */
	public function get_leaders($id){

		$event = Event::with('event_leaders')->find($id);
		return $event->event_leaders;

	}

	/*
	 * Creates a new event
	 *
	 * @param 	int	 	 $facility_id				ID of facility we will have our event
	 * @param   string	 $name						Name of our event
	 * @param 	int	 	 $activity_id				ID of sport / game of event
	 * @param   string   $event_type                Type of event, e.g. Social, Ladder
	 * @param   string   $event_sub_type            Sub Type of event, e.g. doubles, singles
	 * @param 	string	 $type_of_play				Gender or mixed
	 * @param   int      $rounds                    Number of rounds
	 * @param   string   $rounds_interval_metric    How rounds are measured, e.g. Days, Hours
	 * @param   int      $rounds_interval           How many rounds intervals
	 * @param   int      $standard_line_duration    Length of line duration in minutes.
	 * @param   string   $gender_type               Male, Female or Both
	 * @param   decimal  $participant_charge        Amount in dollars
	 * @param   boolean  $charge_cc                 Yes/no, charge CC or Debit cards
	 * @param   integer  $comb_play                 Yes/no, comb play
	 * @param   string   $image_url                 Image path
	 * @param 	date	 $start_date				Start date of event
	 * @param	time	 $start_time				Start time of event
	 * @param   integer  $teams_per_line            Number of teams per line
	 * @param   integer  $single_women_lines        Number of single women lines
	 * @param   integer  $single_men_lines          Number of single men lines
	 * @param   integer  $max_playing_surfaces      Max number of playing surfaces
	 * @param   integer  $ranked                    Yes/No
	 * @param   integer  $sets                      Number of sets
	 * @param	int		 $num_of_start_times		Number of start times for event
	 * @param	int		 $standard_line_duration	Duration of each line
	 * @param	string	 $event_leader_username		Username of user we want to make event leader
	 * @param   string   for_membership_type       	Membership type event is catered towards (guest or member)
	 * @param   string   for_age_type  				Whether event is for adults or children
	 * @param   int      for_active  				Whether event is for active or inactive members
	 *
	 * @return  int
	 *
	 */

	public function create($facility_id, $name, $activity_id, $event_type, $event_sub_type, $type_of_play, $rounds, $rounds_interval_metric, $rounds_interval,
						   $standard_line_duration, $gender_type, $participant_charge, $charge_cc, $start_date, $start_time, $num_of_start_times, $event_leader_username,
						   $for_membership_type, $for_age_type, $for_active){

		if(!empty($event_leader_username)){
			$user_id = $this->find_user_id($event_leader_username, $facility_id);
			if($user_id === false){
				return 'Event leader not found';
			}
		}
		$event = Event::create(array(
			'facility_id' => $facility_id,
			'name' => $name,
			'activity_id' => $activity_id,
			'event_type' => $event_type,
			'event_sub_type' => !empty($event_sub_type) ? $event_sub_type : null,
			'type_of_play' => $type_of_play,
			'rounds' => !empty($rounds) ? $rounds : null,
			'rounds_interval_metric' => !empty($rounds_interval_metric) ? $rounds_interval_metric : null,
			'rounds_interval' => !empty($rounds_interval) ? $rounds_interval : null,
			'standard_line_duration' => !empty($standard_line_duration) ? $standard_line_duration : null,
			'gender_type' => $gender_type,
			'participant_charge' => $participant_charge,
			'charge_cc' => $charge_cc,
			'start_date' => $start_date,
			'start_time' => $start_time,
			'num_of_start_times' => !empty($num_of_start_times) ? $num_of_start_times : null,
			'event_leader_username' => $event_leader_username,
			'for_membership_type' => $for_membership_type,
			'for_age_type' => $for_age_type,
			'for_active' => $for_active,
			'started' => 0,
			'completed' => 0
		));
		if(!empty($event_leader_username)){
			$event->users()->attach($user_id);
			$event->event_leaders()->attach($user_id);
		}
		return $event->id;

	}

	/*
     * Adds a leader to an event
     *
	 * @param	int		 $id					ID of event
     * @param	string	 $event_leader_username	Username of user we want to make event leader
     *
     * @return  mixed
     *
     */
	public function add_leader($id, $event_leader_username){

		$event = Event::find($id);
		$user_id = $this->find_user_id($event_leader_username, $event->facility_id);
		if($user_id){
			$event->event_leaders()->sync(array($user_id), false);
			return true;
		}
		else{
			return 'User with username not found';
		}

	}

	/*
     * Deletes an event leader
     *
	 * @param	int		 $id					ID of event
     * @param	int 	 $user_id				ID of event leader / user
     *
     * @return  boolean
     *
     */
	public function delete_leader($id, $user_id){

		$event = Event::find($id);
		$event->event_leaders()->detach($user_id);
		return true;

	}

	/*
     * Adds a participant to an event
     *
	 * @param	int		 $id							ID of event
     * @param	string	 $event_participant_username	Username of user we want to make an event participant
     * @param	string	 $participant_type				Participant or captain
	 * @param	boolean	 $rsvped						Tells us whether the user is auto rsvped
     * @param	boolean	 $waitlisted					Tells us whether the user is being waitlisted
	 * @param	time	 $preferred_start_time			Whether user has a preferred playing time
	 * @param	boolean	 $unavailable					Tells us whether to our participant is unavailable
	 *
     * @return  mixed
     *
     */
	public function add_participant($id, $event_participant_username, $participant_type, $rsvped = false, $waitlisted = false, $preferred_start_time = null, $unavailable = false){

		$event = Event::find($id);
		$user_id = $this->find_user_id($event_participant_username, $event->facility_id);
		if($user_id){
			$user = User::find($user_id);
			if(($event->gender_type === 'both' || $event->gender_type === $user->sex) || $event->event_type === 'multifacility'){
				$user_data = array(
					'rsvped' => $rsvped === false ? null : DB::raw('CURRENT_TIMESTAMP()'),
					'confirmed' => 0,
					'waitlisted' => $waitlisted === false ? 0 : 1,
					'substitute' => $waitlisted === false ? 0 : 1,
					'unavailable' => $unavailable === false ? 0 : 1,
					'preferred_start_time' => $preferred_start_time
				);
				if($event->event_type === 'ladder'){
                    $rsvpeds = $event->users()->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 0)->orderBy('singles_ladder_ranking')->get();
					$count = count($rsvpeds);
					if($count > 0) {
						$user_data['singles_ladder_ranking'] = $rsvpeds[$count-1]->pivot->singles_ladder_ranking+1;
					}
					else {
						$user_data['singles_ladder_ranking'] = 1;
					}
				}
				if($event->event_type === 'ladder' || $event->event_type === 'multifacility'){
					$user_data['confirmed'] = 1;
				}
				$event->users()->sync(array(
					$user_id => $user_data
				), false);
				if($event->event_type === 'multifacility' && !is_null($event->comb_play)){
					$this->event_teams->update_participant($event, $user->id, $user->sex);
				}
				if($participant_type === 'captain'){
					$this->set_participant_as_captain($event, $user);
				}
				return true;
			}
			else{
				return 'User gender differs from event gender';
			}
		}
		else{
			return 'User with username not found';
		}

	}

	/*
     * Adds participants to an event using an uploaded file
     *
	 * @param	int		$id			ID of event to add participants to
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
	public function add_participants($id, $file_key){

		$event = Event::find($id);
		$result = $this->s3_client->getObject(array(
			'Bucket' => env('AWS_S3_BUCKET', 'teams-r-it-images'),
			'Key' => $file_key
		));
		$body = $result['Body'];
		$line = strtok($body, "\r\n");
		$line_count = 2;
		$num_of_users_added = 0;
		$lines_not_added = array();
		while($line !== false){
			$line = strtok("\r\n");
			$values = explode(',', $line);
			$unavailable = false;
			if(strlen($values[0]) > 0){
				$preferred_start_time = isset($values[1]) ? strtolower(trim($values[1])) : null;
				if($preferred_start_time == '1' || $preferred_start_time === 'one' || $preferred_start_time === '1st'){
					$preferred_start_time = $event->start_time;
				}
				else if($preferred_start_time == '2' || $preferred_start_time === 'two' || $preferred_start_time === '2nd'){
					$preferred_start_time = date('H:i:s', strtotime($event->standard_line_duration . ' minutes', strtotime($event->start_time)));
				}
				else if($preferred_start_time == 'un' || $preferred_start_time == 'unavailable'){
					$unavailable = true;
					$preferred_start_time = null;
				}
				else{
					$preferred_start_time = null;
				}
				$result = $this->add_participant($id, trim($values[0]), null, true, false, $preferred_start_time, $unavailable);
				if($result === true){
					$num_of_users_added = $num_of_users_added + 1;
				}
				else{
					array_push($lines_not_added, $line_count);
				}
			}
			$line_count = $line_count + 1;
		}
		return array(
			'imported_count' => $num_of_users_added,
			'lines_not_added' => $lines_not_added
		);

	}

	/*
     * Updates participants contact information
     *
     * @param 	array  $participants	Updated participant contact information
     *
     */
	public function update_participants_contact_info($participants){

		foreach($participants as $participant){
			User::find($participant['id'])->update(array(
				'email' => $participant['email'],
				'phone' => $participant['phone']
			));
		}

	}

	/*
     * Marks an event as started
     *
	 * @param	int		 $id					ID of event
     *
     * @return  mixed
     *
     */
	public function start_event($id){

		$event = Event::find($id);
		if(count($event->facility_surfaces->toArray()) > 0 || in_array($event->event_type, array('ladder', 'multifacility'))){
			if($event->event_type == 'ladder' && count($this->event_rules->get($id)) == 0){
				return 'Event rules have not been set';
			}
			else{
				return $event->update(array(
					'started' => 1
				));
			}
		}
		else{
			return 'Event facility surfaces have not been set';
		}

	}

	/*
     * Marks an event as complete
     *
	 * @param	int		 $id					ID of event
     *
     * @return  int
     *
     */
	public function close_event($id){

		$event = Event::find($id);
		return $event->update(array(
			'completed' => 1
		));

	}

	/*
     * Adds a do not match request
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $pair_one_id			ID of team or user one
	 * @param 	int		 $pair_two_id			ID of team or user two
     *
     * @return  mixed
     *
     */
	public function add_do_not_match_request($id, $pair_one_id, $pair_two_id){

		$request = EventDoNotMatchTeam::where(function($query) use ($pair_two_id, $pair_one_id){
			$query->where('pair_one_id', '=', $pair_one_id);
			$query->where('pair_two_id', '=', $pair_two_id);
		})->orWhere(function($query) use ($pair_one_id, $pair_two_id){
			$query->where('pair_one_id', '=', $pair_two_id);
			$query->where('pair_two_id', '=', $pair_one_id);
		})->where('event_id', '=', $id);
		if(!$request->exists()){
			return EventDoNotMatchTeam::create(array(
				'event_id' => $id,
				'pair_one_id' => $pair_one_id,
				'pair_two_id' => $pair_two_id
			))->id;
		}
		else{
			return 'Request already exists';
		}

	}

	/*
     * Deletes a do not match request
     *
	 * @param	int		 $do_not_match_request_id			ID of request
     *
     * @return  boolean
     *
     */
	public function delete_do_not_match_request($do_not_match_request_id){

		return EventDoNotMatchTeam::find($do_not_match_request_id)->delete();

	}

	/*
     * Makes updates to an event
     *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $request							Values to update
     *
     * @return  int
     *
     */
	public function update($id, $request){

		$event = Event::find($id);
		$this->remove_extra_surfaces($event, $request);
		if($event->event_type !== 'multifacility'){
			if($request['has_playoff'] == 1){
				$teams_playoff_rounds_referenc_array = array(
					'2' => 1,
					'4' => 2,
					'6' => 3,
					'8' => 3,
					'16' => 4
				);
				$request['num_of_playoff_rounds'] = $teams_playoff_rounds_referenc_array[$request['num_of_teams']];
			}
			else{
				$request['num_of_playoff_rounds'] = 0;
			}
		}
		else{
			$request['num_of_playoff_rounds'] = $request['has_playoff'];
		}
		return $event->update($request);

	}

	/*
     * Makes updates event note
     *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $notes								Event notes
     *
     * @return  int
     *
     */
	public function update_notes($id, $notes){

		$event = Event::find($id);
		return $event->update(array(
			'notes' => $notes
		));

	}

	/*
	 * Calculate our set column widths if we want PDF to be split down the middle
     *
     * @return  object  $event						Event to get data from
	 * @param	array 	$scorecard_parameters		Scorecard parameters
     *
	 * @return	array 	$scorecard_parameters		Scorecard parameters
     *
     */
	public function calculate_set_columns_width($event, $scorecard_parameters){

		if($event->sets === 1){
			$set_width = '746px';
		}
		else if($event->sets === 3){
			$set_width = '366px';
		}
		else if($event->sets === 5){
			$set_width = '186px';
		}
		$scorecard_parameters['set_width'] = $set_width;
		return $scorecard_parameters;

	}

	/*
	 * Calculate our team column value font sizes depending on the length of users' names
     *
	 * @param	array 	$scorecard_parameters		Scorecard parameters
     *
	 * @return	array 	$scorecard_parameters		Scorecard parameters
     *
     */
	public function calculate_team_columns_font_sizes($scorecard_parameters){

		foreach($scorecard_parameters['lines_tables'] as &$table_lines){
			foreach($table_lines as &$line){
				if($line->line_type === 'doubles'){
					$pair_one_user_one_full_name = $line->pair_one->user_one ? $line->pair_one->user_one->first_name . ' ' . $line->pair_one->user_one->last_name : null;
					$pair_one_user_two_full_name = $line->pair_one->user_two ? $line->pair_one->user_two->first_name . ' ' . $line->pair_one->user_two->last_name : null;
					if(strlen($pair_one_user_one_full_name) > 15 || strlen($pair_one_user_two_full_name) > 15){
						$line->pair_one_font_size = '24px';
					}
					else{
						$line->pair_one_font_size = '30px';
					}
					$pair_two_user_one_full_name = $line->pair_two->user_one ? $line->pair_two->user_one->first_name . ' ' . $line->pair_two->user_one->last_name : null;
					$pair_two_user_two_full_name = $line->pair_two->user_two ? $line->pair_two->user_two->first_name . ' ' . $line->pair_two->user_two->last_name : null;
					if(strlen($pair_two_user_one_full_name) > 15 || strlen($pair_two_user_two_full_name) > 15){
						$line->pair_two_font_size = '24px';
					}
					else{
						$line->pair_two_font_size = '30px';
					}
				}
				else{
					$line->pair_one_font_size = '30px';
					$line->pair_two_font_size = '30px';
				}
			}
		}
		return $scorecard_parameters;

	}

	/*
     * Generates a scorecard for an event
     *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $size								Size of scorecard
	 * @param	date	 $round_date						Round for which we want to generate a scorecard for
     *
     * @return  file
     *
     */
	public function generate_scorecard($id, $size, $round_date){

		$format = array(
			'small' => 'A4-L',
			'medium' => 'Legal-L',
			'large' => 'A4-L'
		);
		$mpdf = new \Mpdf\Mpdf(array(
			'format' => $format[$size]
		));
		// Get event and lines info
		$event = $this->get_by_id($id);
		$lines = in_array($event->event_type, array('league', 'round robin')) ? $this->lines->get_event_lines($id, $round_date) : $this->lines->get_event_lines($id);
		if($event->event_type === 'social'){
			$lines_tables_array = $this->parse_social_lines_tables($lines);
		}
		else if($event->event_type === 'league' || $event->event_type === 'round robin'){
			$lines_tables_array = $this->parse_league_lines_tables($lines);
		}
		$scorecard_parameters = array(
			'size' => $size,
			'event_name' => $event->name,
			'event_type' => $event->event_type,
			'event_date' => date('l F j, Y', strtotime($event->start_date)),
			'round_date' => $round_date ? date('l F j, Y', strtotime($round_date)) : null,
			'facility_name' => $event->facilities->name,
			'sets' => $event->sets,
			'lines_tables' => $lines_tables_array,
		);
		if($size === 'large'){
			$scorecard_parameters = $this->calculate_set_columns_width($event, $scorecard_parameters);
		}
		$scorecard_parameters = $this->calculate_team_columns_font_sizes($scorecard_parameters);
		$view = View::make('scorecards.lines', $scorecard_parameters);
		$mpdf->WriteHTML($view->render());
		return $mpdf->Output();

	}

	/*
     * Get surfaces we are using for an event
     *
	 * @param	int		 $id								ID of event
     *
     * @return  collection
     *
     */
	public function get_surfaces($id){

		$facility_id = Event::find($id)->facility_id;
		$facility = Facility::with(array('activities' => function($query){
			$query->wherePivot('activity_id', '=', 1);
		}))->find($facility_id);
		$facility_tennis_surfaces = $facility->activities[0]->pivot->num_of_surfaces;
		return FacilitySurface::with('events')->where('facility_id', '=', $facility_id)->orderBy('facility_surface_number', 'ASC')->limit($facility_tennis_surfaces)->get();

	}

	/*
     * Updates surfaces to be used for an event
     *
	 * @param	int		 $id								ID of event
     * @param	array	 $selected_surfaces					Surfaces to be used for an event
	 *
     * @return  boolean
     *
     */
	public function update_selected_surfaces($id, $selected_surfaces){

		$event = Event::find($id);
		$event->facility_surfaces()->detach();
		if(is_array($selected_surfaces)){
			foreach($selected_surfaces as $surface){
				$event->facility_surfaces()->attach($surface['facility_surface_id'], array(
					'event_surface_number' => $surface['event_surface_number'],
					'emergency_surface' => $surface['emergency_surface']
				));
			}
			$this->set_default_lines_surfaces($event, $selected_surfaces);
			return true;
		}
		else{
			return false;
		}

	}

	/*
     * Get available surfaces for an event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  collection
     *
     */
	public function get_selected_surfaces($id){

		$event = Event::with('facility_surfaces')->find($id);
		return $event->facility_surfaces;

	}

	/*
     * Return list of users who's profile overlaps with the criteria set out by the event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  array
     *
     */
	public function get_default_participants($id){

		$event = Event::find($id);
		$activity_id = $event->activity_id;
		$facility = Facility::with('users')->find($event->facility_id);
		$default_participants = array();
		foreach($facility->users as $user){
			$user_activity_ids = $user->activities()->wherePivot('facility_id', '=', $facility->id)->pluck('id')->toArray();
			if($event->event_type === 'multifacility' || (($user->membership_type === $event->for_membership_type || $event->for_membership_type === 'both') && ($user->age_type === $event->for_age_type || $event->for_age_type === 'both') && ($user->active === $event->for_active || $event->for_active === 2) && ($user->sex === $event->gender_type || $event->gender_type === 'both') && in_array($activity_id, $user_activity_ids))){
				array_push($default_participants, $user);
			}
		}
		return $default_participants;

	}

	/*
     * Return list of users who's profile does not overlap with the criteria set out by the event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  array
     *
     */
	public function get_additional_participants($id){

		$event = Event::find($id);
		$facility = Facility::with('users')->find($event->facility_id);
		$additional_participants = array();
		foreach($facility->users as $user){
			if($event->event_type === 'multifacility' || (($user->membership_type !== $event->for_membership_type && $event->for_membership_type !== 'both') || ($user->age_type !== $event->for_age_type && $event->for_age_type !== 'both') || ($user->active !== $event->for_active && $event->for_active !== 2) || ($user->sex !== $event->gender_type && $event->gender_type !== 'both'))){
				array_push($additional_participants, $user);
			}
		}
		return $additional_participants;

	}

	/*
     * Return subsitututes for an event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  collection
     *
     */
	public function get_substitutes($id){

		$event= Event::with(array(
			'users' => function($query){
				$query->wherePivot('substitute', '=', 1);
			}
		))->find($id);
		return $event->users;

	}

	/*
     * Adds a new event sub
     *
	 * @param	int		 $id								ID of event
	 * @param	string	 $username							Username of new sub
	 *
     * @return  mixed
     *
     */
	public function add_substitute($id, $username){

		$event = Event::find($id);
		$user_id = $this->find_user_id($username, $event->facility_id);
		if($user_id){
			$event_substitutes = $this->get_substitutes($id);
			// Figure out whether the user is already a substitute
			$substitue = $event_substitutes->filter(function($substitute)use($user_id){
				return $substitute->id == $user_id;
			})->first();
			if($substitue){
				return true;
			}
			else{
				$status = $this->add_or_update_user_event_substitute_record($event, $user_id);
				$user = User::find($user_id);
				$closest_user_group_number = $this->user_group_calculator->get_closest_ranked_participant_group_number($event, $user);
				$event_team_user = $this->create_event_team_user($id, 0, $closest_user_group_number, $user->sex, $user_id, 0);
				for($i = 1; $i <= $event->rounds; $i++){
					$this->create_event_team_user_availability_record($event, $event_team_user, $i, $status);
				}
				return true;
			}
		}
		else{
			return 'User with username not found';
		}

	}

	/*
     * Assigns a sub to a particular team for a particular round
     *
	 * @param	int		$id									ID of event
	 * @param	int		$event_team_id						ID of event team to assign sub to
	 * @param	int		$event_team_user_availability_id	ID of availability record to assign
	 *
     * @return  int
     *
     */
	public function add_substitute_assignment($id, $event_team_id, $event_team_user_availability_id){

		return EventTeamSubAssignment::create(array(
			'event_id' => $id,
			'event_team_id' => $event_team_id,
			'event_team_user_availability_id' => $event_team_user_availability_id
		))->id;

	}

	/*
     * Removes a user from an event and any lines they are scheduled for in that event
     *
	 * @param	int		 $id								ID of event
	 * @param	int		 $user_id							ID of user to remove from event
	 *
     * @return  void
     *
     */
	public function remove_participant($id, $user_id){

		$event = Event::find($id);
		$event->users()->updateExistingPivot($user_id, array(
			'confirmed' => 0,
			'waitlisted' => 0,
			'substitute' => 0,
			'unavailable' => 1
		));
		if($event->comb_play === 0 || $event->comb_play === 1){
			$replacement_user = $this->set_replacement_user($user_id, $event);
		}
		$replacement_user_id = isset($replacement_user) && !empty($replacement_user) ? $replacement_user['id'] : null;
		$lines = $this->get_participant_lines($id, $user_id);
		$this->remove_user_in_lines($user_id, $replacement_user_id, $lines);

	}

	/*
     * Update user signup status for an event
     *
	 * @param	array		$event_user						Event user signup array
	 *
     * @return  void
     *
     */
	public function update_signup($event_user){

		$event = Event::find($event_user['event_id']);
		if($event_user['status'] === 'unavailable'){
			$event->users()->updateExistingPivot($event_user['user_id'], array(
				'preferred_start_time' => !empty($event_user['preferred_start_time']) ? $event_user['preferred_start_time'] : null
			));
			$this->remove_participant($event_user['event_id'], $event_user['user_id']);
		}
		else if($event_user['status'] === 'available'){
			$event->users()->updateExistingPivot($event_user['user_id'], array(
				'unavailable' => 0,
				'preferred_start_time' => !empty($event_user['preferred_start_time']) ? $event_user['preferred_start_time'] : null
			));
		}
		if($event->event_type === 'league' && in_array($event_user['status'], array('waitlisted', 'unavailable'))){
			$this->remove_user_from_league($event, $event_user);
		}

	}

	/*
     * Update user signup statuses for an event
     *
	 * @param	object		$event							Event object
	 * @param	array		$event_users					Event user signups array
	 *
     * @return  void
     *
     */
	public function update_signups($event, $event_users){

		foreach($event_users as $user){
			if($user['status'] === 'in'){
				$current_user = $event->users()->wherePivot('user_id', '=', $user['user_id'])->first();
				if($current_user->pivot->confirmed == 0){
					dispatch(new SendReplacementUser($event, $current_user));
				}
				$event->users()->updateExistingPivot($user['user_id'], array(
					'confirmed' => 1,
					'waitlisted' => 0,
					'substitute' => 0,
					'unavailable' => 0,
					'preferred_start_time' => !empty($user['preferred_start_time']) ? $user['preferred_start_time'] : null
				));
			}
			else if($user['status'] === 'waitlisted'){
				$event->users()->updateExistingPivot($user['user_id'], array(
					'confirmed' => 0,
					'waitlisted' => 1,
					'substitute' => 1,
					'unavailable' => 0,
					'preferred_start_time' => !empty($user['preferred_start_time']) ? $user['preferred_start_time'] : null
				));
			}
			else if($user['status'] === 'unavailable'){
				$event->users()->updateExistingPivot($user['user_id'], array(
					'confirmed' => 0,
					'waitlisted' => 0,
					'substitute' => 0,
					'unavailable' => 1,
					'preferred_start_time' => !empty($user['preferred_start_time']) ? $user['preferred_start_time'] : null
				));
			}
			else{
				$event->users()->updateExistingPivot($user['user_id'], array(
					'confirmed' => 0,
					'waitlisted' => 0,
					'substitute' => 0,
					'unavailable' => 0,
					'preferred_start_time' => !empty($user['preferred_start_time']) ? $user['preferred_start_time'] : null
				));
			}
			if($event->event_type === 'league' && in_array($user['status'], array('waitlisted', 'unavailable'))){
				$this->remove_user_from_league($event, $user);
			}
		}

	}

	/*
     * Get open time slots info for an event
     *
	 * @param	int			$id					ID of event
	 *
     * @return  object
     *
     */
	public function get_open_time_slots_info($id){

		return Event::with('users', 'lines.pair_one', 'lines.pair_two')->find($id);

	}

}