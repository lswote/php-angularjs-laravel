<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendChallenge extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $user, $sender, $event, $custom_message, $rsvp_token, $subject;

	public function __construct($user, $sender, $event, $custom_message, $rsvp_token, $subject){

		$this->user = $user;
		$this->sender = $sender;
		$this->event = $event;
		$this->custom_message = $custom_message;
		$this->rsvp_token = $rsvp_token;
		$this->subject = $subject;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$user = $this->user;
		$subject = $this->subject;
		Mail::send('emails.event-challenge', array(
			'user' => $this->user,
			'sender' => $this->sender,
			'event' => $this->event,
			'custom_message' => $this->custom_message,
			'rsvp_token' => $this->rsvp_token
		), function($message)use($user, $subject){
			$message->from('events@teamsrit.com', 'TeamsRIt');
			$message->to($user->email);
			$message->subject($subject);
		});

	}

}