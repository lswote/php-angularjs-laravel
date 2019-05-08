<?php

namespace App\Repositories;

use App\Interfaces\EventTeamInterface;
use App\Models\EventTeamUser;
use App\Models\EventTeam;
use App\Models\EventTeamUserAvailability;
use App\Models\EventTeamSubAssignment;
use App\Models\Pair;
use App\Models\Line;
use App\Models\LineScore;
use App\Models\Match;
use App\Models\Event;
use App\Models\User;
use App\Models\Activity;
use App\Library\UserGroupCalculator;
use Illuminate\Support\Facades\App;
use App\Jobs\SendAvailabilityUpdate;

class EventTeamRepository implements EventTeamInterface{

	private $s3_client, $user_group_calculator;

	private $team_names, $singles_line_types, $female_line_types, $male_line_types, $multifacility_captain_user_id;

	public function __construct(){

		// Default team names
		$this->team_names = array('red', 'green', 'yellow', 'blue', 'orange', 'white', 'black', 'purple', 'cyan', 'magenta', 'lime', 'pink', 'teal', 'lavender', 'brown', 'beige', 
								  'maroon', 'mint', 'olive', 'coral', 'navy', 'grey', 'crimson', 'lightblue', 'violet');
		$this->singles_line_types = array('ws', 'ms', 'xs');
		$this->female_line_types = array('wd', 'ws', 'xd');
		$this->male_line_types = array('md', 'ms', 'xd');

		$this->s3_client = App::make('aws')->createClient('s3');
		$this->user_group_calculator = new UserGroupCalculator();

	}

	// Get info related to an event
	private function get_event($event_id){

		return Event::with('event_team_users')->with(array('users' => function($query){
			$query->wherePivot('rsvped', '!=', null)->where('unavailable', '=', 0);
		}))->find($event_id);

	}

	// Get all users who are available for an event
	private function get_event_users($event_id){

		return User::with(array('events' => function($query)use($event_id){
			$query->where('event_id', '=', $event_id)->where('rsvped', '!=', null)->where('unavailable', '=', 0);
		}))->whereHas('events', function($query)use($event_id){
			$query->where('event_id', '=', $event_id)->where('rsvped', '!=', null)->where('unavailable', '=', 0);
		})->get();

	}

	// Get female and male counts of available users
	private function parse_event_users($users){

		$female_count = 0;
		$male_count = 0;
		foreach($users as $user){
			if($user->sex === 'female'){
				$female_count = $female_count + 1;
			}
			else if($user->sex === 'male'){
				$male_count = $male_count + 1;
			}
		}
		return array(
			'female_count' => $female_count,
			'male_count' => $male_count
		);

	}

	// Use lines per round to calculate our team sizes
	private function calculate_team_sizes_using_lines($per_round_lines_aggregate){

		$females_per_team = 0;
		$males_per_team = 0;
		foreach($per_round_lines_aggregate as $line_type){
			if($line_type['line_play_type'] === 'wd'){
				$females_per_team = ($females_per_team + 2) * $line_type['count'];
			}
			else if($line_type['line_play_type'] === 'md'){
				$males_per_team = $males_per_team + 2 * $line_type['count'];
			}
			else if($line_type['line_play_type'] === 'ws'){
				$females_per_team = $females_per_team + 1 * $line_type['count'];
			}
			else if($line_type['line_play_type'] === 'ms'){
				$males_per_team = $males_per_team + 1 * $line_type['count'];
			}
			else if($line_type['line_play_type'] === 'xd'){
				$females_per_team = $females_per_team + 1 * $line_type['count'];
				$males_per_team = $males_per_team + 1 * $line_type['count'];
			}
		}
		return array(
			'females_per_team' => $females_per_team,
			'males_per_team' => $males_per_team
		);

	}

	// Create event team user availability record
	private function create_event_team_user_availability_record($event, $event_team_user, $i){

		$days_from_today = $i < 0 ? ($event->rounds - $i - 1) * $event->rounds_interval : ($i - 1) * $event->rounds_interval;
		EventTeamUserAvailability::create(array(
			'event_team_user_id' => $event_team_user->id,
			'round' => $i,
			'date' => $event->rounds_interval_metric === 'days' ? date('Y-m-d', strtotime($event->start_date . " +$days_from_today days")) : $event->start_date,
			'status' => 'available'
		));

	}

	// Create availability records for all regular season and playoff rounds
	private function create_user_availability_records_for_all_rounds($event, $event_team_user){

		for($i = 1; $i <= $event->rounds; $i++){
			$this->create_event_team_user_availability_record($event, $event_team_user, $i);
		}
		for($i = 1; $i <= $event->num_of_playoff_rounds; $i++){
			$this->create_event_team_user_availability_record($event, $event_team_user, -$i);
		}

	}

	// Create female event team user and event team user availability records
	private function create_female_event_team_user_records($event, $event_team, $females_per_team){

		$group_number_index = 1;
		$existing_female_records = EventTeamUser::where('event_id', '=', $event->id)->where('sex', '=', 'female')->whereNotNull('user_id');
		$existing_female_records = $existing_female_records->get();
		foreach($existing_female_records as $existing_female_record){
			$existing_female_record->update(array(
				'event_team_id' => $event_team->id,
				'group_number' => $group_number_index,
				'user_id' => null,
				'captain' => 0,
			));
			$group_number_index = $group_number_index + 1;
			$this->create_user_availability_records_for_all_rounds($event, $existing_female_record);
		}
		$existing_female_records_count = $existing_female_records->count();
		for($y = 0; $y < ($females_per_team - $existing_female_records_count); $y++){
			$event_team_user = $this->create_event_team_user($event->id, $group_number_index, $event_team->id, 'female', null, 0);
			$this->create_user_availability_records_for_all_rounds($event, $event_team_user);
			$group_number_index = $group_number_index + 1;
		}

	}

	// Create male event team user and event team user availability records
	private function create_male_event_team_user_records($event, $event_team, $males_per_team){

		$group_number_index = 1;
		$existing_male_records = EventTeamUser::where('event_id', '=', $event->id)->where('sex', '=', 'male')->whereNotNull('user_id');
		$existing_male_records = $existing_male_records->get();
		foreach($existing_male_records as $existing_male_record){
			$existing_male_record->update(array(
				'event_team_id' => $event_team->id,
				'group_number' => $group_number_index,
				'user_id' => null,
				'captain' => 0,
			));
			$group_number_index = $group_number_index + 1;
			$this->create_user_availability_records_for_all_rounds($event, $existing_male_record);
		}
		$existing_male_records_count = $existing_male_records->count();
		for($z = 0; $z < ($males_per_team - $existing_male_records_count); $z++){
			$event_team_user = $this->create_event_team_user($event->id, $group_number_index, $event_team->id, 'male', null, 0);
			$this->create_user_availability_records_for_all_rounds($event, $event_team_user);
			$group_number_index = $group_number_index + 1;
		}

	}

	// Calculate total number of playoff round matches after the first and second rounds
	private function calculate_additional_round_playoff_matches_count($previous_round_matches_count, $additional_round_matches = null){

		if($previous_round_matches_count > 1){
			$current_round_matches_count = $previous_round_matches_count / 2;
			if($additional_round_matches === null){
				$additional_round_matches = array(array(
					'round' => -3,
					'count' => $current_round_matches_count
				));
			}
			else{
				$current_round = -3 - count($additional_round_matches);
				array_push($additional_round_matches, array(
					'round' => $current_round,
					'count' => $current_round_matches_count
				));
			}
			return $this->calculate_additional_round_playoff_matches_count($current_round_matches_count, $additional_round_matches);
		}
		else{
			return $additional_round_matches;
		}

	}

