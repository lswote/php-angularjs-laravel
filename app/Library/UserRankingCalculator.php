<?php

namespace App\Library;

use App\Models\User;

class UserRankingCalculator{

	// Check whether any set scores have been given
	private function are_scores_provided($line_set_scores){

		foreach($line_set_scores as $line_set_score){
			if($line_set_score['pair_one_score'] > 0 || $line_set_score['pair_two_score'] > 0){
				return true;
			}
		}
		return false;

	}

	// Tell us whether a line was competitive based on how many games each side won
	private function was_line_competitive($line, $line_scores){

		$pair_one_total_score = 0;
		$pair_two_total_score = 0;
		foreach($line_scores['sets'] as $set){
			$pair_one_total_score = $pair_one_total_score + $set['pair_one_score'];
			$pair_two_total_score = $pair_two_total_score + $set['pair_two_score'];
		}
		$num_of_sets = count($line->line_scores);
		if($num_of_sets === 1){
			if($pair_one_total_score < 3 || $pair_two_total_score < 3){
				return false;
			}
		}
		else if($num_of_sets === 3){
			if($pair_one_total_score < 6 || $pair_two_total_score < 6){
				return false;
			}
		}
		else if($num_of_sets === 5){
			if($pair_one_total_score < 11 || $pair_two_total_score < 11){
				return false;
			}
		}
		return true;

	}

	// Get a team's total ranking
	private function get_team_rankings($event, $team_user_ids){

		$team_total_ranking = 0;
		foreach($team_user_ids as $team_user_id){
			$user = User::with(array('activities' => function($query)use($event){
				$query->wherePivot('facility_id', '=', $event->facility_id)->wherePivot('activity_id', '=', $event->activity_id);
			}))->find($team_user_id);
			$user_ranking = isset($user->activities[0]) ? $user->activities[0]->pivot->ranking : 0;
			$team_total_ranking = $team_total_ranking + $user_ranking;
		}
		return $team_total_ranking / 2;

	}

	// Get the higher ranking of two users from a team
	private function get_team_higher_user_ranking($event, $team_user_ids){

		$team_user_rankings = array();
		foreach($team_user_ids as $team_user_id){
			$user = User::with(array('activities' => function($query)use($event){
				$query->wherePivot('facility_id', '=', $event->facility_id)->wherePivot('activity_id', '=', $event->activity_id);
			}))->find($team_user_id);
			$user_ranking = isset($user->activities[0]) ? $user->activities[0]->pivot->ranking : 0;
			array_push($team_user_rankings, $user_ranking);
		}
		return max($team_user_rankings);

	}

	// Update a user's ranking
	private function update_user_rankings($event, $user_ids, $ranking_change){

		foreach($user_ids as $user_id){
			$user = User::with(array('activities' => function($query)use($event){
				$query->wherePivot('facility_id', '=', $event->facility_id)->wherePivot('activity_id', '=', $event->activity_id);
			}))->find($user_id);
			$user_ranking = isset($user->activities[0]) ? $user->activities[0]->pivot->ranking : 0;
			$user->activities()->updateExistingPivot($event->activity_id, array(
				'ranking' => $user_ranking + $ranking_change
			));
		}

	}

