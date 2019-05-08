<?php

namespace App\Http\Controllers;

use App\Interfaces\MultifacilityInterface;
use App\Interfaces\EventInterface;
use App\Interfaces\EventTeamInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class MultifacilityController extends ApiController{

	private $multi_facility, $events, $event_teams;

    public function __construct(ResponseFactory $response, Request $request, MultifacilityInterface $multi_facility, EventInterface $events, EventTeamInterface $event_teams){

    	parent::__construct($response, $request);

    	$this->multi_facility = $multi_facility;
    	$this->events = $events;
    	$this->event_teams = $event_teams;

	}

	/**
     * @api {post} /event/{id}/captain/get			Get captain
     * @apiVersion 1.0.0
     * @apiName Get captain
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 *
     * @apiSuccessExample Success-Response:
	 *	      HTTP/1.1 200 OK
		 	  {
		 	      "success": true,
		 	      "error": null,
		 	      "captain": {
		 	          "id": 2,
		 	          "first_name": "Lo",
		 	          "last_name": "Bo",
		 	          "sex": "female",
		 	          "email": "lswote@gmail.com",
		 	          "username": "pihish1",
		 	          "phone": "666-444-9999",
		 	          "remember_token": "",
		 	          "room": null,
		 	          "membership_type": "member",
		 	          "age_type": "adult",
		 	          "member_id": null,
		 	          "affilation_id": null,
		 	          "alta_number": null,
		 	          "receive_email": 1,
		 	          "image_url": null,
		 	          "privilege": "participant",
		 	          "active": 1
		 	      }
		 	  }
     */
	public function get_captain(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('captain', $this->multi_facility->get_captain($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/participant/delete 			   Delete participant
     * @apiVersion 1.0.0
     * @apiName Delete participant
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
     */
    public function delete_participant(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
            $this->multi_facility->delete_participant($id, $request['user_id']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/directions/add			Add match facility directions
     * @apiVersion 1.0.0
     * @apiName Add match facility directons
     * @apiGroup Events
	 *
	 * @apiParam	{int}			id					ID of event
	 * @apiParam	{array}			facility			Facility address and directions
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
	 */
	public function add_directions(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $user->event_leaders()->pluck('id')->toArray()) || $this->events->is_multifacility_captain($id, $user->id) || $this->event_teams->is_captain($id, $user->id)){
            $this->multi_facility->add_directions($request['facility']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/directions/edit			Edit match facility directions
     * @apiVersion 1.0.0
     * @apiName Edit match facility directons
     * @apiGroup Events
	 *
	 * @apiParam	{int}			id					ID of event
	 * @apiParam	{int}			facility id			ID of facility being edited
	 * @apiParam	{array}			facility			Facility address and directions
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
	 */
	public function edit_directions(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $user->event_leaders()->pluck('id')->toArray())){
            $this->multi_facility->edit_directions($request['facility_id'], $request['facility']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/directions/delete		Delete match facility directions
     * @apiVersion 1.0.0
     * @apiName Delete match facility directons
     * @apiGroup Events
	 *
	 * @apiParam	{int}			id					ID of event
	 * @apiParam	{int}			facility id			ID of facility being edited
	 * @apiParam	collection		$facility			Facility address and directions
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
	 */
	public function delete_directions(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $user->event_leaders()->pluck('id')->toArray())){
            $this->multi_facility->delete_directions($request['facility_id']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/directions/get			Get facility directions
     * @apiVersion 1.0.0
     * @apiName Get facility directons
     * @apiGroup Events
	 *
	 * @apiParam	{int}			id					ID of event
	 *
	 * @apiParam	collection		$facility			Facility address and directions
	 *
     * @apiSuccessExample Success-Response:
     * {
     *     "success": true,
     *     "error": null,
     *     "directions": [
     *         {
     *             "id": 1,
     *             "name": "Westco Oil",
     *             "address": "123 Noname Drive",
     *             "city": "Palukaville",
     *             "state": "FL",
     *             "zip": "33327",
     *             "directions": "Turn left at Bugs Bunny Drive",
     *             "created_at": "2018-08-09T17:52:32+00:00",
     *             "updated_at": "2018-08-09T17:52:32+00:00"
     *         }
     *     ]
     * }
	 */
	public function get_directions(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('directions', $this->multi_facility->get_directions());
		}
		else{
			return $this->respondUnauthorized();
		}

	}

    /**
     * @api {get} /event/{id}/matches/multi					Get all matches for an event
     * @apiVersion 1.0.0
     * @apiName GET event matches
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		id							ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"matches": [
					{
						"id": 1,
						"event_id": 4,
						"round": 1,
						"date": "2018-07-07",
						"event_team_one_id": 2,
						"event_team_two_id": 1,
						"event_team_one_score": null,
						"event_team_two_score": null,
						"created_at": "2018-07-07T20:02:09+00:00",
						"updated_at": "2018-07-07T20:02:10+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00"
					}
                ]
	 		}
     */
    public function get_event_matches(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('matches', $this->multi_facility->get_event_matches($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id/matches/update			Update matches
     * @apiVersion 1.0.0
     * @apiName Update matches
     * @apiGroup Events
	 *
	 * @apiParam	collection		$matches			Matches
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
	 */
	public function update_matches(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
            $this->multi_facility->update_matches($id, $request['matches']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/match/directions	Returns match directions in PDF format for the event
     * @apiVersion 1.0.0
     * @apiName GET match directions
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{string}	size				Size of directions to generate
	 * @apiParam	{array}		rounds				Rounds to be printed
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            PDF file
     */
	public function get_match_directions(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->multi_facility->generate_match_directions($id, $request['size'], $request['rounds']);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/scorecard/multi		Returns a scorecard in PDF format for the specified round in the event
     * @apiVersion 1.0.0
     * @apiName GET event scorecard
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{string}	size				Size of scorecard to generate
	 * @apiParam	{int}		round				Round number
	 * @apiParam	{date}		round_date			Round to which to print scorecard for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            PDF file
     */
	public function get_scorecard(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			return $this->multi_facility->generate_scorecard($id, $request['size'], $request['round'], $request['round_date']);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/lineup/email			Emails team member lineup for a round
     * @apiVersion 1.0.0
     * @apiName Email lineup
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{array}		recipients			Email recipients
	 * @apiParam	{string}	message				Optional message to send
	 * @apiParam	{date}		round_date			Round to which to send lineup for
	 * @apiParam	{boolean}	directions			Flag indicating whether to send directions
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function send_lineup(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$this->multi_facility->send_lineup($id, $request['recipients'], $request['message'], $request['round_date'], $request['directions'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/availability/email	Emails team member availability
     * @apiVersion 1.0.0
     * @apiName Email availability
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{array}		recipients			Email recipients
	 * @apiParam	{array}		rounds				Round to email availability
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function send_availability(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id) || $this->event_teams->is_captain($id, $user->id)){
			$this->multi_facility->send_availability($id, $request['recipients'], $request['rounds'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/*
     * @api {post} /event/{id}/multi/lines				Update lines for event
     * @apiVersion 1.0.0
     * @apiName Update match lines for event
     * @apiGroup Events
	 *
	 * @apiParam	{int}			id					ID of event
	 * @apiParam	{array}			lines				Match lines
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_match_lines(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$this->multi_facility->update_match_lines($id, $request['lines']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}