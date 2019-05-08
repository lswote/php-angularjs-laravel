<?php

namespace App\Interfaces;

interface EventTeamInterface{

    /*
     * Returns teams and groups info about an event
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$team_id			Team ID
     *
     * @return  collection
     *
     */
	public function get($event_id, $team_id);

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
	public function create($event_id, $per_round_lines_aggregate, $num_of_females_to_remove, $num_of_males_to_remove);

	/*
     * Create event team and lines for a multifacility event
     *
	 * @param	int		$event_id					ID of event
	 * @param	array	$per_round_lines_aggregate 	Type and number of lines we need to create per match for our event
	 *
     * @return  void
     *
     */
	public function create_team($event_id, $per_round_lines_aggregate);

	/*
     * Set all non-confirmed participants as waitlisted
     *
	 * @param	int		$event_id					ID of event
	 *
     * @return  void
     *
     */
	public function set_waitlisted_participants($event_id);

	/*
     * Create event teams and groups using an import file
     *
	 * @param	int		$event_id					ID of event
	 * @param	string	$file_key 					S3 key for import file
	 *
     * @return  mixed
     *
     */
	public function import($event_id, $file_key);

	/*
     * Update group and team info
     *
	 * @param	int		$event_id					ID of event
	 * @param	array	$event_team_users		Teams and groups we want to update
	 * @param	int		$event_id					Captain team id if applicable
     *
     * @return  void
     *
     */
	public function update($event_id, $event_team_users, $captain_team_id);

	/*
     * Return teams with loss stats
     *
	 * @param	int		$event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get_stats($event_id);

	/*
     * Delete team and group records for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  boolean
     *
     */
	public function delete($event_id);

	/*
     * Get the next unassigned group for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  collection
     *
     */
	public function get_next_unassigned_group($event_id);

	/*
     * Check whether a user is a captain for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_captain($event_id, $user_id);

	/*
     * Get team user availabilities for an event
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of user requesting data
     *
     * @return  collection
     *
     */
	public function get_availabilities($event_id, $user_id);

	/*
     * Get sub user availabilities for an event
     *
	 * @param	int		$event_id			ID of event
     *
     * @return  collection
     *
     */
	public function get_sub_availabilities($event_id);

	/*
     * Get team user availabilitiy for an event / user
     *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of user
     *
     * @return  collection
     *
     */
	public function get_availability($event_id, $user_id);

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
	public function update_availabilities($event_id, $user_id, $users_availabilities);

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
	public function update_availability($event_id, $user_id, $user_availabilities);

	/*
     * Get team standings for an event
     *
	 * @param	int		$event_id				ID of event
	 *
     * @return  collection
     *
     */
	public function get_standings($event_id);

	/*
     * Update lineups for event
     *
	 * @param 	int		$event_id			ID of event
     * @param	array	$lineups			Lineups for event
	 *
     * @return  void
     *
     */
	public function update_lineups($event_id, $lineups);

	/*
     * Update event team captains
     *
	 * @param 	int		$event_id			ID of event
     * @param	array	$event_team_users	Event team user records
	 *
     * @return  void
     *
     */
	public function update_captains($event_id, $event_team_users);

	/*
     * Get open team slots for an event
     *
	 * @param 	int		$event_id			ID of event
	 *
     * @return  collection
     *
     */
	public function get_open_slots($event_id);

	/*
     * Set a event team user slot as the new captain for its team
     *
	 * @param 	int		$event_team_user_id		ID of event team user
	 *
     * @return  void
     *
     */
	public function set_new_team_captain($event_team_user_id);

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
	public function update_participant($event, $user_id, $sex);

}