	// Construct playoff rounds array for league / round robin events
	private function build_nonmultifacility_playoff_rounds_array($event_team_ids){

		$num_of_teams = count($event_team_ids);
		$first_round_matches_count = $num_of_teams / 2;
		if($num_of_teams > 2){
			if($first_round_matches_count % 2 !== 0){
				$second_round_matches_count = ($first_round_matches_count + 1) / 2;
			}
			else{
				$second_round_matches_count = $first_round_matches_count / 2;
			}
		}
		else{
			$second_round_matches_count = 0;
		}
		$playoff_rounds_matches = array(array(
			'round' => -1,
			'count' => $first_round_matches_count
	    ), array(
		 	'round' => -2,
			'count' => $second_round_matches_count
		));
		$additional_round_matches = $this->calculate_additional_round_playoff_matches_count($second_round_matches_count);
		if($additional_round_matches !== null){
			$playoff_rounds_matches = array_merge($playoff_rounds_matches, $additional_round_matches);
		}
		return $playoff_rounds_matches;

	}

	// Construct playoff rounds array for multifacility events
	private function build_multifacility_playoff_rounds_array($event){

		$playoff_rounds_matches = array();
		for($x = 1; $x <= $event->num_of_playoff_rounds; $x++){
			array_push($playoff_rounds_matches, array(
				'round' => -$x,
				'count' => 1
			));
		}
		return $playoff_rounds_matches;

	}

	// Construct our playoff rounds array
	private function build_playoff_rounds_array($event, $event_team_ids){

		if($event['event_type'] !== 'multifacility'){
			return $this->build_nonmultifacility_playoff_rounds_array($event_team_ids);
		}
		else{
			return $this->build_multifacility_playoff_rounds_array($event);
		}

	}

	// Create playoff matches
	private function create_playoff_matches($event, $playoff_rounds_array){

		$playoff_matches_array = array();
		foreach($playoff_rounds_array as $round){
			$days_from_today = ($event->rounds - $round['round'] - 1) * $event->rounds_interval;
			for($i = 0; $i < $round['count']; $i++){
				$match = Match::create(array(
					'event_id' => $event->id,
					'round' => $round['round'],
					'date' => $event->rounds_interval_metric === 'days' ? date('Y-m-d', strtotime($event->start_date . " +$days_from_today days")) : $event->start_date
				));
				array_push($playoff_matches_array, $match);
			}
		}
		return $playoff_matches_array;

	}

	// Saves existing team captain's user ID
	private function save_multifacility_captain_user_id($event){

		$captain = EventTeamUser::where('event_id', '=', $event->id)->where('captain', '=', 1);
		if($captain->exists()){
			$this->multifacility_captain_user_id = $captain->first()->user_id;
		}

	}

	// Create event team / group records and corresponding matches
	private function create_teams_and_matches($event, $females_per_team, $males_per_team){

		$event_team_ids = array();
		$matches_array = array();
		if($event->event_type !== 'multifacility'){
			$group_rounds = $event->rounds / ($event->num_of_teams - 1);
		}
		else{
			$group_rounds = $event->rounds;
			$this->save_multifacility_captain_user_id($event);
		}
		for($x = 0; $x < $event->num_of_teams; $x++){
			$event_team = EventTeam::create(array(
				'event_id' => $event->id,
				'name' => $this->team_names[$x]
			));
			$this->create_female_event_team_user_records($event, $event_team, $females_per_team);
			$this->create_male_event_team_user_records($event, $event_team, $males_per_team);
			array_push($event_team_ids, $event_team->id);
			if(count($event_team_ids) > 1){
				for($b = 1; $b <= $group_rounds; $b++){
					$last_event_team_ids_index = count($event_team_ids) - 1;
					for($a = count($event_team_ids) - 2; $a >= 0; $a--){
						$match = Match::create(array(
							'event_id' => $event->id,
							'event_team_one_id' => $event_team_ids[$last_event_team_ids_index],
							'event_team_two_id' => $event_team_ids[$a]
						));
						array_push($matches_array, $match);
					}
				}
			}
			else if($event->event_type === 'multifacility'){
				for($c = 1; $c <= $group_rounds; $c++){
					$days_from_today = ($c - 1) * $event->rounds_interval;
					$match = Match::create(array(
						'event_id' => $event->id,
						'event_team_one_id' => $event_team_ids[0],
						'round' => $c,
						'date' => date('Y-m-d', strtotime($event->start_date . " +$days_from_today days"))
					));
					array_push($matches_array, $match);
				}
			}
		}
		if($event->num_of_playoff_rounds > 0){
			$playoff_rounds_array = $this->build_playoff_rounds_array($event, $event_team_ids);
			$playoff_matches_array = $this->create_playoff_matches($event, $playoff_rounds_array);
			$matches_array = array_merge($matches_array, $playoff_matches_array);
		}
		return $matches_array;

	}

	// Convert our lines aggregate array into an array with individual lines
	private function build_lines_array($lines_aggregate){

		$lines_array = array();
		foreach($lines_aggregate as $line_play_type){
			for($x = 0; $x < $line_play_type['count']; $x++){
				array_push($lines_array, array(
					'line_play_type' => $line_play_type['line_play_type']
				));
			}
		}
		return $lines_array;

	}

	// Assign round numbers to our matches
	private function assign_rounds_to_matches($event){

		$event_team_ids = EventTeam::where('event_id', '=', $event->id)->orderBy('id', 'asc')->pluck('id')->toArray();
		$half_of_teams = count($event_team_ids) / 2;
		$event_team_ids = array_chunk($event_team_ids, $half_of_teams);
		$first_array = $event_team_ids[0];
		$second_array = $event_team_ids[1];
		// Two array rotate round assignment
		for($x = 1; $x <= $event->rounds; $x++){
			for($i = 0; $i < count($first_array); $i++){
				$team_one_id = $first_array[$i];
				$team_two_id = $second_array[(count($first_array) - 1 - $i)];
				$match = Match::where('event_id', '=', $event->id)->whereNull('round')->where(function($query)use($team_one_id, $team_two_id){
					$query->whereIn('event_team_one_id', array($team_one_id, $team_two_id))->whereIn('event_team_two_id', array($team_one_id, $team_two_id));
				})->first();
				$days_from_today = ($x - 1) * $event->rounds_interval;
				$match->update(array(
					'round' => $x,
					'date' => $event->rounds_interval_metric === 'days' ? date('Y-m-d', strtotime($event->start_date . " +$days_from_today days")) : $event->start_date
				));
			}
			array_splice($first_array, 1, 0, $second_array[(count($first_array) - 1)]);
			array_unshift($second_array, $first_array[(count($first_array) - 1)]);
			unset($first_array[(count($first_array) - 1)]);
			unset($second_array[(count($first_array))]);
		}

	}

	// Create our start times array to use when assigning lines
	private function create_start_times_array($start_time, $event){

		$starting_times = array($start_time);
		for($i = 1; $i < $event->num_of_start_times; $i++){
			$start_time = date('H:i:s', strtotime($event->standard_line_duration . ' minutes', strtotime($start_time)));
			array_push($starting_times, $start_time);
		}
		$start_times = array();
		for($y = 0; $y < $event->max_playing_surfaces; $y++){
			foreach($starting_times as $starting_time){
				array_push($start_times, $starting_time);
			}
		}
		return $start_times;

	}

	// Return the number of times a value occurs in an array
	private function array_count_values_of($array, $value) {

		$counts = array_count_values($array);
		return $counts[$value];

	}

	// Creats a pair record
	private function create_pair($event_id){

		$pair = Pair::create(array(
			'event_id' => $event_id,
		));
		return $pair->id;

	}

	// Creates a line
	private function create_line($event_id, $match_id, $line_type, $line_play_type, $line_play_type_number, $pair_one_id, $pair_two_id, $start_time){

		return Line::create(array(
			'event_id' => $event_id,
			'match_id' => $match_id,
			'line_type' => $line_type,
			'line_play_type' => $line_play_type,
			'line_play_type_number' => $line_play_type_number,
			'pair_one_id' => $pair_one_id,
			'pair_two_id' => $pair_two_id,
			'start_time' => $start_time
		));

	}

	// Create score records for a line
	private function create_line_scores($line, $sets){

		for($i = 1; $i <= $sets; $i++){
			LineScore::create(array(
				'line_id' => $line->id,
				'set_number' => $i
			));
		}

	}

