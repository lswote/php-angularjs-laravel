<?php

namespace App\Http\Controllers;

use App\Interfaces\EventRuleInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class EventRuleController extends ApiController{

	private $event_rules;

	public function __construct(ResponseFactory $response, Request $request, EventRuleInterface $event_rules){

		parent::__construct($response, $request);
		$this->event_rules = $event_rules;

	}

	/*
     * Check whether a user is a confirmed participant for an event
     *
     * @param 	int	 	$event_id					ID of event
	 * @param	int 	$user_id					ID of user
     *
     * @return  int
     *
     */
	private function is_event_participant($event_id, $user){

		return count($user->events()->find($event_id)->users()->where('id', '=', $user->id)->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 0)->get());

	}

	/**
	 * @api               {post} /event/{id}/rules                    Creates a new set of rules for an event
	 * @apiVersion        1.0.0
	 * @apiName           POST event rules
	 * @apiGroup          Events
	 *
	 * @apiParam          int     event_id                        ID of our event
	 * @apiParam          int     num_sets                        number of "sets" for our event
	 * @apiParam          int     num_challenges                  total number of challenges that may be issued
	 * @apiParam          int     num_opp_challenges              number of challanges opponent may issue
	 * @apiParam          int     num_team_challenges             number of challenges a team/pair may issue
	 * @apiParam          int     num_spots_up                    number of spots up a challenger may issue
	 * @apiParam          int     num_spots_down                  number of spots down a challenger may issue
	 * @apiParam          boolean allow_challenge_next            allow challenge next in line
	 * @apiParam          string  switch_or_jump                  "s" switch, "j" jump for winning challenge
	 * @apiParam          boolean deny_challenge_rank             does denying a challenge affect challengee's rank
	 * @apiParam          boolean deny_accept_rank                does refusing to accept a challenge affect challengee's rank
	 * @apiParam          boolean withdrawal_rank                 does withdrawing from a challenge affect rank
	 * @apiParam          boolean accept_not_played_rank          does accepting a challenge that is not played affect rank
	 * @apiParam          int     days_accept_challenge           days to accept a challenge
	 * @apiParam          int     days_play_challenge             days to play a challenge
	 * @apiParam          int     days_after_completed            days after a challenge has been played before issuing another
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
		   {
			   "success": true,
			   "error": null,
			   "event_rules_id": 14
		   }
	 */
	public function create_event_rules(Request $request){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			if($this->event_rules->get($request['event_id'])->count()){
				return $this->update_event_rules($request, $request['event_id']);
			}
			else{
				if($request['default_values'] === 1){
					$event_rule_id = $this->event_rules->create($request->get('auth_user_id'), $request['event_id'], $request['default_values']);
				}
				else{
					$event_rule_id = $this->event_rules->create($request->get('auth_user_id'), $request['event_id'], $request['default_values'], $request['num_sets'], $request['num_challenges'], $request['num_opp_challenges'], $request['num_team_challenges'], $request['num_spots_up'], $request['num_spots_down'], $request['allow_challenge_next'], $request['switch_or_jump'], $request['deny_challenge_rank'], $request['deny_accept_rank'], $request['withdrawal_rank'], $request['accept_not_played_rank'], $request['days_accept_challenge'], $request['days_play_challenge'], $request['days_after_completed']);
				}
				return $this->respondSuccess('event_rules_id', $event_rule_id);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
	 * @api               {put} /event/{id}/rules                       Updates the set of rules for an event
	 * @apiVersion        1.0.0
	 * @apiName           PUT event rules
	 * @apiGroup          Events
	 *
	 * @apiParam          int     event_id                        ID of our event
	 * @apiParam          int     num_sets                        number of "sets" for our event
	 * @apiParam          int     num_challenges                  total number of challenges that may be issued
	 * @apiParam          int     num_opp_challenges              number of challanges opponent may issue
	 * @apiParam          int     num_team_challenges             number of challenges a team/pair may issue
	 * @apiParam          int     num_spots_up                    number of spots up a challenger may issue
	 * @apiParam          int     num_spots_down                  number of spots down a challenger may issue
	 * @apiParam          boolean allow_challenge_next            allow challenge next in line
	 * @apiParam          string  switch_or_jump                  "s" switch, "j" jump for winning challenge
	 * @apiParam          boolean deny_challenge_rank             does denying a challenge affect challengee's rank
	 * @apiParam          boolean deny_accept_rank                does refusing to accept a challenge affect challengee's rank
	 * @apiParam          boolean withdrawal_rank                 does withdrawing from a challenge affect rank
	 * @apiParam          boolean accept_not_played_rank          does accepting a challenge that is not played affect rank
	 * @apiParam          int     days_accept_challenge           days to accept a challenge
	 * @apiParam          int     days_play_challenge             days to play a challenge
	 * @apiParam          int     days_after_completed            days after a challenge has been played before issuing another
	 *
	 * @apiSuccessExample Success-Response:
	 *      HTTP/1.1 200 OK
		   {
		  	   "success": true,
	   		   "error": null
		   }
	 */
	public function update_event_rules(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('facility leader')) || in_array($event_id, $leader_of_events_ids)){
			if($this->event_rules->get($request['event_id'])->count()){
				$this->event_rules->update($request->get('auth_user_id'), $request['event_id'], $request['num_sets'], $request['num_challenges'], $request['num_opp_challenges'],
										   $request['num_team_challenges'], $request['num_spots_up'], $request['num_spots_down'], $request['allow_challenge_next'],
										   $request['switch_or_jump'], $request['deny_challenge_rank'], $request['deny_accept_rank'], $request['withdrawal_rank'],
										   $request['accept_not_played_rank'], $request['days_accept_challenge'], $request['days_play_challenge'], $request['days_after_completed']);
				return $this->respondSuccess("updated", true);
			}
			else{
				return $this->respondSuccess("updated", false);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
	 * @api               {get} /event/{id}/rules                    Gets the set of rules for an event
	 * @apiVersion        1.0.0
	 * @apiName           POST event rules
	 * @apiGroup          Events
	 *
	 * @apiParam          int     event_id                        ID of our event
	 * @apiParam          int     num_sets                        number of "sets" for our event
	 * @apiParam          int     num_challenges                  total number of challenges that may be issued
	 * @apiParam          int     num_opp_challenges              number of challanges opponent may issue
	 * @apiParam          int     num_team_challenges             number of challenges a team/pair may issue
	 * @apiParam          int     num_spots_up                    number of spots up a challenger may issue
	 * @apiParam          int     num_spots_down                  number of spots down a challenger may issue
	 * @apiParam          boolean allow_challenge_next            allow challenge next in line
	 * @apiParam          string  switch_or_jump                  "s" switch, "j" jump for winning challenge
	 * @apiParam          boolean deny_challenge_rank             does denying a challenge affect challengee's rank
	 * @apiParam          boolean deny_accept_rank                does refusing to accept a challenge affect challengee's rank
	 * @apiParam          boolean withdrawal_rank                 does withdrawing from a challenge affect rank
	 * @apiParam          boolean accept_not_played_rank          does accpeting a challenge that is not played affect rank
	 * @apiParam          int     days_accept_challenge           days to accept a challenge
	 * @apiParam          int     days_play_challenge             days to play a challenge
	 * @apiParam          int     days_after_completed            days after a challenge has been played before issuing another
	 *
	 * @apiSuccessExample Success-Response:
	       HTTP/1.1 200 OK
		   {
		       "success": true,
		       "error": null,
		       "rules_event": [
			       {
					   "id": 13,
					   "event_id": 43,
					   "num_sets": 3,
					   "num_challenges": 2,
					   "num_opp_challenges": 1,
					   "num_team_challenges": 1,
					   "num_spots_up": 10,
					   "num_spots_down": 10,
					   "allow_challenge_next": 1,
					   "switch_or_jump": 's',
					   "deny_challenge_rank": 1,
					   "deny_accept_rank": 1,
					   "withdrawal_rank": 1,
					   "accept_not_played_rank": 0,
					   "days_accept_challenge": 14,
					   "days_play_challenge": 7,
					   "days_after_completed": 7
			       }
               ]
		   }
	 */

	public function get_event_rules(Request $request, $event_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($event_id, $leader_of_events_ids) || $this->is_event_participant($event_id, $user)){
			return $this->respondSuccess('rules_event', $this->event_rules->get($event_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}


}