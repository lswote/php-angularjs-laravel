<?php

namespace App\Repositories;

use App\Interfaces\ReportInterface;
use App\Interfaces\EmailInterface;
use App\Interfaces\EventInterface;
use App\Interfaces\LadderEventInterface;
use App\Models\Event;
use App\Models\User;
use App\Models\Challenge;

class ReportRepository implements ReportInterface{

	private $email, $events, $ladder_events;

	public function __construct(EmailInterface $email, EventInterface $events, LadderEventInterface $ladder_events){

		$this->email = $email;
		$this->events = $events;
		$this->ladder_events = $ladder_events;

	}

	/*
	 * Get ladder summary report
	 *
	 * @param	date	 $date					Date to make report for
	 * @param	int		 $event_id				ID of event
	 * @param	int		 $user_id				ID of person receiving report
	 * @param	int		 $days					Number days to include in report
	 *
	 * @return  boolean
	 *
	 */
	public function generate_ladder_summary_report($event_id, $user_id, $days=1){

		// report will run in early morning so all timezones can finish their
		// day, but it will then run for the days previous as specified by $days
		date_default_timezone_set('America/New_York');
		$date = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-$days, date("Y")));

		$event_leaders = $this->events->get_leaders($event_id);
		// if event leader, make them the sender
		if(count($event_leaders) > 0){ 
			$sender = $event_leaders[0];
		}
		// otherwise use first user (probably facility leader)
		else{
			$sender = User::find(1);
		}
		// define user recipents for a single user
		if($user_id){
			$recipients = array($user_id);
		}
		// define user recipents for facility leader and event leader
		else{
			// send to event leader if defined
			if(count($event_leaders) > 0){ 
				$leaders = array($event_leaders[0]->id);
			}
			// otherwise send to facility leader
			else{
			    // couldn't get orWherePivot to work inside a function, which was necessary since the where privilege = 'facility leader' would be wiped out 
			    // by the orWherePivot, so I just did a merge of two wherePivot calls
			    $leaders = array_merge(Event::find($event_id)->users()->where('privilege','=','facility leader')->wherePivot('receive_daily_summary','=',1)->pluck('id')->ToArray(),
								       Event::find($event_id)->users()->where('privilege','=','facility leader')->wherePivot('receive_daily_summary','=',null)->pluck('id')->ToArray());
			}
			$recipients = array_unique(array_merge($leaders, Event::find($event_id)->users()->wherePivot('receive_daily_summary','=',1)->pluck('id')->ToArray()));
		}

		// process any completed challenges updated today
		$report = array('results' => '', 'accepted' => '', 'unaccepted' => '');
		$challenges = $this->ladder_events->get_challenge_data(Challenge::where('event_id','=',$event_id)->where('played_date','!=',null)->whereDate('updated_at', '>=', $date)->get());
		$results = array();
		foreach($challenges as $challenge){
			if($challenge['event_sub_type'] === 'singles'){
				if($challenge['winner'] === $challenge['challenger_id']){
					$winner =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
					$loser =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
				}
				else{
					$winner =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
					$loser =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
				}
			}
			else{ // ($challenge['event_sub_type'] === 'doubles')
				if($challenge['winner'] === $challenge['challenger_id']){
					$winner = $challenge['challenger'][0]['last_name'] . '/' .  $challenge['challenger'][1]['last_name'];
					$loser = $challenge['challengee'][0]['last_name'] . '/' .  $challenge['challengee'][1]['last_name'];
				}
				else{
					$winner = $challenge['challengee'][0]['last_name'] . '/' .  $challenge['challengee'][1]['last_name'];
					$loser = $challenge['challenger'][0]['last_name'] . '/' .  $challenge['challenger'][1]['last_name'];
				}
			}
			$scores = array();
			foreach($challenge['matches'] as $match){
				if($match['pair_one_score'] == $match['pair_two_score']){
					break;
				}
				if($challenge['winner'] == $challenge['challenger_id']){
					array_push($scores, $match['pair_one_score'].'-'.$match['pair_two_score']);
				}
				else{
					array_push($scores, $match['pair_two_score'].'-'.$match['pair_one_score']);
				}
			}
			$score = join(',', $scores);
			array_push($results, sprintf("%s: %s def. %s %s\n", $challenge['played_date'], $winner, $loser, $score));
		}
		sort($results);
		$report['results'] = join('', $results);

		// process any accepted challenges updated today
		$challenges = $this->ladder_events->get_challenge_data(Challenge::where('event_id','=',$event_id)->where('played_date','=',null)->where('accepted_date','!=',null)->whereDate('updated_at', '>=', $date)->get());
		$accepted = array();
		foreach($challenges as $challenge){
			if($challenge['event_sub_type'] === 'singles'){
				$challenger =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
				$challengee =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
			}
			else{ // ($challenge['event_sub_type'] === 'doubles')
				$challenger = $challenge['challenger'][0]['last_name'] . '/' .  $challenge['challenger'][1]['last_name'];
				$challengee = $challenge['challengee'][0]['last_name'] . '/' .  $challenge['challengee'][1]['last_name'];
			}
			array_push($accepted, sprintf("#%s %s vs #%s %s\n", $challenge['challenger_ranking'], $challenger, $challenge['challengee_ranking'], $challengee));
		}
		sort($accepted);
		$report['accepted'] = join('', $accepted);

		// process any unaccepted challenges updated today
		$challenges = $this->ladder_events->get_challenge_data(Challenge::where('event_id','=',$event_id)->where('played_date','=',null)->where('accepted_date','=',null)->where('responded','=',0)->whereDate('updated_at', '>=', $date)->get());
		$unaccepted = array();
		foreach($challenges as $challenge){
			if($challenge['event_sub_type'] === 'singles'){
				$challenger =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
				$challengee =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
			}
			else{ // ($challenge['event_sub_type'] === 'doubles')
				$challenger = $challenge['challenger'][0]['last_name'] . '/' .  $challenge['challenger'][1]['last_name'];
				$challengee = $challenge['challengee'][0]['last_name'] . '/' .  $challenge['challengee'][1]['last_name'];
			}
			array_push($unaccepted, sprintf("#%s %s vs #%s %s\n", $challenge['challenger_ranking'], $challenger, $challenge['challengee_ranking'], $challengee));
		}
		sort($unaccepted);
		$report['unaccepted'] = join('', $unaccepted);

		// email the report to recipients
		if(count($recipients) > 0 && ($report['results'] != '' || $report['accepted'] != '' || $report['accepted'] != '')){
			$today = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-1, date("Y")));
			if($date === $today){
				$report_date = $date;
			}
			else{
				$report_date = $date . ' to ' . $today;
			}
			$this->email->send_challenge_daily_report($event_id, $report_date, $recipients, $report, $sender);
		}

	}

	/*
	 * Process summary reports
	 *
	 * @param	array 	$events				Array of events
	 * @param	int		 $user_id			ID of person receiving report
	 *
	 * @return  boolean
	 *
	 */
	public function process_summary_reports($events, $user_id, $days=0){

		foreach($events as $event){
			if($event->event_type === 'ladder' && $event->started === 1 && $event->completed === 0){
				$this->generate_ladder_summary_report($event->id, $user_id, $days); 
			}
		}
	}

	/*
	 * Get ladder summary report
	 *
	 * @param	int		 $event_id				ID of event
	 * @param	int		 $user_id				ID of person receiving report
	 * @param	int		 $days					Number days to include in report
	 *
	 * @return  boolean
	 *
	 */
    public function get_ladder_summary_report($event_id, $user_id, $days){

		$this->generate_ladder_summary_report($event_id, $user_id, $days);
		return true;

	}

	/*
	 * Process expirations
	 *
	 * @param	array 	$events				Array of events
	 * @param	int		 $user_id			ID of person receiving report
	 *
	 * @return  boolean
	 *
	 */
	public function process_expirations($events, $user_id){

		// report will run in early morning so all timezones can finish their
		// day, but it will then run for the day before
		date_default_timezone_set('America/New_York');
		$today = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-1, date("Y")));
		$in_three_days = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-1+3, date("Y")));
		$in_five_days = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-1+5, date("Y")));
		foreach($events as $event){
			if($event->event_type === 'ladder' && $event->started === 1 && $event->completed === 0){
				$event_leaders = $this->events->get_leaders($event->id);
				if(count($event_leaders) > 0){
					$user = $event_leaders[0];
				}
				else
				{
					$user = User::find(1);
				}
				$rule = $event->event_rules()->first();
				$challenges = $this->ladder_events->get_challenges($event['id'], 0);
				foreach($challenges as $challenge){
					if(($challenge['accepted_date'] === null) && ($challenge['accept_by_date'] <= $today)){
						$recipients = array();
						if($challenge['event_sub_type'] === 'singles'){
							$user['challenger'] =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
							$user['challengee'] =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
							array_push($recipients, $challenge['challenger']['id']);
							array_push($recipients, $challenge['challengee']['id']);
						}
						else{ // ($challenge['event_sub_type'] === 'doubles')
							$user['challenger'] =  $challenge['challenger'][0]['first_name'].' '.$challenge['challenger'][0]['last_name'] . '/' .
												   $challenge['challenger'][1]['first_name'].' '.$challenge['challenger'][1]['last_name'];
							$user['challengee'] =  $challenge['challengee'][0]['first_name'].' '.$challenge['challengee'][0]['last_name'] . '/' .
												   $challenge['challengee'][1]['first_name'].' '.$challenge['challengee'][1]['last_name'];
							array_push($recipients, $challenge['challenger'][0]['id']);
							array_push($recipients, $challenge['challenger'][1]['id']);
							array_push($recipients, $challenge['challengee'][0]['id']);
							array_push($recipients, $challenge['challengee'][1]['id']);
						}
						$this->email->notify_challenge_update($event->id, $recipients, ' has been been cancelled because the challenge was not accepted in the allowed timeframe', $user);
						if($rule->deny_accept_rank === 1){
							$this->ladder_events->improve_participant_rating($event->id, $challenge['challenger_id'], $challenge['challengee_id']);
						}
						$challenge['winner'] = $challenge['challenger_id'];
						$challenge['matches'] = array();
						$challenge['match_status'] = 'forfeit';
						$challenge['played_date'] = $today;
						$this->ladder_events->update_challenge($challenge);
					}
					else if(($challenge['accepted_date'] === null) && ($challenge['accept_by_date'] === $in_three_days)){
						$recipients = array();
						if($challenge['event_sub_type'] === 'singles'){
							$user['challenger'] =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
							$user['challengee'] =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
							array_push($recipients, $challenge['challengee']['id']);
						}
						else{ // ($challenge['event_sub_type'] === 'doubles')
							$user['challenger'] =  $challenge['challenger'][0]['first_name'].' '.$challenge['challenger'][0]['last_name'] . '/' .
												   $challenge['challenger'][1]['first_name'].' '.$challenge['challenger'][1]['last_name'];
							$user['challengee'] =  $challenge['challengee'][0]['first_name'].' '.$challenge['challengee'][0]['last_name'] . '/' .
												   $challenge['challengee'][1]['first_name'].' '.$challenge['challengee'][1]['last_name'];
							array_push($recipients, $challenge['challengee'][0]['id']);
							array_push($recipients, $challenge['challengee'][1]['id']);
						}
						$user['action_id'] =  $challenge['id'];
						$this->email->notify_challenge_update($event->id, $recipients, ' must be accepted or denied within the next three days', $user);
					}
					else if(($challenge['accepted_date'] !== null) && ($challenge['played_date'] === null) && ($challenge['play_by_date'] <= $today)){
						$recipients = array();
						if($challenge['event_sub_type'] === 'singles'){
							$user['challenger'] =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
							$user['challengee'] =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
							array_push($recipients, $challenge['challenger']['id']);
							array_push($recipients, $challenge['challengee']['id']);
						}
						else{ // ($challenge['event_sub_type'] === 'doubles')
							$user['challenger'] =  $challenge['challenger'][0]['first_name'].' '.$challenge['challenger'][0]['last_name'] . '/' .
												   $challenge['challenger'][1]['first_name'].' '.$challenge['challenger'][1]['last_name'];
							$user['challengee'] =  $challenge['challengee'][0]['first_name'].' '.$challenge['challengee'][0]['last_name'] . '/' .
												   $challenge['challengee'][1]['first_name'].' '.$challenge['challengee'][1]['last_name'];
							array_push($recipients, $challenge['challenger'][0]['id']);
							array_push($recipients, $challenge['challenger'][1]['id']);
							array_push($recipients, $challenge['challengee'][0]['id']);
							array_push($recipients, $challenge['challengee'][1]['id']);
						}
						$this->email->notify_challenge_update($event->id, $recipients, ' has expired because the challenge was not played in the allowed timeframe', $user);
						if($rule->accept_not_played_rank === 1){
							$this->ladder_events->improve_participant_rating($event->id, $challenge['challenger_id'], $challenge['challengee_id']);
						}
						$challenge['winner'] = $challenge['challenger_id'];
						$challenge['matches'] = array();
						$challenge['match_status'] = 'forfeit';
						$challenge['played_date'] = $today;
						$this->ladder_events->update_challenge($challenge);
					}
					else if(($challenge['accepted_date'] !== null) && ($challenge['played_date'] === null) && ($challenge['play_by_date'] === $in_five_days)){
						$recipients = array();
						if($challenge['event_sub_type'] === 'singles'){
							$user['challenger'] =  $challenge['challenger']['first_name'].' '.$challenge['challenger']['last_name'];
							$user['challengee'] =  $challenge['challengee']['first_name'].' '.$challenge['challengee']['last_name'];
							array_push($recipients, $challenge['challenger']['id']);
							array_push($recipients, $challenge['challengee']['id']);
						}
						else{ // ($challenge['event_sub_type'] === 'doubles')
							$user['challenger'] =  $challenge['challenger'][0]['first_name'].' '.$challenge['challenger'][0]['last_name'] . '/' .
												   $challenge['challenger'][1]['first_name'].' '.$challenge['challenger'][1]['last_name'];
							$user['challengee'] =  $challenge['challengee'][0]['first_name'].' '.$challenge['challengee'][0]['last_name'] . '/' .
												   $challenge['challengee'][1]['first_name'].' '.$challenge['challengee'][1]['last_name'];
							array_push($recipients, $challenge['challenger'][0]['id']);
							array_push($recipients, $challenge['challenger'][1]['id']);
							array_push($recipients, $challenge['challengee'][0]['id']);
							array_push($recipients, $challenge['challengee'][1]['id']);
						}
						$this->email->notify_challenge_update($event->id, $recipients, ' must be played within the next five days', $user);
					}
				}
			}
		}
	}

}