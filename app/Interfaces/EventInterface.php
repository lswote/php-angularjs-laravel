<?php

namespace App\Interfaces;

interface EventInterface{

	/*
     * Check whether a user is a confirmed participant for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_event_participant($event_id, $user_id);

	/*
     * Check whether a user is a captain for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	public function is_multifacility_captain($event_id, $user_id);

    /*
     * Get all events associated with a user
     *
     * @param 	int	 	$user_id		Get events this user is related to
	 * @param	string	$privilege		Privilege of calling user
     *
     * @return  collection
     *
     */
    public function get($user_id, $privilege);

    /*
     * Get info about an event
     *
     * @param 	int	 	$id							ID of event
	 * @param	boolean	$all_associated_users		Tells us whether to return all users who have RSVPed regardless of status
     *
     * @return  object
     *
     */
    public function get_by_id($id, $all_associated_users = false);

    /*
     * Update start date
     *
     * @param 	int	 	$id							ID of event
	 * @param	date	$start_date		            Start date
     *
     * @return  boolean
     *
     */
    public function update_start_date($id, $start_date);

    /*
     * Get info about an event using a RSVP token
     *
     * @param 	string	$token		RSVP token
     *
     * @return  mixed
     *
     */
	public function get_by_rsvp_token($token);

	/*
     * Get all users associated with an event regardless of their status or RSVP response
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_all_participants($id);

	/*
     * Get a list of all participants corresponding to an event in CSV format
     *
     * @param 	int	 	$id				ID of event to look up
     * @param	collection				Values to narrow down search by
     *
     * @return  file
     *
     */
	public function get_participants_export($id, $request);

    /*
     * Get all users not confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_non_confirmed_participants($id);

	/*
     * Get all users confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_confirmed_participants($id);

	/*
     * Get all users confirmed for an event who have been assigned lines
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_confirmed_participants_with_lines($id);

    /*
     * Gets participants that are confirmed, even if they are unavailable
     *
	 * @param	int		$id			ID of event
     *
     * @return  array
     *
     */
	public function get_non_dropped_participants($id);

	/*
     * Get all users waitlisted for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_waitlisted_participants($id);

    /*
     * Get only events where user is an event leader
     *
     * @param 	int	 	$user_id		Get events this user is leading
     *
     * @return  collection
     *
     */
	public function get_as_event_leader($user_id);

    /*
     * Get only events where user is a captain
     *
     * @param 	int	 	$user_id		Get events this user captain
     *
     * @return  collection
     *
     */
	public function get_as_captain($user_id);

	/*
     * Get leaders for an event
     *
     * @param 	int	 	$id				ID of event
     *
     * @return  collection
     *
     */
	public function get_leaders($id);

    /*
     * Creates a new event
     *
     * @param 	int	 	 $facility_id				ID of facility we will have our event
     * @param   string	 $name						Name of our event
     * @param 	int	 	 $activity_id				ID of sport / game of event
     * @param   string   $event_type                Type of event, e.g. Social, Ladder
     * @param   string   $event_sub_type            Sub Type of event, e.g. doubles, singles
     * @param 	string	 $type_of_play				Gender or mixed
     * @param   int      $rounds                    Number of rounds
     * @param   string   $rounds_interval_metric    How rounds are measured, e.g. Days, Hours
     * @param   int      $rounds_interval           How many rounds intervals
     * @param   int      $standard_line_duration    Length of line duration in minutes.
     * @param   string   $gender_type               Male, Female or Both
     * @param   decimal  $participant_charge        Amount in dollars
     * @param   boolean  $charge_cc                 Yes/no, charge CC or Debit cards
     * @param   integer  $comb_play                 Yes/no, comb play
     * @param   string   $image_url                 Image path
     * @param 	date	 $start_date				Start date of event
     * @param	time	 $start_time				Start time of event
     * @param   integer  $teams_per_line            Number of teams per line
     * @param   integer  $single_women_lines        Number of single women lines
     * @param   integer  $single_men_lines          Number of single men lines
     * @param   integer  $max_playing_surfaces      Max number of playing surfaces
     * @param   integer  $ranked                    Yes/No
     * @param   integer  $sets                      Number of sets
     * @param	int		 $num_of_start_times		Number of start times for event
     * @param	int		 $standard_line_duration	Duration of each line
     * @param	string	 $event_leader_username		Username of user we want to make event leader
     * @param   string   for_membership_type       	Membership type event is catered towards (guest or member)
     * @param   string   for_age_type  				Whether event is for adults or children
     * @param   int      for_active  				Whether event is for active or inactive members
     *
     * @return  int
     *
     */

    public function create($facility_id, $name, $activity_id, $event_type, $event_sub_type,
                           $type_of_play, $rounds, $rounds_interval_metric, $rounds_interval, $standard_line_duration,
                           $gender_type, $participant_charge, $charge_cc, $start_date, $start_time, $num_of_start_times,
                           $event_leader_username, $for_membership_type, $for_age_type, $for_active);

    /*
     * Adds a leader to an event
     *
	 * @param	int		 $id					ID of event
     * @param	string	 $event_leader_username	Username of user we want to make event leader
     *
     * @return  mixed
     *
     */
	public function add_leader($id, $username);

