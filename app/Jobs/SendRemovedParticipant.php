<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendRemovedParticipant extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $event, $removed_user_name, $replacement_user, $leader_email;

	public function __construct($event, $removed_user_name, $replacement_user, $leader_email){

		$this->event = $event;
		$this->removed_user_name = $removed_user_name;
		$this->replacement_user = $replacement_user;
		$this->leader_email = $leader_email;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$event = $this->event;
		$leader_email = $this->leader_email;
		$removed_user_name = $this->removed_user_name;
		Mail::send('emails.removed-participant-notification', array(
			'event_name' => $this->event->name,
			'event_date' => $this->event->start_date_formatted,
			'ranked' => $this->event->ranked,
			'removed_user' => $this->removed_user_name,
			'replacement_user' => !empty($this->replacement_user) ? $this->replacement_user->first_name . ' ' . $this->replacement_user->last_name : null,
		), function($message) use ($event, $leader_email, $removed_user_name){
			$message->from('events@teamsrit.com', 'Teams-R-It');
			$message->to($leader_email);
			$message->subject($removed_user_name . ' Has Removed Themself From ' . $event->name);
		});

	}

}