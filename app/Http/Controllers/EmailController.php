<?php

namespace App\Http\Controllers;

use App\Interfaces\EventInterface;
use App\Interfaces\LadderEventInterface;
use App\Interfaces\FacilityInterface;
use App\Models\Event;
use App\Models\User;
use App\Models\RsvpToken;
use App\Interfaces\EmailInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class EmailController extends ApiController{

	private $emails, $events, $ladder_events, $facilities;

    public function __construct(ResponseFactory $response, Request $request, EmailInterface $emails, EventInterface $events, LadderEventInterface $ladder_events, FacilityInterface $facilities){

    	parent::__construct($response, $request);

    	$this->emails = $emails;
    	$this->events = $events;
    	$this->ladder_events = $ladder_events;
		$this->facilities = $facilities;

    }

	// Returns the first facility leader for the facility
	private function get_facility_leader($id){

		$event = Event::find($id);
		return User::whereHas('facility_leaders', function($query)use($event){
			$query->where('id', '=', $event->facility_id);
		})->first();

	}

    /**
     * @api {post} /email/participants/potential						Sends an e-mail inviting users to an event
     * @apiVersion 1.0.0
     * @apiName POST email potential participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to send invite to
	 * @apiParam	{custom_message}		string						Custom message to send with invite
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function potential_participants(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$result = $this->emails->potential_participants($request['event_id'], $request['recipient_emails'], $request['custom_message'], $user);
			if($result){
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
     * @api {post} /email/participants									Sends an e-mail to confirmed users of an event
     * @apiVersion 1.0.0
     * @apiName POST email participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to send e-mail to
	 * @apiParam	{custom_message}		string						Custom message to send with e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function participants(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$this->emails->participants($request['event_id'], $request['recipient_emails'], $request['custom_message'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/participants/reminder							Sends a reminder e-mail to users
     * @apiVersion 1.0.0
     * @apiName POST email participants reminder
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to send e-mail to
	 * @apiParam	{custom_message}		string						Custom message to send with e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function participants_reminder(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$this->emails->participants_reminder($request['event_id'], $request['recipient_emails'], $request['custom_message'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/participants/not-responded					Sends an e-mail to users who have not responded to an invite
     * @apiVersion 1.0.0
     * @apiName POST email not responded participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to e-mail to
	 * @apiParam	{custom_message}		string						Custom message to send with e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function not_responded_participants(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$this->emails->not_responded_participants($request['event_id'], $request['recipient_emails'], $request['custom_message'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/participants/waitlisted						Sends an e-mail to waitlisted users of an event
     * @apiVersion 1.0.0
     * @apiName POST email waitlisted participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to e-mail to
	 * @apiParam	{custom_message}		string						Custom message to send with e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function waitlisted_participants(Request $request){

    	$user = User::find($request->get('auth_user_id'));
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['event_id'], $leader_of_events_ids)){
			$this->emails->waitlisted_participants($request['event_id'], $request['recipient_emails'], $request['custom_message'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/challenge									Sends an e-mail with challenge request
     * @apiVersion 1.0.0
     * @apiName POST email participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {array}                 recipient_emails            E-mails of users to send e-mail to
	 * @apiParam	{string}		        custom_message				Custom message to send with e-mail
	 * @apiParam	{object}		        sender						Info about the user initiating the e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function challenge(Request $request){

    	$user = User::find($request->get('auth_user_id'));
        $id = $request->event_id;
    	if(in_array($request->get('privilege'), array('admin', 'facility leader')) || $this->events->is_event_participant($id, $user->id)){
            $event_leaders = $this->events->get_leaders($id);
            if(count($event_leaders) > 0){
                $user = $event_leaders[0];
			}
			else{
				$user = $this->get_facility_leader($id);
			}
            $user['action_id'] = $request['challenge_id'];
            $user['challenger_name'] = $request['messageData']['challenger_name'];
			$user['accept_by_date'] = $request['messageData']['accept_by_date'];
            $user['player_name'] = $request['messageData']['player_name'];
            $user['player_email'] = $request['messageData']['player_email'];
			if(array_key_exists('player_name_two', $request['messageData'])){
				$user['player_name_two'] = $request['messageData']['player_name_two'];
			}
			if(array_key_exists('player_email_two', $request['messageData'])){
				$user['player_email_two'] = $request['messageData']['player_email_two'];
			}
            $this->emails->challenge($request['event_id'], $request['recipient_emails'], '', $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/notify_challenger								Sends challenger email notification
     * @apiVersion 1.0.0
     * @apiName POST email participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam	{string}				preferred_start_time		User requested start time
	 * @apiParam    {array}                 recipient_emails            E-mails of users to send e-mail to
	 * @apiParam	{string}		        custom_message				Custom message to send with e-mail
	 * @apiParam	{object}		        sender						Info about the user initiating the e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function notify_challenger(Request $request){

        $result = RsvpToken::where('token', '=', $request->token);
        if($result->exists()){
            $user_id = $result->get()[0]->user_id;
            $id = $request->event_id;
    		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || $this->events->is_event_participant($id, $user_id)){
            	$event_leaders = $this->events->get_leaders($id);
            	if(count($event_leaders) > 0){
                    $user = $event_leaders[0];
				}
				else{
					$user = $this->get_facility_leader($id);
				}
                $user['action_id'] = $request->challenge_id;
                $user['challenger'] = $request->challenger;
                $user['challengee'] = $request->challengee;
                $user['play_by_date'] = $request->play_by_date;
    			$this->emails->notify_challenger($request->event_id, $request->preferred_start_time, 
                                                 $request->recipient_emails, '', $user);
    			return $this->respondSuccess();
    		}
    		else{
    			return $this->respondUnauthorized();
    		}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/notify_challengers							Sends challenger email notifications
     * @apiVersion 1.0.0
     * @apiName POST email participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam	{object}		        challenge_data			    Info about challenges
	 * @apiParam	{object}		        sender						Info about the user initiating the e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function notify_challengers(Request $request){

        $id = $request['event_id'];
        $user = User::find($request->get('auth_user_id'));
        if(in_array($request->get('privilege'), array('admin', 'facility leader')) || $this->events->is_event_participant($id, $user->id)){
           	$event_leaders = $this->events->get_leaders($id);
           	if(count($event_leaders) > 0){
                $user = $event_leaders[0];
			}
			else{
				$user = $this->get_facility_leader($id);
			}
    		$this->emails->notify_challengers($request->event_id, $request->challenge_data, $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/notify_challenge_update					    Sends challenge participants update notification
     * @apiVersion 1.0.0
     * @apiName POST email participants
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {array}                 recipient_emails            E-mails of users to send e-mail to
	 * @apiParam	{string}		        custom_message				Custom message to send with e-mail
	 * @apiParam	{object}		        sender						Info about the user initiating the e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function notify_challenge_update(Request $request){

        $id = $request['event_id'];
        $user = User::find($request->get('auth_user_id'));
        if(in_array($request->get('privilege'), array('admin', 'facility leader')) || $this->events->is_event_participant($id, $user->id)){
            $event_leaders = $this->events->get_leaders($id);
            if(count($event_leaders) > 0){
                $user = $event_leaders[0];
            }
			else{
				$user = $this->get_facility_leader($id);
			}
            $user['challenger'] = $request['challenger'];
            $user['challengee'] = $request['challengee'];
			$this->emails->notify_challenge_update($id, $request['recipient_emails'], $request['custom_message'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /email/custom								Send custom email
     * @apiVersion 1.0.0
     * @apiName POST email custom message
     * @apiGroup Email
	 *
	 * @apiParam	{int}					event_id					ID of event
	 * @apiParam    {recipient_emails}      array                       E-mails of users to e-mail to
	 * @apiParam    {subject}      			array                       Custom subject for email
	 * @apiParam	{custom_message}		string						Custom message to send with e-mail
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
    public function send_custom_email(Request $request){

    	$user = User::find($request->get('auth_user_id'));
        $id = $request->event_id;
		$leader_of_events_ids = $user->event_leaders()->pluck('id')->toArray();
    	if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_events_ids) | $this->events->is_event_participant($id, $user->id)){
			$this->emails->send_custom_email($id, $request['recipient_emails'], $request['data']['subject'], $request['data'], $user);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /event												Get info about an event using an event RSVP token
     * @apiVersion 1.0.0
     * @apiName GET event by token
     * @apiGroup Email
	 *
	 * @apiParam	{string}				token						Event RSVP token
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null,
	 *          "event":
	 *  	}
     */
	public function get_event_by_rsvp_token(Request $request){

    	$result = $this->events->get_by_rsvp_token($request['token']);
    	if($result !== false){
    		return $this->respondSuccess('event', $result);
		}
		else{
    		return $this->respondNotFound();
		}

	}

	/**
     * @api {get} /event/challenge										Get info about an event using an event RSVP token
     * @apiVersion 1.0.0
     * @apiName GET challenge by token
     * @apiGroup Email
	 *
	 * @apiParam	{string}				token						Event RSVP token
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null,
	 *          "event":
	 *  	}
     */
	public function get_event_challenge_by_rsvp_token(Request $request){

    	$result = $this->ladder_events->get_challenge_by_rsvp_token($request['token'], $request['id']);
    	if($result !== false){
    		return $this->respondSuccess('challenge', $result);
		}
		else{
    		return $this->respondNotFound();
		}

	}

	/**
     * @api {post} /event/rsvp											RSVPs a user for an event
     * @apiVersion 1.0.0
     * @apiName POST email rsvp
     * @apiGroup Email
	 *
	 * @apiParam	{string}				token						Event RSVP token
	 * @apiParam	{time}					preferred_start_time		User requested start time
	 * @apiParam	{string}				action		                Which action is being rsvped
	 * @apiParam	{int}				    action_id		            Value used by action
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
	 * 		{
	 *			"success": true,
	 *			"error": null
	 *  	}
     */
	public function rsvp(Request $request){

		$result = $this->emails->rsvp($request['token'], $request['preferred_start_time'], $request['action'], $request['action_id']);
    	if($result){
    		return $this->respondSuccess('event', $result);
		}
		else{
    		return $this->respondNotFound();
		}

	}

}