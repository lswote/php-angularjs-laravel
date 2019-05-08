<?php

namespace App\Library;

use App\Models\Match;

class MatchScoreCalculator{

	// Tells us which team won a line
	private function get_winning_team($line, $line_scores){

		if($line->pair_one_id == $line_scores['winning_pair_id']){
			return 1;
		}
		else if($line->pair_two_id == $line_scores['winning_pair_id']){
			return 2;
		}

	}

	// Get team scores from a match
	private function get_team_scores($match_id){

		$match = Match::find($match_id);
		$event_team_one_score = is_null($match->event_team_one_score) ? 0 : $match->event_team_one_score;
		$event_team_two_score = is_null($match->event_team_two_score) ? 0 : $match->event_team_two_score;
		return array(
			'event_team_one_score' => $event_team_one_score,
			'event_team_two_score' => $event_team_two_score
		);

	}

	// Reset the last match scores update for a points line scoring format event line
	private function reset_last_points_scores_update($match, $winning_pair_changed_object){

		$match->update(array(
			'event_team_one_score' => $match->event_team_one_score - $winning_pair_changed_object['last_pair_one_total_score'],
			'event_team_two_score' => $match->event_team_two_score - $winning_pair_changed_object['last_pair_two_total_score']
		));

	}

	// Use line results to update associated match scores if event is a point line scoring event
	private function update_points_scores($line_scores, $event_team_one_score, $event_team_two_score){

		foreach($line_scores['sets'] as $set){
			$team_one_set_score = !empty($set['pair_one_score']) ? $set['pair_one_score'] : 0;
			$event_team_one_score = $event_team_one_score + $team_one_set_score;
			$team_two_set_score = !empty($set['pair_two_score']) ? $set['pair_two_score'] : 0;
			$event_team_two_score = $event_team_two_score + $team_two_set_score;
		}
		return array(
			'event_team_one_score' => $event_team_one_score,
			'event_team_two_score' => $event_team_two_score
		);

	}

	// Reset the last match scores update for a win / loss event line
	private function reset_last_wl_scores_update($line, $line_scores, $match){

		$winning_team = $this->get_winning_team($line, $line_scores);
		if($winning_team === 1){
			$match->update(array(
				'event_team_two_score' => $match->event_team_two_score - 1
			));
		}
		else if($winning_team === 2){
			$match->update(array(
				'event_team_one_score' => $match->event_team_one_score - 1
			));
		}

	}

	// Use line results to update associated match scores if event is a wl line scoring event
	private function update_wl_scores($line, $line_scores, $event_team_one_score, $event_team_two_score){

		$winning_team = $this->get_winning_team($line, $line_scores);
		if($winning_team === 1){
			$event_team_one_score = $event_team_one_score + 1;
		}
		else if($winning_team === 2){
			$event_team_two_score = $event_team_two_score + 1;
		}
		return array(
			'event_team_one_score' => $event_team_one_score,
			'event_team_two_score' => $event_team_two_score
		);

	}

	// Use line results to update associated match scores
	public function update_scores($event, $line, $line_scores, $winning_pair_changed_object){

		$match = Match::find($line->match_id);
		if($event->line_scoring_format === 'points'){
			if($winning_pair_changed_object['line_scores_changed'] === true){
				$this->reset_last_points_scores_update($match, $winning_pair_changed_object);
			}
			$result = $this->get_team_scores($line->match_id);
			$result = $this->update_points_scores($line_scores, $result['event_team_one_score'], $result['event_team_two_score']);
		}
		else if($event->line_scoring_format === 'wl'){
			if($winning_pair_changed_object['winning_pair_changed'] === true){
				$this->reset_last_wl_scores_update($line, $line_scores, $match);
			}
			$result = $this->get_team_scores($line->match_id);
			$result = $this->update_wl_scores($line, $line_scores, $result['event_team_one_score'], $result['event_team_two_score']);
		}
		$match->update(array(
			'event_team_one_score' => $result['event_team_one_score'],
			'event_team_two_score' => $result['event_team_two_score']
		));

	}

}