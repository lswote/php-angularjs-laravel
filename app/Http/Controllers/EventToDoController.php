<?php

namespace App\Http\Controllers;

use App\Interfaces\EventToDoInterface;
use App\Interfaces\EventInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class EventToDoController extends ApiController{

	private $event_to_dos, $events;

    public function __construct(ResponseFactory $response, Request $request, EventToDoInterface $event_to_dos, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->event_to_dos = $event_to_dos;
    	$this->events = $events;

    }

    /**
     * @api {get} /event/{event_id}/todos					Return all to dos for a particular event
     * @apiVersion 1.0.0
     * @apiName GET event todos
     * @apiGroup Event ToDos
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  			"event_to_dos": [
					{
						"id": 1,
						"event_id": 4,
						"primary_id": 1,
						"secondary_id": 0,
						"previous_to_do_primary_id": null,
						"previous_to_do_secondary_id": null,
						"days_from_previous_to_do": 3,
						"status": "complete",
						"description": "wipe butt",
						"assigned_user": null,
						"created_at": "2018-08-30T16:51:38+00:00",
						"updated_at": "2018-08-30T16:51:38+00:00"
					}
				]
            }
     */
    public function get(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->events->is_multifacility_captain($event_id, $user->id)){
			return $this->respondSuccess('event_to_dos', $this->event_to_dos->get($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{event_id}/todos					Create or update event to do records
     * @apiVersion 1.0.0
     * @apiName PUT event todos
     * @apiGroup Event ToDos
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		event_to_dos				Records to create / update
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
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->events->is_multifacility_captain($event_id, $user->id)){
			$this->event_to_dos->create_or_update($event_id, $request['event_to_dos']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /event/{event_id}/todos/{to_do_id}		Deletes a to do ID
     * @apiVersion 1.0.0
     * @apiName DELETE event todo
     * @apiGroup Event ToDos
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{int}		to_do_id					ID of to do record to delete
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function delete(Request $request, $event_id, $to_do_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->events->is_multifacility_captain($event_id, $user->id)){
			$this->event_to_dos->delete($event_id, $to_do_id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/todos/print  			Prints todos
     * @apiVersion 1.0.0
     * @apiName POST event print todos
     * @apiGroup Event ToDos
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		to_do_ids					IDs of todos to print
	 * @apiParam	{string}	size						Size of paper
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function print_todos(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->events->is_multifacility_captain($event_id, $user->id)){
			$this->event_to_dos->print($event_id, $request['tasks'], $request['status'], $request['size']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}