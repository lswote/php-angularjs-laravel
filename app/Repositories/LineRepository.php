<?php

namespace App\Repositories;

use App\Interfaces\LineInterface;
use App\Models\Event;
use App\Models\Line;
use App\Models\Pair;
use App\Models\LineScore;
use App\Models\Activity;
use App\Library\UserRankingCalculator;
use App\Library\MatchScoreCalculator;

class LineRepository implements LineInterface{

	private $singles_line_types, $line_play_type_assignment_order, $line_play_type_pairing_end, $participants, $female_participants, $male_participants,
			$female_spots_available, $male_spots_available, $picked_participants, $waitlisted_female_participants, $waitlisted_male_participants, $ranked;

	private $user_ranking_calculator, $match_score_calculator;

	public function __construct(){

		$this->singles_line_types = array('ws', 'ms', 'xs');
		$this->line_play_type_assignment_order = array('ws', 'ms', 'wd', 'md', 'xs', 'xd');
		$this->line_play_type_pairing_end = array('ms', 'md', 'xd');
		$this->picked_participants = array();

		$this->user_ranking_calculator = new UserRankingCalculator();
		$this->match_score_calculator = new MatchScoreCalculator();

	}

	// Calculate how many spots are available in our event for guys and gals
	private function calculate_spots_available($lines_aggregate){

		$this->female_spots_available = 0;
		$this->male_spots_available = 0;
		foreach($lines_aggregate as $line_play_type){
			if($line_play_type['line_play_type'] === 'ws'){
				$this->female_spots_available = $this->female_spots_available + (2 * $line_play_type['count']);
			}
			else if($line_play_type['line_play_type'] === 'wd'){
				$this->female_spots_available = $this->female_spots_available + (4 * $line_play_type['count']);
			}
			else if($line_play_type['line_play_type'] === 'ms'){
				$this->male_spots_available = $this->male_spots_available + (2 * $line_play_type['count']);
			}
			else if($line_play_type['line_play_type'] === 'md'){
				$this->male_spots_available = $this->male_spots_available + (4 * $line_play_type['count']);
			}
			else if($line_play_type['line_play_type'] === 'xs'){
				$this->female_spots_available = $this->female_spots_available + (1 * $line_play_type['count']);
				$this->male_spots_available = $this->male_spots_available + (1 * $line_play_type['count']);
			}
			else if($line_play_type['line_play_type'] === 'xd'){
				$this->female_spots_available = $this->female_spots_available + (2 * $line_play_type['count']);
				$this->male_spots_available = $this->male_spots_available + (2 * $line_play_type['count']);
			}
		}

	}

	// Custom sort by line play type
	private function sort_by_line_play_type($a, $b){

		$pos_a = array_search($a['line_play_type'], $this->line_play_type_assignment_order);
		$pos_b = array_search($b['line_play_type'], $this->line_play_type_assignment_order);
		return $pos_a - $pos_b;

	}

	// Custom sort by RSVP datetime
	private function sort_by_rsvp($a, $b){

		return strtotime($a['pivot']['rsvped']) - strtotime($b['pivot']['rsvped']);

	}

	// Custom sort by start time preference then ranking
	private function sort_by_preferred_start_time_and_ranking($a, $b){

		if($a['pivot']['preferred_start_time'] === null && $b['pivot']['preferred_start_time'] !== null){
			return 1;
		}
    	if($b['pivot']['preferred_start_time'] === null && $a['pivot']['preferred_start_time'] !== null){
			return -1;
		}
		$preferred_start_time_difference = strtotime($a['pivot']['preferred_start_time']) - strtotime($b['pivot']['preferred_start_time']);
		if($this->ranked == 1){
			if($preferred_start_time_difference === 0){
				return $a['ranking'] <= $b['ranking'];
			}
			else{
				return $preferred_start_time_difference;
			}
		}
		else{
			return $preferred_start_time_difference;
		}


	}

