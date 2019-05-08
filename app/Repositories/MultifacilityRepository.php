<?php

namespace App\Repositories;

use App\Interfaces\MultifacilityInterface;
use App\Interfaces\EmailInterface;
use App\Interfaces\EventInterface;
use App\Interfaces\LadderEventInterface;
use App\Interfaces\EventTeamInterface;
use App\Interfaces\LineInterface;
use App\Models\Event;
use App\Models\User;
use App\Models\Match;
use App\Models\Line;
use App\Models\EventTeamUser;
use App\Models\MultiOpponentFacility;
use Illuminate\Support\Facades\View;

class MultifacilityRepository implements MultifacilityInterface{

	private $email, $events, $ladder_events, $event_teams, $lines;

	public function __construct(EmailInterface $email, EventInterface $events, LadderEventInterface $ladder_events, EventTeamInterface $event_teams, LineInterface $lines){

		$this->email = $email;
		$this->events = $events;
		$this->ladder_events = $ladder_events;
		$this->event_teams = $event_teams;
		$this->lines = $lines;

	}

	/*
	 * Get captain
	 *
	 * @param	int		$event_id			ID of event
	 *
	 * @return  record  $user				User data
	 *
	 */
	public function get_captain($event_id){

		$captain = EventTeamUser::where('event_id','=',$event_id)->where('captain','=', 1)->get();
		if($captain->count() > 0){
			return User::find($captain->first()->user_id);
		}
		else{
			return false;
		}

	}

	/*
	 * Delete participant
	 *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of participant to delete
	 *
	 * @return  boolean
	 *
	 */
	public function delete_participant($id, $user_id){

		$event = Event::find($id);
		$captain = EventTeamUser::where('event_id','=',$id)->where('user_id','=',$user_id)->where('captain','=', 1)->get();
		if($captain->count() > 0){
			$captain->first()->update(array(
				'captain' => 0
			));
		}
		// delete this user from the user_event table
		$event->users()->updateExistingPivot($user_id, array(
			'confirmed' => 0,
			'waitlisted' => 0,
			'substitute' => 0,
			'unavailable' => 1
		));

	}

	/*
	 * Add match facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function add_directions($facility){

		MultiOpponentFacility::create(array(
			'name' => $facility['name'],
			'address' => $facility['address'],
			'city' => $facility['city'],
			'state' => $facility['state'],
			'zip' => $facility['zip'],
			'directions' => $facility['directions']
		));
		return true;

	}

	/*
	 * Edit match facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function edit_directions($id, $facility){

		MultiOpponentFacility::find($id)->update(array(
			'name' => $facility['name'],
			'address' => $facility['address'],
			'city' => $facility['city'],
			'state' => $facility['state'],
			'zip' => $facility['zip'],
			'directions' => $facility['directions']
		));
		return true;

	}

	/*
	 * Delete match facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function delete_directions($id){

		$match_facility = MultiOpponentFacility::find($id);
		if($match_facility->exists() && $match_facility->count() > 0){
			$match_facility->delete();
		}
		return true;

	}

	/*
	 * Get facility directions
	 *
	 * @param	collection
	 *
	 */
	public function get_directions(){

		return MultiOpponentFacility::get();

	}

	/*
	 * Return matches for an event
	 *
	 * @param	int		$event_id				ID of event
	 *
	 * @return  collection
	 *
	 */
	public function get_event_matches($event_id){

		return Match::with('multi_opponent_facility')->where('event_id', '=', $event_id)->orderBy('round', 'ASC')->get();

	}

	/*
	 * Update matches
	 *
	 * @param	int				$event_id		ID of event
	 * @param	collection		$matches		Match update
	 *
	 * @return  boolean
	 *
	 */
	public function update_matches($event_id, $matches){

		foreach($matches as $match){
			$round_matches = Match::find($match['id'])->update(array(
				'multi_opponent_facility_id' => $match['opponent_id'],
				'home_away' => $match['where']
			));
		}
		return true;

	}

	/*
	 * Generates match directions for an event
	 *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $size								Size of match directions
	 * @param	array	 $rounds							Rounds to be printed
	 *
	 * @return  file
	 *
	 */
	public function generate_match_directions($id, $size, $rounds){

		$format = array(
			'small' => 'A4',
			'medium' => 'Legal',
			'large' => 'A4'
		);
		$mpdf = new \Mpdf\Mpdf(array(
			'format' => $format[$size],
			'orientation' => 'portrait'
		));
		$matches = $this->get_event_matches($id);
		$match_directions = array();
		for($i = 0; $i < count($matches); $i++){
			if(in_array($matches[$i]->round, $rounds)){
				$direction = array(
					'round' => $matches[$i]->round,
					'date' => $matches[$i]->date,
					'name' => $matches[$i]->multi_opponent_facility->name,
					'address' => $matches[$i]->multi_opponent_facility->address . ', '  .
								 $matches[$i]->multi_opponent_facility->city . ', ' .
								 $matches[$i]->multi_opponent_facility->state . ' ' .
								 $matches[$i]->multi_opponent_facility->zip,
					'directions' => $matches[$i]->multi_opponent_facility->directions,
					'url' => 'https://www.google.com/maps/search/?api=1&query='.urlencode($matches[$i]->multi_opponent_facility->address.' '.$matches[$i]->multi_opponent_facility->city.' '.$matches[$i]->multi_opponent_facility->state.' '.$matches[$i]->multi_opponent_facility->state.' '.$matches[$i]->multi_opponent_facility->zip)
				);
				array_push($match_directions, $direction);
			}
		}
		$event = $this->events->get_by_id($id);

		$scorecard_parameters = array(
			'size' => $size,
			'event_name' => $event->name,
			'directions' => $match_directions,
			'set_width' => '746px'
		);
		$view = View::make('match.directions', $scorecard_parameters);
		$mpdf->WriteHTML($view->render());
		return $mpdf->Output();

	}

