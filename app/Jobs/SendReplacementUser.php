<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendReplacementUser extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $event, $replacement_user;

	public function __construct($event, $replacement_user){

		$this->event = $event;
		$this->replacement_user = $replacement_user;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$event = $this->event;
		$replacement_user = $this->replacement_user;
		Mail::send('emails.replacement-participant-notification', array(
			'event' => $event,
			'replacement_user' => $replacement_user
		), function($message)use($event, $replacement_user){
			$message->from('events@teamsrit.com', 'Teams-R-It');
			$message->to($replacement_user->email);
			$message->subject('You Have Been Confirmed For ' . $event->name);
		});

	}

}