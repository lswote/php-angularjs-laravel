<?php

namespace App\Library;

use App\Repositories\LineRepository;
use App\Models\Event;
use App\Models\Line;
use App\Models\User;

class EventLinesCalculator{

	private $lines;

	private $event, $participants, $male_count, $female_count, $women_lines, $men_lines, $additional_women, $additional_men, $comb_lines, $total_lines, $additional_players,
		    $per_team_lines, $lines_aggregate_array;

	public function __construct($event_id){

		$this->lines = new LineRepository();

		$this->event = Event::find($event_id);
		$this->participants = User::whereHas('events', function($query)use($event_id){
			$query->where('event_id', '=', $event_id)->where('rsvped', '!=', null)->where('unavailable', '=', 0);
		})->get();;

	}

	// Get total counts of female / male participants
	private function parse_participants_sex_count(){

		$this->female_count = 0;
		$this->male_count = 0;
		foreach($this->participants as $participant){
			if($participant->sex === 'female'){
				$this->female_count = $this->female_count + 1;
			}
			else if($participant->sex === 'male'){
				$this->male_count = $this->male_count + 1;
			}
		}

	}

	// Calculate combined lines given the number of additional guys and gals
	private function calculate_comb_lines($additional_women, $additional_men){

		if($additional_women >= 2 && $additional_men >= 2 && $this->event->comb_play == 1){
			$possible_women_duos = floor($additional_women / 2);
			$possible_men_duos= floor($additional_men / 2);
			return min($possible_women_duos, $possible_men_duos);
		}
		return 0;

	}

	// Builds our array definining how many of each line type to schedule
	private function build_lines_aggregate_array(){

		$this->lines_aggregate_array = array();
		foreach($this->per_team_lines[0] as $key => $value){
			$line_play_type = null;
			if($key === 'women_doubles'){
				$line_play_type = 'wd';
			}
			else if($key === 'men_doubles'){
				$line_play_type = 'md';
			}
			else if($key === 'women_singles'){
				$line_play_type = 'ws';
			}
			else if($key === 'men_singles'){
				$line_play_type = 'ms';
			}
			else if($key === 'mixed_doubles'){
				$line_play_type = 'xd';
			}
			else if($key === 'mixed_singles'){
				$line_play_type = 'xs';
			}
			if($line_play_type !== null){
				array_push($this->lines_aggregate_array, array(
					'line_play_type' => $line_play_type,
					'count' => $value
				));
			}
		}

	}

	// Calculates lines for gender play
	private function calculate_lines_gender(){

		if(isset($this->event->comb_play) && isset($this->event->single_women_lines) && isset($this->event->single_men_lines)){
			$women_singles = min(floor($this->female_count / 2), $this->event->single_women_lines);
			$men_singles = min(floor($this->male_count / 2), $this->event->single_men_lines);
			$women_doubles = max(0, floor(($this->female_count - ($this->event->single_women_lines * 2)) / 4));
			$men_doubles = max(0, floor(($this->male_count - ($this->event->single_men_lines * 2)) / 4));
			$this->women_lines = $women_singles + $women_doubles;
			$this->men_lines = $men_singles + $men_doubles;
			$this->additional_women = max(0, ($this->female_count - ($this->event->single_women_lines * 2)) % 4);
			$this->additional_men = max(0, ($this->male_count - ($this->event->single_men_lines * 2)) % 4);
			$this->comb_lines = $this->calculate_comb_lines($this->additional_women, $this->additional_men);
			$this->total_lines = $this->women_lines + $this->men_lines + $this->comb_lines;
			$this->additional_players = ($this->additional_women + $this->additional_men) - ($this->comb_lines * 4);
		}
		else{
			$this->women_lines = '-';
			$this->men_lines = '-';
			$this->additional_women = '-';
			$this->additional_men = '-';
			$this->comb_lines = '-';
			$this->total_lines = '-';
			$this->additional_players = '-';
		}
		$this->per_team_lines = array(array(
			'total_teams' => 1,
			'women_lines' => $this->women_lines,
			'men_lines' => $this->men_lines,
			'additional_women' => $this->additional_women,
			'additional_men' => $this->additional_men,
			'comb_lines' => $this->comb_lines,
			'total_lines' => $this->total_lines,
			'additional_players' => $this->additional_players,
			'women_doubles' => $women_doubles,
			'men_doubles' => $men_doubles,
			'women_singles' => $women_singles,
			'men_singles' => $men_singles,
			'mixed_doubles' => $this->comb_lines
	    ), array(
	    	'total_teams' => 2
		), array(
	    	'total_teams' => 4
		), array(
	    	'total_teams' => 6
		), array(
	    	'total_teams' => 8
		), array(
	    	'total_teams' => 9
		), array(
	    	'total_teams' => 16
		), array(
	    	'total_teams' => 25
		));

	}

