<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendPasswordReset extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $user, $token;

	public function __construct($user, $token){

		$this->user = $user;
		$this->token = $token;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$user = $this->user;
		Mail::send('emails.forgot-password', array(
			'first_name' => $user->first_name,
			'token' => $this->token,
		), function($message)use($user){
			$message->from('events@teamsrit.com', 'Teams-R-It');
			$message->to($user->email);
			$message->subject('Password Reset Request');
		});

	}

}