<?php

namespace App\Http\Controllers;

use App\Interfaces\EventInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;
use App\Models\EventDoNotMatchTeam;
use App\Models\Event;
use App\Library\EventLinesCalculator;

class EventController extends ApiController{

	private $events;

    public function __construct(ResponseFactory $response, Request $request, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->events = $events;

    }

    // Allow for file download
	private function download_send_headers($filename){

		// Disable caching
		$now = gmdate("D, d M Y H:i:s");
		header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
		header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
		header("Last-Modified: {$now} GMT");
		// Force download
		header("Content-Type: application/force-download");
		header("Content-Type: application/octet-stream");
		header("Content-Type: application/download");
		// Disposition / encoding on response body
		header("Content-Disposition: attachment;filename={$filename}");
		header("Content-Transfer-Encoding: binary");

    }

    /**
     * @api {get} /events					Return all events associated with the calling user (both as participant and event leader)
     * @apiVersion 1.0.0
     * @apiName GET events
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"events": [
					{
						"id": 1,
                        "facility_id": 1,
                        "name": "Jin Open 2018",
						"activity": "tennis",
						"event_type": "social",
						"image_url": null,
						"start_date": "2018-02-02",
						"started": 1,
						"completed": 0,
						"created_at": "2018-02-23T16:16:10+00:00",
						"updated_at": "2018-02-23T16:16:10+00:00"
					}
				]
            }
     */
    public function get(Request $request){

    	return $this->respondSuccess('events', $this->events->get($request->get('auth_user_id'), $request->get('privilege')));

	}

