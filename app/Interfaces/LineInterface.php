<?php

namespace App\Interfaces;

interface LineInterface{

	/*
     * Get lines for an event
     *
     * @param	int		 $event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get_event_lines($event_id, $round_date = null);

	/*
     * Creates lines for an event
     *
     * @param	int		 $user_id					ID of event
	 * @param	int		 $sets						Number of sets per line
     * @param 	array	 $lines_aggregate			Array telling us how many of each type of lines to create
     *
     * @return  boolean
     *
     */
	public function create_lines($event_id, $sets, $lines_aggregate);

	/*
     * Update participants associated with a line
     *
	 * @param	int		 $event_id					ID of event
     * @param 	array	 $lines					Lines to update
	 * @param	string	 $privilege					Privilege of calling user
	 * @param	array	 $leader_of_events_ids		IDs of events the calling user is an event leader of
     *
     * @return  void
     *
     */
	public function update_lines($event_id, $lines, $privilege, $leader_of_events_ids);

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
	public function update_lines_scores($lines_scores, $privilege, $leader_of_events_ids);

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
	public function update_lines_surfaces($line_surfaces, $privilege, $leader_of_events_ids);

	/*
     * Tells us whether any line results have been entered
     *
	 * @param	int	 	$event_id		ID of event
     *
     * @return  boolean
     *
     */
	public function event_lines_results_entered($event_id);

}