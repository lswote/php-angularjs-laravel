<?php

namespace App\Interfaces;

interface FacilityInterface{

	/*
     * Returns all facilities
     *
     * @return  collection
     *
     */
	public function get();

	/*
     * Returns info about a facility
     *
	 * @param	int		$id			ID of facility
     *
     * @return  object
     *
     */
	public function get_by_id($id);

	/*
     * Creates a new facility
     *
	 * @param	{string}	name				Facility name
	 * @param	{string}	address				Street address
	 * @param	{string}	city				City where facility is located
	 * @param	{string}	state				State where facility is located
	 * @param	{int}		zip					Zip of where facility is located
	 * @param	{int}		parent_id			Master Facility id
	 * @param	{date}		expiration_date		Contract expiration date
	 * @param	{string}	paypal_link			Paypal payment link for new facility
     *
     * @return  int
     *
     */
	public function create($name, $address, $city, $state, $zip, $parent_id, $expiration_date, $paypal_link);

	/*
     * Updates a facility
     *
	 * @param	{int}		id					Facility id
	 * @param	{string}	name				Facility name
	 * @param	{string}	address				Street address
	 * @param	{string}	city				City where facility is located
	 * @param	{string}	state				State where facility is located
	 * @param	{int}		zip					Zip of where facility is located
	 * @param	{int}		parent_id			Master Facility id
	 * @param	{date}		expiration_date		Contract expiration date
	 * @param	{string}	paypal_link			Paypal payment link for facility
     *
     * @return  boolean
     *
     */
	public function update($id, $name, $address, $city, $state, $zip, $parent_id, $expiration_date, $paypal_link);

	/*
     * Deletes a facility
     *
	 * @param	{int}		id					ID of facility to delete
     *
     * @return  mixed
     *
     */
	public function delete($id);

    /*
     * Updates a facility's image
     *
	 * @param	int		$id			ID of facility to update
     * @param 	string	$url		URL of the new image
	 * @param 	int	 	$disable	Whether we want to show / hide the banner image
     *
     * @return  array
     *
     */
    public function image($id, $url, $disable);

    /*
     * Add a participant to a facility
     *
	 * @param	int		$id			ID of facility to add participant to
     * @param 	array	$request	Request object
     *
     * @return  boolean
     *
     */
    public function add_participant($id, $request);

    /*
     * Adds participants to a facility using an uploaded file
     *
	 * @param	int		$id			ID of facility to add participants to
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
    public function add_participants($id, $file_key);

    /*
     * Returns a list of all the participants at a facility
     *
	 * @param	int		$id			ID of facility
     *
     * @return  collection
     *
     */
	public function get_participants($id);

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
     * Updates activities a facility can host events for
     *
	 * @param	int		$id				ID of facility
	 * @param	array	$activities		Activities to associate with facility
     *
     * @return  void
     *
     */
	public function update_activities($id, $activities);

	/*
     * Associates participants to activities at a facility using an uploaded file
     *
	 * @param	int		$id			ID of facility
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
    public function add_participants_activities($id, $file_key);

    /*
     * Generates a CSV file with a facility's participants activities
     *
	 * @param	int		$id			ID of facility
     *
     * @return  file
     *
     */
	public function get_participants_activities($id);

	/*
     * Get player rankings for a facility / activity combo
     *
	 * @param	int		$id				ID of facility
	 * @param	int		$activity_id	ID of activity
     *
     * @return  collection
     *
     */
	public function get_participants_rankings($id, $activity_id);

	/*
     * Get player rankings for a facility / activity combo
     *
	 * @param	int		$id				ID of facility
	 * @param	int		$activity_id	ID of activity
	 * @param	int		$user_id		ID of user whose ranking we want to update
	 * @param	decimal $ranking		New user ranking
     *
     * @return  mixed
     *
     */
	public function update_participant_ranking($id, $activity_id, $user_id, $ranking);

	/*
     * Get facility IDs of events where the user is a captain
     *
	 * @param	int		$user_id		ID of user we want to look up
     *
     * @return  array
     *
     */
	public function get_user_captain_facilities($user_id);

	/*
     * Associates participant to activity at a facility
     *
	 * @param	object	$participant		Participant
	 * @param	int		$activity_id		Activity ID
     * @param 	string  $skill_level		Skill level
     * @param 	float  	$ranking			Ranking
	 * @param	int		$facility_id		Facility ID
     *
     */
	public function associate_participant_to_activity($participant, $activity_id, $skill_level, $ranking, $facility_id);

	/*
     * Deletes participant activity record
     *
	 * @param	int		$facility_id					Facility ID
	 * @param	int		$activity_id					Activity ID
	 * @param	int		$user_id						User ID
     *
     */
	public function delete_participant_activity($facility_id, $activity_id, $user_id);

}