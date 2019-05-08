<?php

namespace App\Http\Controllers;

use App\Interfaces\EventMatchInterface;
use App\Interfaces\EventInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class EventMatchController extends ApiController{

	private $event_matches, $events;

    public function __construct(ResponseFactory $response, Request $request, EventMatchInterface $event_matches, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->event_matches = $event_matches;
    	$this->events = $events;

    }

    /**
     * @api {get} /event/{id}/matches						Get all matches for an event
     * @apiVersion 1.0.0
     * @apiName GET event matches
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		event_id					ID of event
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
    public function get_event_matches(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('matches', $this->event_matches->get_event_matches($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/matches/playoff				Get all playoff matches for an event
     * @apiVersion 1.0.0
     * @apiName GET event playoff matches
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"playoff_matches": [
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
    public function get_event_playoff_matches(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('playoff_matches', $this->event_matches->get_event_playoff_matches($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event/{id}/teams/scores					Get team scores for an event
     * @apiVersion 1.0.0
     * @apiName GET event team scores
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"team_scores":
	 		}
     */
    public function get_team_scores(Request $request, $event_id){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('team_scores', $this->event_matches->get_team_scores($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

    /**
     * @api {get} /event/{id}/match/lines					Get number and type of lines per match for an event
     * @apiVersion 1.0.0
     * @apiName GET event match lines
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		event_id					ID of event
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"lines": [
					{
						"id": 9,
						"event_id": 4,
						"match_id": 1,
						"event_surface_number": null,
						"line_type": "doubles",
						"line_play_type": "xd",
						"pair_one_id": null,
						"pair_two_id": null,
						"start_time": "14:00:00",
						"winning_pair_id": null,
						"created_at": "2018-07-07T02:46:37+00:00",
						"updated_at": "2018-07-07T02:46:37+00:00",
						"deleted_at": "1970-01-01T00:00:00+00:00",
						"start_time_formatted": "2:00"
					}
                ]
	 		}
     */
	public function get_lines_per_match(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		$participant_of_events_ids = $user->events()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || in_array($event_id, $participant_of_events_ids)){
			return $this->respondSuccess('lines', $this->event_matches->get_lines_per_match($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/match/rounds					Update match round dates
     * @apiVersion 1.0.0
     * @apiName PUT event match rounds
     * @apiGroup Event Matches
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
	public function update_round_dates(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->events->is_multifacility_captain($event_id, $user->id)){
			$this->event_matches->update_round_dates($event_id, $request['rounds']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /event/{id}/matches						Update matches
     * @apiVersion 1.0.0
     * @apiName PUT event matches
     * @apiGroup Event Matches
	 *
	 * @apiParam	{int}		event_id					ID of event
	 * @apiParam	{array}		matches						Matches to update
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
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids)){
			return $this->respondSuccess('team_scores', $this->event_matches->update($event_id, $request['matches']));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}