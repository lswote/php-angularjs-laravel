<?php

namespace App\Repositories;

use App\Interfaces\EmailInterface;
use App\Interfaces\EventInterface;
use App\Interfaces\LadderEventInterface;
use App\Models\User;
use App\Models\Event;
use App\Models\RsvpToken;
use App\Models\Email;
use App\Models\Line;
use App\Models\Pair;
use App\Models\Challenge;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendDefault;
use App\Jobs\SendAvailability;
use App\Jobs\SendChallenge;
use App\Jobs\SendChallengeDailyReport;
use App\Jobs\SendChallengeUpdate;
use App\Jobs\SendCustom;
use App\Jobs\SendLineup;
use App\Jobs\SendNotifyChallenger;

class EmailRepository implements EmailInterface{

	private $events, $ladder_events;

    public function __construct(EventInterface $events, LadderEventInterface $ladder_events){

    	$this->events = $events;
        $this->ladder_events = $ladder_events;

    }

	// Generates a random event RSVP token
	private function token_generator($length){

		$keyspace = '0123456789abcdefghijklmnopqrstuvwxyz';
		$str = '';
		$max = mb_strlen($keyspace, '8bit') - 1;
		for($i = 0; $i < $length; ++$i){
			$str = $str . $keyspace[random_int(0, $max)];
		}
		return $str;

	}

	// Tells us whether a RSVP token is already in the system
	private function does_rsvp_token_exist($token){

		return RsvpToken::where('token', '=', $token)->exists();

	}

	// Adds a rsvp token
	private function add_rsvp_token($event_id, $user_id, $token){

		RsvpToken::create(array(
			'event_id' => $event_id,
			'user_id' => $user_id,
			'token' => $token
		));

	}

	// Generates and adds a RSVP token to the system
	private function generate_rsvp_token($event_id, $user_id){

		$token = $this->token_generator(64);
		if($this->does_rsvp_token_exist($token) === false){
			$this->add_rsvp_token($event_id, $user_id, $token);
			return $token;
		}
		else{
			$this->generate_rsvp_token($event_id, $user_id);
		}

	}

	// Creates a sent e-mail record
	private function create_email_record($type, $event_id, $recipients, $subject, $content){

		$recipient_emails = array_column($recipients, 'email');
		Email::create(array(
			'email_type_name' => $type,
			'event_id' => $event_id,
			'to_email_addresses' => implode('; ', $recipient_emails),
			'subject' => $subject,
			'content' => $content
		));

	}

	// Event RSVP logic
	private function rsvp_participant($result, $preferred_start_time){

		$event = Event::with('facilities')->find($result->event_id);
		$reference_record = $event->users()->where('user_id', '=', $result->user_id)->first();
		if($reference_record->pivot->rsvped === null){
			$event->users()->updateExistingPivot($result->user_id, array(
				'rsvped' => DB::raw('CURRENT_TIMESTAMP()')
			));
			if(($preferred_start_time !== 'unavailable') && ($event->event_type === 'ladder') && ($event->event_sub_type == 'singles')){
				$rsvpeds = DB::table('user_event')->where('event_id', '=', $result->event_id)->where('rsvped', '!=', null)->where('unavailable', '=', 0)
												  ->orderBy('singles_ladder_ranking')->get();
				$count = count($rsvpeds);
				if($count > 0){
					$event->users()->updateExistingPivot($result->user_id, array(
						'singles_ladder_ranking' => $rsvpeds[$count - 1]->singles_ladder_ranking + 1
					));
				}
				else{
					$event->users()->updateExistingPivot($result->user_id, array(
						'singles_ladder_ranking' => 1
					));
				}
			}
			if(($preferred_start_time !== 'unavailable') && ($event->event_type === 'ladder')){
				$event->users()->updateExistingPivot($result->user_id, array(
					'confirmed' => 1
				));
			}
		}
		if($preferred_start_time !== 'available' && $preferred_start_time !== 'unavailable'){
			$event->users()->updateExistingPivot($result->user_id, array(
				'preferred_start_time' => $preferred_start_time
			));
		}
		else if($preferred_start_time === 'unavailable'){
			$event->users()->updateExistingPivot($result->user_id, array(
				'unavailable' => 1
			));
		}
		return $event;

	}

