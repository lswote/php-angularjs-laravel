<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendFacilityLeaderWelcome extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $username, $facility_name, $first_name, $password, $email;

	public function __construct($username, $facility_name, $first_name, $password, $email){

		$this->username = $username;
		$this->facility_name = $facility_name;
		$this->first_name = $first_name;
		$this->password = $password;
		$this->email = $email;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$email = $this->email;
		Mail::send('emails.facility-leader-welcome', array(
			'username' => $this->username,
			'facility_name' => $this->facility_name,
			'first_name' => $this->first_name,
			'password' => $this->password,
		), function($message)use($email){
			$message->from('events@teamsrit.com', 'Teams-R-It');
			$message->to($email);
			$message->subject('You Have Been Assigned As a Facility Leader');
		});

	}

}