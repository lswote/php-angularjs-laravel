<?php

namespace App\Http\Controllers;

use App\Interfaces\EventInterface;
use App\Interfaces\EventTeamInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class EventTeamController extends ApiController{

	private $event_teams, $events;

    public function __construct(ResponseFactory $response, Request $request, EventTeamInterface $event_teams, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->event_teams = $event_teams;
    	$this->events = $events;

    }

    /**
     * @api {get} /event/{event_id}/teams					Return all groups / teams associated with an event
     * @apiVersion 1.0.0
     * @apiName GET event teams
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"event_team_users": [
					{
						"id": 1,
						"event_id": 4,
						"group_number": 1,
						"team_name": "blue",
						"sex": "female",
						"user_id": 1,
						"created_at": "2018-06-09T23:57:35+00:00",
						"updated_at": "2018-06-09T23:57:35+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00"
					}
				]
            }
     */
    public function get(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('event_team_users', $this->event_teams->get($event_id, null));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/teams					Create event teams and their associated matches / lines
     * @apiVersion 1.0.0
     * @apiName POST event teams
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		per_round_lines_aggregate	Type and number of lines to create per round
	 * @apiParam    {int}       num_of_females_to_remove    # of females to explicitly remove from event
	 * @apiParam	{int}		num_of_males_to_remove		# of males to explicitly remove from event
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function post(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->create($event_id, $request['per_round_lines_aggregate'], $request['num_of_females_to_remove'], $request['num_of_males_to_remove']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/team					Create event team and their associated matches / lines for a multifacility event
     * @apiVersion 1.0.0
     * @apiName POST event team
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		per_round_lines_aggregate	Type and number of lines to create per round
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function create_team(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->event_teams->is_captain($event_id, $request->get('auth_user_id')) !== false){
			$this->event_teams->create_team($event_id, $request['per_round_lines_aggregate']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/teams/import			Import teams / participants info for an event
     * @apiVersion 1.0.0
     * @apiName POST event teams import
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{string}	file_key			S3 file key
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"results": {
					"imported_count": 4,
					"lines_not_added": [1]
				}
            }
     */
    public function import(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$result = $this->event_teams->import($event_id, $request['file_key']);
			return $this->respondSuccess('results', $result);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{event_id}/teams					Update event team and group information
     * @apiVersion 1.0.0
     * @apiName PUT event teams
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		event_teams					Groups and teams info for an event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function put(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$captain_team_id = $this->event_teams->is_captain($event_id, $request->get('auth_user_id'));
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $captain_team_id){
			$this->event_teams->update($event_id, $request['event_teams'], $captain_team_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{event_id}/teams/stats				Get event teams with loss stats
     * @apiVersion 1.0.0
     * @apiName GET event teams stats
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"teams":
            }
     */
    public function get_stats(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('teams', $this->event_teams->get_stats($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/teams/complete			Tells us team draw user assignments are complete
     * @apiVersion 1.0.0
     * @apiName POST event teams complete
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function complete(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->set_waitlisted_participants($event_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /event/{event_id}/teams				Delete all event team and group info
     * @apiVersion 1.0.0
     * @apiName DELETE event teams
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function delete(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->delete($event_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{event_id}/unassigned-group		Gets the next unassigned group batch
     * @apiVersion 1.0.0
     * @apiName GET event unassigned group
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"next_group": {
					"sex": "female",
					"group_number": 1,
					"spots": [
						{
							"id": 1,
							"event_id": 4,
							"event_team_id": 1,
							"group_number": 1,
							"sex": "female",
							"user_id": null,
							"created_at": "2018-06-20 00:00:37",
							"updated_at": "2018-06-20 00:00:37",
							"deleted_at": null
						}
					]
            	}
     */
	public function get_next_unassigned_group(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$next_group = $this->event_teams->get_next_unassigned_group($event_id);
			return $this->respondSuccess('next_group', $next_group);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{event_id}/teams/availability		Get event team users' availability
     * @apiVersion 1.0.0
     * @apiName GET event teams availability
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
				"user_availability": [
					{
						"id": 1,
						"event_team_user_id": 1,
						"round": 1,
						"date": "2018-02-02",
						"status": "available",
						"line_id": null,
						"created_at": "2018-08-25T10:19:49+00:00",
						"updated_at": "2018-08-25T10:19:49+00:00",
						"user": {
							"id": 18,
							"first_name": "Jacqulin",
							"last_name": "Smith",
							"sex": "female",
							"email": "real@teamsrit.com",
							"username": "real",
							"phone": "666-444-9999",
							"remember_token": "",
							"room": null,
							"membership_type": "member",
							"age_type": "adult",
							"member_id": null,
							"affiliation": null,
							"alta_number": null,
							"usta_number": null,
							"receive_email": 1,
							"image_url": null,
							"privilege": "participant",
							"active": 1,
							"created_at": "2018-08-25T13:19:12+00:00",
							"updated_at": "2018-08-25T13:19:12+00:00",
							"deleted_at": "1970-01-01T00:00:00+00:00",
							"team_id": 1,
							"team_name": "red"
						},
						"lines": null
					}
            	}
     */
	public function get_availability(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->event_teams->is_captain($event_id, $request->get('auth_user_id'))){
			return $this->respondSuccess('user_availability', $this->event_teams->get_availabilities($event_id, $request->get('auth_user_id')));
		}
		else if(in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('user_availability', $this->event_teams->get_availability($event_id, $request->get('auth_user_id')));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{event_id}/subs/availability		Get event sub users' availability
     * @apiVersion 1.0.0
     * @apiName GET event subs availability
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
				"sub_availability": [
					{
						"id": 1,
						"event_team_user_id": 1,
						"round": 1,
						"date": "2018-02-02",
						"status": "available",
						"line_id": null,
						"created_at": "2018-08-25T10:19:49+00:00",
						"updated_at": "2018-08-25T10:19:49+00:00",
						"user": {
							"id": 18,
							"first_name": "Jacqulin",
							"last_name": "Smith",
							"sex": "female",
							"email": "real@teamsrit.com",
							"username": "real",
							"phone": "666-444-9999",
							"remember_token": "",
							"room": null,
							"membership_type": "member",
							"age_type": "adult",
							"member_id": null,
							"affiliation": null,
							"alta_number": null,
							"usta_number": null,
							"receive_email": 1,
							"image_url": null,
							"privilege": "participant",
							"active": 1,
							"created_at": "2018-08-25T13:19:12+00:00",
							"updated_at": "2018-08-25T13:19:12+00:00",
							"deleted_at": "1970-01-01T00:00:00+00:00",
							"team_id": 1,
							"team_name": "red"
						},
						"lines": null
					}
            	}
     */
	public function get_subs_availability(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('sub_availability', $this->event_teams->get_sub_availabilities($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/teams/availabilities			Update user availabilities for an event
     * @apiVersion 1.0.0
     * @apiName PUT event teams availabilities
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		users_availabilities		Availabilities of users
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 		}
     */
	public function update_availabilities(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->event_teams->is_captain($event_id, $request->get('auth_user_id'))){
			$this->event_teams->update_availabilities($event_id, $request->get('auth_user_id'), $request['users_availabilities']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/teams/availability			Update user availability for an event
     * @apiVersion 1.0.0
     * @apiName PUT event teams availability
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		user_availabilities			Availability of user
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 		}
     */
	public function update_availability(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($event_id, $participant_of_events_ids)){
			$this->event_teams->update_availability($event_id, $user->id, $request['user_availabilities']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/standings						Get standings for an event
     * @apiVersion 1.0.0
     * @apiName GET event standings
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"teams": [
					{
						"id": 2,
						"event_id": 4,
						"name": "green",
						"created_at": "2018-07-07T02:46:35+00:00",
						"updated_at": "2018-07-07T02:46:35+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"matches": [
							{
								"id": 1,
								"round": 1,
								"date": "2018-07-07",
	                     		"opposing_team_name": "red",
								"score": null
							}
	                    ]
                    }
     			]
	 		}
	 */
	public function get_standings(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('teams', $this->event_teams->get_standings($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/line/assignments				Get line assignments for an event
     * @apiVersion 1.0.0
     * @apiName GET event line assignments
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 *
	 		}
	 */
	public function get_line_assignments(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->get_line_assignments($event_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/lineups						Update lineups for an event
     * @apiVersion 1.0.0
     * @apiName PUT event lineups
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		lineups						Event lineups array
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 		}
     */
	public function update_lineups(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->event_teams->is_captain($event_id, $request->get('auth_user_id'))){
			$this->event_teams->update_lineups($event_id, $request['lineups']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/teams/captains				Update event team captains
     * @apiVersion 1.0.0
     * @apiName PUT event team captains
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		event_team_users			Event team user records
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 		}
     */
	public function update_captains(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->update_captains($event_id, $request['event_team_users']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/open/slots					Return open team slots for an event
     * @apiVersion 1.0.0
     * @apiName GET event open slots
     * @apiGroup Event Teams
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
				"open_slots": [{
					"id": 13,
					"event_id": 4,
					"event_team_id": 3,
					"group_number": 1,
					"sex": "male",
					"user_id": null,
					"captain": 0,
					"created_at": "2018-08-17T11:50:45+00:00",
					"updated_at": "2018-08-18T12:30:17+00:00",
					"deleted_at": "1970-01-01T00:00:00+00:00",
					"event_teams": {
						"id": 3,
						"event_id": 4,
						"name": "crimson",
						"created_at": "2018-08-17T11:50:45+00:00",
						"updated_at": "2018-08-17T11:50:45+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00"
					}
				}]
	 		}
	 */
	public function get_open_slots(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('open_slots', $this->event_teams->get_open_slots($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{event_id}/team/captain			Make a specific event team user slot the captain of its team
     * @apiVersion 1.0.0
     * @apiName PUT event team captain
     * @apiGroup Event Teams
	 *
	 * @apiParam	{array}		event_team_user_id			ID of event team user record we want to designate as captain
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function set_new_team_captain(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->event_teams->set_new_team_captain($request['event_team_user_id']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}