	// Challenge RSVP logic
	private function rsvp_challenge($result, $preferred_start_time, $action_id){

		$event = Event::with('facilities')->find($result->event_id);
		if($event->event_type === 'ladder'){
            $challenge = Challenge::where('id', '=', $action_id)->get();
            if($event->event_sub_type === 'singles'){
                if(count($challenge) > 0){
                    if($result->user_id === $challenge[0]->challengee_id){
                        $this->ladder_events->challenge_response($event->id, $action_id, $preferred_start_time);
                    }
                }
            }
            else{
                if(count($challenge) > 0){
                    $pairs = Pair::where('id', '=', $challenge[0]->challengee_id)->get();
                    if(count($pairs) === 0){
                        return -1;
                    }
                    else if(($result->user_id === $pairs[0]->user_one_id) ||
                            ($result->user_id === $pairs[0]->user_two_id)){
                        $this->ladder_events->challenge_response($event->id, $action_id, $preferred_start_time);
                    }
                }
            }
		}
		return $event;

	}

	// Breaks apart a string containing a token so into the string before the token, the token and the string after the token
	// so it can be processed by the email blade
	private function process_string($string){

    	$return_strings = array();
		if(strpos($string, '<LINK>') !== false){
			$strings = explode('<LINK>', $string);
			foreach($this->process_string($strings[0]) as $return_string){
				array_push($return_strings, $return_string);
			}
			array_push($return_strings, '<LINK>');
			foreach($this->process_string($strings[1]) as $return_string){
				array_push($return_strings, $return_string);
			}
		}
		else if(strpos($string, '<SENDER-EMAIL-LINK>') !== false){
			$strings = explode('<SENDER-EMAIL-LINK>', $string);
			foreach($this->process_string($strings[0]) as $return_string){
				array_push($return_strings, $return_string);
			}
			array_push($return_strings, '<SENDER-EMAIL-LINK>');
			foreach($this->process_string($strings[1]) as $return_string){
				array_push($return_strings, $return_string);
			}
		}
		else{
			array_push($return_strings, $string);
		}
		return $return_strings;

    }

	// Sends out an e-mail
	private function send_email($email_type, $event_id, $recipients, $email_object, $sender){

		$event = Event::find($event_id);
		$subject = $email_object['subject'];
		$lines = array();
		if($email_object['emailTop'] === 'true'){
			foreach($this->process_string($email_object['bodyTop']) as $string){
				array_push($lines, $string);
			}
			array_push($lines, "\n\n");
		}
		if($email_object['customBody']){
			foreach($this->process_string($email_object['customBody']) as $string){
				array_push($lines, $string);
			}
			array_push($lines, "\n\n");
		}
		if($email_object['emailBottom'] === 'true'){
			foreach($this->process_string($email_object['bodyBottom']) as $string){
				array_push($lines, $string);
			}
		}
		$get_line = strpos(join('', $lines), '<LINE') !== false;
		foreach($recipients as $recipient){
			$user = User::find($recipient['id']);
			$user->events()->sync(array($event_id), false);
			$rsvp_token = $this->generate_rsvp_token($event_id, $user->id);
			$participant_line = $this->get_participant_line($event_id, $user->id);
			dispatch(new SendDefault($user, $sender, $event, $lines, $get_line, $participant_line, $rsvp_token, $subject));
		}
		$this->create_email_record($email_type, $event_id, $recipients, $subject, $email_object['customBody']);

    }

