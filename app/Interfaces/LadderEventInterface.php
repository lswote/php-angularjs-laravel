<?php

namespace App\Interfaces;

interface LadderEventInterface{

	/*
     * Get all users confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_available_participants($id);

	/*
     * Creates a challenge record
     *
	 * @param	int		$id					                ID of event
     * @param   int     $user_id                            User ID
     * @param   int     $challenger_id                      Challenger id
     * @param   int     $challengee_id                      Challengee id
     * @param   int     $complete_challenge_flag            Flag indicating if challenge can be completed without emailing challengee
	 *
     * @return  boolean
     *
     */
	public function add_challenge($id, $user_id, $challenger_id, $challengee_id, $complete_challenge_flag);

	/*
     * Upgrades a participant ranking based on second participant
     *
     * @param   int 	$event_id               		Event id
     * @param   int 	$participant1_id        		Participant1 id
     * @param   int 	$participant2_id        		Participant2 id
	 *
     */
    public function improve_participant_rating($event_id, $participant1_id, $participant2_id);

	/*
     * Updates a challenge record
     *
     * @param	int	     $challenge_data 	    Challenge data
	 *
     * @return  boolean
     *
     */
	public function update_challenge($challenge_data);

	/*
     * Deletes a challenge record
     *
     * @param	int	     $challenger_id 	    Challenger id
	 *
     * @return  collection
     *
     */
	public function delete_challenge($challenge_id);

	/*
     * Records the responses to challenge requests
     *
	 * @param	int		$event_id			    Event ID
	 * @param	array	$responses			    Challenge response data
	 *
     */
    public function challenge_responses($event_id, $responses);

    /*
     * Records the response to a challenge request
     *
	 * @param	int		$event_id			    Event ID
	 * @param	int		$challenge_id			ID of challenge
	 * @param	string	$preferred_start_time	Flag marking accept/deny
     *
     * @return  boolean
     *
     */
    public function challenge_response($event_id, $challenge_id, $preferred_start_time);

	/*
     * Resets a challenge record
     *
     * @param	int	     $id 	                Event id
     * @param	int	     $challenger_id 	    Challenger id
	 *
     * @return  boolean
     *
     */
	public function reset_challenge($id, $challenge_id);

	/*
     * Gets challenge data
     *
	 * @param	array		 $challenges		Challenges to gather data from
	 *
     * @return  collection
     *
     */
    public function get_challenge_data($challenges);

	/*
     * Gets a challenge record for an event_id and optional challenge participant id
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id	            ID of challenge participant
	 *
     * @return  collection
     *
     */
	public function get_challenges($event_id, $user_id);

	/*
     * Gets all accepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id				ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_accepted_challenges($id, $user_id);

	/*
     * Gets all unplayed accepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id				ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_unplayed_challenges($id, $user_id);

	/*
     * Gets all played accepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id				ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_played_challenges($id, $user_id);

	/*
     * Gets all unaccepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id				ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_unaccepted_challenges($id, $user_id);

	/*
     * Gets specific challenge
     *
     * @param 	string	$token		RSVP token
	 * @param	int		 $id		ID of challenge
	 *
     * @return  collection
     *
     */
	public function get_challenge_by_rsvp_token($token, $id);

	/*
     * Creates a pair record of two users
     *
	 * @param	int		 $id					ID of event
     * @param	string	 $user_id1	            User 1 id
     * @param	string	 $user_id2	            User 2 id
	 *
     * @return  boolean
     *
     */
	public function add_pair($id, $user_id1, $user_id2);

	/*
     * Updates pair records
     *
	 * @param	int		    $id					ID of event
     * @param	collection  $pair_data	        Pair data
	 *
     * @return  boolean
     *
     */
	public function update_pairs($pair_data);

	/*
     * Returns pair that was withdrawn
     *
	 * @param	int		    $id					ID of event
     * @param	int         $pair_id	        Pair to return to ladder
	 *
     * @return  boolean
     *
     */
	public function return_pair($id, $pair_id);

	/*
     * Gets all pairs for a specific event
     *
	 * @param	collection		 $pair_data					ID of event
	 *
     * @return  boolean
     *
     */
	public function get_pairs($id);

	/*
     * Gets all active pairs for a specific event
     *
	 * @param	collection		 $pair_data					ID of event
	 *
     * @return  boolean
     *
     */
	public function get_active_pairs($id);

	/*
     * Gets all pairs for a specific event
     *
	 * @param	int		 $event_id				ID of event to withdraw pairs from
	 * @param	array    $pair_ids              IDs of pairs to be withdrawn
     * @param   string   $withdraw_type         Withdraw type
	 *
     * @return  collection
     *
     */
	public function withdraw_pairs($user_event, $pair_ids, $withdraw_type);

	/*
     * Gets all pairs for a specific event
     *
	 * @param	int		 $event_id				ID of event to withdraw pairs from
	 * @param	int      $user_id               ID of user to get pairs for
	 *
     * @return  collection
     *
     */
	public function get_withdrawn_pairs($user_event, $user_id);

	/*
     * Gets non-dropped participants for an event
     *
	 * @param	int 	 $event_id				Id of event
     * @param	int 	 $user_id				User ID to narrow results to
     *
     * @return  collection participants
     *
     */
	public function get_withdrawn_participants($id, $user_id);

	/*
     * Returns a withdrawn participant to a ladder
     *
	 * @param	int 	 $event_id				Id of event
     * @param	int 	 $user_id				User ID to narrow results to
     *
     * @return  boolean
     *
     */
	public function return_participant($id, $user_id);

	/*
     * Gets all withdrawn participants for a specific event.  Withdrawn participants 
     * have confirmed but are unavailable.  They have not dropped
     *
	 * @param	int 	 $event_id				Id of event
	 * @param	int 	 $user_id				User id to narrow results to
	 *
     * @return  collection participants
     *
     */
	public function withdraw_participant($event_id, $user_id, $withdraw_type);

	/*
     * Gets user settings
     *
	 * @param	int		 $event_id				ID of event
	 * @param	int 	 $user_id			    User ID
	 *
     * @return  array    $settings              User settings
     *
     */
    public function get_user_settings($event_id, $user_id);

	/*
     * Sets user settings
     *
	 * @param	int		 $event_id				ID of event
	 * @param	int 	 $user_id			    User ID
	 * @param	array 	 $settings			    User settings
	 *
     * @return  boolean
     *
     */
    public function set_user_settings($event_id, $user_id, $settings);

	/*
     * Returns all do not match team requests for an event
     *
	 * @param	int		 $id					ID of event
     *
     * @return  collection
     *
     */
	public function do_not_match_teams($id);

	/*
     * Get info about an event
     *
     * @param 	int	 	    $id				ID of event
	 * @param	collection	$user_data		Updated participant data
     *
     * @return  object
     *
     */
    public function update_participants($id, $user_data);

}