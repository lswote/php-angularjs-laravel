<?php

namespace App\Interfaces;

interface MultifacilityInterface{

	/*
     * Get captain
     *
	 * @param	int		 $event_id				ID of event
	 *
     * @return  boolean
     *
     */
    public function get_captain($event_id);

	/*
	 * Delete participant
	 *
	 * @param	int		$event_id			ID of event
	 * @param	int		$user_id			ID of participant to delete
	 *
	 * @return  boolean
	 *
	 */
	public function delete_participant($event_id, $user_id);

	/*
	 * Add facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function add_directions($facility);

	/*
	 * Edit facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function edit_directions($id, $facility);

	/*
	 * Delete match facility directions
	 *
	 * @param	collection		$facility			Facility address and directions
	 *
	 * @return  boolean
	 *
	 */
	public function delete_directions($id);

	/*
	 * Get facility directions
	 *
	 * @return	collection
	 *
	 */
	public function get_directions();

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
	 * Update matches
	 *
	 * @param	int				$event_id		ID of event
	 * @param	collection		$matches		Match update
	 *
	 * @return  boolean
	 *
	 */
	public function update_matches($event_id, $matches);

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
	public function generate_match_directions($id, $size, $rounds);

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
	public function generate_scorecard($id, $size, $round, $round_date);

	/*
     * Emails team member lineup for a round
     *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $recipients						Email recipients
	 * @param	string	 $message							Optional message to send 
	 * @param	date	 $round_date						Round date
	 * @param	boolean	 $directions						Flag indicating whether directions mailed as well
	 * @param	object	 $sender							Info about the user initiating the e-mail
     *
     * @return  boolean
     *
     */
	public function send_lineup($id, $recipients, $message, $round_date, $directions, $sender);

	/*
     * Emails team member availability
     *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $recipients						Email recipients
	 * @param	array	 $rounds							Rounds to email availability for
	 * @param	object	 $sender							Info about the user initiating the e-mail
     *
     * @return  boolean
     *
     */
	public function send_availability($id, $recipients, $rounds, $sender);

	/*
     * Update match lines for event
     *
	 * @param	int		 $id								ID of event
	 * @param	array	 $lines								Match lines
     *
     * @return  boolean
     *
     */
	public function update_match_lines($id, $lines);

}