	/* sort the lines in the order desired for output */
	private function sort_lines($lines){

		$line_play_type_sort_order = array('ws', 'wd', 'ms', 'md', 'xs', 'xd');
		return $lines->sort(function($a, $b)use($line_play_type_sort_order){
			$a_position = array_search($a->line_play_type, $line_play_type_sort_order);
			$b_position = array_search($b->line_play_type, $line_play_type_sort_order);
			if($a_position - $b_position === 0){
				return $a->id - $b->id;
			}
			return $a_position - $b_position;
		});

	}

	/*
	 * Generates a scorecard for an event
	 *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $size								Size of scorecard
	 * @param	int		 $round								Round number
	 * @param	date	 $round_date						Round for which we want to generate a scorecard for
	 *
	 * @return  file
	 *
	 */
	public function generate_scorecard($id, $size, $round, $round_date){

		$format = array(
			'small' => 'A4',
			'medium' => 'Legal',
			'large' => 'A4'
		);
		$mpdf = new \Mpdf\Mpdf(array(
			'format' => $format[$size]
		));
		$matches = $this->get_event_matches($id);
		// Get event and lines info
		foreach($matches as $match){
			if($round_date === $match->date){
				$opponent = !is_null($match->multi_opponent_facility_id) ? $match->multi_opponent_facility->name : '';
				$home_away = !is_null($match->home_away) ? ($match->home_away === 'H' ? 'Home' : 'Away') : '';
			}
		}
		$event = $this->events->get_by_id($id);
		$lines = $this->sort_lines($this->lines->get_event_lines($id, $round_date));
		$lines_tables_array = array();
		$line_play_type_counts = array();
		// lines are returned from get_event_lines ordered by their ids
		// which is the order they were created so if a line_play_type_number is
		// missing, it can be derived from a running count of that line_play_type
		foreach($lines as $line){
			if(array_key_exists($line['line_play_type'], $line_play_type_counts)){
				$line_play_type_counts[$line['line_play_type']]++;
			}
			else{
				$line_play_type_counts[$line['line_play_type']] = 1;
			}
			if(!$line['line_play_type_number']){
				$line['line_play_type_number'] = $line_play_type_counts[$line['line_play_type']];
			}
		}
		array_push($lines_tables_array, $lines);
		$scorecard_parameters = array(
			'size' => $size,
			'event_name' => $event->name,
			'round' => $round,
			'round_date' => date('l F j, Y', strtotime($round_date)),
			'facility_name' => $event->facilities->name,
			'opponent_name' => isset($opponent) ? $opponent : null,
			'home_away' => isset($home_away) ? $home_away : null,
			'sets' => $event->sets,
			'lines_tables' => $lines_tables_array
		);
		if($size === 'large'){
			$scorecard_parameters = $this->events->calculate_set_columns_width($event, $scorecard_parameters);
		}
		$scorecard_parameters = $this->events->calculate_team_columns_font_sizes($scorecard_parameters);
		$view = View::make('scorecards.multi-lines', $scorecard_parameters);
		$mpdf->WriteHTML($view->render());
		return $mpdf->Output();

	}