	/**
     * @api {get} /event/{id} 			   Return info about an event
     * @apiVersion 1.0.0
     * @apiName GET event
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"event": {
					"id": 1,
                    "facility_id": 1,
                    "name": "Jin Open 2018",
					"activity": "tennis",
					"event_type": "social",
					"image_url": null,
					"start_date": "2018-02-02",
					"started": 1,
					"completed": 0,
					"created_at": "2018-02-23T16:16:10+00:00",
					"updated_at": "2018-02-23T16:16:10+00:00"
				}
            }
     */
    public function get_by_id(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$all_associated_users = $request['all_associated_users'] == 1 ? true : false;
			$event = $this->events->get_by_id($id, $all_associated_users);
			if(isset($event['id'])){
				return $this->respondSuccess('event', $event);
			}
			else{
				return $this->respondNotFound();
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/start_date 			   Update start date
     * @apiVersion 1.0.0
     * @apiName Update start date
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
     */
    public function update_start_date(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
            $results = $this->events->update_start_date($id, $request['start_date']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants					Return users regardless of their status or RSVP response
     * @apiVersion 1.0.0
     * @apiName GET event participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"participants": [
					{
						"id": 9,
						"first_name": "Rick",
						"last_name": "Pier",
						"sex": "male",
						"email": "rick@teamsrit.com",
						"remember_token": null,
						"image_url": null,
						"privilege": "participant",
						"created_at": "2018-03-16T16:04:41+00:00",
						"updated_at": "2018-03-16T16:04:41+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 7,
							"user_id": 9,
							"confirmed": 0,
	                        "waitlisted": 0,
	                        "unavailable": 0
						}
					}
				]
            }
     */
	public function get_all_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('participants', $this->events->get_all_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/export			Export list of event participants as a CSV file
     * @apiVersion 1.0.0
     * @apiName GET event participants export
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    CSV File
            }
     */
	public function get_participants_export(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$event = $this->events->get_by_id($id);
			$this->download_send_headers(str_replace(' ', '-', $event->name) . '-Participants.csv');
			echo $this->events->get_participants_export($id, $request);
			die();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/unconfirmed				Return users not confirmed for an event
     * @apiVersion 1.0.0
     * @apiName GET event nonconfirmed participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"unconfirmed_participants": [
					{
						"id": 9,
						"first_name": "Rick",
						"last_name": "Pier",
						"sex": "male",
						"email": "rick@teamsrit.com",
						"remember_token": null,
						"image_url": null,
						"privilege": "participant",
						"created_at": "2018-03-16T16:04:41+00:00",
						"updated_at": "2018-03-16T16:04:41+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 7,
							"user_id": 9,
							"confirmed": 0,
	                        "waitlisted": 0,
	                        "unavailable": 0
						}
					}
				]
            }
     */
	public function get_non_confirmed_participants(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('unconfirmed_participants', $this->events->get_non_confirmed_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/confirmed		Return users confirmed for an event
     * @apiVersion 1.0.0
     * @apiName GET event confirmed participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"confirmed_participants": [
					{
						"id": 9,
						"first_name": "Rick",
						"last_name": "Pier",
						"sex": "male",
						"email": "rick@teamsrit.com",
						"remember_token": null,
						"image_url": null,
						"privilege": "participant",
						"created_at": "2018-03-16T16:04:41+00:00",
						"updated_at": "2018-03-16T16:04:41+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 7,
							"user_id": 9,
							"confirmed": 0,
	                        "waitlisted": 0,
	 						"unavailable": 0
						}
					}
				]
            }
     */
	public function get_confirmed_participants(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('confirmed_participants', $this->events->get_confirmed_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/confirmed/with-lines		Return users confirmed for an event who have been assigned to lines
     * @apiVersion 1.0.0
     * @apiName GET event confirmed participants with lines
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id									ID of event
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"confirmed_participants_with_lines": [
					{
						"id": 9,
						"first_name": "Rick",
						"last_name": "Pier",
						"sex": "male",
						"email": "rick@teamsrit.com",
						"remember_token": null,
						"image_url": null,
						"privilege": "participant",
						"created_at": "2018-03-16T16:04:41+00:00",
						"updated_at": "2018-03-16T16:04:41+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 7,
							"user_id": 9,
							"confirmed": 0,
	                        "waitlisted": 0,
	 						"unavailable": 0
						}
					}
				]
            }
     */
	public function get_confirmed_participants_with_lines(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('confirmed_participants_with_lines', $this->events->get_confirmed_participants_with_lines($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

    /**
     * @api {post} /event/{id}/participants/nondropped  Gets non-dropped participants
     * @apiVersion 1.0.0
     * @apiName POST event participants
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to add participants to
	 *
     * @apiSuccessExample Success-Response:
     */
	public function get_non_dropped_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('participants', $this->events->get_non_dropped_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/participants/waitlisted		Return users waitlisted for an event
     * @apiVersion 1.0.0
     * @apiName GET event waitlisted participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"waitlisted_participants": [
					{
						"id": 9,
						"first_name": "Rick",
						"last_name": "Pier",
						"sex": "male",
						"email": "rick@teamsrit.com",
						"remember_token": null,
						"image_url": null,
						"privilege": "participant",
						"created_at": "2018-03-16T16:04:41+00:00",
						"updated_at": "2018-03-16T16:04:41+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 7,
							"user_id": 9,
							"confirmed": 0,
	                     	"waitlisted": 1,
	 						"unavailable": 0
						}
					}
				]
            }
     */
	public function get_waitlisted_participants(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('waitlisted_participants', $this->events->get_waitlisted_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}


	/**
     * @api {get} /events/leader			Return only events where the user is an event leader
     * @apiVersion 1.0.0
     * @apiName GET events as leader
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"events": [
					{
						"id": 1,
                        "facility_id": 1,
                        "name": "Jin Open 2018",
						"activity": "tennis",
						"event_type": "social",
						"image_url": null,
						"start_date": "2018-02-02",
						"started": 1,
						"completed": 0,
						"created_at": "2018-02-23T16:16:10+00:00",
						"updated_at": "2018-02-23T16:16:10+00:00"
					}
				]
            }
     */
	public function get_as_event_leader(Request $request){

    	return $this->respondSuccess('events', $this->events->get_as_event_leader($request->get('auth_user_id')));

	}

	/**
     * @api {get} /events/captain			Return only events where the user is a captain
     * @apiVersion 1.0.0
     * @apiName GET events as captain
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"events": [
					{
						"id": 1,
                        "facility_id": 1,
                        "name": "Jin Open 2018",
						"activity": "tennis",
						"event_type": "social",
						"image_url": null,
						"start_date": "2018-02-02",
						"started": 1,
						"completed": 0,
						"created_at": "2018-02-23T16:16:10+00:00",
						"updated_at": "2018-02-23T16:16:10+00:00"
					}
				]
            }
     */
	public function get_as_captain(Request $request){

    	return $this->respondSuccess('events', $this->events->get_as_captain($request->get('auth_user_id')));

	}

	/**
     * @api {get} /event/{id}/leaders			Get all leaders for an event
     * @apiVersion 1.0.0
     * @apiName GET event leaders
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"event_leaders": [
					{
						"id": 2,
						"first_name": "Lo",
						"last_name": "Bo",
						"sex": "female",
						"email": "pihish1@yahoo.com",
						"username": "pihish1",
						"phone": "666-444-9999",
						"room": null,
						"membership_type": "member",
						"age_type": "adult",
						"image_url": null,
						"privilege": "participant",
						"active": 1,
						"created_at": "2018-04-12T14:31:45+00:00",
						"updated_at": "2018-04-12T14:31:45+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"pivot": {
							"event_id": 1,
							"user_id": 2
						}
					}
				]
            }
     */
	public function get_leaders(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
        if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('event_leaders', $this->events->get_leaders($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/leader		Adds a leader to an event
     * @apiVersion 1.0.0
     * @apiName POST event leader
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to add a leader to
	 * @apiParam	{string}	username			Username of user who we want to add as event leader
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_leader(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$result = $this->events->add_leader($id, $request['username']);
			if($result === true){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /event/{id}/leader/{user_id}	Deletes an event leader
     * @apiVersion 1.0.0
     * @apiName DELETE event leader
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{int}		user_id				ID of event leader / user
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function delete_leader(Request $request, $id, $user_id){

		if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
			$this->events->delete_leader($id, $user_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/participant			Adds a participant to an event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to add a participant to
	 * @apiParam	{string}	username			Username of user who we want to add as event participant
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_participant(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$event = Event::find($id);
			$result = $this->events->add_participant($id, $request['username'], $request['type'], true, $event->started == 1);
			if($result === true){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/participants			Adds participants to an event using an uploaded file
     * @apiVersion 1.0.0
     * @apiName POST event participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to add participants to
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
	public function add_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$result = $this->events->add_participants($id, $request['file_key']);
			return $this->respondSuccess('results', $result);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/participants/updat_contact_info	Updates participants contanct information
     * @apiVersion 1.0.0
     * @apiName POST event participants contact information
     * @apiGroup Events
	 *
	 * @apiParam	{array}	participants						Updated particpants contact info
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
                "error": null,
            }
     */
	public function update_participants_contact_info(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$this->events->update_participants_contact_info($request['participants']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/start					Starts an event
     * @apiVersion 1.0.0
     * @apiName PUT event start
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to start
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function start_event(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$result = $this->events->start_event($id);
			if(!is_string($result)){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/close					Ends / completes an event
     * @apiVersion 1.0.0
     * @apiName PUT event close
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to close
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function close_event(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$this->events->close_event($id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/do_not_match_request						Adds do not match request
     * @apiVersion 1.0.0
     * @apiName POST do not match request
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id										ID of event
	 * @apiParam 	{int}		pair_one_id								ID of team / user one
	 * @apiParam 	{int}		pair_two_id								ID of team / user two
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
			    "event_do_not_match_teams_id": 31
            }
     */
	public function add_do_not_match_request(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$result = $this->events->add_do_not_match_request($id, $request['pair_one_id'], $request['pair_two_id']);
			if(!is_string($result)){
				return $this->respondSuccess('event_do_not_match_teams_id', $result);
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /events/do_not_match_request/{do_not_match_request_id}		Deletes do not match request
     * @apiVersion 1.0.0
     * @apiName DELETE do not match request
     * @apiGroup Events
	 *
	 * @apiParam	{int}		do_not_match_request_id							ID of request to delete
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function delete_do_not_match_request(Request $request, $do_not_match_request_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$event_id = EventDoNotMatchTeam::find($do_not_match_request_id)->event_id;
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$this->events->delete_do_not_match_request($do_not_match_request_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/scorecard/{size}		Returns a scorecard in PDF format for the event
     * @apiVersion 1.0.0
     * @apiName GET event scorecard
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{string}	size				Size of scorecard to generate
	 * @apiParam	{date}		round_date			Round to which to print scorecard for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            PDF file
     */
	public function get_scorecard(Request $request, $id, $size){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			return $this->events->generate_scorecard($id, $size, $request['round_date']);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/surfaces				Returns the list of facility surfaces we are using for this event
     * @apiVersion 1.0.0
     * @apiName GET event surfaces
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 			"surfaces": [
					{
						"id": 1,
						"facility_id": 1,
						"facility_surface_number": 1,
						"created_at": "2018-04-13T12:08:31+00:00",
						"events": [
							{
								"id": 1,
                                "facility_id": 1,
                                "name": "Hustle Open 2018",
								"activity": "tennis",
								"event_type": "social",
                                "event_sub_type": "single",
								"type_of_play": "gender",
                                "rounds": 1,
                                "rounds_interval_metric": "minutes",
                                "rounds_interval": 30,
                                "standard_line_duration": ,
                                "gender_type": men,
                                "participant_charge": 2.50,
                                "charge_cc": 0,
								"comb_play": null,
								"image_url": null,
								"start_date": "2018-01-02",
								"start_time": "16:00:00",
								"teams_per_line": null,
                                "single_women_lines": null,
                                "single_men_lines": null,
								"max_playing_surfaces": null,
								"ranked": null,
								"sets": null,
								"num_of_start_times": 2,
								"started": 0,
								"completed": 0,
								"created_at": "2018-04-13T12:08:30+00:00",
								"updated_at": "2018-04-13T12:08:30+00:00",
								"start_date_formatted": "Jan 2, 18",
								"pivot": {
									"facility_surface_id": 1,
									"event_id": 1,
									"event_surface_number": 4
								}
							}
						]
					}
                ]
            }
     */
	public function get_surfaces(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			return $this->respondSuccess('surfaces', $this->events->get_surfaces($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/surfaces				Updates surfaces used for an event
     * @apiVersion 1.0.0
     * @apiName PUT event surfaces
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{array}		selected_surfaces	Surfaces to be used for event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_selected_surfaces(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$this->events->update_selected_surfaces($id, $request['selected_surfaces']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/surfaces/selected		Returns a list of surfaces event is using
     * @apiVersion 1.0.0
     * @apiName GET event selected surfaces
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 			"surfaces": [
					{
						"id": 1,
						"facility_id": 1,
						"facility_surface_number": 1,
						"created_at": "2018-04-13T12:08:31+00:00",
						"pivot": {
							"event_id": 5,
							"facility_surface_id": 1,
							"event_surface_number": 1
						}
					}
                ]
            }
     */
	public function get_selected_surfaces(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('surfaces', $this->events->get_selected_surfaces($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/default		Returns a list of users whose profiles fit within the criteria set out by the event
     * @apiVersion 1.0.0
     * @apiName GET event default participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id						ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 			"participants": [
					{
						"id": 1,
						"first_name": "Sarah",
						"last_name": "Huckabee",
						"sex": "female",
						"email": "pihish@gmail.com",
						"username": "pihish",
						"phone": "666-444-9999",
						"room": null,
						"membership_type": "member",
						"age_type": "adult",
						"image_url": null,
						"privilege": "facility leader",
						"active": 1,
						"created_at": "2018-04-17 14:33:33",
						"updated_at": "2018-04-17 14:33:33",
						"deleted_at": null,
						"pivot": {
							"facility_id": 1,
							"user_id": 1
						}
					}
                ]
            }
     */
	public function get_default_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('participants', $this->events->get_default_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/additional	Returns a list of users whose profiles do not fit within the criteria set out by the event
     * @apiVersion 1.0.0
     * @apiName GET event additional participants
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id						ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
	 			"participants": [
					{
						"id": 1,
						"first_name": "Sarah",
						"last_name": "Huckabee",
						"sex": "female",
						"email": "pihish@gmail.com",
						"username": "pihish",
						"phone": "666-444-9999",
						"room": null,
						"membership_type": "member",
						"age_type": "adult",
						"image_url": null,
						"privilege": "facility leader",
						"active": 1,
						"created_at": "2018-04-17 14:33:33",
						"updated_at": "2018-04-17 14:33:33",
						"deleted_at": null,
						"pivot": {
							"facility_id": 1,
							"user_id": 1
						}
					}
                ]
            }
     */
	public function get_additional_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('participants', $this->events->get_additional_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/substitutes				Returns a list of users who are subs for our event
     * @apiVersion 1.0.0
     * @apiName GET event substitutes
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id						ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"substitutes": [
					{
						"id": 1,
						"first_name": "Sarah",
						"last_name": "Huckabee",
						"sex": "female",
						"email": "pihish@gmail.com",
						"username": "pihish",
						"phone": "666-444-9999",
						"room": null,
						"membership_type": "member",
						"age_type": "adult",
						"image_url": null,
						"privilege": "facility leader",
						"active": 1,
						"created_at": "2018-04-17 14:33:33",
						"updated_at": "2018-04-17 14:33:33",
						"deleted_at": null,
						"pivot": {
							"facility_id": 1,
							"user_id": 1
						}
					}
                ]
            }
     */
	public function get_substitutes(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			return $this->respondSuccess('substitutes', $this->events->get_substitutes($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/substitute				Adds a new sub to an event
     * @apiVersion 1.0.0
     * @apiName POST event substitute
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id						ID of event
	 * @apiParam	{string}	username				Username of new sub
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_substitute(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$result = $this->events->add_substitute($id, $request['username']);
			if(is_string($result)){
				return $this->respond(array(
            		'success' => false,
					'error' => $result
				), 400);
			}
			else{
				return $this->respondSuccess();
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/substitute/assignment	Assigns a sub to a team for a particular round
     * @apiVersion 1.0.0
     * @apiName POST event substitute assignment
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id										ID of event
	 * @apiParam	{int}		event_team_id							Team to assign sub to
	 * @apiParam	{int}		event_team_user_availability_id			ID of availability record to assign
	 *
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_substitute_assignment(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$this->events->add_substitute_assignment($id, $request['event_team_id'], $request['event_team_user_availability_id']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/signup						Update user signup for an event
     * @apiVersion 1.0.0
     * @apiName PUT event signup
     * @apiGroup Events
	 *
	 * @apiParam	{array}		event_user					Event user array
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_signup(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($id, $participant_of_events_ids) && $request->get('auth_user_id') == $request['event_user']['user_id']){
			$this->events->update_signup($request['event_user']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/users/signups					Update user signups for an event
     * @apiVersion 1.0.0
     * @apiName PUT event users signups
     * @apiGroup Events
	 *
	 * @apiParam	{array}		event_users					Event users array
	 * @apiParam	{int}	    complete_event_setup_done   Whether complete event setup has been ran
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_signups(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$event = Event::find($id);
			$this->events->update_signups($event, $request['event_users']);
			if($request['complete_event_setup_done'] == 1 && $event->started != 1){
				$event_lines_calculator = new EventLinesCalculator($id);
				$event_lines_calculator->calculate_lines();
			}
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/open-time-slots				Get open time slots info for an event
     * @apiVersion 1.0.0
     * @apiName GET event open time slots
     * @apiGroup Events
	 *
	 * @apiParam	{id}	    id   						ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
 				"open_time_slots_info":
            }
     */
	public function get_open_time_slots_info(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			return $this->respondSuccess('open_time_slots_info', $this->events->get_open_time_slots_info($id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

    /**
     * @api {post} /event					Creates a new event
     * @apiVersion 1.0.0
     * @apiName POST event
     * @apiGroup Events
	 *
     * @apiParam	{integer}	facility_id					Facility ID of event
     * @apiParam	{string}	name						Name of event
     * @apiParam	{int}		activity_id					ID of activity event is associated with
     * @apiParam	{string}	event_type					Type of event
     * @apiParam	{string}	event_sub_type				Sub Type of event
     * @apiParam	{string}	type_of_play				Gender or mixed
     * @apiParam	{integer}	rounds				        Rounds number
     * @apiParam	{string}	rounds_interval_metric		Rounds interval days or minutes
     * @apiParam	{string}	rounds_interval				Rounds interval
     * @apiParam	{integer}	standard_line_duration      Standard line duration
     * @apiParam	{string}	gender_type				    Gender or mixed
     * @apiParam	{decimal}	participant_charge			Participant fees dollar amount
     * @apiParam	{boolean}	charge_cc				    Charge debit/credit cards
     * @apiParam    {date}      start_date          		Date event starts
     * @apiParam	{time}		start_time					Time event starts
     * @apiParam    {int}   	num_of_start_times  		Number of start times for event
     * @apiParam    {string}    event_leader_username  		Username of user who we want to add as event leader
     * @apiParam    {string}    for_membership_type       	Membership type event is catered towards (guest or member)
     * @apiParam    {string}    for_age_type  				Whether event is for adults or children
     * @apiParam    {boolean}   for_active  				Whether event is for active or inactive members
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     * 		{
     * 			  "success": true,
     * 			  "error": null,
     * 			  "event_id": 55
     * 		}
     */

    public function post(Request $request){

        if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
            $user = User::where('id', '=', $request->get('auth_user_id'))->with('facilities')->get()[0];
            $facility_id = $user->facilities[0]->id;
            $start_time = date('H:i:s', strtotime($request['start_time']));
            $result = $this->events->create($facility_id, $request['name'], $request['activity_id'], $request['event_type'],
										    $request['event_sub_type'], $request['type_of_play'], $request['rounds'], $request['rounds_interval_metric'],
                							$request['rounds_interval'], $request['standard_line_duration'], $request['gender_type'], $request['participant_charge'],
											$request['charge_cc'], $request['start_date'], $start_time, $request['num_of_start_times'], $request['event_leader_username'],
											$request['for_membership_type'], $request['for_age_type'], $request['for_active']);
            if(is_string($result)){
            	return $this->respond(array(
            		'success' => false,
					'error' => $result
				), 400);
			}
			else{
            	return $this->respondSuccess('event_id', $result);
			}
        }
        else{
            return $this->respondUnauthorized();
        }

    }

	/**
     * @api {put} /event/{id}						Updates an event
     * @apiVersion 1.0.0
     * @apiName PUT event
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to close
	 * @apiParam	{string}	name				Name for event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function put(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$this->events->update($id, $this->sanitizeRequest($request));
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/update_notes			Updates event notes
     * @apiVersion 1.0.0
     * @apiName PUT event
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event to close
	 * @apiParam	{string}	notes				Event notes
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_notes(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_multifacility_captain($id, $user->id)){
			$this->events->update_notes($id, $request['notes']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}