	// Resort our match lines so that lines are sorted with start times based on line ID
	private function resort_match_lines($match){

		$match_lines_start_times = Line::where('match_id', '=', $match->id)->orderBy('start_time', 'ASC')->pluck('start_time')->toArray();
		$match_lines = Line::where('match_id', '=', $match->id)->orderBy('id', 'ASC')->get();
		$index = 0;
		foreach($match_lines as $match_line){
			$match_line->update(array(
				'start_time' => $match_lines_start_times[$index]
			));
			$index = $index + 1;
		}

	}

	// Create lines for our matches
	private function create_lines_for_matches($event, $lines_array){

		$matches = Match::where('event_id', '=', $event->id)->orderBy('round', 'asc');
		$current_round = $matches->min('round');
		$matches = $matches->get();
		$per_round_lines_index = 0;
		$start_times = $this->create_start_times_array($event->start_time, $event);
		$first_start_time = $event->event_type !== 'multifacility' ? $start_times[0] : null;
		foreach($matches as $match){
			// If same round, reset start times array so that the first value is always the earliest start time available
			if($current_round === $match->round && $event->event_type !== 'multifacility'){
				while($start_times[$per_round_lines_index] !== $first_start_time &&
					  $this->array_count_values_of($start_times, $start_times[$per_round_lines_index]) !== count($start_times)){
					$current_start_time = $start_times[$per_round_lines_index];
					unset($start_times[$per_round_lines_index]);
					$start_times = array_values($start_times);
					array_push($start_times, $current_start_time);
				}
			}
			$line_play_type_number_array = array(
				'wd' => 1,
				'ws' => 1,
				'md' => 1,
				'ms' => 1,
				'xd' => 1,
				'xs' => 1
			);
			foreach($lines_array as $line){
				if($current_round !== $match->round){
					$current_round = $match->round;
					$per_round_lines_index = 0;
				}
				$line_type = in_array($line['line_play_type'], $this->singles_line_types) === true ? 'singles' : 'doubles';
				if($line_type === 'doubles'){
					$pair_one_id = $this->create_pair($event->id);
					$pair_two_id = $this->create_pair($event->id);
				}
				else if($line_type === 'singles'){
					$pair_one_id = null;
					$pair_two_id = null;
				}
				if($event->event_type === 'multifacility'){
					$start_time = $event->start_time;
				}
				else{
					$start_time = isset($start_times[$per_round_lines_index]) ? $start_times[$per_round_lines_index] : null;
					if($event->rounds_interval_metric === 'minutes' && !is_null($start_time)){
						$round_minutes_from_start_time = $match->round < 0 ? ($event->rounds - $match->round - 1) * $event->rounds_interval : ($match->round - 1) * $event->rounds_interval;
						$start_time = date('H:i', strtotime("$start_time +$round_minutes_from_start_time minutes"));
					}
				}
				$line = $this->create_line($event->id, $match->id, $line_type, $line['line_play_type'], $line_play_type_number_array[$line['line_play_type']], $pair_one_id,
										   $pair_two_id, $start_time);
				$this->create_line_scores($line, $event->sets);
				$per_round_lines_index = $per_round_lines_index + 1;
				$line_play_type_number_array[$line['line_play_type']] = $line_play_type_number_array[$line['line_play_type']] + 1;
			}
			if($event->event_type !== 'multifacility'){
				$this->resort_match_lines($match);
			}
		}

	}

	// Find out how many female / male spots are available
	private function get_spots_available_by_sex($event_team_users){

		$female_spots_available = 0;
		$male_spots_available = 0;
		foreach($event_team_users as $event_team_user){
			if($event_team_user['sex'] === 'female'){
				$female_spots_available = $female_spots_available + 1;
			}
			else if($event_team_user['sex'] === 'male'){
				$male_spots_available = $male_spots_available + 1;
			}
		}
		return array(
			'female_spots_available' => $female_spots_available,
			'male_spots_available' => $male_spots_available
		);

	}

	// Return lists of all available / rsvped participants by sex
	private function get_all_event_particpants($event_participants){

		$female_participants = array();
		$male_participants = array();
		foreach($event_participants as $participant){
			if($participant['sex'] === 'female'){
				array_push($female_participants, $participant);
			}
			else if($participant['sex'] === 'male'){
				array_push($male_participants, $participant);
			}
		}
		return array(
			'female_participants' => $female_participants,
			'male_participants' => $male_participants
		);

	}

	// Add user rankings to the class' participants property
	private function add_user_rankings($event, $users){

		$event_activity_id = $event->activity_id;
		$event_facility_id = $event->facility_id;
		$activity = Activity::with(array('users' => function($query)use($event_facility_id){
			$query->wherePivot('facility_id', '=', $event_facility_id);
		}))->find($event_activity_id);
		$user_rankings = $activity->users->toArray();
		foreach($users as &$user){
			$index = array_search($user['id'], array_column($user_rankings, 'id'));
			if($index !== false){
				$user['ranking'] = $user_rankings[$index]['pivot']['ranking'];
			}
		}
		return $users;

	}

	// Custom sort by RSVP datetime
	private function sort_by_rsvp($a, $b){

		return strtotime($a['pivot']['rsvped']) - strtotime($b['pivot']['rsvped']);

	}

	// Custom sort by ranking
	private function sort_by_ranking($a, $b){

		if(isset($a['ranking']) && isset($b['ranking'])){
			return $a['ranking'] <= $b['ranking'];
		}
		else{
			return 0;
		}

	}