	/*
     * Deletes an event leader
     *
	 * @param	int		 $id					ID of event
     * @param	int 	 $user_id				ID of event leader / user
     *
     * @return  boolean
     *
     */
	public function delete_leader($id, $user_id);

	/*
     * Adds a participant to an event
     *
	 * @param	int		 $id							ID of event
     * @param	string	 $event_participant_username	Username of user we want to make an event participant
     * @param	string	 $participant_type				Participant or captain
	 * @param	boolean	 $rsvped						Tells us whether the user is auto rsvped
     * @param	boolean	 $waitlisted					Tells us whether the user is being waitlisted
	 * @param	time	 $preferred_start_time			Whether user has a preferred playing time
	 * @param	boolean	 $unavailable					Tells us whether to our participant is unavailable
	 *
     * @return  mixed
     *
     */
	public function add_participant($id, $event_participant_username, $participant_type, $rsvped = false, $waitlisted = false, $preferred_start_time = null, $unavailable = false);

	/*
     * Adds participants to an event using an uploaded file
     *
	 * @param	int		$id			ID of event to add participants to
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
    public function add_participants($id, $file_key);

	/*
     * Updates participants contact information
     *
     * @param 	array  $participants	Updated participant contact information
     *
     */
	public function update_participants_contact_info($participants);

	/*
     * Marks an event as started
     *
	 * @param	int		 $id					ID of event
     *
     * @return  int
     *
     */
	public function start_event($id);

	/*
     * Marks an event as complete
     *
	 * @param	int		 $id					ID of event
     *
     * @return  int
     *
     */
	public function close_event($id);

	/*
     * Adds a do not match request
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $pair_one_id			ID of team or user one
	 * @param 	int		 $pair_two_id			ID of team or user two
     *
     * @return  mixed
     *
     */
	public function add_do_not_match_request($id, $pair_one_id, $pair_two_id);

	/*
     * Deletes a do not match request
     *
	 * @param	int		 $do_not_match_request_id			ID of request
     *
     * @return  boolean
     *
     */
	public function delete_do_not_match_request($do_not_match_request_id);

	/*
     * Makes updates to an event
     *
	 * @param	int		 $id								ID of event
	 * @param	array 	 $request							Values to update
     *
     * @return  int
     *
     */
	public function update($id, $request);

	/*
     * Makes updates event note
     *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $notes								Event notes
     *
     * @return  int
     *
     */
	public function update_notes($id, $notes);

	/*
     * Generates a scorecard for an event
     *
	 * @param	int		 $id								ID of event
	 * @param	string 	 $size								Size of scorecard
	 * @param	date	 $round_date						Round for which we want to generate a scorecard for
     *
     * @return  file
     *
     */
	public function generate_scorecard($id, $size, $round_date);

	/*
     * Get surfaces we are using for an event
     *
	 * @param	int		 $id								ID of event
     *
     * @return  collection
     *
     */
	public function get_surfaces($id);

	/*
     * Updates surfaces to be used for an event
     *
	 * @param	int		 $id								ID of event
     * @param	array	 $selected_surfaces					Surfaces to be used for an event
	 *
     * @return  boolean
     *
     */
	public function update_selected_surfaces($id, $selected_surfaces);

	/*
     * Get available surfaces for an event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  collection
     *
     */
	public function get_selected_surfaces($id);

	/*
     * Return list of users who's profile overlaps with the criteria set out by the event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  array
     *
     */
	public function get_default_participants($id);

	/*
     * Return list of users who's profile does not overlap with the criteria set out by the event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  array
     *
     */
	public function get_additional_participants($id);

	/*
     * Return subsitututes for an event
     *
	 * @param	int		 $id								ID of event
	 *
     * @return  collection
     *
     */
	public function get_substitutes($id);

	/*
     * Adds a new event sub
     *
	 * @param	int		 $id								ID of event
	 * @param	string	 $username							Username of new sub
	 *
     * @return  mixed
     *
     */
	public function add_substitute($id, $username);

	/*
     * Assigns a sub to a particular team for a particular round
     *
	 * @param	int		$id									ID of event
	 * @param	int		$event_team_id						ID of event team to assign sub to
	 * @param	int		$event_team_user_availability_id	ID of availability record to assign
	 *
     * @return  int
     *
     */
	public function add_substitute_assignment($id, $event_team_id, $event_team_user_availability_id);

	/*
     * Removes a user from an event and any lines they are scheduled for in that event
     *
	 * @param	int		 $id								ID of event
	 * @param	int		 $user_id							ID of user to remove from event
	 *
     * @return  void
     *
     */
	public function remove_participant($id, $user_id);

	/*
     * Update user signup status for an event
     *
	 * @param	array		$event_user						Event user signup array
	 *
     * @return  void
     *
     */
	public function update_signup($event_user);

	/*
     * Update user signup statuses for an event
     *
	 * @param	object		$event							Event object
	 * @param	array		$event_users					Event user signups array
	 *
     * @return  void
     *
     */
	public function update_signups($event, $event_users);

	/*
     * Get open time slots info for an event
     *
	 * @param	int			$id					ID of event
	 *
     * @return  object
     *
     */
	public function get_open_time_slots_info($id);

}