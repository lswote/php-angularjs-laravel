<?php

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendHomepageMessage extends Job implements ShouldQueue{

	use InteractsWithQueue, SerializesModels;

	private $request;

	public function __construct($request){

		$this->request = $request;

	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 */
	public function handle(){

		$request = $this->request;
		Mail::send('emails.homepage-contact', array(
			'name' => $request['name'],
			'email' => $request['email'],
			'subject' => $request['subject'],
			'body' => $request['body']
		), function($message)use($request){
			$message->from('no-reply@teamsrit.com', $request['name']);
			$message->to('inquiries@teamsrit.com');
			$message->subject($request['subject'] . ' - New Message From teamsrit.com');
		});

	}

}