<?php

namespace App\Http\Controllers;

use App\Interfaces\EventInterface;
use App\Interfaces\LineInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;
use App\Library\EventLinesCalculator;

class LineController extends ApiController{

	private $lines, $events;

    public function __construct(ResponseFactory $response, Request $request, LineInterface $lines, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->lines = $lines;
    	$this->events = $events;

    }

    /**
     * @api {get} /event/{event_id}/lines				Get lines for an event
     * @apiVersion 1.0.0
     * @apiName GET event lines
     * @apiGroup Lines
	 *
	 * @apiParam	{int}		event_id				ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function get_event_lines(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) ||
					$this->events->is_event_participant($event_id, $user->id)){
			return $this->respondSuccess('lines', $this->lines->get_event_lines($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

    /**
     * @api {post} /lines								Generate lines for an event
     * @apiVersion 1.0.0
     * @apiName POST lines
     * @apiGroup Lines
	 *
	 * @apiParam	{int}		event_id				ID of event
	 * @apiParam	{int}		sets					Number of sets
	 * @apiParam	{array}		lines_aggregate			Array of count of each type of lines to generate
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function create_lines(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$this->lines->create_lines($request['event_id'], $request['sets'], $request['lines_aggregate']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{event_id}/lines				Updates lines corresponding to an event
     * @apiVersion 1.0.0
     * @apiName PUT event lines
     * @apiGroup Lines
	 *
	 * @apiParam	{int}		event_id				ID of event
	 * @apiParam	{array}		lines					Lines we want to update
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_lines(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$this->lines->update_lines($event_id, $request['lines'], $request->get('privilege'), $leader_of_events_ids);
		return $this->respondSuccess();

	}

	/**
     * @api {put} /lines/scores						Update scores for lines
     * @apiVersion 1.0.0
     * @apiName PUT lines scores
     * @apiGroup Lines
	 *
	 * @apiParam	{array}		lines_scores			Array of results for lines
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_lines_scores(Request $request){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$this->lines->update_lines_scores($request['lines_scores'], $request->get('privilege'), $leader_of_events_ids);
		return $this->respondSuccess();

	}

	/**
     * @api {put} /lines/surfaces						Update surfaces lines are played on
     * @apiVersion 1.0.0
     * @apiName PUT lines surfaces
     * @apiGroup Lines
	 *
	 * @apiParam	{array}		lines_surfaces		Array of lines / surfaces combos
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_lines_surfaces(Request $request){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$this->lines->update_lines_surfaces($request['lines_surfaces'], $request->get('privilege'), $leader_of_events_ids);
		return $this->respondSuccess();

	}

	/**
     * @api {get} /event/{event_id}/lines/results-entered		Tells us whether results have been entered for an event's lines
     * @apiVersion 1.0.0
     * @apiName GET event lines results entered
     * @apiGroup Lines
	 *
	 * @apiParam	{int}		event_id						ID of event to look up
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	            "results_entered": false
            }
     */
	public function event_lines_results_entered(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('results_entered', $this->lines->event_lines_results_entered($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /event/{event_id}/lines/regenerate			Regenerate lines for an event
     * @apiVersion 1.0.0
     * @apiName POST event regenerate lines
     * @apiGroup Lines
	 *
	 * @apiParam	{int}		event_id						ID of event to regenerate lines for
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function regenerate_lines(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			$event_lines_calculator = new EventLinesCalculator($event_id);
			$event_lines_calculator->calculate_lines();
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}