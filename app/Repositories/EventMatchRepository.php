<?php

namespace App\Repositories;

use App\Interfaces\EventMatchInterface;
use App\Interfaces\EventTeamInterface;
use App\Models\EventTeamUserAvailability;
use App\Models\Line;
use App\Models\Match;

class EventMatchRepository implements EventMatchInterface{

	private $event_teams;

	public function __construct(EventTeamInterface $event_teams){

		$this->event_teams = $event_teams;

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

		return Match::with('team_one', 'team_two')->where('event_id', '=', $event_id)->orderBy('round', 'ASC')->get();

	}

	/*
     * Return playoff matches for an event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_event_playoff_matches($event_id){

		return Match::with('team_one', 'team_two')->where('event_id', '=', $event_id)->where('round', '<', 0)->orderBy('round', 'ASC')->get();

	}

	/*
     * Get total team scores based on the number of games they have won
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  array
     *
     */
	public function get_team_scores($event_id){

		$regular_season_matches = $this->get_event_matches($event_id);
		$team_scores = array();
		foreach($regular_season_matches as $regular_season_match){
			if(isset($team_scores[$regular_season_match['event_team_one_id']])){
				$event_team_one_score = $regular_season_match['event_team_one_score'] ? $regular_season_match['event_team_one_score'] : 0;
				$team_scores[$regular_season_match['event_team_one_id']] = $team_scores[$regular_season_match['event_team_one_id']] + $event_team_one_score;
			}
			else{
				$team_scores[$regular_season_match['event_team_one_id']] = $regular_season_match['event_team_one_score'] ? $regular_season_match['event_team_one_score'] : 0;
			}
			if(isset($team_scores[$regular_season_match['event_team_two_id']])){
				$event_team_two_score = $regular_season_match['event_team_two_score'] ? $regular_season_match['event_team_two_score'] : 0;
				$team_scores[$regular_season_match['event_team_two_id']] = $team_scores[$regular_season_match['event_team_two_id']] + $event_team_two_score;
			}
			else{
				$team_scores[$regular_season_match['event_team_two_id']] = $regular_season_match['event_team_two_score'] ? $regular_season_match['event_team_two_score'] : 0;
			}
		}
		$event_teams = $this->event_teams->get_stats($event_id)->toArray();
		foreach($event_teams as &$event_team){
			$event_team['score'] = $team_scores[$event_team['id']];
		}
		return $event_teams;

	}

	/*
     * Get number and type of lines per match for our event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_lines_per_match($event_id){

		$match = Match::where('event_id', '=', $event_id)->first();
		return Line::where('match_id', '=', $match->id)->get();

	}

	/*
     * Update round dates for matches
     *
	 * @param	int		$event_id				ID of event
	 * @param	array	$rounds					Rounds we want to update
	 *
     * @return  void
     *
     */
	public function update_round_dates($event_id, $rounds){

		foreach($rounds as $round){
			$round_matches = Match::where('event_id', '=', $event_id)->where('round', '=', $round['number']);
			$round_matches->update(array(
				'date' => $round['date']
			));
			$event_team_user_availability = EventTeamUserAvailability::whereHas('event_team_users', function($query)use($event_id){
				$query->where('event_id', '=', $event_id);
			})->where('round', '=', $round['number']);
			$event_team_user_availability->update(array(
				'date' => $round['date']
			));
		}

	}

	/*
     * Update event matches
     *
	 * @param	int		$event_id				ID of event
	 * @param	array	$matches				Matches we want to update
	 *
     * @return  void
     *
     */
	public function update($event_id, $matches){

		foreach($matches as $match){
			if(isset($match['team_one']['id']) && isset($match['team_two']['id'])){
				Match::find($match['id'])->update(array(
					'winning_team_id' => $match['winning_team_id'],
					'event_team_one_id' => $match['team_one']['id'],
					'event_team_two_id' => $match['team_two']['id'],
				));
			}
		}

	}

}