<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendLineup extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $user, $sender, $event, $lineup_data, $subject;

	public function __construct($user, $sender, $event, $lineup_data, $subject){

		$this->user = $user;
		$this->sender = $sender;
		$this->event = $event;
		$this->lineup_data = $lineup_data;
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
		Mail::send('emails.team-member-lineup', array(
			'user' => $this->user,
			'sender' => $this->sender,
			'event' => $this->event,
			'lineup_data' => $this->lineup_data,
		), function($message)use($user, $subject){
			$message->from('events@teamsrit.com', 'TeamsRIt');
			$message->to($user->email);
			$message->subject($subject);
		});

	}

}