	// Calculates lines for gender play for a singles only event
	private function calculate_lines_gender_singles_only(){

		$extra_women = $this->female_count % 2;
		$extra_men = $this->male_count % 2;
		if($this->event->comb_play == 1){
			$comb_singles = $extra_women === 1 && $extra_men === 1 ? 1 : 0;
		}
		else{
			$comb_singles = 0;
		}
		$this->women_lines = floor($this->female_count / 2);
		$this->men_lines = floor($this->male_count / 2);
		$this->additional_women = $comb_singles === 0 ? $extra_women : 0;
		$this->additional_men = $comb_singles === 0 ? $extra_men : 0;
		$this->comb_lines = $comb_singles;
		$this->total_lines = $this->women_lines + $this->men_lines + $this->comb_lines;
		$this->additional_players = $this->additional_women + $this->additional_men;
		$this->per_team_lines = array(array(
			'total_teams' => 1,
			'women_lines' => $this->women_lines,
			'men_lines' => $this->men_lines,
			'additional_women' => $this->additional_women,
			'additional_men' => $this->additional_men,
			'comb_lines' => $this->comb_lines,
			'total_lines' => $this->total_lines,
			'additional_players' => $this->additional_players,
			'women_doubles' => 0,
			'men_doubles' => 0,
			'women_singles' => $this->women_lines,
			'men_singles' => $this->men_lines,
			'mixed_doubles' => 0
	    ), array(
	    	'total_teams' => 2
		), array(
	    	'total_teams' => 4
		), array(
	    	'total_teams' => 6
		), array(
	    	'total_teams' => 8
		), array(
	    	'total_teams' => 9
		), array(
	    	'total_teams' => 16
		), array(
	    	'total_teams' => 25
		));

	}

	// Calculates lines for mixed play
	private function calculate_lines_mixed(){

		$single_lines = min($this->female_count, $this->male_count, $this->event->single_women_lines, $this->event->single_men_lines);
		$women_left_after_singles = $this->female_count - $single_lines;
		$men_left_after_singles = $this->male_count - $single_lines;
		$most_of_gender_available_for_doubles = min($women_left_after_singles, $men_left_after_singles);
		$extra_women = $women_left_after_singles - $most_of_gender_available_for_doubles;
		$extra_men = $men_left_after_singles - $most_of_gender_available_for_doubles;
		$double_lines = floor($most_of_gender_available_for_doubles / 2);
		$this->total_lines = $single_lines + $double_lines;
		$women_and_men_left_after_doubles = $most_of_gender_available_for_doubles % 2;
		$additional_women = $extra_women + $women_and_men_left_after_doubles;
		$additional_men = $extra_men + $women_and_men_left_after_doubles;
		$this->per_team_lines = array(array(
			'total_teams' => 1,
			'women_lines' => '-',
			'men_lines' => '-',
			'additional_women' => $additional_women,
			'additional_men' => $additional_men,
			'comb_lines' => '-',
			'total_lines' => $this->total_lines,
			'additional_players' => $additional_women + $additional_men,
			'mixed_singles' => $single_lines,
			'mixed_doubles' => $double_lines
	    ), array(
	    	'total_teams' => 2
		), array(
	    	'total_teams' => 4
		), array(
	    	'total_teams' => 6
		), array(
	    	'total_teams' => 8
		), array(
	    	'total_teams' => 9
		), array(
	    	'total_teams' => 16
		), array(
	    	'total_teams' => 25
		));

	}

	// Calculates lines for mixed play for a singles only event
	private function calculate_lines_mixed_singles_only(){

		$this->total_lines = min($this->female_count, $this->male_count);
		$extra_women = $this->female_count - $this->total_lines;
		$extra_men = $this->male_count - $this->total_lines;
		$this->per_team_lines = array(array(
			'total_teams' => 1,
			'women_lines' => '-',
			'men_lines' => '-',
			'additional_women' => $extra_women,
			'additional_men' => $extra_men,
			'comb_lines' => '-',
			'total_lines' => $this->total_lines,
			'additional_players' => $extra_women + $extra_men,
			'mixed_singles' => $this->total_lines,
			'mixed_doubles' => 0
	    ), array(
	    	'total_teams' => 2
		), array(
	    	'total_teams' => 4
		), array(
	    	'total_teams' => 6
		), array(
	    	'total_teams' => 8
		), array(
	    	'total_teams' => 9
		), array(
	    	'total_teams' => 16
		), array(
	    	'total_teams' => 25
		));

	}

	// Delete all existing lines for an event
	private function delete_existing_lines(){

		Line::where('event_id', '=', $this->event->id)->delete();

	}

	// Calculate number and type of lines for our event
	public function calculate_lines(){

		$this->delete_existing_lines();
		$this->parse_participants_sex_count();
		if($this->event->type_of_play === 'gender'){
			if($this->event->singles_only == 0){
				$this->calculate_lines_gender();
			}
			else{
				$this->calculate_lines_gender_singles_only();
			}
		}
		else if($this->event->type_of_play === 'mixed'){
			if($this->event->singles_only == 0){
				$this->calculate_lines_mixed();
			}
			else{
				$this->calculate_lines_mixed_singles_only();
			}
		}
		$this->build_lines_aggregate_array();
		$this->lines->create_lines($this->event->id, $this->event->sets, $this->lines_aggregate_array);

	}

}