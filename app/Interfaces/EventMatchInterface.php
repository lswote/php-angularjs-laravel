<?php

namespace App\Interfaces;

interface EventMatchInterface{

	/*
     * Return matches for an event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_event_matches($event_id);

	/*
     * Return playoff matches for an event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_event_playoff_matches($event_id);

	/*
     * Get total team scores based on the number of games they have won
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  array
     *
     */
	public function get_team_scores($event_id);

	/*
     * Get number and type of lines per match for our event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_lines_per_match($event_id);

	/*
     * Update round dates for matches
     *
	 * @param	int		$event_id				ID of event
	 * @param	array	$rounds					Rounds we want to update
	 *
     * @return  void
     *
     */
	public function update_round_dates($event_id, $rounds);

	/*
     * Update event matches
     *
	 * @param	int		$event_id				ID of event
	 * @param	array	$matches				Matches we want to update
	 *
     * @return  void
     *
     */
	public function update($event_id, $matches);

}