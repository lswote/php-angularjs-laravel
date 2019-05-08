<?php

namespace App\Http\Controllers;

use App\Interfaces\ReportInterface;
use App\Interfaces\EventInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class ReportController extends ApiController{

	private $events;

    public function __construct(ResponseFactory $response, Request $request, ReportInterface $report, EventInterface $events){

    	parent::__construct($response, $request);

    	$this->report = $report;
    	$this->events = $events;

	}

	/**
     * @api {post} /event/{id}/laddersummaryreport	Get summary ladder report
     * @apiVersion 1.0.0
     * @apiName Get ladder summary report
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id					ID of event
	 * @apiParam	{int}		user_id				User to restrict to or all users
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "success": true,
     *          "error": null
     *      }
     */
	public function get_ladder_summary_report(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) || $this->events->is_event_participant($id, $user->id)){
			return $this->respondSuccess('results', $this->report->get_ladder_summary_report($id, $user->id, $request['days']));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}