	/*
     * E-mail users inviting them to an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $email_object				Custom message to go along with invite
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  mixed
     *
     */
	public function potential_participants($event_id, $recipients, $email_object, $sender){

		$event = Event::find($event_id);
		$errors = ["No emails sent"];
		foreach($recipients as $recipient){
			$user = User::find($recipient['id']);
			if(!(($event->gender_type ==='both') || ($event->gender_type === $user->sex))){
				array_push($errors, $user->first_name.' '.$user->last_name.' gender differs from event gender');
			}
		}
		if(count($errors) > 1){
			return $errors;
		}
		else{
			$this->send_email('potential-participants', $event_id, $recipients, $email_object, $sender);
			return null;
		}

	}

	/*
     * E-mail confirmed users about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function participants($event_id, $recipients, $email_object, $sender){

		$this->send_email('participants', $event_id, $recipients, $email_object, $sender);

	}

	/*
     * E-mail with challenge request 
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function challenge($event_id, $recipients, $custom_message, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - You Have Been Invited To A Ladder Challenge At ' . $event->name;
		foreach($recipients as $recipient){
			$user = User::find($recipient['id']);
			$user->events()->sync(array($event_id), false);
			$rsvp_token = $this->generate_rsvp_token($event_id, $user->id);
			dispatch(new SendChallenge($user, $sender, $event, $custom_message, $rsvp_token, $subject));
		}
		$this->create_email_record('challenge', $event_id, $recipients, $subject, $custom_message);

	}

	/*
     * E-mail challenge acceptance notification 
     *
     * @param	int		 $event_id					ID of event
     * @param	string	 $preferred_start_time	    Start time user is requesting
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param 	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
    public function notify_challenger($event_id, $preferred_start_time, $recipients, $custom_message, $sender){

		$event = Event::find($event_id);
        if ($preferred_start_time === 'unavailable'){
        
		    $subject = 'TeamsRIt - Your Ladder Challenge At ' . $event->name . ' Has Been Declined';
            $sender['status'] = 'declined';
        }
        else{
		    $subject = 'TeamsRIt - Your Ladder Challenge At ' . $event->name . ' Has Been Accepted';
            $sender['status'] = 'accepted';
            $custom_message = '  Your match must be played by '.$sender->play_by_date.'.';
        }
		foreach($recipients as $recipient){
            $user = User::find($recipient['id']);
            dispatch(new SendNotifyChallenger($user, $sender, $event, $custom_message, $subject));
		}

	}

	/*
     * E-mail challenges acceptance notification 
     *
     * @param	int		 $event_id					ID of event
	 * @param 	object	 $challenge_data			Multiple challenges
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  boolean
     *
     */
	public function notify_challengers($event_id, $challenge_data, $sender){

        foreach($challenge_data as $challenge){
            $sender['action_id'] = $challenge['challenge_id'];
            $sender['challenger'] = $challenge['challenger'];
            $sender['challengee'] = $challenge['challengee'];
            $sender['play_by_date'] = $challenge['play_by_date'];
            $this->notify_challenger($event_id, $challenge['preferred_start_time'], $challenge['recipients'], '', $sender);
        }
        return true;

	}

	/*
     * E-mail challenge update notification 
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function notify_challenge_update($event_id, $recipients, $custom_message, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - Update information about your Ladder Challenge At ' . $event->name;
		foreach($recipients as $recipient){
            $user = User::find($recipient); 
			$user->events()->sync(array($event_id), false);
			$rsvp_token = $sender['action_id'] ? $this->generate_rsvp_token($event_id, $user->id) : null;
			dispatch(new SendChallengeUpdate($user, $sender, $event, $custom_message, $rsvp_token, $subject));
		}

	}

	/*
     * E-mail challenge daily report
     *
     * @param	int		 $event_id					ID of event
     * @param	date	 $date						Date of report
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_challenge_daily_report($event_id, $date, $recipients, $custom_message, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - ' . $event->name . ' Ladder Summary Report for '.$date;
		foreach($recipients as $recipient){
            $user = User::find($recipient); 
			dispatch(new SendChallengeDailyReport($user, $sender, $event, $custom_message, $subject));
		}

	}

	/*
     * E-mail custom email
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	string	 $subject			    	Custom subject for email
	 * @param	array	 $data						Info for e-mail message
	 * @param	object	 $sender					Sender info
     *
     * @return  void
     *
     */
	public function send_custom_email($event_id, $recipients, $subject, $data, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - ' . $subject;
		foreach($recipients as $recipient){
            $user = User::find($recipient); 
			dispatch(new SendCustom($user, $sender, $event, $data, $subject));
		}

	}