	// Returns info about event
	private function get_event($event_id){

		return Event::find($event_id);

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

	// Creates an array listing of lines with the lines being in the order we want to assign them in
	private function create_ordered_lines_array($lines_aggregate){

		$current_pair_lines = array();
		$ordered_lines = array();
		foreach($lines_aggregate as $line_play_type){
			for($x = 0; $x < $line_play_type['count']; $x++){
				array_push($current_pair_lines, array(
					'line_play_type' => $line_play_type['line_play_type']
				));
			}
			if(in_array($line_play_type['line_play_type'], $this->line_play_type_pairing_end)){
				$current_pair_mixed_lines = array();
				$half_of_array_length = floor(count($current_pair_lines) / 2);
				$array_length_odd = count($current_pair_lines) % 2 !== 0;
				for($i = 0; $i < $half_of_array_length; $i++){
					// Pluck differenty depending on whether our current index is even or odd
					if($i % 2 == 0){
						array_push($current_pair_mixed_lines, $current_pair_lines[$i]);
						$reverse_index = (count($current_pair_lines) - 1) - $i;
						array_push($current_pair_mixed_lines, $current_pair_lines[$reverse_index]);
					}
					else{
						$reverse_index = (count($current_pair_lines) - 1) - $i;
						array_push($current_pair_mixed_lines, $current_pair_lines[$reverse_index]);
						array_push($current_pair_mixed_lines, $current_pair_lines[$i]);
					}
					if($array_length_odd === true && $i == ($half_of_array_length - 1)){
						array_push($current_pair_mixed_lines, $current_pair_lines[$half_of_array_length]);
					}
				}
				$ordered_lines = array_merge($ordered_lines, $current_pair_mixed_lines);
				$current_pair_lines = array();
			}
		}
		return $ordered_lines;

	}

	// Add user rankings to the class' participants property
	private function add_user_rankings($event){

		$event_activity_id = $event->activity_id;
		$event_facility_id = $event->facility_id;
		$activity = Activity::with(array('users' => function($query)use($event_facility_id){
			$query->wherePivot('facility_id', '=', $event_facility_id);
		}))->find($event_activity_id);
		$user_rankings = $activity->users->toArray();
		foreach($this->participants as &$user){
			$index = array_search($user['id'], array_column($user_rankings, 'id'));
			$user['ranking'] = $user_rankings[$index]['pivot']['ranking'];
		}

	}

	// Sets available participants by sex
	private function set_available_participants_by_sex(){

		$this->female_participants = array();
		$this->male_participants = array();
		foreach($this->participants as $participant){
			if($participant['sex'] === 'female'){
				array_push($this->female_participants, $participant);
			}
			else if($participant['sex'] === 'male'){
				array_push($this->male_participants, $participant);
			}
		}

	}

	// Determine who will be confirmed for the event based on number of spots available
	private function sort_and_set_participants_by_sex(){

		// Chicks sort
		usort($this->female_participants, array($this, 'sort_by_rsvp'));
		$this->waitlisted_female_participants = array_slice($this->female_participants, $this->female_spots_available);
		$this->female_participants = array_slice($this->female_participants, 0, $this->female_spots_available);
		usort($this->female_participants, array($this, 'sort_by_preferred_start_time_and_ranking'));
		// Dudes sort
		usort($this->male_participants, array($this, 'sort_by_rsvp'));
		$this->waitlisted_male_participants = array_slice($this->male_participants, $this->male_spots_available);
		$this->male_participants = array_slice($this->male_participants, 0, $this->male_spots_available);
		usort($this->male_participants, array($this, 'sort_by_preferred_start_time_and_ranking'));

	}

	// Set event participants
	private function set_event_participants($event){

		$event = Event::with(array('users' => function($query){
			$query->wherePivot('rsvped', '!=', null)->where('unavailable', '=', 0);
		}))->find($event->id);
		$this->participants = $event->users->toArray();
		$this->add_user_rankings($event);
		$this->set_available_participants_by_sex();
		$this->sort_and_set_participants_by_sex();

	}

	// Given a ranking and gender, find the closest ranked user with no start time preference
	private function get_closest_ranked_participant_with_no_preference($sex, $partner_ranking){

		$closest_ranked_user = null;
		if($sex === 'female'){
			foreach($this->female_participants as $key => $value){
				if($value['pivot']['preferred_start_time'] === null){
					if($closest_ranked_user === null || (abs($partner_ranking - $closest_ranked_user['ranking']) > abs($closest_ranked_user['ranking'] - $partner_ranking))){
						$closest_ranked_user = array(
							'key' => $key,
							'user_id' => $value['id'],
							'ranking' => $value['ranking']
						);
					}
				}
			}
			return $closest_ranked_user;
		}
		else if($sex === 'male'){
			foreach($this->male_participants as $key => $value){
				if($value['pivot']['preferred_start_time'] === null){
					if($closest_ranked_user === null || (abs($partner_ranking - $closest_ranked_user['ranking']) > abs($closest_ranked_user['ranking'] - $partner_ranking))){
						$closest_ranked_user = array(
							'key' => $key,
							'user_id' => $value['id'],
							'ranking' => $value['ranking']
						);
					}
				}
			}
			return $closest_ranked_user;
		}

	}

	// Grab a male or female participant and delete him / her from our participants class variables
	private function pick_participant($sex, $start_time, $partner_ranking = null){

		if($sex === 'female'){
			if($partner_ranking !== null && $start_time !== $this->female_participants[0]['pivot']['preferred_start_time']){
				$female_user = $this->get_closest_ranked_participant_with_no_preference('female', $partner_ranking);
			}
			else{
				foreach($this->female_participants as $key => $value){
					if($value['pivot']['preferred_start_time'] === $start_time || $value['pivot']['preferred_start_time'] === null){
						$female_user = array(
							'key' => $key,
							'user_id' => $value['id']
						);
						break;
					}
				}
			}
			if(isset($female_user)){
				unset($this->participants[$female_user['key']]);
				unset($this->female_participants[$female_user['key']]);
				$this->participants = array_values($this->participants);
				$this->female_participants = array_values($this->female_participants);
				array_push($this->picked_participants, $female_user['user_id']);
				return $female_user['user_id'];
			}

		}
		else if($sex === 'male'){
			if($partner_ranking !== null && $start_time !== $this->male_participants[0]['pivot']['preferred_start_time']){
				$male_user = $this->get_closest_ranked_participant_with_no_preference('male', $partner_ranking);
			}
			else{
				foreach($this->male_participants as $key => $value){
					if($value['pivot']['preferred_start_time'] === $start_time || $value['pivot']['preferred_start_time'] === null){
						$male_user = array(
							'key' => $key,
							'user_id' => $value['id']
						);
						break;
					}
				}
			}
			if(isset($male_user)){
				unset($this->participants[$male_user['key']]);
				unset($this->male_participants[$male_user['key']]);
				$this->participants = array_values($this->participants);
				$this->male_participants = array_values($this->male_participants);
				array_push($this->picked_participants, $male_user['user_id']);
				return $male_user['user_id'];
			}
		}
		return false;

	}
	
	// Get two users to make a pair given the line type
	private function create_pair($line_play_type, $start_time, $event_id){

		if($line_play_type === 'wd'){
			$user_one_id = $this->pick_participant('female', $start_time);
			$user_key = array_search($user_one_id, array_column($this->participants, 'id'));
			$user_two_id = $this->pick_participant('female', $start_time, $this->participants[$user_key]['ranking']);
		}
		else if($line_play_type === 'md'){
			$user_one_id = $this->pick_participant('male', $start_time);
			$user_key = array_search($user_one_id, array_column($this->participants, 'id'));
			$user_two_id = $this->pick_participant('male', $start_time, $this->participants[$user_key]['ranking']);
		}
		else if($line_play_type === 'xd'){
			$user_one_id = $this->pick_participant('female', $start_time);
			$user_two_id = $this->pick_participant('male', $start_time);
		}
		$pair = Pair::create(array(
			'event_id' => $event_id,
			'user_one_id' => $user_one_id,
			'user_two_id' => $user_two_id
		));
		return array(
			'id' => $pair->id,
			'user_one_id' => $user_one_id,
			'user_two_id' => $user_two_id
		);
		
	}

	// Mix pair users for ranked lines
	private function mix_pair_users($pair_one, $pair_two){

		if($this->ranked === 1){
			$pair_one_user_one_id = $pair_one['user_one_id'];
			$pair_two_user_one_id = $pair_two['user_one_id'];
			Pair::find($pair_one['id'])->update(array(
				'user_one_id' => $pair_two_user_one_id
			));
			Pair::find($pair_two['id'])->update(array(
				'user_one_id' => $pair_one_user_one_id
			));
		}

	}

	// Pick two users for a singles line given the line line type
	private function line_singles($line_play_type, $start_time){
		
		if($line_play_type === 'ws'){
			$pair_one_id = $this->pick_participant('female', $start_time);
			$pair_two_id = $this->pick_participant('female', $start_time);
		}
		else if($line_play_type === 'ms'){
			$pair_one_id = $this->pick_participant('male', $start_time);
			$pair_two_id = $this->pick_participant('male', $start_time);
		}
		else if($line_play_type === 'xs'){
			$pair_one_id = $this->pick_participant('female', $start_time);
			$pair_two_id = $this->pick_participant('male', $start_time);
		}
		return array(
			'pair_one_id' => $pair_one_id,
			'pair_two_id' => $pair_two_id
		);
		
	}

	// Creates a line
	private function create_line($event_id, $line_type, $line_play_type, $pair_one_id, $pair_two_id, $start_time){

		return Line::create(array(
			'event_id' => $event_id,
			'line_type' => $line_type,
			'line_play_type' => $line_play_type,
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

	// Marks users who were assigned a line as confirmed for event
	private function update_confirmed_participants($event){

		foreach($this->picked_participants as $participant_id){
			$event->users()->updateExistingPivot($participant_id, array(
				'confirmed' => 1,
				'waitlisted' => 0,
				'substitute' => 0,
				'unavailable' => 0
			));
		}

	}

	// Marks users who were not assigned a line as waitlisted for event
	private function update_waitlisted_participants($event){

		foreach($this->female_participants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
		}
		foreach($this->male_participants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
		}
		foreach($this->waitlisted_female_participants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
		}
		foreach($this->waitlisted_male_participants as $participant){
			$event->users()->updateExistingPivot($participant['id'], array(
				'confirmed' => 0,
				'waitlisted' => 1,
				'substitute' => 1,
				'unavailable' => 0
			));
		}

	}

	/*
     * Get lines for an event
     *
     * @param	int		 $event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get_event_lines($event_id, $round_date = null){

		$doubles = Line::with('pair_one.user_one', 'pair_one.user_two', 'pair_two.user_one', 'pair_two.user_two', 'line_scores', 'matches.team_one',
							  'matches.team_two')->where('event_id', '=', $event_id)->where('line_type', '=', 'doubles');
		$singles = Line::with('pair_one', 'pair_two', 'line_scores', 'matches.team_one', 'matches.team_two')->where('event_id', '=', $event_id)
																											->where('line_type', '=', 'singles');
		// Return only lines corresponding to a specific round if round date is provided
		if($round_date !== null){
			$doubles->whereHas('matches', function($query)use($round_date){
				$query->where('date', '=', $round_date);
			});
			$singles->whereHas('matches', function($query)use($round_date){
				$query->where('date', '=', $round_date);
			});
		};
		$doubles = $doubles->get();
		$singles = $singles->get();
		$line_play_type_sort_order = array('ws', 'wd', 'ms', 'md', 'xs', 'xd');
		return $doubles->merge($singles)->sort(function($a, $b)use($line_play_type_sort_order){
			$start_time_comparision = strcmp($a['start_time'], $b['start_time']);
			if($start_time_comparision === 0){
				$a_position = array_search($a->line_play_type, $line_play_type_sort_order);
				$b_position = array_search($b->line_play_type, $line_play_type_sort_order);
				return $a_position - $b_position;
			}
			return $start_time_comparision;
		})->values();

	}

	/*
     * Creates lines for an event
     *
     * @param	int		 $user_id					ID of event
	 * @param	int		 $sets						Number of sets per line
     * @param 	array	 $lines_aggregate			Array telling us how many of each type of lines to create
     *
     * @return  void
     *
     */
	public function create_lines($event_id, $sets, $lines_aggregate){

		$event = $this->get_event($event_id);
		$this->ranked = $event->ranked;
		$this->calculate_spots_available($lines_aggregate);
		$this->set_event_participants($event);
		$start_time = $event->start_time;
		$total_lines_index = 0;
		usort($lines_aggregate, array($this, 'sort_by_line_play_type'));
		$total_lines_allowed = $event->num_of_start_times * $event->max_playing_surfaces;
		$start_times = $this->create_start_times_array($start_time, $event);
		$ordered_lines = $this->create_ordered_lines_array($lines_aggregate);
		foreach($ordered_lines as $line){
			$line_type = in_array($line['line_play_type'], $this->singles_line_types) === true ? 'singles' : 'doubles';
			if($line_type === 'doubles'){
				$pair_one = $this->create_pair($line['line_play_type'], $start_times[$total_lines_index], $event_id);
				$pair_two = $this->create_pair($line['line_play_type'], $start_times[$total_lines_index], $event_id);
				$pair_one_id = $pair_one['id'];
				$pair_two_id = $pair_two['id'];
				$this->mix_pair_users($pair_one, $pair_two);
			}
			else if($line_type === 'singles'){
				$teams = $this->line_singles($line['line_play_type'], $start_times[$total_lines_index]);
				$pair_one_id = $teams['pair_one_id'];
				$pair_two_id = $teams['pair_two_id'];
			}
			$line = $this->create_line($event_id, $line_type, $line['line_play_type'], $pair_one_id, $pair_two_id, $start_times[$total_lines_index]);
			$this->create_line_scores($line, $sets);
			$total_lines_index = $total_lines_index + 1;
			if($total_lines_index === $total_lines_allowed){
				break;
			}
		}
		$this->update_confirmed_participants($event);
		$this->update_waitlisted_participants($event);

	}

	/*
     * Update participants associated with a line
     *
	 * @param	int		 $event_id					ID of event
     * @param 	array	 $lines						Lines to update
	 * @param	string	 $privilege					Privilege of calling user
	 * @param	array	 $leader_of_events_ids		IDs of events the calling user is an event leader of
     *
     * @return  void
     *
     */
	public function update_lines($event_id, $lines, $privilege, $leader_of_events_ids){

		foreach($lines as $line){
			$line_object = Line::find($line['id']);
			if(in_array($privilege, array('admin', 'facility leader')) || in_array($line_object->event_id, $leader_of_events_ids)){
				if($line['line_type'] === 'doubles'){
					Pair::find($line['pair_one']['id'])->update(array(
						'event_id' => $event_id,
						'user_one_id' => !empty($line['pair_one']['user_one_id']) ? $line['pair_one']['user_one_id'] : null,
						'user_two_id' => !empty($line['pair_one']['user_two_id']) ? $line['pair_one']['user_two_id'] : null
					));
					Pair::find($line['pair_two']['id'])->update(array(
						'event_id' => $event_id,
						'user_one_id' => !empty($line['pair_two']['user_one_id']) ? $line['pair_two']['user_one_id'] : null,
						'user_two_id' => !empty($line['pair_two']['user_two_id']) ? $line['pair_two']['user_two_id'] : null
					));
				}
				else if($line['line_type'] === 'singles'){
					$line_object->update(array(
						'pair_one_id' => !empty($line['pair_one_id']) ? $line['pair_one_id'] : null,
						'pair_two_id' => !empty($line['pair_two_id']) ? $line['pair_two_id'] : null
					));
				}
			}
		}

	}

	/*
     * Update lines scores
     *
     * @param 	array	 $lines_scores			New scores for lines
	 * @param	string	 $privilege					Privilege of calling user
	 * @param	array	 $leader_of_events_ids		IDs of events the calling user is an event leader of
     *
     * @return  void
     *
     */
	public function update_lines_scores($lines_scores, $privilege, $leader_of_events_ids){

		foreach($lines_scores as $line_scores){
			$line = Line::with('pair_one', 'pair_two', 'line_scores')->find($line_scores['line_id']);
			if(in_array($privilege, array('admin', 'facility leader')) || in_array($line->event_id, $leader_of_events_ids)){
				// Test whether winning team has been changed
				$winning_pair_changed = $line->winning_pair_id != $line_scores['winning_pair_id'] && $line->ranking_updated == 1;
				$line->update(array(
					'winning_pair_id' => $line_scores['winning_pair_id']
				));
				$last_pair_one_total_score = 0;
				$last_pair_two_total_score = 0;
				$line_scores_changed = false;
				foreach($line_scores['sets'] as $set){
					$line_score = LineScore::find($set['line_score_id']);
					$last_pair_one_total_score = $last_pair_one_total_score + $line_score->pair_one_score;
					$last_pair_two_total_score = $last_pair_two_total_score + $line_score->pair_two_score;
					// Test whether scores have been changed
					if($line_score->pair_one_score != $set['pair_one_score'] || $line_score->pair_two_score != $set['pair_two_score']){
						$line_scores_changed = true;
					}
					$line_score->update(array(
						'pair_one_score' => $set['pair_one_score'],
						'pair_two_score' => $set['pair_two_score']
					));
				}
				$event = Event::find($line->event_id);
				if($line_scores['winning_pair_id'] > 0 && $event->event_type === 'league' &&
				  ($line->ranking_updated != 1 || $winning_pair_changed === true || $line_scores_changed === true)){
					$this->match_score_calculator->update_scores($event, $line, $line_scores, array(
						'winning_pair_changed' => $winning_pair_changed,
						'line_scores_changed' => $line_scores_changed,
						'last_pair_one_total_score' => $last_pair_one_total_score,
						'last_pair_two_total_score' => $last_pair_two_total_score
					));
				}
				if($event->ranked == 1 && $line->ranking_updated != 1 && $line_scores['winning_pair_id'] > 0){
					$this->user_ranking_calculator->update_rankings($event, $line, $line_scores);
				}
			}
		}

	}

	/*
     * Update surfaces lines are played on
     *
     * @param 	array	 $lines_surfaces			Lines / surfaces combos
	 * @param	string	 $privilege					Privilege of calling user
	 * @param	array	 $leader_of_events_ids		IDs of events the calling user is an event leader of
     *
     * @return  void
     *
     */
	public function update_lines_surfaces($line_surfaces, $privilege, $leader_of_events_ids){

		foreach($line_surfaces as $line_surface){
			$line = Line::find($line_surface['id']);
			if(in_array($privilege, array('admin', 'facility leader')) || in_array($line->event_id, $leader_of_events_ids)){
				$line->update(array(
					'event_surface_number' => !empty($line_surface['event_surface_number']) &&  $line_surface['event_surface_number'] !== '0' ? $line_surface['event_surface_number'] : null
				));
			}
		}

	}

	/*
     * Tells us whether any line results have been entered
     *
	 * @param	int	 	$event_id		ID of event
     *
     * @return  boolean
     *
     */
	public function event_lines_results_entered($event_id){

		$lines = Line::where('event_id', '=', $event_id)->where(function($query){
			$query->whereHas('line_scores', function($query){
				$query->where('pair_one_score', '!=', null)->where('pair_two_score', '!=', null);
			});
			$query->orWhere('winning_pair_id', '!=', null);
		});
		return $lines->exists();

	}

}