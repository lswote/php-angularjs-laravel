<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendAvailability extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $user, $sender, $event, $availability_data, $subject;

	public function __construct($user, $sender, $event, $availability_data, $subject){

		$this->user = $user;
		$this->sender = $sender;
		$this->event = $event;
		$this->availability_data = $availability_data;
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
		Mail::send('emails.team-member-availability', array(
			'user' => $this->user,
			'sender' => $this->sender,
			'event' => $this->event,
			'availability_data' => $this->availability_data,
		), function($message)use($user, $subject){
			$message->from('events@teamsrit.com', 'TeamsRIt');
			$message->to($user->email);
			$message->subject($subject);
		});

	}

}