	/*
	 * Emails team member lineup for a round
	 *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $recipients						Email recipients
	 * @param	string	 $message							Optional message to send 
	 * @param	date	 $round_date						Round for which we want to generate a scorecard for
	 * @param	boolean	 $directions						Flag indicating whether directions mailed as well
	 * @param	object	 $sender							Info about the user initiating the e-mail
	 *
	 * @return  void
	 *
	 */
	public function send_lineup($id, $recipients, $message, $round_date, $directions, $sender){

		$matches = $this->get_event_matches($id);
		// Get event and lines info
		foreach($matches as $match){
			if($round_date === $match->date){
				$home_away = !is_null($match->home_away) ? ($match->home_away === 'H' ? 'Home' : 'Away') : '';
			}
		}
		$event = $this->events->get_by_id($id);
		$lines = $this->sort_lines($this->lines->get_event_lines($id, $round_date));
		$lines_tables_array = array();
		$line_play_type_counts = array();
		// Lines are returned from get_event_lines ordered by their ids which is the order they were created so if a line_play_type_number is missing,
		// it can be derived from a running count of that line_play_type
		foreach($lines as $line){
			if(array_key_exists($line['line_play_type'], $line_play_type_counts)){
				$line_play_type_counts[$line['line_play_type']]++;
			}
			else{
				$line_play_type_counts[$line['line_play_type']] = 1;
			}
			if(!$line['line_play_type_number']){
				$line['line_play_type_number'] = $line_play_type_counts[$line['line_play_type']];
			}
		}
		array_push($lines_tables_array, $lines);

		$match_directions = array();
		if((int)$directions){
			$matches = $this->get_event_matches($id);
			for($i = 0; $i < count($matches); $i++){
				if($matches[$i]->home_away === 'A' && $matches[$i]->date === $round_date){
					$direction = array(
						'name' => $matches[$i]->multi_opponent_facility->name,
						'address' => $matches[$i]->multi_opponent_facility->address . ', '  .
									 $matches[$i]->multi_opponent_facility->city . ', ' .
									 $matches[$i]->multi_opponent_facility->state . ' ' .
									 $matches[$i]->multi_opponent_facility->zip,
						'directions' => $matches[$i]->multi_opponent_facility->directions,
						'url' => 'https://www.google.com/maps/search/?api=1&query='.urlencode($matches[$i]->multi_opponent_facility->address.' '.$matches[$i]->multi_opponent_facility->city.' '.$matches[$i]->multi_opponent_facility->state.' '.$matches[$i]->multi_opponent_facility->state.' '.$matches[$i]->multi_opponent_facility->zip)
					);
					array_push($match_directions, $direction);
				}
			}
		}

		$lineup_data = array(
			'event_name' => $event->name,
			'message' => $message,
			'round_date' => date('l F j, Y', strtotime($round_date)),
			'home_away' => isset($home_away) ? $home_away : null,
			'lines_tables' => $lines_tables_array,
			'directions' => $match_directions
		);
		$this->email->send_lineup_email($event->id, $recipients, $lineup_data, $sender);

	}

	/*
	 * Emails team member availability
	 *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $recipients						Email recipients
	 * @param	array	 $rounds							Rounds to email availability for
	 * @param	object	 $sender							Info about the user initiating the e-mail
	 *
	 * @return  void
	 *
	 */
	public function send_availability($id, $recipients, $rounds, $sender){

		$event = $this->events->get_by_id($id);
		$availabilites = $this->event_teams->get_availabilities($id, $sender->id);
		$availability_data = array(
			'event_id' => $event->id,
			'event_name' => $event->name,
			'rounds' => $rounds,
			'availabilities' => $availabilites
		);
		// If the sender is a captain of a team, all event partipant availabilities will be retrieved but only participants who are on the same team
		// will have filled in data. check to see if any of the participants' data is empty and if so, don't send that participant an email
		foreach($recipients as $recipient){
			$has_data = false;
			foreach($availability_data['availabilities'] as $availability){
				if($availability->user['id'] == $recipient && in_array($availability->round, $rounds)){
					// Found valid data, so no need to check further, just email it.
					$has_data = true;
					break;
				}
			}
			// If data was found, send an email
			if($has_data){
				$availability_data['user_id'] = $recipient;
				$this->email->send_availability_email($event->id, array($recipient), $availability_data, $sender);
			}
		}

	}

	// This routine determines which index in a list of records in the same round with the same line_play_type a particular line is
	private function get_round_offset($line){
		$round_lines = Line::where('match_id','=',$line['match_id'])->where('line_play_type','=',$line['line_play_type'])->orderBy('id', 'asc')->get();
		for($i = 0; $i < $round_lines->count(); $i++){
			if($round_lines[$i]->id === (int)$line['id']){
				return $i;
			}
		}
		return -1;
	}

	/*
	 * Update match lines for event
	 *
	 * @param	int		 $id								ID of event
	 * @param	array	 $lines								Match lines
	 *
	 * @return  boolean
	 *
	 */
	public function update_match_lines($id, $lines){

		$rounds = Match::where('event_id','=',$id)->orderBy('round', 'asc')->get();
		// Update all rounds with the same time for each line_play_type, line_play_type_number
		foreach($lines as $line){
			// Rather than try to match the line by line_play_type and line_play_type_number since line_play_type_number may not be filled in yet
			// because line_play_type_number remains null until a user is actually assigned, just calculate the index because the way they are assigned 
			// is just by ascending id
			$index = $this->get_round_offset($line);
			if($index === -1){
				continue;
			}
			// loop through the rounds setting the same time for each line_play_type line_play_type_number
			foreach($rounds as $round){
				$round_lines = Line::where('match_id','=',$round->id)->where('line_play_type','=',$line['line_play_type'])->orderBy('id', 'asc')->get();
				$round_lines[$index]->update(array(
					'start_time' => $line['start_time']
				));
			}
		}
		return true;

	}

}