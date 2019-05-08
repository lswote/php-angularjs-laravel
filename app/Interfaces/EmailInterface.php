<?php

namespace App\Interfaces;

interface EmailInterface{

	/*
     * E-mail users inviting them to an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with invite
	 * @param	array	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function potential_participants($event_id, $recipients, $custom_message, $sender);

	/*
     * E-mail confirmed users about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function participants($event_id, $recipients, $custom_message, $sender);

	/*
     * E-mail confirmed users a reminder about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function participants_reminder($event_id, $recipients, $custom_message, $sender);

	/*
     * E-mail users who have not responded to a RSVP
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function not_responded_participants($event_id, $recipients, $custom_message, $sender);

	/*
     * E-mail waitlisted users about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function waitlisted_participants($event_id, $recipients, $custom_message, $sender);

	/*
     * E-mail a challenge request
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $message			        Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function challenge($event_id, $recipients, $message, $sender);

	/*
     * E-mail challenge acceptance notification
     *
     * @param	int		 $event_id					ID of event
     * @param	string	 $preferred_start_time	    Start time user is requesting
	 * @param	array	 $recipient_emails			E-mails of users to send e-mail to
	 * @param	string	 $message			        Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function notify_challenger($event_id, $preferred_start_time, $recipient_emails, $message, $sender);

	/*
     * E-mail challenge update notification 
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipient_emails			E-mails of users to send e-mail to
	 * @param	string	 $message			        Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function notify_challenge_update($event_id, $recipient_emails, $message, $sender);

	/*
     * E-mail challenges acceptance notification 
     *
     * @param	int		 $event_id					ID of event
	 * @param 	object	 $challenge_data			Multiple challenges
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  boolean
     *
     */
    public function notify_challengers($event_id, $challenge_data, $sender);

	/*
     * E-mail challenge daily report
     *
     * @param	int		 $event_id					ID of event
     * @param	date	 $date						Date of report
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
    public function send_challenge_daily_report($event_id, $date, $recipients, $custom_message, $sender);

	/*
     * E-mail custom email
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	array	 $subject			    	Custom subject for email
	 * @param	string	 $custom_message			Custom message for email
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_custom_email($event_id, $recipients, $subject, $custom_message, $sender);

	/*
     * E-mail team member lineup
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	array	 $lineup_data				Team member lineup
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_lineup_email($event_id, $recipients, $lineup_data, $sender);

	/*
     * E-mail team member availability
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	array	 $availability_data			Team member availability data
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_availability_email($event_id, $recipients, $availability_data, $sender);

	/*
     * RSVPs user for an event
     *
     * @param	string		 $token					Token to use to RSVP
     * @param	string		 $preferred_start_time	Start time user is requesting
     * @param	string		 $action	            Which action is being rsvped
     * @param	int		     $action_id	            Value used by action
	 *
     * @return  mixed
     *
     */
	public function rsvp($token, $preferred_start_time, $action, $action_id);

}