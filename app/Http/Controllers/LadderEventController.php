<?php

namespace App\Http\Controllers;

use App\Interfaces\LadderEventInterface;
use App\Interfaces\EventInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class LadderEventController extends ApiController{

	private $ladder_events, $events;

    public function __construct(ResponseFactory $response, Request $request, LadderEventInterface $ladder_events, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->ladder_events = $ladder_events;
    	$this->events = $events;

    }

    /**
     * @api {get} /event/{id}/participants/available	Return users confirmed for an event
     * @apiVersion 1.0.0
     * @apiName GET event confirmed participants
     * @apiGroup Ladder Events
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
	public function get_available_participants(Request $request, $id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('confirmed_participants', $this->ladder_events->get_available_participants($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{id}/participants/withdrawn/{user_id} 	Gets withdrawn participants
     *
     * @apiVersion 1.0.0
     * @apiName POST event participants
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id									ID of event to add participants to
	 * @apiParam	{int}		user_id								User ID to narrow results to
	 *
     * @apiSuccessExample Success-Response:
     */
	public function get_withdrawn_participants(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){

			return $this->respondSuccess('participants', $this->ladder_events->get_withdrawn_participants($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {put} /event/{id}/participants/return/{user_id}  Returns a withdrawn user
     * @apiVersion 1.0.0
     * @apiName POST event participants
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id							ID of event to add participants to
	 * @apiParam	{int}		user_id						ID of participant to return to ladder
	 *
     * @apiSuccessExample Success-Response:
     */
	public function return_participant(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){

			return $this->respondSuccess('participants', $this->ladder_events->return_participant($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {put} /event/{id}/participant/withdraw		Withdraw a participant from an event
     * @apiVersion 1.0.0
     * @apiName Put event participant withdraw
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id						ID of event to withdraw participant from
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function withdraw_participant(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('users', $this->ladder_events->withdraw_participant($id, $request['user_id'], $request['withdraw_type']));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {post} /event/{id}/challenge/add			Creates a challenge record of two  users
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					        ID of event to add a participant to
	 * @apiParam	{int}	    challenger_id		        Challenger id
	 * @apiParam	{int}	    challengee_id		        Challengee id
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_challenge(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
            $result = $this->ladder_events->add_challenge($id, $user->id, $request['challenger_id'], $request['challengee_id'], in_array($request->get('privilege'), array('admin', 'facility leader')));
			if($result['id'] !== -1){
				return $this->respondSuccess('id', $result['id']);
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result['error']
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {post} /event/{id}/challenge/reset   	    Resets a challenge record for an event
     * @apiVersion 1.0.0
     * @apiName POST event challenge
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		    id					ID of event to add a participant to
	 * @apiParam	{int}           challenge_id		Challenge id
	 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function reset_challenge(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids)){
			$result = $this->ladder_events->reset_challenge($id, $request['challenge_id']);
			if($result){
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
     * @api {post} /event/{id}/challenge/update	    Updates a challenge record for an event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		    id					ID of event to add a participant to
	 * @apiParam	{collection}    challenge_data		Update challenge data
	 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_challenge(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
            $result = $this->ladder_events->update_challenge($request['challenge_data']);
			if($result !== -1){
				return $this->respondSuccess('id', $result);
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
     * @api {get} /event/{id}/challenges/{user_id}	    Get challenges
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id			        ID of event to retrieve challenges for
	 * @apiParam	{int}		participant_id		ID of participant to retrieve challenges for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
            "success": true,
            "error": null,
            "challenges": [
                {
                    "challenger": {
                        "id": 25,
                        "first_name": "Jack",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@yahoo.com",
                        "username": "jackdoe",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "challengee": {
                        "id": 26,
                        "first_name": "Bill",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@myacc.net",
                        "username": "jackblack",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "accepted_date": "2018-05-13"
                ]

            }
     */
	public function get_challenges(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('challenges', $this->ladder_events->get_challenges($id, $user_id));
		}
        else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/challenges/accepted/{user_id}	Get accepted challenges for a specific event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to retrieve challenges for
     * @apiParam	{int}		user_id				Specific user to narrow data to
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
            "success": true,
            "error": null,
            "accepted_challenges": [
                {
                    "challenger": {
                        "id": 25,
                        "first_name": "Jack",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@yahoo.com",
                        "username": "jackdoe",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "challengee": {
                        "id": 26,
                        "first_name": "Bill",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@myacc.net",
                        "username": "jackblack",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "accepted_date": "2018-05-13"
                ]

            }
     */
	public function get_accepted_challenges(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('challenges', $this->ladder_events->get_accepted_challenges($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/challenges/unplayed/{user_id}	Get unplayed accepted challenges for a specific event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to retrieve challenges for
     * @apiParam	{int}		user_id				Specific user to narrow data to
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
            "success": true,
            "error": null,
            "accepted_challenges": [
                {
                    "challenger": {
                        "id": 25,
                        "first_name": "Jack",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@yahoo.com",
                        "username": "jackdoe",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "challengee": {
                        "id": 26,
                        "first_name": "Bill",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@myacc.net",
                        "username": "jackblack",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "accepted_date": "2018-05-13"
                ]

            }
     */
	public function get_unplayed_challenges(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('challenges', $this->ladder_events->get_unplayed_challenges($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/challenges/played/{user_id}	Get played accepted challenges for a specific event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to retrieve challenges for
     * @apiParam	{int}		user_id				Specific user to narrow data to
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
            "success": true,
            "error": null,
            "accepted_challenges": [
                {
                    "challenger": {
                        "id": 25,
                        "first_name": "Jack",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@yahoo.com",
                        "username": "jackdoe",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "challengee": {
                        "id": 26,
                        "first_name": "Bill",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@myacc.net",
                        "username": "jackblack",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "accepted_date": "2018-05-13"
                ]

            }
     */
	public function get_played_challenges(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('challenges', $this->ladder_events->get_played_challenges($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

    /**
     * @api {get} /event/{id}/challenges/unaccepted/{user_id}	Get unaccepted challenges for a specific event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
     *
     * @apiParam    {int}       id                  ID of event to retrieve challenges for
     * @apiParam	{int}		user_id			    Specific user to narrow data to
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
            "success": true,
            "error": null,
            "accepted_challenges": [
                {
                    "challenger": {
                        "id": 25,
                        "first_name": "Jack",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@yahoo.com",
                        "username": "jackdoe",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "challengee": {
                        "id": 26,
                        "first_name": "Bill",
                        "last_name": "Doe",
                        "sex": "male",
                        "email": "lswote@myacc.net",
                        "username": "jackblack",
                        "phone": "666-444-9999",
                        "remember_token": "",
                        "room": null,
                        "membership_type": "member",
                        "age_type": "adult",
                        "image_url": null,
                        "privilege": "participant",
                        "active": 1,
                        "created_at": "2018-06-23 18:18:24",
                        "updated_at": "2018-06-23 18:18:24",
                        "deleted_at": null
                    },
                    "accepted_date": "2018-05-13"
                ]

            }
     */
	public function get_unaccepted_challenges(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('challenges', $this->ladder_events->get_unaccepted_challenges($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {put} /event/{id}/challenge/delete      Delete a challenge
     * @apiVersion 1.0.0
     * @apiName  Delete challenge
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id		            ID of challenge to delete
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function delete_challenge(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('users', $this->ladder_events->delete_challenge($request['challenge_id']));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {post} /event/{id}/challenge/responses   Challenge request responses
     * @apiVersion 1.0.0
     * @apiName  Challenge response
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		event_id			    Event ID
	 * @apiParam	{array}		responses			    Response data
	 *
     */
	public function challenge_responses(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
        if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
            $this->ladder_events->challenge_responses($id, $request['responses']);
            return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {post} /event/{id}/pair			        Creates a pair record of two  users
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to add a participant to
	 * @apiParam	{int}	    user_id1			User id of first person being added to a pair
	 * @apiParam	{int}	    user_id2			User id of second person being added to a pair
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function add_pair(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$result = $this->ladder_events->add_pair($id, $request['userid1'], $request['userid2']);
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
     * @api {get} /event/{id}/pair/return{pair_id}		Return a withdrawn pair
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					    ID of event to add a participant to
	 * @apiParam	{int}	    pair_id			        User id of first person being added to a pair
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function return_pair(Request $request, $id, $pair_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$result = $this->ladder_events->return_pair($id, $pair_id);
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
     * @api {post} /event/{id}/pairs/update			    Update pair data
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{collection}	 pair_date      Pair data update information
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_pairs(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$result = $this->ladder_events->update_pairs($request['pairs']);
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
     * @api {get} /event/{id}/pairs			        Get all pairs for a specific event
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to retrieve pairs for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
                "error": null,
                "pairs": [
                    {
                        "id": 8,
                        "event_id": 9,
                        "user_one_id": 6,
                        "user_two_id": 3,
                        "ladder_ranking": 1,
                        "created_at": "2018-06-13T16:31:21+00:00"
                    }
                ]
            }
     */
	public function get_pairs(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('pairs', $this->ladder_events->get_pairs($id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/pairs/active			Get all pairs that are not dropped or out
     * @apiVersion 1.0.0
     * @apiName POST event participant
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to retrieve pairs for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
                "error": null,
                "pairs": [
                    {
                        "id": 8,
                        "event_id": 9,
                        "user_one_id": 6,
                        "user_two_id": 3,
                        "ladder_ranking": 1,
                        "created_at": "2018-06-13T16:31:21+00:00"
                    }
                ]
            }
     */
	public function get_active_pairs(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('pairs', $this->ladder_events->get_active_pairs($id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {put} /event/{id}/pairs/withdraw		Withdraw a team from an event
     * @apiVersion 1.0.0
     * @apiName Put event pairs withdraw
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to withdraw pairs from
	 * @apiParam	{array}     pair_ids            IDs of pairs to be withdrawn
     * @apiParam    {string}    withdraw_type       Withdraw type
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function withdraw_pairs(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('users', $this->ladder_events->withdraw_pairs($id, $request['pair_ids'], $request['withdraw_type']));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {put} /event/{id}/pairs/withdrawn/get/{user_id}	    Withdraw a team from an event
     * @apiVersion 1.0.0
     * @apiName Get pairs with withdrawn status of dropped
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event to withdraw pairs from
	 * @apiParam	{int}       user_id             Name an optional specific user
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function get_withdrawn_pairs(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('pairs', $this->ladder_events->get_withdrawn_pairs($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {get} /event/{id}/settings/{user_id}	    Get user settings
     * @apiVersion 1.0.0
     * @apiName Get user settings
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{int}       user_id             User ID
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "success": true,
     *          "error": null,
     *          "settings": {
     *              "receive_summary": 0
     *          }
     *      }
     */
	public function get_user_settings(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('settings', $this->ladder_events->get_user_settings($id, $user_id));
		}
		else{
			return $this->respondUnauthorized();
		}

    }

	/**
     * @api {post} /event/{id}/settings/{user_id}	Set user settings
     * @apiVersion 1.0.0
     * @apiName Set user settings
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{int}       user_id             User ID
	 * @apiParam	{array}     settings            Settings
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "success": true,
     *          "error": null
     *      }
     */
	public function set_user_settings(Request $request, $id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			$this->ladder_events->set_user_settings($id, $user_id, $request['settings']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

    }

    /**
     * @api {get} /event/{id}/do_not_match_requests			Returns do not match team requests for an event
     * @apiVersion 1.0.0
     * @apiName GET event do not match requests
     * @apiGroup Ladder Events
	 *
	 * @apiParam	{int}		id							ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"do_not_match_requests": [
					 {
						"id": 1,
						"event_id": 15,
						"pair_one_id": 1,
						"pair_two_id": 5,
						"created_at": "2018-03-17T12:25:14+00:00",
						"pair_one": {
							"id": 1,
							"first_name": "Sarah",
							"last_name": "Huckabee",
							"sex": "female",
							"email": "pihish@gmail.com",
							"phone": "666-444-9999",
							"remember_token": null,
							"image_url": null,
							"privilege": "facility leader",
							"created_at": "2018-03-17T12:25:13+00:00",
							"updated_at": "2018-03-17T12:25:13+00:00",
							"deleted_at": "1970-01-01T00:00:00+00:00"
						},
						"pair_two": {
							"id": 5,
							"first_name": "Charles",
							"last_name": "England",
							"sex": "male",
							"email": "charles@teamsrit.com",
							"phone": "666-444-9999",
							"remember_token": null,
							"image_url": null,
							"privilege": "participant",
							"created_at": "2018-03-17T12:25:13+00:00",
							"updated_at": "2018-03-17T12:25:13+00:00",
							"deleted_at": "1970-01-01T00:00:00+00:00"
						}
					}
                ]
            }
     */
	public function get_do_not_match_teams_requests(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('do_not_match_requests', $this->ladder_events->do_not_match_teams($id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/participants/update 		Update participant information
     * @apiVersion 1.0.0
     * @apiName GET event
     * @apiGroup Events
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function update_participants(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
            return $this->respondSuccess('event', $this->ladder_events->update_participants($id, $request['participants']));
		}
		else{
			return $this->respondUnauthorized();
		}

	}
    
}