	/*
     * E-mail team member lineup
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	array	 $lineup_data				Team member lineup
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_lineup_email($event_id, $recipients, $lineup_data, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - ' . $event->name . ' line-up for ' . $lineup_data['round_date'];
		foreach($recipients as $recipient){
            $user = User::find($recipient); 
			dispatch(new SendLineup($user, $sender, $event, $lineup_data, $subject));
		}

	}

	/*
     * E-mail team member availability
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients			    E-mails of users to send e-mail to
	 * @param	array	 $availability_data			Team member availability data
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function send_availability_email($event_id, $recipients, $availability_data, $sender){

		$event = Event::find($event_id);
		$subject = 'TeamsRIt - ' . $event->name . ' team member availability';
		foreach($recipients as $recipient){
            $user = User::find($recipient); 
			dispatch(new SendAvailability($user, $sender, $event, $availability_data, $subject));
		}

	}

	// Get lines participant has been assigned to
	private function get_participant_line($id, $user_id){

		// Get singles lines user is playing in
		$singles = Line::where('event_id', '=', $id)->where('line_type', '=', 'singles')->where(function($query)use($user_id){
			$query->where('pair_one_id', '=', $user_id)->orWhere('pair_two_id', '=', $user_id);
		})->get();
		// Get doubles lines user is playing in
		$user_pair_ids = Pair::where('user_one_id', '=', $user_id)->orWhere('user_two_id', '=', $user_id)->pluck('id');
		$doubles = Line::where('event_id', '=', $id)->where('line_type', '=', 'doubles')->where(function($query)use($user_pair_ids){
			$query->whereIn('pair_one_id', $user_pair_ids)->orWhereIn('pair_two_id', $user_pair_ids);
		})->get();
		return count($doubles->merge($singles)->values()) ? $doubles->merge($singles)->values()[0] : null;

	}

	/*
     * E-mail confirmed users a reminder about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function participants_reminder($event_id, $recipients, $email_object, $sender){

		$this->send_email('participants-reminder', $event_id, $recipients, $email_object, $sender);

	}

	/*
     * E-mail users who have not responded to a RSVP
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function not_responded_participants($event_id, $recipients, $email_object, $sender){

		$this->send_email('potential-participants', $event_id, $recipients, $email_object, $sender);

	}

	/*
     * E-mail waitlisted users about an event
     *
     * @param	int		 $event_id					ID of event
	 * @param	array	 $recipients				Users to send invite to
	 * @param	string	 $custom_message			Custom message to go along with e-mail
	 * @param	object	 $sender					Info about the user initiating the e-mail
     *
     * @return  void
     *
     */
	public function waitlisted_participants($event_id, $recipients, $email_object, $sender){

		$this->send_email('waitlisted-participants', $event_id, $recipients, $email_object, $sender);

	}

	/*
     * RSVPs user for an event
     *
     * @param	string		 $token					Token to use to RSVP
     * @param	string		 $preferred_start_time	Start time user is requesting
     * @param	string		 $action	            Which action is being rsvped
     * @param	int		     $action_id	            Value used by action
	 *
     * @return  mixed
     *
     */
	public function rsvp($token, $preferred_start_time, $action, $action_id){

		if(RsvpToken::where('token', '=', $token)->exists()){
			$result = RsvpToken::where('token', '=', $token)->first();
            if($action === 'challenge'){
                return $this->rsvp_challenge($result, $preferred_start_time, $action_id);
            }
            else{
                return $this->rsvp_participant($result, $preferred_start_time);
            }
		}
		else{
			return false;
		}

	}

}