	// Mark participants as confirmed by sex
	private function set_confirmed_participants_by_sex($event, $confirmed_female_participants, $confirmed_male_pariticpants){

		foreach($confirmed_female_participants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 1,
				'waitlisted' => 0,
				'substitute' => 0,
				'unavailable' => 0
			));
		}
		foreach($confirmed_male_pariticpants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 1,
				'waitlisted' => 0,
				'substitute' => 0,
				'unavailable' => 0
			));
		}

	}

	// Create an event team user record
	private function create_event_team_user($event_id, $group_number, $event_team_id, $sex, $user_id, $captain){

		return EventTeamUser::create(array(
			'event_id' => $event_id,
			'group_number' => $group_number,
			'event_team_id' => $event_team_id,
			'sex' => $sex,
			'user_id' => $user_id,
			'captain' => $captain
		));

	}

	// Mark participants as waitlisted by sex
	private function set_waitlisted_participants_by_sex($event, $waitlisted_female_participants, $waitlisted_male_participants){

		foreach($waitlisted_female_participants as $participant){
			$user = User::find($participant['id']);
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
			if($event->event_type === 'league'){
				$group_number = $this->user_group_calculator->get_closest_ranked_participant_group_number($event, $user);
				$event_team_user = $this->create_event_team_user($event->id, $group_number, 0, $user->sex, $user->id, 0);
				$this->create_user_availability_records_for_all_rounds($event, $event_team_user);
			}
		}
		foreach($waitlisted_male_participants as $participant){
			$user = User::find($participant['id']);
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
			if($event->event_type === 'league'){
				$group_number = $this->user_group_calculator->get_closest_ranked_participant_group_number($event, $user);
				$event_team_user = $this->create_event_team_user($event->id, $group_number, 0, $user->sex, $user->id, 0);
				$this->create_user_availability_records_for_all_rounds($event, $event_team_user);
			}
		}

	}

	// Assign participants to teams for an unranked event
	private function assign_unranked_teams($event, $female_participants, $male_participants){

		shuffle($female_participants);
		shuffle($male_participants);
		$female_index = 0;
		$male_index = 0;
		foreach($event->event_team_users as $event_team_user){
			$event_team_object = EventTeamUser::find($event_team_user['id']);
			if($event_team_object->sex === 'female'){
				$user_id = $female_participants[$female_index]['id'];
				$female_index = $female_index + 1;
			}
			else if($event_team_object->sex === 'male'){
				$user_id = $male_participants[$male_index]['id'];
				$male_index = $male_index + 1;
			}
			$event_team_object->update(array(
				'user_id' => $user_id
			));
			$user = User::find($user_id);
			$user->events()->updateExistingPivot($event->id, array(
				'confirmed' => 1,
				'waitlisted' => 0,
				'substitute' => 0,
				'unavailable' => 0
			));
		}

	}

	// Custom sort of array from low middle value outwards
	private function center_low_sort($array){

		if(count($array) % 2 === 0){
			$middle_index = (count($array) / 2) - 1;
		}
		else{
			$middle_index = floor(count($array) / 2);
		}
		$sorted_array = array($array[$middle_index]);
		$i = 1;
		while($i){
			$high_index = $middle_index + $i;
			$low_index = $middle_index - $i;
			if(isset($array[$high_index])){
				array_push($sorted_array, $array[$high_index]);
			}
			else{
				break;
			}
			if(isset($array[$low_index])){
				array_push($sorted_array, $array[$low_index]);
			}
			else{
				break;
			}
			$i = $i + 1;
		}
		return $sorted_array;

	}

	// Custom sort of array from high middle value outwards
	private function center_high_sort($array){

		if(count($array) % 2 === 0){
			$middle_index = count($array) / 2;
		}
		else{
			$middle_index = floor(count($array) / 2);
		}
		$sorted_array = array($array[$middle_index]);
		$i = 1;
		while($i){
			$low_index = $middle_index - $i;
			$high_index = $middle_index + $i;
			if(isset($array[$low_index])){
				array_push($sorted_array, $array[$low_index]);
			}
			else{
				break;
			}
			if(isset($array[$high_index])){
				array_push($sorted_array, $array[$high_index]);
			}
			else{
				break;
			}
			$i = $i + 1;
		}
		return $sorted_array;

	}

	// Assign female teams using pairing sort logic
	private function assign_female_pairing_teams($event, $female_participants, $reverse = false){

		$female_event_team_users = EventTeamUser::where('sex', '=', 'female')->where('event_id', '=', $event->id)->where('user_id', '=', null)->orderBy('group_number', 'ASC')
																		     ->orderBy('event_team_id', 'ASC')->get()->toArray();
		$group_size = EventTeamUser::where('sex', '=', 'female')->where('event_id', '=', $event->id)->where('group_number', '=', 1)->count();
		if($group_size > 0){
			$female_participants_index = 0;
			$group_index = 1;
			$female_event_team_users = array_chunk($female_event_team_users, $group_size);
			foreach($female_event_team_users as &$group){
				if(in_array($group_index, array(1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34)) && $reverse === true){
					$group = array_reverse($group);
				}
				if(in_array($group_index, array(2, 3, 8, 9, 14, 15, 20, 21, 26, 27, 32, 33)) && $reverse === false){
					$group = array_reverse($group);
				}
				if(in_array($group_index, array(5, 11, 17, 23, 29, 35))){
					$group = $this->center_low_sort($group);
				}
				if(in_array($group_index, array(6, 12, 18, 24, 30, 36))){
					$group = $this->center_high_sort($group);
				}
				foreach($group as $spot){
					$event_team_user = EventTeamUser::find($spot['id']);
					$event_team_user->update(array(
						'user_id' => $female_participants[$female_participants_index]['id']
					));
					$female_participants_index = $female_participants_index + 1;
				}
				$group_index = $group_index + 1;
			}
		}

	}

	// Assign male teams using pairing sort logic
	private function assign_male_pairing_teams($event, $male_participants, $reverse = false){

		$male_event_team_users = EventTeamUser::where('sex', '=', 'male')->where('event_id', '=', $event->id)->where('user_id', '=', null)->orderBy('group_number', 'ASC')
																	     ->orderBy('event_team_id', 'ASC')->get()->toArray();
		$group_size = EventTeamUser::where('sex', '=', 'male')->where('event_id', '=', $event->id)->where('group_number', '=', 1)->count();
		if($group_size > 0){
			$male_participants_index = 0;
			$group_index = 1;
			$male_event_team_users = array_chunk($male_event_team_users, $group_size);
			foreach($male_event_team_users as &$group){
				if(in_array($group_index, array(1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34)) && $reverse === true){
					$group = array_reverse($group);
				}
				if(in_array($group_index, array(2, 3, 8, 9, 14, 15, 20, 21, 26, 27, 32, 33)) && $reverse === false){
					$group = array_reverse($group);
				}
				if(in_array($group_index, array(5, 11, 17, 23, 29, 35))){
					$group = $this->center_low_sort($group);
				}
				if(in_array($group_index, array(6, 12, 18, 24, 30, 36))){
					$group = $this->center_high_sort($group);
				}
				foreach($group as $spot){
					$event_team_user = EventTeamUser::find($spot['id']);
					$event_team_user->update(array(
						'user_id' => $male_participants[$male_participants_index]['id']
					));
					$male_participants_index = $male_participants_index + 1;
				}
				$group_index = $group_index + 1;
			}
		}

	}

	// Assign participants to teams using the pairing method
	private function assign_pairing_teams($event, $female_participants, $male_participants){

		$female_participants = $this->add_user_rankings($event, $female_participants);
		$male_participants = $this->add_user_rankings($event, $male_participants);
		usort($female_participants, array($this, 'sort_by_ranking'));
		usort($male_participants, array($this, 'sort_by_ranking'));
		if($event->event_type === 'social' || ($event->event_type === 'league' && !($event->singles_only == 1 && $event->type_of_play === 'mixed'))){
			$this->assign_female_pairing_teams($event, $female_participants);
			$this->assign_male_pairing_teams($event, $male_participants, true);
		}
		else{
			$this->assign_female_pairing_teams($event, $female_participants);
			$this->assign_male_pairing_teams($event, $male_participants);
		}

	}

	// Set our participants who will be assigned a team and those who are waitlisted
	private function sort_and_set_participants_by_sex($event){

		$spots_available = $this->get_spots_available_by_sex($event->event_team_users->toArray());
		$all_event_participants = $this->get_all_event_particpants($event->users->toArray());
		// Chicks sort
		usort($all_event_participants['female_participants'], array($this, 'sort_by_rsvp'));
		$waitlisted_female_participants = array_slice($all_event_participants['female_participants'], $spots_available['female_spots_available']);
		$female_participants = array_slice($all_event_participants['female_participants'], 0, $spots_available['female_spots_available']);
		// Dudes sort
		usort($all_event_participants['male_participants'], array($this, 'sort_by_rsvp'));
		$waitlisted_male_participants = array_slice($all_event_participants['male_participants'], $spots_available['male_spots_available']);
		$male_participants = array_slice($all_event_participants['male_participants'], 0, $spots_available['male_spots_available']);
		// Assign users to teams / mark as confirmed and to the waitlist
		$this->set_confirmed_participants_by_sex($event, $female_participants, $male_participants);
		if($event->ranked != '1'){
			$this->assign_unranked_teams($event, $female_participants, $male_participants);
		}
		else if($event->ranked == '1' && $event->team_assignment_method === 'pairing'){
			$this->assign_pairing_teams($event, $female_participants, $male_participants);
		}
		$this->set_waitlisted_participants_by_sex($event, $waitlisted_female_participants, $waitlisted_male_participants);

	}

	// Relabel our event team user record as team captain
	private function reassign_multifacility_captain($event){

		if($this->multifacility_captain_user_id > 0){
			$captain = EventTeamUser::where('event_id', '=', $event->id)->where('user_id', '=', $this->multifacility_captain_user_id)->first();
			$captain->update(array(
				'captain' => 1
			));
		}

	}

	// Assign users to our multifacility team
	private function assign_multifacility_team_users($event, $female_participants, $male_participants){

		$female_participants = $this->add_user_rankings($event, $female_participants);
		$male_participants = $this->add_user_rankings($event, $male_participants);
		usort($female_participants, array($this, 'sort_by_ranking'));
		usort($male_participants, array($this, 'sort_by_ranking'));
		$female_slots = EventTeamUser::where('event_id', '=', $event->id)->where('sex', '=', 'female')->whereNull('user_id')->get();
		$female_index = 0;
		foreach($female_slots as $slot){
			$slot->update(array(
				'user_id' => $female_participants[$female_index]['id']
			));
			$female_index = $female_index + 1;
		}
		$male_slots = EventTeamUser::where('event_id', '=', $event->id)->where('sex', '=', 'male')->whereNull('user_id')->get();
		$male_index = 0;
		foreach($male_slots as $slot){
			$slot->update(array(
				'user_id' => $male_participants[$male_index]['id']
			));
			$male_index = $male_index + 1;
		}
		$this->reassign_multifacility_captain($event);

	}

	// Construct our sub assignment arrays
	private function build_sub_assignment_arrays($event_id, $event_team_id = null){

		$team_sub_assignments = EventTeamSubAssignment::where('event_id', '=', $event_id);
		if($event_team_id !== null){
			$team_sub_assignments = $team_sub_assignments->where('event_team_id', '=', $event_team_id);
		}
		$team_sub_assignments = $team_sub_assignments->get();
		$availability_ids = array();
		$team_and_availabilty_ids = array();
		foreach($team_sub_assignments as $team_sub_assignment){
			array_push($availability_ids, $team_sub_assignment->event_team_user_availability_id);
			$team_and_availabilty_ids[$team_sub_assignment->event_team_user_availability_id] = $team_sub_assignment->event_team_id;
		}
		return array(
			'availability_ids' => $availability_ids,
			'team_and_availability_ids' => $team_and_availabilty_ids
		);

	}

	// Build a reference array for event teams
	private function build_event_teams_reference_array($event_id){

		$event_teams = EventTeam::where('event_id', '=', $event_id)->get();
		$reference_array = array();
		foreach($event_teams as $event_team){
			$reference_array[$event_team->id] = $event_team->name;
		}
		return $reference_array;

	}

	// Replace user in a line
	private function remove_user_in_line($user_id, $line){

		if($line->line_type === 'singles'){
			if($line->pair_one_id == $user_id){
				Line::find($line->id)->update(array(
					'pair_one_id' => null
				));
			}
			else if($line->pair_two_id == $user_id){
				Line::find($line->id)->update(array(
					'pair_two_id' => null
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
						'user_one_id' => null
					));
					break;
				}
				else if($pair->user_two_id == $user_id){
					Pair::find($pair->id)->update(array(
						'user_two_id' => null
					));
					break;
				}
			}
		}

	}

	// Reset our user assignments
	private function reset_lineup($event_id){

		$lines = Line::with('matches')->where('event_id', '=', $event_id);
		$single_lines = clone $lines;
		$double_lines_one = clone $lines;
		$double_lines_two = clone $lines;
		$single_lines->where('line_type', '=', 'singles')->update(array(
			'pair_one_id' => null,
			'pair_two_id' => null
		));
		$pair_one_ids = $double_lines_one->where('line_type', '=', 'doubles')->pluck('pair_one_id')->toArray();
		$pair_two_ids = $double_lines_two->where('line_type', '=', 'doubles')->pluck('pair_two_id')->toArray();
		$all_pair_ids = array_merge($pair_one_ids, $pair_two_ids);
		Pair::whereIn('id', $all_pair_ids)->update(array(
			'user_one_id' => null,
			'user_two_id' => null
		));

	}

	// Get number and type of lines per match for our event
	private function get_lines_per_match($event_id){

		$match = Match::where('event_id', '=', $event_id)->first();
		return Line::where('match_id', '=', $match->id)->get();

	}

	// Build our female and male spots per match arrays
	private function build_participant_spots_arrays($lines_per_match){

		$female_line_spots_per_match = array();
		$male_line_spots_per_match = array();
		$line_type_counts = array(
			'wd' => 1,
			'md' => 1,
			'ws' => 1,
			'ms' => 1,
			'xd' => 1,
			'xs' => 1
		);
		foreach($lines_per_match as $line){
			if(in_array($line->line_play_type, $this->female_line_types)){
				if($line->line_play_type === 'wd'){
					array_push($female_line_spots_per_match, $line->line_play_type . $line_type_counts[$line->line_play_type],
							   $line->line_play_type . $line_type_counts[$line->line_play_type]);
				}
				else if(in_array($line->line_play_type, array('ws', 'xd'))){
					array_push($female_line_spots_per_match, $line->line_play_type . $line_type_counts[$line->line_play_type]);
				}
			}
			else if(in_array($line->line_play_type, $this->male_line_types)){
				if($line->line_play_type === 'md'){
					array_push($male_line_spots_per_match, $line->line_play_type . $line_type_counts[$line->line_play_type],
							   $line->line_play_type . $line_type_counts[$line->line_play_type]);
				}
				else if(in_array($line->line_play_type, array('ms', 'xd'))){
					array_push($male_line_spots_per_match, $line->line_play_type . $line_type_counts[$line->line_play_type]);
				}
			}
			$line_type_counts[$line->line_play_type] = $line_type_counts[$line->line_play_type] + 1;
		}
		return array(
			'female' => $female_line_spots_per_match,
			'male' => $male_line_spots_per_match
		);

	}

	// Return the lines that match our criteria
	private function get_correct_play_type_lines($event_id, $line_play_type, $line_play_type_number, $event_team_user){

		return Line::with('matches')->where('event_id', '=', $event_id)->where('line_play_type', '=', $line_play_type)->where('line_play_type_number', '=', $line_play_type_number)
									  ->whereHas('matches', function($query)use($event_team_user){
				$query->where('event_team_one_id', '=', $event_team_user->event_team_id)->orWhere('event_team_two_id', '=', $event_team_user->event_team_id);
		})->orderBy('id', 'ASC')->get();

	}

	// Adding user to a singles line
	private function set_singles_line($current_line, $line_play_type_number, $event_team_user){

		if($current_line->matches->event_team_one_id == $event_team_user->event_team_id){
			$current_line->update(array(
				'line_play_type_number' => $line_play_type_number,
				'pair_one_id' => $event_team_user->user_id
			));
		}
		else if($current_line->matches->event_team_two_id == $event_team_user->event_team_id){
			$current_line->update(array(
				'line_play_type_number' => $line_play_type_number,
				'pair_two_id' => $event_team_user->user_id
			));
		}

	}

	// Assing user to a doubles line
	private function set_doubles_line($current_line, $line_play_type_number, $event_team_user){

		$current_line->update(array(
			'line_play_type_number' => $line_play_type_number
		));
		if($current_line->matches->event_team_one_id == $event_team_user->event_team_id){
			$pair = Pair::find($current_line->pair_one_id);
		}
		else if($current_line->matches->event_team_two_id == $event_team_user->event_team_id){
			$pair = Pair::find($current_line->pair_two_id);
		}
		if(empty($pair->user_one_id)){
			$pair->update(array(
				'user_one_id' => $event_team_user->user_id
			));
		}
		else{
			$pair->update(array(
				'user_two_id' => $event_team_user->user_id
			));
		}

	}

	// Assign user to a line for a particular round
	private function set_lineup($current_line, $line_play_type, $line_play_type_number, $event_team_user){

		if(in_array($line_play_type, $this->singles_line_types)){
			$this->set_singles_line($current_line, $line_play_type_number, $event_team_user);
		}
		else{
			$this->set_doubles_line($current_line, $line_play_type_number, $event_team_user);
		}

	}

	// Set default lineups based on users' group numbers
	private function set_default_lineups_by_group($event_id){

		$this->reset_lineup($event_id);
		$event_team_users = EventTeamUser::where('event_id', '=', $event_id)->orderBy('event_team_id', 'ASC')->orderBy('sex', 'ASC')->orderBy('group_number', 'ASC')->get();
		$lines_per_match = $this->get_lines_per_match($event_id);
		$participant_spots_arrays = $this->build_participant_spots_arrays($lines_per_match);
		$female_line_spots_index = 0;
		$male_line_spots_index = 0;
		$event_team_id = null;
		foreach($event_team_users as $event_team_user){
			if($event_team_user->event_team_id !== $event_team_id){
				$event_team_id = $event_team_user->event_team_id;
				$female_line_spots_index = 0;
				$male_line_spots_index = 0;
			}
			if($event_team_user->sex === 'female'){
				$line_play_type = substr($participant_spots_arrays['female'][$female_line_spots_index], 0, 2);
				$line_play_type_number = substr($participant_spots_arrays['female'][$female_line_spots_index], 2);
				$female_line_spots_index = $female_line_spots_index + 1;
			}
			else if($event_team_user->sex === 'male'){
				$line_play_type = substr($participant_spots_arrays['male'][$male_line_spots_index], 0, 2);
				$line_play_type_number = substr($participant_spots_arrays['male'][$male_line_spots_index], 2);
				$male_line_spots_index = $male_line_spots_index + 1;
			}
			$lines = $this->get_correct_play_type_lines($event_id, $line_play_type, $line_play_type_number, $event_team_user);
			$availabilities = EventTeamUserAvailability::where('event_team_user_id', '=', $event_team_user->id)->get();
			foreach($availabilities as $availability){
				if($availability->round > 0){
					$current_line = $lines->filter(function($item)use($availability){
						return $availability->round == $item->matches->round;
					})->first();
					$this->set_lineup($current_line, $line_play_type, $line_play_type_number, $event_team_user);
					$availability->update(array(
						'line_id' => $current_line->id
					));
				}
			}
		}

	}

	// Prepare to assign user to a line for a particular round
	private function prepare_set_lineup($line_play_type, $line_play_type_number, $lines, $event_team_user){

		$current_line = $lines[$line_play_type_number - 1];
		$this->set_lineup($current_line, $line_play_type, $line_play_type_number, $event_team_user);
		return $current_line;

	}

	/*
     * Determine if a user is an admin, facility leader, or leader of the event passed in
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of user requesting data
     *
     * @return  boolean
     *
	 */
	private function is_elevated_user($event_id, $user_id){

		if(in_array(User::find($user_id)->privilege, array('admin', 'facility leader')) ||
		   in_array($event_id, User::find($user_id)->event_leaders()->pluck('id')->toArray())){
			return true;
		}
		else{
			return false;
		}

	}

	/*
     * Returns teams and groups info about an event
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$team_id			Team ID
     *
     * @return  collection
     *
     */
	public function get($event_id, $team_id){

		if(is_null($team_id)){
			return EventTeamUser::with('users', 'event_teams')->where('event_id', '=', $event_id)->where('event_team_id', '>', 0)->get();
		}
		else{
			return EventTeamUser::with('users', 'event_teams')->where('event_id', '=', $event_id)->where('event_team_id', '=', $team_id)->get();
		}

	}

	/*
     * Create event teams and groups
     *
	 * @param	int		$event_id					ID of event
	 * @param	array	$per_round_lines_aggregate 	Type and number of lines we need to create per match for our event
	 * @param	int		$num_of_females_to_remove	# of girls to explicitly remove from event
	 * @param	int		$num_of_males_to_remove		# of guys to explicitly remove from event
	 *
     * @return  void
     *
     */
	public function create($event_id, $per_round_lines_aggregate, $num_of_females_to_remove, $num_of_males_to_remove){

		$event = $this->get_event($event_id);
		$event_users = $this->get_event_users($event_id);
		if($event->event_type === 'league'){
			$result = $this->parse_event_users($event_users);
			$females_per_team = floor(($result['female_count'] - $num_of_females_to_remove) / $event->num_of_teams);
			$males_per_team = floor(($result['male_count'] - $num_of_males_to_remove) / $event->num_of_teams);
		}
		else if($event->event_type === 'round robin'){
			$result = $this->calculate_team_sizes_using_lines($per_round_lines_aggregate);
			$females_per_team = $result['females_per_team'];
			$males_per_team = $result['males_per_team'];
		}
		// Create our teams, matches, lines, and corresponding rounds
		$this->create_teams_and_matches($event, $females_per_team, $males_per_team);
		$this->assign_rounds_to_matches($event);
		$lines_array = $this->build_lines_array($per_round_lines_aggregate);
		$this->create_lines_for_matches($event, $lines_array);
		// Get updated event object
		$event = $this->get_event($event_id);
		$this->sort_and_set_participants_by_sex($event);
		if($event->event_type === 'round robin'){
			$this->set_default_lineups_by_group($event_id);
		}

	}

	/*
     * Create event team and lines for a multifacility event
     *
	 * @param	int		$event_id					ID of event
	 * @param	array	$per_round_lines_aggregate 	Type and number of lines we need to create per match for our event
	 *
     * @return  void
     *
     */
	public function create_team($event_id, $per_round_lines_aggregate){

		$event_with_female_users = Event::with(array('users' => function($query){
			$query->where('sex', '=', 'female');
		}))->find($event_id);
		$event_with_male_users = Event::with(array('users' => function($query){
			$query->where('sex', '=', 'male');
		}))->find($event_id);
		$females_count = count($event_with_female_users->users);
		$males_count = count($event_with_male_users->users);
		// Create our team, matches, lines, and corresponding rounds
		$this->create_teams_and_matches($event_with_female_users, $females_count, $males_count);
		$lines_array = $this->build_lines_array($per_round_lines_aggregate);
		$this->create_lines_for_matches($event_with_female_users, $lines_array);
		$this->assign_multifacility_team_users($event_with_female_users, $event_with_female_users->users->toArray(), $event_with_male_users->users->toArray());

	}

	/*
     * Set all non-confirmed participants as waitlisted
     *
	 * @param	int		$event_id					ID of event
	 *
     * @return  void
     *
     */
	public function set_waitlisted_participants($event_id){

		$event = Event::find($event_id);
		$event->users()->newPivotStatement()->where('confirmed', '=', 0)->update(array(
			'waitlisted' => 1,
			'substitute' => 1,
			'unavailable' => 0
		));
		$event_team_users = EventTeamUser::where('event_id', '=', $event_id)->where('event_team_id', '=', 0)->get();
		foreach($event_team_users as $event_team_user){
			$user = User::find($event_team_user->user_id);
			$group_number = $this->user_group_calculator->get_closest_ranked_participant_group_number($event, $user);
			$event_team_user->update(array(
				'group_number' => $group_number
			));
		}

	}

	/*
     * Create event teams and groups using an import file
     *
	 * @param	int		$event_id					ID of event
	 * @param	string	$file_key 					S3 key for import file
	 *
     * @return  mixed
     *
     */
	public function import($event_id, $file_key){

		$result = $this->s3_client->getObject(array(
			'Bucket' => env('AWS_S3_BUCKET', 'teams-r-it-images'),
			'Key' => $file_key
		));
		$body = $result['Body'];
		$line = strtok($body, "\r\n");
		$line_count = 2;
		$num_of_users_imported = 0;
		$lines_not_added = array();
		$event_team_ids = array_values(EventTeamUser::where('event_id', '=', $event_id)->pluck('event_team_id')->unique()->toArray());
		while($line !== false){
			$line = strtok("\r\n");
			$values = explode(',', $line);
			if(isset($values[2]) && strlen($values[2]) > 0){
				$username = trim($values[2]);
				$team_number = trim($values[4]);
				$user = User::where('username', '=', $username)->whereHas('events', function($query)use($event_id){
					$query->where('id', '=', $event_id);
				});
				if($user->exists() && !empty($team_number)){
					$user = $user->get()[0];
					$index = $team_number - 1;
					$event_team_user = EventTeamUser::where('event_team_id', '=', $event_team_ids[$index])->where('sex', '=', $user->sex)->whereNull('user_id')->first();
					if($event_team_user){
						$event_team_user->update(array(
							'user_id' => $user->id
						));
						$user->events()->updateExistingPivot($event_id, array(
							'confirmed' => 1,
							'waitlisted' => 0,
							'substitute' => 0,
							'unavailable' => 0
						));
						$num_of_users_imported = $num_of_users_imported + 1;
					}
					else{
						array_push($lines_not_added, $line_count);
					}
				}
				else{
					array_push($lines_not_added, $line_count);
				}
			}
			$line_count = $line_count + 1;
		}
		$this->set_waitlisted_participants($event_id);
		return array(
			'imported_count' => $num_of_users_imported,
			'lines_not_added' => $lines_not_added
		);

	}

	/*
     * Update group and team info
     *
	 * @param	int		$event_id					ID of event
	 * @param	array	$event_team_users			Teams and groups we want to update
	 * @param	int		$event_id					Captain team id if applicable
     *
     * @return  void
     */
	public function update($event_id, $event_team_users, $captain_team_id){

		foreach($event_team_users as $event_team_user){
			if($captain_team_id && ($captain_team_id != $event_team_user['event_team_id'])){
				continue;
			}
			$event_team_object = EventTeamUser::find($event_team_user['id']);
			$event_team_object->update(array(
				'user_id' => $event_team_user['user_id'],
				'captain' => $event_team_user['captain']
			));
			$user = User::find($event_team_user['user_id']);
			$user->events()->updateExistingPivot($event_id, array(
				'confirmed' => 1,
				'waitlisted' => 0,
				'substitute' => 0,
				'unavailable' => 0
			));
		}
		$event = Event::find($event_id);
		if($event->event_type === 'round robin'){
			$this->set_default_lineups_by_group($event_id);
		}

	}

	/*
     * Return teams with loss stats
     *
	 * @param	int		$event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get_stats($event_id){

		$event_teams = EventTeam::where('event_id', '=', $event_id)->get();
		foreach($event_teams as &$event_team){
			$sets_lost = 0;
			$games_lost = 0;
			$team_matches = Match::with('lines.line_scores')->where('event_id', '=', $event_id)->where(function($query)use($event_team){
				$query->where('event_team_one_id', '=', $event_team->id)->orWhere('event_team_two_id', '=', $event_team->id);
			})->get();
			foreach($team_matches as $team_match){
				foreach($team_match->lines as $line){
					foreach($line->line_scores as $set){
						if($team_match->event_team_one_id === $event_team->id){
							if($set->pair_two_score > $set->pair_one_score){
								$sets_lost = $sets_lost + 1;
							}
							$games_lost = $games_lost + $set->pair_two_score;
						}
						else if($team_match->event_team_two_id === $event_team->id){
							if($set->pair_two_score < $set->pair_one_score){
								$sets_lost = $sets_lost + 1;
							}
							$games_lost = $games_lost + $set->pair_one_score;
						}
					}
				}
			}
			$event_team->sets_lost = $sets_lost;
			$event_team->games_lost = $games_lost;
		}
		return $event_teams;

	}

	/*
     * Delete team and group records for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  boolean
     *
     */
	public function delete($event_id){

		return EventTeamUser::where('event_id', '=', $event_id)->delete();

	}

	/*
     * Get the next unassigned group for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  mixed
     *
     */
	public function get_next_unassigned_group($event_id){

		$female_spots = EventTeamUser::with('event_teams')->where('event_id', '=', $event_id)->where('sex', '=', 'female')->whereNull('user_id');
		if($female_spots->exists()){
			$female_group_numbers = $female_spots->pluck('group_number')->toArray();
			$next_group_number = min($female_group_numbers);
			return array(
				'sex' => 'female',
				'group_number' => $next_group_number,
				'spots' => $female_spots->where('group_number', '=', $next_group_number)->get()
			);
		}
		else{
			$male_spots = EventTeamUser::with('event_teams')->where('event_id', '=', $event_id)->where('sex', '=', 'male')->whereNull('user_id');
			if($male_spots->exists()){
				$male_group_numbers = $male_spots->pluck('group_number')->toArray();
				$next_group_number = min($male_group_numbers);
				return array(
					'sex' => 'male',
					'group_number' => $next_group_number,
					'spots' => $male_spots->where('group_number', '=', $next_group_number)->get()
				);
			}
			else{
				return 'No unassigned groups found';
			}
		}

	}

	/*
     * Gets the event team ID associated with the captain
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_captain($event_id, $user_id){

		$event = Event::find($event_id);
		$event_team_user = EventTeamUser::where('event_id', '=', $event_id)->where('user_id', '=', $user_id)->where('captain', '=', 1);
		if(in_array($event->event_type, array('multifacility', 'league')) && $event_team_user->exists()){
			return $event_team_user->first()->event_team_id;
		}
		else{
			return false;
		}

	}

	/*
     * Get team user availabilities for an event
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of user requesting data
     *
     * @return  collection
     *
     */
	public function get_availabilities($event_id, $user_id){

		$event_team_user_availabilities = EventTeamUserAvailability::with('event_team_users.event_teams', 'event_team_users.users', 'lines')->whereHas('event_team_users', function($query){
			$query->where('event_team_id', '>', 0);
		});
		if($this->is_elevated_user($event_id, $user_id)){
			$team_sub_assignments = $this->build_sub_assignment_arrays($event_id);
			$event_team_user_availabilities = $event_team_user_availabilities->whereHas('event_team_users', function($query)use($event_id){
				$query->where('event_id', '=', $event_id);
			})->orWhereIn('id', $team_sub_assignments['availability_ids'])->get();
		}
		else{
			$event_team_id = $this->is_captain($event_id, $user_id);
			$team_sub_assignments = $this->build_sub_assignment_arrays($event_id, $event_team_id);
			$event_team_user_availabilities = $event_team_user_availabilities->whereHas('event_team_users', function($query)use($event_id, $event_team_id){
				$query->where('event_id', '=', $event_id)->where('event_team_id', '=', $event_team_id);
			})->orWhereIn('id', $team_sub_assignments['availability_ids'])->get();
		}
		$event_teams_reference_array = $this->build_event_teams_reference_array($event_id);
		foreach($event_team_user_availabilities as &$user){
			$event_team_user = $user->event_team_users->toArray();
			if(!$user->event_team_users->event_teams){
				$event_team_user['users']['is_sub'] = 1;
				$event_team_user['users']['team_id'] = $team_sub_assignments['team_and_availability_ids'][$user->id];
				$event_team_user['users']['team_name'] = $event_teams_reference_array[$team_sub_assignments['team_and_availability_ids'][$user->id]];
				$event_team_user['users']['group_number'] = $event_team_user['group_number'];
			}
			else{
				$event_team_user['users']['team_id'] = $user->event_team_users->event_teams->id;
				$event_team_user['users']['team_name'] = $user->event_team_users->event_teams->name;
				$event_team_user['users']['group_number'] = $event_team_user['group_number'];
			}
			$user->user = $event_team_user['users'];
			unset($user->event_team_users);
		}
		return $event_team_user_availabilities;

	}

	/*
     * Get sub user availabilities for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  collection
     *
     */
	public function get_sub_availabilities($event_id){

		$blocked_availabilities = EventTeamSubAssignment::where('event_id', '=', $event_id)->pluck('event_team_user_availability_id')->toArray();
		$event_sub_user_availabilities = EventTeamUserAvailability::with(array(
			'event_team_users.users.events' => function($query)use($event_id){
				$query->where('id', '=', $event_id);
		}), 'lines')->whereHas('event_team_users', function($query)use($event_id){
			$query->where('event_id', '=', $event_id)->where('event_team_id', '=', 0);
		})->whereNotIn('id', $blocked_availabilities)->get();
		foreach($event_sub_user_availabilities as &$user){
			$event_team_user = $user->event_team_users->toArray();
			$event_team_user['users']['type'] = $event_team_user['users']['events'][0]['pivot']['confirmed'] == 1 ? 'R' : 'S';
			unset($event_team_user['users']['events']);
			$event_team_user['users']['group_number'] = $user['event_team_users']['group_number'];
			$user->user = $event_team_user['users'];
			unset($user->event_team_users);
		}
		return $event_sub_user_availabilities;

	}

	/*
     * Get team user availabilitiy for an event / user
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of user
     *
     * @return  collection
     *
     */
	public function get_availability($event_id, $user_id){

		$event_team_user_availability = EventTeamUserAvailability::whereHas('event_team_users', function($query)use($event_id, $user_id){
			$query->where('event_id', '=', $event_id)->where('user_id', '=', $user_id);
		})->with('event_team_users.event_teams', 'event_team_users.users')->get();
		foreach($event_team_user_availability as &$user){
			$event_team_user = $user->event_team_users->toArray();
			$event_team_user['users']['team_id'] = $user->event_team_users->event_teams->id;
			$event_team_user['users']['team_name'] = $user->event_team_users->event_teams->name;
			$event_team_user['users']['group_number'] = $event_team_user['group_number'];
			$user->user = $event_team_user['users'];
			unset($user->event_team_users);
		}
		return $event_team_user_availability;

	}

	/*
     * Update users' availabilities
     *
	 * @param	int		$event_id				ID of event
	 * @param	int		$user_id				ID of user
     * @param	array	$users_availabilities	Availability records
	 *
     * @return  void
     *
     */
	public function update_availabilities($event_id, $user_id, $users_availabilities){

		$captain_team_id = $this->is_captain($event_id, $user_id);
		foreach($users_availabilities as $availability){
			$event_team_user_availability = EventTeamUserAvailability::with('event_team_users')->find($availability['id']);
			if($this->is_elevated_user($event_id, $user_id) || $event_team_user_availability->event_team_users->event_team_id == $captain_team_id){
				$event_team_user_availability->update(array(
					'status' => !empty($availability['status']) ? $availability['status'] : null
				));
			}
		}

	}

	/*
     * Update a user's availability
     *
	 * @param	int		$event_id				ID of event
	 * @param	int		$user_id				ID of user
     * @param	array	$user_availabilities	Availability records
	 *
     * @return  void
     *
     */
	public function update_availability($event_id, $user_id, $user_availabilities){

		foreach($user_availabilities as $availability){
			$event_team_user_availability = EventTeamUserAvailability::with('event_team_users')->find($availability['id']);
			$update_array = array(
				'status' => !empty($availability['status']) ? $availability['status'] : null
			);
			if($availability['status'] === 'unavailable'){
				$line_to_remove = Line::where('id', '=', $event_team_user_availability->line_id);
				if($line_to_remove->exists()){
					$this->remove_user_in_line($user_id, $line_to_remove->first());
				}
				$update_array['line_id'] = null;
			}
			if($event_team_user_availability->event_team_users->user_id == $user_id){
				$event_team_user_availability->update($update_array);
			}
		}
		$event = Event::with('event_leaders')->find($event_id);
		$user = User::find($user_id);
		// If there is a captain, send the e-mail notification to captain - otherwise, send to event leaders
		$event_team_user = EventTeamUser::with('event_teams')->where('event_id', '=', $event_id)->where('user_id', '=', $user->id)->first();
		$team_captain = EventTeamUser::where('event_id', '=', $event_id)->where('event_team_id', '=', $event_team_user->event_team_id)->where('captain', '=', 1);
		if($team_captain->exists()){
			$captain = User::find($team_captain->first()->user_id);
			$notification_emails = array($captain->email);
		}
		else{
			$notification_emails = $event->event_leaders->pluck('email')->toArray();
		}
		dispatch(new SendAvailabilityUpdate($event, $user, $event_team_user->event_teams->name, $notification_emails));

	}

	/*
     * Get team standings for an event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_standings($event_id){

		$teams = array();
		$matches = Match::where('event_id', '=', $event_id)->where('round', '>', 0)->orderBy('round', 'asc')->get();
		foreach($matches as $match){
			$team_one_index = array_search($match->event_team_one_id, array_column($teams, 'id'));
			$team_two_index = array_search($match->event_team_two_id, array_column($teams, 'id'));
			if($team_one_index === false){
				$team = EventTeam::find($match->event_team_one_id)->toArray();
				$team['matches'] = array();
				array_push($teams, $team);
				$team_one_index = count($teams) - 1;
			}
			if($team_two_index === false){
				$team = EventTeam::find($match->event_team_two_id)->toArray();
				$team['matches'] = array();
				array_push($teams, $team);
				$team_two_index = count($teams) - 1;
			}
			array_push($teams[$team_one_index]['matches'], array(
				'id' => $match['id'],
				'round' => $match['round'],
				'date' => $match['date'],
				'opposing_team_name' => EventTeam::find($match['event_team_two_id'])->name,
				'score' => $match['event_team_one_score']
			));
			array_push($teams[$team_two_index]['matches'], array(
				'id' => $match['id'],
				'round' => $match['round'],
				'date' => $match['date'],
				'opposing_team_name' => EventTeam::find($match['event_team_one_id'])->name,
				'score' => $match['event_team_two_score']
			));
		}
		return $teams;

	}

	/*
     * Update lineups for event
     *
	 * @param 	int		$event_id			ID of event
     * @param	array	$lineups			Lineups for event
	 *
     * @return  void
     *
     */
	public function update_lineups($event_id, $lineups){

		$this->reset_lineup($event_id);
		foreach($lineups as $lineup){
			$event_team_user_availability = EventTeamUserAvailability::find($lineup['id']);
			$update_object = array(
				'status' => in_array($lineup['status'], array('available', 'unavailable')) ? $lineup['status'] : 'available'
			);
			$event_team_user = EventTeamUser::find($lineup['event_team_user_id']);
			if($event_team_user->event_team_id === 0){
				$team_sub_assignments = $this->build_sub_assignment_arrays($event_id);
				$event_team_user->event_team_id = $team_sub_assignments['team_and_availability_ids'][$lineup['id']];
			}
			$line_play_type = strtolower(substr($lineup['status'], 0, 2));
			$line_play_type_number = strtolower(substr($lineup['status'], 2));
			$lines = Line::with('matches')->where('event_id', '=', $event_id)->where('line_play_type', '=', $line_play_type)->whereHas('matches', function($query)use($event_team_user, $lineup){
				$query->where('round', '=', $lineup['round'])->where(function($query)use($event_team_user){
					$query->where('event_team_one_id', '=', $event_team_user->event_team_id)->orWhere('event_team_two_id', '=', $event_team_user->event_team_id);
				});
			})->orderBy('id', 'ASC')->get();
			if(!in_array($lineup['status'], array('available', 'unavailable')) && count($lines) > 0){
				$current_line = $this->prepare_set_lineup($line_play_type, $line_play_type_number, $lines, $event_team_user);
				$update_object['line_id'] = $current_line->id;
			}
			else{
				$update_object['line_id'] = null;
			}
			$event_team_user_availability->update($update_object);
		}

	}

	/*
     * Update event team captains
     *
	 * @param 	int		$event_id			ID of event
     * @param	array	$event_team_users	Event team user records
	 *
     * @return  void
     *
     */
	public function update_captains($event_id, $event_team_users){

		foreach($event_team_users as $event_team_user){
			EventTeamUser::find($event_team_user['id'])->update(array(
				'captain' => $event_team_user['captain']
			));
		}

	}

	/*
     * Get open team slots for an event
     *
	 * @param 	int		$event_id			ID of event
	 *
     * @return  collection
     *
     */
	public function get_open_slots($event_id){

		return EventTeamUser::with('event_teams')->where('event_id', '=', $event_id)->where('user_id', '=', null)->get();

	}

	/*
     * Set a event team user slot as the new captain for its team
     *
	 * @param 	int		$event_team_user_id		ID of event team user
	 *
     * @return  void
     *
     */
	public function set_new_team_captain($event_team_user_id){

		$event_team_user = EventTeamUser::find($event_team_user_id);
		// Reset any users on the team who might currently be the captain
		EventTeamUser::where('event_id', '=', $event_team_user->event_id)->where('event_team_id', '=', $event_team_user->event_team_id)->update(array(
			'captain' => 0
		));
		$event_team_user->update(array(
			'captain' => 1
		));

	}

	/*
     * Update participant
     *
	 * @param 	object  $event				Event
     * @param	int		$user_id			ID of user
     * @param	string	$sex				User sex
	 *
     * @return  void
     *
     */
	public function update_participant($event, $user_id, $sex){

		$existing_sex_records = EventTeamUser::where('event_id', '=', $event->id)->where('sex', '=', $sex)->whereNotNull('user_id')->get();
		$existing_sex_records_count = $existing_sex_records->count();
		$event_team_id = $existing_sex_records->first()->event_team_id;
		$event_team_user = $this->create_event_team_user($event->id, $existing_sex_records_count + 1, $event_team_id, $sex, $user_id, 0);
		$this->create_user_availability_records_for_all_rounds($event, $event_team_user);

	}

}