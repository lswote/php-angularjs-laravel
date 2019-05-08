<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendAvailabilityUpdate extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $event, $user, $team_name, $event_leader_emails;

	public function __construct($event, $user, $team_name, $event_leader_emails){

		$this->event = $event;
		$this->user = $user;
		$this->team_name = $team_name;
		$this->event_leader_emails = $event_leader_emails;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$event = $this->event;
		$user = $this->user;
		$event_leader_emails = $this->event_leader_emails;
		Mail::send('emails.availability-update-notification', array(
			'event' => $event,
			'user' => $user,
			'team_name' => $this->team_name
		), function($message)use($event, $user, $event_leader_emails){
			$message->from('events@teamsrit.com', 'Teams-R-It');
			$message->to($event_leader_emails);
			$message->subject("$user->first_name $user->last_name Changed Their Availability For $event->name");
		});

	}

}