	// Update rankings for all users in a doubles line
	private function update_doubles_rankings($event, $line, $line_scores){

		if($line->pair_one_id == $line_scores['winning_pair_id']){
			$winning_team_user_ids = array($line->pair_one->user_one_id, $line->pair_one->user_two_id);
			$losing_team_user_ids = array($line->pair_two->user_one_id, $line->pair_two->user_two_id);
		}
		else if($line->pair_two_id == $line_scores['winning_pair_id']){
			$winning_team_user_ids = array($line->pair_two->user_one_id, $line->pair_two->user_two_id);
			$losing_team_user_ids = array($line->pair_one->user_one_id, $line->pair_one->user_two_id);
		}
		$winning_team_ranking = $this->get_team_rankings($event, $winning_team_user_ids);
		$losing_team_ranking = $this->get_team_rankings($event, $losing_team_user_ids);
		$was_line_competitive = $this->was_line_competitive($line, $line_scores);
		if($winning_team_ranking > $losing_team_ranking){
			if($this->are_scores_provided($line_scores['sets'])){
				if($was_line_competitive){
					$this->update_user_rankings($event, $losing_team_user_ids, 0.5);
				}
				else{
					$difference_in_ranking = $winning_team_ranking - $losing_team_ranking;
					if($difference_in_ranking < 2){
						$this->update_user_rankings($event, $losing_team_user_ids, -0.5);
					}
				}
			}
		}
		else{
			$difference_in_ranking = $losing_team_ranking - $winning_team_ranking;
			$this->update_user_rankings($event, $losing_team_user_ids, max(-$difference_in_ranking, -1));
			$winning_team_highest_rank = $this->get_team_higher_user_ranking($event, $winning_team_user_ids);
			$this->update_user_rankings($event, $winning_team_user_ids, min($difference_in_ranking, abs($winning_team_ranking - $winning_team_highest_rank)));
			if($this->are_scores_provided($line_scores['sets']) && !$was_line_competitive){
				$this->update_user_rankings($event, $winning_team_user_ids, 0.5);
				$this->update_user_rankings($event, $losing_team_user_ids, -0.5);
			}
		}

	}

	// Update rankings for all users in a singles line
	private function update_singles_rankings($event, $line, $line_scores){

		if($line->pair_one_id == $line_scores['winning_pair_id']){
			$winning_user_id = $line->pair_one_id;
			$losing_user_id = $line->pair_two_id;
		}
		else if($line->pair_two_id == $line_scores['winning_pair_id']){
			$winning_user_id = $line->pair_two_id;
			$losing_user_id = $line->pair_one_id;
		}
		$winning_user_ranking = $this->get_user_ranking($event, $winning_user_id);
		$losing_user_ranking = $this->get_user_ranking($event, $losing_user_id);
		$was_line_competitive = $this->was_line_competitive($line, $line_scores);
		if($winning_user_ranking > $losing_user_ranking){
			if($this->are_scores_provided($line_scores['sets'])){
				if($was_line_competitive){
					$this->update_user_rankings($event, array($losing_user_id), 0.5);
				}
				else{
					$difference_in_ranking = $winning_user_ranking - $losing_user_ranking;
					if($difference_in_ranking < 2){
						$this->update_user_rankings($event, array($losing_user_id), -0.5);
					}
				}
			}
		}
		else{
			$difference_in_ranking = $losing_user_ranking - $winning_user_ranking;
			$this->update_user_rankings($event, array($losing_user_id), max(-$difference_in_ranking, -1));
			$this->update_user_rankings($event, array($winning_user_id), $difference_in_ranking);
			if($this->are_scores_provided($line_scores['sets']) && !$was_line_competitive){
				$this->update_user_rankings($event, array($winning_user_id), 0.5);
				$this->update_user_rankings($event, array($losing_user_id), -0.5);
			}
		}

	}

	// Get a user's ranking
	public function get_user_ranking($event, $user_id){

		$user = User::with(array('activities' => function($query)use($event){
			$query->wherePivot('facility_id', '=', $event->facility_id)->wherePivot('activity_id', '=', $event->activity_id);
		}))->find($user_id);
		return isset($user->activities[0]) ? $user->activities[0]->pivot->ranking : 0;

	}

	// Update rankings for all participants in a ranked line
	public function update_rankings($event, $line, $line_scores){

		if($line->line_type == 'doubles'){
			$this->update_doubles_rankings($event, $line, $line_scores);
		}
		else if($line->line_type == 'singles'){
			$this->update_singles_rankings($event, $line, $line_scores);
		}
		$line->update(array(
			'ranking_updated' => 1
		));

	}

}