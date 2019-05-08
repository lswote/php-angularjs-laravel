<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendChallengeDailyReport extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $user, $sender, $event, $custom_message, $subject;

	public function __construct($user, $sender, $event, $custom_message, $subject){

		$this->user = $user;
		$this->sender = $sender;
		$this->event = $event;
		$this->custom_message = $custom_message;
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
		Mail::send('emails.event-challenge-daily-summary', array(
			'user' => $this->user,
			'sender' => $this->sender,
			'event' => $this->event,
			'custom_message' => $this->custom_message,
		), function($message)use($user, $subject){
			$message->from('events@teamsrit.com', 'TeamsRIt');
			$message->to($user->email);
			$message->subject($subject);
		});

	}

}