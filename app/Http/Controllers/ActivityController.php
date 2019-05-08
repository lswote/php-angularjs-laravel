<?php

namespace App\Http\Controllers;

use App\Interfaces\ActivityInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class ActivityController extends ApiController{

	private $activities;

    public function __construct(ResponseFactory $response, Request $request, ActivityInterface $activities){

    	parent::__construct($response, $request);

    	$this->activities = $activities;

    }

    /**
     * @api {get} /activities					Get all activities
     * @apiVersion 1.0.0
     * @apiName GET activities
     * @apiGroup Activities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null,
	 			   "activities": [{
						"id": 1,
						"name": "Tennis",
						"two_teams_per_line": 1,
						"three_teams_per_line": 0,
						"four_teams_per_line": 0,
						"five_teams_per_line": 0,
						"doubles": 1,
						"competition_scoring_format": 3,
						"line_scoring_format": "points",
						"point": "high",
						"surface_type": "court",
						"match_type": "set",
						"created_at": "2018-05-08T16:30:59+00:00",
						"updated_at": "2018-05-08T16:30:59+00:00"
					}]
            }
     */
	public function get(Request $request){

		if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
			$facilities = $this->activities->get();
			return $this->respondSuccess('activities', $facilities);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /activity								Create a new activity
     * @apiVersion 1.0.0
     * @apiName POST activity
     * @apiGroup Activities
	 *
     * @apiParam	{string}	name						Name of activity
     * @apiParam	{integer}	two_teams_per_line			Whether activity allows two teams per line
     * @apiParam	{integer}	three_teams_per_line		Whether activity allows three teams per line
     * @apiParam	{integer}	four_teams_per_line			Whether activity allows four teams per line
     * @apiParam	{integer}	five_teams_per_line			Whether activity allows five teams per line
     * @apiParam	{integer}	doubles				        Whether there are double / pair lines
     * @apiParam	{integer}	competition_scoring_format  Number of games per set / line
     * @apiParam	{string}	line_scoring_format			Win / loss or by points
     * @apiParam	{string}	point      					High or low points win games
     * @apiParam	{string}	surface_type				Type of playing surface
	 * @apiParam	{string}	line_type				    Whether activity uses sets or games to count scoring
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null,
	 			   "activity_id": 5
            }
     */
	public function post(Request $request){

		if(in_array($request->get('privilege'), array('admin'))){
			$activity_id = $this->activities->create($request);
			return $this->respondSuccess('activity_id', $activity_id);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /activity/{id}							Updates an existing activity
     * @apiVersion 1.0.0
     * @apiName PUT activity
     * @apiGroup Activities
	 *
	 * @apiParam	{integer}	id							ID of activity to update
     * @apiParam	{string}	name						Name of activity
     * @apiParam	{integer}	two_teams_per_line			Whether activity allows two teams per line
     * @apiParam	{integer}	three_teams_per_line		Whether activity allows three teams per line
     * @apiParam	{integer}	four_teams_per_line			Whether activity allows four teams per line
     * @apiParam	{integer}	five_teams_per_line			Whether activity allows five teams per line
     * @apiParam	{integer}	doubles				        Whether there are double / pair lines
     * @apiParam	{integer}	competition_scoring_format  Number of games per set / line
     * @apiParam	{string}	line_scoring_format			Win / loss or by points
     * @apiParam	{string}	point      					High or low points win games
     * @apiParam	{string}	surface_type				Type of playing surface
	 * @apiParam	{string}	line_type				    Whether activity uses sets or games to count scoring
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null
            }
     */
	public function put(Request $request, $id){

		if(in_array($request->get('privilege'), array('admin'))){
			$this->activities->update($id, $this->sanitizeRequest($request));
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}