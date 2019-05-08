<?php

namespace App\Repositories;

use App\Interfaces\LadderEventInterface;
use App\Interfaces\EventInterface;
use App\Interfaces\LineInterface;
use App\Interfaces\EventRuleInterface;
use App\Models\Event;
use App\Models\User;
use App\Models\RsvpToken;
use App\Models\Line;
use App\Models\LineScore;
use App\Models\Pair;
use App\Models\Challenge;
use Illuminate\Support\Facades\DB;

class LadderEventRepository implements LadderEventInterface{

	private $events, $lines, $rules;

	public function __construct(EventInterface $events, LineInterface $lines, EventRuleInterface $rules){

		$this->events = $events;
		$this->lines = $lines;
		$this->rules = $rules;

	}

	// Check whether a challenge associated with a pair exists
	private function in_challenge($event_id, $pair_id){

		return (Challenge::where('event_id', '=', $event_id)->where('result_status','=','')->where(function($query)use($pair_id){
            $query->where('challenger_id', '=', $pair_id)->orWhere('challengee_id', '=', $pair_id);
        })->get()->count() > 0);

	}

	/*
	 * Gets participant data
	 *
	 * @param	int			$event_id		Event to get data from
	 * @param	array		$users			Users to gather data for
	 *
	 * @return  collection
	 *
	 */
    private function get_participant_data($event_id, $users){

		foreach($users as $user){
            $user['total_challenger'] = Challenge::where('event_id','=',$event_id)->where('played_date','=',null)->where('challenger_id', '=', $user->id)->get()->count();
            $user['total_challengee'] = Challenge::where('event_id','=',$event_id)->where('played_date','=',null)->where('challengee_id', '=', $user->id)->get()->count();
			$user['singles_ladder_ranking'] = $user->pivot->singles_ladder_ranking;
			$user['wild'] = $user->pivot->wild;
			$user['in_challenge'] = $this->in_challenge($event_id, $user->id);
            $user['wins'] = Line::where('event_id','=',$event_id)->where('winning_pair_id', '=', $user->id)->get()->count();
            $user['loses'] = Line::where('event_id','=',$event_id)->where(function($query) use ($user){
                $query->where('pair_one_id', '=', $user->id)->orWhere('pair_two_id','=',$user->id);
            })->where('winning_pair_id', '!=', $user->id)->get()->count();
		}

	}

	/*
     * Get all users confirmed for an event
     *
     * @param 	int	 	$id				ID of event to look up
     *
     * @return  collection
     *
     */
	public function get_available_participants($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('confirmed','=',1)->wherePivot('unavailable', '=', 0);
			}
		))->find($id);
		$this->get_participant_data($id, $event->users);
		return $event->users;

	}

	/*
     * Gets all withdrawn participants for a specific event.  Withdrawn participants 
     * have confirmed but are unavailable.  They have not dropped
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $user_id				User ID to narrow results to
	 *
     * @return  boolean
     *
     */
	public function get_withdrawn_participants($id, $user_id){

		return Event::with(array(
            'users' => function($query) use ($user_id){
                if($user_id){
				    $query->wherePivot('user_id','=',$user_id)->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 1);
                }
                else{
				    $query->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 1);
                }
			}
		))->find($id);

	}

	/*
     * Returns a withdrawn participant
     *
	 * @param	int		 $id					ID of event
     * @param	int	     $participant_id	    ID of participant being returned
	 *
     * @return  boolean
     *
     */
    public function return_participant($id, $participant_id){

		$event = Event::find($id);
        $participants = $event->users()->wherePivot('singles_ladder_ranking', '>', 0)->orderBy('singles_ladder_ranking')->get();
		$count = count($participants);
        if($count > 0){
            $ladder_ranking = $participants[$count-1]->pivot->singles_ladder_ranking+1;
        }
        else{
            $ladder_ranking = 1;
        }
		$event->users()->updateExistingPivot($participant_id, array(
		    'unavailable' => 0,
		    'singles_ladder_ranking' => $ladder_ranking
		));
        return true;

	}

	/*
     * Withdraw a participant for an event
     *
	 * @param	int 	 $event_id				Id of event
	 * @param	int 	 $user_id				Id of participant withdrawing
	 * @param	string 	 $withdraw_type			Withdraw type 
	 *
     * @return  collection
     *
     */
	public function withdraw_participant($event_id, $user_id, $withdraw_type){
    
		$event = Event::find($event_id);
        if($event->event_sub_type === 'singles'){
            $challenges = Challenge::where('event_id', '=', $event_id)->where(function($query) use ($user_id){
                $query->where('challenger_id', '=', $user_id)->orWhere('challengee_id', '=', $user_id);
            });

            // data about users affected by deleted challenges
            $user_data = array('event_sub_type' => 'singles',
                               'challenges' => array());
            foreach($challenges->get() as $challenge){
                $data = array('challenge_id' => $challenge->id,
                              'challenger' => User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $challenge->challenger_id)->first()->toArray(),
                              'challengee' => User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $challenge->challengee_id)->first()->toArray());
                array_push($user_data['challenges'], $data);
            }
        }
        else{
            // find the pairs this user is in
    		$user_pairs = Pair::where('event_id', '=', $event_id)->where(function($query) use ($user_id){
    			$query->where('user_one_id', '=', $user_id)->orWhere('user_two_id', '=', $user_id);
    		})->get();
    
            // find all the challenges these pairs are in
    		$challenges = Challenge::where('event_id', '=', $event_id)->where(function($query) use ($user_pairs){
                $pair_ids = $user_pairs->pluck('id')->toArray();  
    			$query->whereIn('challenger_id', $pair_ids)->orWhereIn('challengee_id', $pair_ids);
    		});
    
            // data about users affected by deleted challenges
            $user_data = array('event_sub_type' => 'doubles',
                               'challenges' => array());
            foreach($challenges->get() as $challenge){
                $data = array('challenge_id' => $challenge->id);
                $pairs = Pair::find($challenge->challenger_id);
                $data['challenger']  = array('pair_id' => $pairs->id,
                                             'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs->user_one_id)->first()->toArray(),
                                                              User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs->user_two_id)->first()->toArray()));
                $pairs = Pair::find($challenge->challengee_id);
                $data['challengee']  = array('pair_id' => $pairs->id,
                                             'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs->user_one_id)->first()->toArray(),
                                                              User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs->user_two_id)->first()->toArray()));
                array_push($user_data['challenges'], $data);
            }

            // update pairs user was in to reflect withdrawal type (dropped or out)
            foreach($user_pairs as $pair){
		        $pair->update(array(
			        'status' => $withdraw_type,
			        'ladder_ranking' => 0
				));
			}
            // now re-number the pairs that are still active
            $rankings = Pair::where('event_id','=',$event_id)->where('ladder_ranking','>',0)->orderBy('ladder_ranking')->get();
            for ($i = 0; $i < count($rankings); $i++){
		        $rankings[$i]->update(array(
			        'ladder_ranking' => $i + 1
                ));
            }
        }


        // delete the challenges
        if($challenges->exists() && ($challenges->get()->count() > 0)){
            foreach($challenges->get() as $challenge){
                $this->delete_challenge($challenge->id);
            }
        }

        // update user information
        if($withdraw_type === 'dropped'){
		    $event->users()->updateExistingPivot($user_id, array(
			    'confirmed' => 0,
			    'unavailable' => 1,
			    'singles_ladder_ranking' => 0
		    ));
        }
        else if($withdraw_type === 'out'){
		    $event->users()->updateExistingPivot($user_id, array(
			    'unavailable' => 1,
			    'singles_ladder_ranking' => 0
		    ));
        }

        // re-number user rankings
        $rankings = $event->users()->wherePivot('singles_ladder_ranking','>',0)->orderBy('singles_ladder_ranking')->get();
        for ($i = 0; $i < count($rankings); $i++){
		    $event->users()->updateExistingPivot($rankings[$i]->id, array(
			    'singles_ladder_ranking' => $i + 1
            ));
        }

        // return information about affected participants
        return $user_data;
	}

	/*
     * Creates a challenge record 
     *
	 * @param	int		 $id					            ID of event
     * @param   string   $challenger_id                     Challenger id
     * @param   string   $challengee_id                     Challengee id
     * @param   string   $complete_challenge_flag           Flag indicating
     *                                                      if challenge can be
     *                                                      completed without emailing
     *                                                      challengee
	 *
     * @return  boolean
     *
     */
	public function add_challenge($id, $user_id, $challenger_id, $challengee_id, $complete_challenge_flag){

        // First see if there are any active challengs
		if(Challenge::where('event_id', '=', $id)->where('challenger_id', '=', $challenger_id)->where('challengee_id','=',$challengee_id)->where('played_date','=',null)->get()->count() ||
		   Challenge::where('event_id', '=', $id)->where('challenger_id', '=', $challengee_id)->where('challengee_id','=',$challenger_id)->where('played_date','=',null)->get()->count()){
            return array('id' => -1, 'error' => "Challenge already exists");
        }
        else{
            $event = Event::find($id);
            // Temporary routine until requiring event rule definition is in place
            if($event->event_rules()->get()->count() === 0){
                $this->rules->create($user_id, $id, 1);
            }
            $rule = $event->event_rules()->first();
			$played_challenges = Challenge::where('event_id', '=', $id)->where('played_date','!=',null)->where(function($query) use ($challenger_id, $challengee_id){
				$query->where(function($query) use ($challenger_id, $challengee_id){
					$query->where('challenger_id', '=', $challenger_id)->where('challengee_id','=',$challengee_id);
				})->orWhere(function($query) use ($challenger_id, $challengee_id){
					$query->where('challenger_id', '=', $challengee_id)->where('challengee_id','=',$challenger_id);
				});
			})->get();
			$last_allowed_completed = date('Y-m-d', strtotime(date('Y-m-d', time()). ' - ' . $rule->days_after_completed . ' day'));
			foreach($played_challenges as $played_challenge){
				if($played_challenge->played_date >= $last_allowed_completed){
					return array('id' => -1, 'error' => "Challenge too soon after last completed challenge");
				}
			}
            if($event->event_sub_type === 'singles'){
			    $data = $event->users()->select('user_id as id','singles_ladder_ranking as ladder_ranking')->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 0)->orderBy('singles_ladder_ranking')->get()->toArray();
                $challenger_ranking = $event->users()->find($challenger_id)->pivot->singles_ladder_ranking;
                $challengee_ranking = $event->users()->find($challengee_id)->pivot->singles_ladder_ranking;
            }
            else{
		        $data= Pair::select('id','ladder_ranking')->where('event_id', '=', $id)->orderBy('ladder_ranking')->get()->toArray();
                $challenger_ranking = Pair::find($challenger_id)->ladder_ranking;
                $challengee_ranking = Pair::find($challengee_id)->ladder_ranking;
            }

            // see who is involved in active challenges
            $rankings = array();
            $ids = array();
            for ($i = 0; $i < count($data); $i++){
                $challenger = Challenge::where('event_id','=',$id)->where('responded','=',1)->where('played_date','=',null)->where('challenger_id', '=', $data[$i]['id'])->get()->count();
                $opponent = Challenge::where('event_id','=',$id)->where('responded','=',1)->where('played_date','=',null)->where('challengee_id', '=', $data[$i]['id'])->get()->count();
                $total = $challenger+$opponent;

                // save rank and number of active challenges
                $rankings[$data[$i]['ladder_ranking']] = array('total' => $total, 'challenger' => $challenger, 'opponent' => $opponent);
                $ids[$data[$i]['id']] = array('total' => $total, 'challenger' => $challenger, 'opponent' => $opponent);
            }

            // check to see it the challenge is within num_spots_up
            if($challenger_ranking - $rule->num_spots_up > $challengee_ranking){
                // if the challenge is out of bounds see if there is an exceptiion because there weren't any open spots
                if($rule->allow_challenge_next){
                    for ($i = $challenger_ranking-$rule->num_spots_up; $i > $challengee_ranking; $i--){
                        // if anybody at a ranking between the challenger's
                        // number of spots down allowed and the challengee's
                        // spot is not in a challenge, fail the challenge
                        // as the challengee is not the next available spot
                        if($rankings[$i]['total'] == 0){
                            return array('id' => -1, 'error' => "Opponent ranking is higher than the number of spots up the challenge can be issued");
                        }
                    }
                }
                else{
                    return array('id' => -1, 'error' => "Opponent ranking is higher than the number of spots up the challenge can be issued");
                }
            }

            // check to see it the challenge is within num_spots_down
            if($challenger_ranking + $rule->num_spots_down < $challengee_ranking){
                // if the challenge is out of bounds see if there is an exceptiion because there weren't any open spots
                if($rule->allow_challenge_next){
                    for ($i = $challenger_ranking+$rule->num_spots_down; $i < $challengee_ranking; $i++){
                        // if anybody at a ranking between the challenger's
                        // number of spots up allowed and the challengee's
                        // spot is not in a challenge, fail the challenge
                        // as the challengee is not the next available spot
                        if($rankings[$i]['total'] == 0){
                            return array('id' => -1, 'error' => "Opponent ranking is lower than the number of spots down the challenge can be issued");
                        }
                    }
                }
                else{
                    return array('id' => -1, 'error' => "Opponent ranking is lower than the number of spots down the challenge can be issued");
                }
            }

            if($ids[$challenger_id]['challenger'] >= $rule->num_team_challenges){
                return array('id' => -1, 'error' => "The number of challenges that can be issued has reach the maximum allowed in the rules");
            }

            if($ids[$challengee_id]['opponent'] >= $rule->num_opp_challenges){
                return array('id' => -1, 'error' => "The number of challenges that the opponent can be involved in has reach the maximum allowed in the rules");
            }

		    $line = Line::create(array(
			    'event_id' => $id,
			    'line_type' => $event->event_sub_type,
			    'pair_one_id' => $challenger_id,
			    'pair_two_id' => $challengee_id
		    ));
            $rule = $event->event_rules()->first();
		    $challenge = Challenge::create(array(
			    'event_id' => $id,
			    'challenger_id' => $challenger_id,
			    'challengee_id' => $challengee_id,
                'challenge_date' => DB::raw('CURRENT_TIMESTAMP()'),
                'accept_by_date' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' . $rule->days_accept_challenge . ' DAY)'),
                'play_by_date' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' . $rule->days_play_challenge . ' DAY)'),
			    'line_id' => $line->id
            ));
            // this finishes the challenge creation process without emailing
            // the challengee
            if($complete_challenge_flag){
                $this->challenge_response($id, $challenge->id, "available");
            }
            return array('id' => $challenge->id);
	    }

	}

	/*
     * Resets a challenge record 
     *
	 * @param	int		 $id					            ID of event
     * @param   string   $challenge_id                      Challenge id
	 *
     * @return  boolean
     *
     */
	public function reset_challenge($id, $challenge_id){

        $challenge = Challenge::find($challenge_id);
        if($challenge){
            foreach($challenge->line()->first()->line_scores()->pluck('set_number')->ToArray() as $i){
                $line_score = $challenge->line()->first()->line_scores()->where('set_number','=',$i);
                $line_score->update(array('pair_two_score' => null,
                                          'pair_one_score' => null
                                   ));
            }
            $challenge->line()->first()->update(array('winning_pair_id' => null));
	        $event = Event::find($challenge->event_id);
            $rule = $event->event_rules()->first();
            if($challenge->responded === 0){
                $challenge->update(array('challenge_date' => DB::raw('CURRENT_TIMESTAMP()'),
                                         'accept_by_date' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' . $rule->days_accept_challenge . ' DAY)'),
                                         'accepted_date' => null));
            }
            else {
                $challenge->update(array('accepted_date' => DB::raw('CURRENT_TIMESTAMP()'),
                                         'play_by_date' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' . $rule->days_play_challenge . ' DAY)'),
                                         'played_date' => null,
                                         'result_status' => ''));
            }
            return true;
        }
        else{
            return false;
        }

	}

	/*
     * Upgrades a participant ranking based on second participant
     *
     * @param   int $event_id              Event id
     * @param   int $participant1_id       Participant1 id
     * @param   int $participant2_id       Participant2 id
	 *
     */
    public function improve_participant_rating($event_id, $participant1_id, $participant2_id){

	   $event = Event::find($event_id);
       $rule = $event->event_rules()->first();
       if($event->event_sub_type === 'singles'){
            $participant1 = $event->users()->find($participant1_id);
            $participant2 = $event->users()->find($participant2_id);
            if ($participant2->pivot->singles_ladder_ranking < $participant1->pivot->singles_ladder_ranking){
                $updated_participants = array();
                if($rule->switch_or_jump == 's'){
                    $participant1_ranking = $participant1->pivot->singles_ladder_ranking;
                    $participant1->ladder_ranking = $participant2->pivot->singles_ladder_ranking;
                    array_push($updated_participants, $participant1);
                    $participant2->ladder_ranking = $participant1_ranking;
                    array_push($updated_participants, $participant2);
                }
                else{
                    $participants = $event->users()->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 0)->orderBy('singles_ladder_ranking')->get();
                    $participant1_ranking = $participant1->pivot->singles_ladder_ranking;
                    $participant2_ranking = $participant2->pivot->singles_ladder_ranking;
                    for($i = 0; $i < $participants->count(); $i++){
                        // this moves everyone down a slot including participant1 except participant2
                        // until the spot before where the participant2 is
                        if(($participants[$i]->pivot->singles_ladder_ranking < $participant1_ranking) &&
                           ($participants[$i]->pivot->singles_ladder_ranking >= $participant2_ranking)){
                            $participants[$i]->ladder_ranking = $participants[$i+1]->pivot->singles_ladder_ranking;
                            array_push($updated_participants, $participants[$i]);
                        }
                    }
                    // now move participant2 to participant1's old spot
                    $participant1->ladder_ranking = $participant2_ranking;
                    array_push($updated_participants, $participant1);
                }
                $this->update_participants($event->id, $updated_participants);
            }
       }
       else{ // ($event->event_sub_type === 'doubles')
            $participant1 = $this->get_pair($participant1_id);
            $participant2 = $this->get_pair($participant2_id);
            if ($participant2->ladder_ranking < $participant1->ladder_ranking){
                $updated_pairs = array();
                if($rule->switch_or_jump == 's'){
                    $participant1_ranking = $participant1->ladder_ranking;
                    $participant1->ladder_ranking = $participant2->ladder_ranking;
                    array_push($updated_pairs, $participant1);
                    $participant2->ladder_ranking = $participant1_ranking;
                    array_push($updated_pairs, $participant2);
                }
                else{ // switch_or_jump == 'j'
                    $pairs = Pair::where('event_id', '=', $event->id)->where('status','=',null)->orderBy('ladder_ranking')->get();
                    $participant1_ranking = $participant1->ladder_ranking;
                    $participant2_ranking = $participant2->ladder_ranking;
                    for($i = 0; $i < $pairs->count(); $i++){
                        // this moves everyone down a slot including participant2 except participant1
                        // until the spot before where the participant1 is
                        if(($pairs[$i]->ladder_ranking < $participant1_ranking) &&
                           ($pairs[$i]->ladder_ranking >= $participant2_ranking)){
                            $pairs[$i]->ladder_ranking = $pairs[$i+1]->ladder_ranking;
                            array_push($updated_pairs, $pairs[$i]);
                        }
                    }
                    // now move participant1 to participant2's old spot
                    $participant1->ladder_ranking = $participant2_ranking;
                    array_push($updated_pairs, $participant1);
                }
                $this->update_pairs($updated_pairs);
            }
        }
        
    }

	/*
     * Updates a challenge record 
     *
     * @param   collection  $challengee_data    Updated data
	 *
     * @return  boolean
     *
     */
	public function update_challenge($challenge_data){

        $challenge = Challenge::find($challenge_data['id']);
	    $event = Event::find($challenge->event_id);
        $rule = $event->event_rules()->first();
        for($i = 0; $i < count($challenge_data['matches']); $i++){
            $record = $challenge_data['matches'][$i];
            $line_score = $challenge->line()->first()->line_scores()->where('set_number','=',$i+1);
            if($line_score->get()->count() === 0){
                $line_score = LineScore::create(array('line_id' => $challenge->line_id,
                                                      'set_number' => $i+1));
            }
            // did this in reverse order so that if a record is just created
            // and wouldn't have value filled in, it fills it in normal
            // order by default
            if($challenge_data['winner'] == $challenge->challengee_id){
                $line_score->update(array('pair_two_score' => $record['one'],
                                          'pair_one_score' => $record['two']
                                     ));
            }
            else{
                $line_score->update(array('pair_one_score' => $record['one'],
                                          'pair_two_score' => $record['two']
                                     ));
            }
            if($challenge_data['winner'] == $challenge->challengee_id){
                $this->improve_participant_rating($challenge->event_id, $challenge->challengee_id, $challenge->challenger_id);
            }
            else{ // ($challenge_data['winner'] == $challenge->challenger_id)
                $this->improve_participant_rating($challenge->event_id, $challenge->challenger_id, $challenge->challengee_id);
            }

        }
        // set responded to reflect that any match that has scores 
        $challenge_update = array('played_date' => $challenge_data['played_date'],
                                  'result_status' => $challenge_data['match_status']);
        if($challenge_data['responded'] == 0){
            $challenge_update['responded'] = 1;
            $challenge_update['accepted_date'] = DB::raw('CURRENT_TIMESTAMP()');
        }
        $challenge->update($challenge_update);
        $challenge->line()->first()->update(array('winning_pair_id' => $challenge_data['winner']));
        return true;

	}

	/*
     * Gets challenge data
     *
	 * @param	array		 $challenges		Challenges to gather data from
	 *
     * @return  collection
     *
     */
    public function get_challenge_data($challenges){
		$matching_challenges = array();
        if(count($challenges) > 0){
		    foreach($challenges as $challenge){
                $event = Event::find($challenge->event_id);
                if($event->event_type !== 'ladder'){
                    continue;
                }
                $rule = $event->event_rules()->first();
                if($event->event_sub_type === 'singles'){
                    $challenger = $challenge->challenger()->first();
                    $challenger_ranking = $challenger['ladder_ranking'] = $event->users()->find($challenger->id)->pivot->singles_ladder_ranking;
                    $challengee = $challenge->challengee()->first();
                    $challengee_ranking = $challengee['ladder_ranking'] = $event->users()->find($challengee->id)->pivot->singles_ladder_ranking;
                }
                else {
					$pair = $this->get_pair($challenge->challenger_id);
					$challenger_ranking = $pair->ladder_ranking;
                    $pair->user_one['ladder_ranking'] = $event->users()->find($pair->user_one->id)->pivot->singles_ladder_ranking;
                    $pair->user_two['ladder_ranking'] = $event->users()->find($pair->user_two->id)->pivot->singles_ladder_ranking;
                    $challenger = array($pair->user_one,
                                        $pair->user_two);
                    $pair = $this->get_pair($challenge->challengee_id);
					$challengee_ranking = $pair->ladder_ranking;
                    $pair->user_one['ladder_ranking'] = $event->users()->find($pair->user_one->id)->pivot->singles_ladder_ranking;
                    $pair->user_two['ladder_ranking'] = $event->users()->find($pair->user_two->id)->pivot->singles_ladder_ranking;
                    $challengee = array($pair->user_one,
                                        $pair->user_two);
                }
                //temporary patch until all canned data has lines
                if($challenge->line_id === null){
		            $line = Line::create(array(
			            'event_id' => $id,
			            'line_type' => $event->event_sub_type,
			            'pair_one_id' => $challenger_id,
			            'pair_two_id' => $challengee_id
                    ));
                    $challenge->line_id = $line->id;
                }
                $winner = $challenge->line()->first()->winning_pair_id;
                $matches = $challenge->line()->first()->line_scores()->get()->ToArray(); 
			    array_push($matching_challenges,
                           array('id' => $challenge->id,
                                 'event_id' =>  $challenge->event_id,
                                 'event_sub_type' => $event->event_sub_type,
                                 'challenger' => $challenger,
                                 'challenger_id' => $challenge->challenger_id,
                                 'challenger_ranking' => $challenger_ranking,
                                 'challengee' => $challengee,
                                 'challengee_id' => $challenge->challengee_id,
                                 'challengee_ranking' => $challengee_ranking,
                                 'challenge_date' => $challenge->challenge_date,
                                 'accept_by_date' => $challenge->accept_by_date,
                                 'accepted_date' => $challenge->accepted_date,
                                 'play_by_date' => $challenge->play_by_date,
                                 'played_date' => $challenge->played_date,
                                 'num_sets' => $rule->num_sets,
                                 'matches' => $matches,
                                 'winner' => $winner,
                                 'result_status' => $challenge->result_status,
                                 'responded' => $challenge->responded,
                                 'updated_at' => $challenge->updated_at));
            }
        }
        return $matching_challenges;
    }

	/*
     * Gets a challenge record for an event_id and optional challenge participant id
     *
	 * @param	int		 $event_id			ID of event
	 * @param	int		 $participant_id	ID of challenge participant
	 *
     * @return  collection
     *$event->event_sub_type
     */
	public function get_challenges($event_id, $participant_id){

        $query = Challenge::where('event_id', '=', $event_id);
        if($participant_id){
	        $event = Event::find($event_id);
            if($event->event_sub_type === 'singles'){
                $challenges = $query->where('challenger_id','=',$participant_id)->get();
            }
            else{
                $challenges = array();
		        foreach($query->get() as $challenge){
                    $challenger_pair = $this->get_pair($challenge->challenger_id);
                    if (($challenger_pair->user_one->id == $participant_id) ||
                        ($challenger_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                }
            }
        }
        else{
            $challenges = $query->get();
        }
        return $this->get_challenge_data($challenges);

	}

	/*
     * Gets all accepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $participant_id		ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_accepted_challenges($event_id, $participant_id){

        $query = Challenge::where('event_id', '=', $event_id)->where('responded', '=', 1)->where('accepted_date', '!=', null);
        if($participant_id){
	        $event = Event::find($event_id);
            if($event->event_sub_type === 'singles'){
                $challenges = $query->where('challenger_id','=',$participant_id)->get();
            }
            else{
                $challenges = array();
		        foreach($query->get() as $challenge){
                    $challenger_pair = $this->get_pair($challenge->challenger_id);
                    if (($challenger_pair->user_one->id == $participant_id) ||
                        ($challenger_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                }
            }
        }
        else{
            $challenges = $query->get();
        }
        return $this->get_challenge_data($challenges);

	}

	/*
     * Gets all unplayed challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $participant_id		ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_unplayed_challenges($event_id, $participant_id){

        $query = Challenge::where('event_id', '=', $event_id)->where('responded', '=', 1)->where('accepted_date', '!=', null)->where('played_date', '=', null);
        if($participant_id){
	        $event = Event::find($event_id);
            if($event->event_sub_type === 'singles'){
                $challenges = $query->where(function($query) use ($participant_id){
                    $query->where('challenger_id','=',$participant_id)->orWhere('challengee_id','=',$participant_id);
                })->get();
            }
            else{
                $challenges = array();
		        foreach($query->get() as $challenge){
                    $challenger_pair = $this->get_pair($challenge->challenger_id);
                    if (($challenger_pair->user_one->id == $participant_id) ||
                        ($challenger_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                    $challengee_pair = $this->get_pair($challenge->challengee_id);
                    if (($challengee_pair->user_one->id == $participant_id) ||
                        ($challengee_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                }
            }
        }
        else{
            $challenges = $query->get();
        }
        return $this->get_challenge_data($challenges);

	}

	/*
     * Gets all played challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $participant_id		ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_played_challenges($event_id, $participant_id){

        $query = Challenge::where('event_id', '=', $event_id)->where('played_date', '!=', null);
        if($participant_id){
	        $event = Event::find($event_id);
            if($event->event_sub_type === 'singles'){
                $challenges = $query->where(function($query) use ($participant_id){
                    $query->where('challenger_id','=',$participant_id)->orWhere('challengee_id','=',$participant_id);
                })->get();
            }
            else{
                $challenges = array();
		        foreach($query->get() as $challenge){
                    $challenger_pair = $this->get_pair($challenge->challenger_id);
                    if (($challenger_pair->user_one->id == $participant_id) ||
                        ($challenger_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                    $challengee_pair = $this->get_pair($challenge->challengee_id);
                    if (($challengee_pair->user_one->id == $participant_id) ||
                        ($challengee_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                }
            }
        }
        else{
            $challenges = $query->get();
        }
        return $this->get_challenge_data($challenges);

	}

	/*
     * Gets all unaccepted challenges for a specific event
     *
	 * @param	int		 $id					ID of event
	 * @param	int		 $participant_id		ID data is restricted to
	 *
     * @return  collection
     *
     */
	public function get_unaccepted_challenges($event_id, $participant_id){

        $query = Challenge::where('event_id', '=', $event_id)->where('responded', '=', 0)->where('accepted_date', '=', null);
        if($participant_id){
	        $event = Event::find($event_id);
            if($event->event_sub_type === 'singles'){
                $challenges = $query->where(function($query) use ($participant_id){
                    $query->where('challenger_id','=',$participant_id)->orWhere('challengee_id','=',$participant_id);
                })->get();
            }
            else{
                $challenges = array();
		        foreach($query->get() as $challenge){
                    $challenger_pair = $this->get_pair($challenge->challenger_id);
                    if (($challenger_pair->user_one->id == $participant_id) ||
                        ($challenger_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                    $challengee_pair = $this->get_pair($challenge->challengee_id);
                    if (($challengee_pair->user_one->id == $participant_id) ||
                        ($challengee_pair->user_two->id == $participant_id)){
                        array_push($challenges, $challenge);
                    }
                }
            }
        }
        else{
            $challenges = $query->get();
        }
        return $this->get_challenge_data($challenges);

	}

	/*
     * Deletes specific challenge
     *
	 * @param	int		 $challenge_id			ID of challenge
	 *
     * @return  collection
     *
     */
	public function delete_challenge($id){

        $user_data = array();
		$challenge = Challenge::find($id);
        if($challenge){
            // first delete the lines & lines_scores records if they exists
            if($challenge->line_id){
                $challenge->line()->first()->line_scores()->delete();
                $challenge->line()->first()->forceDelete();
            }
		    $event = Event::find($challenge->event_id);
            if($event->event_sub_type === 'singles'){
                $user_data['event_sub_type'] = 'singles';
                $data = array('challenge_id' => $challenge->id,
                              'challenger' => User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $challenge->challenger_id)->first()->toArray(),
                              'challengee' => User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $challenge->challengee_id)->first()->toArray());
                $user_data['challenge'] = $data;
            }
            else{
                $user_data['event_sub_type'] = 'doubles';
                $data = array('challenge_id' => $challenge->id);
                $pairs = Pair::where('id', '=', $challenge->challenger_id)->get();
                $data['challenger']  = array('pair_id' => $pairs[0]->id,
                                             'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_one_id)->first()->toArray(),
                                                              User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_two_id)->first()->toArray()));
                $pairs = Pair::where('id', '=', $challenge->challengee_id)->get();
                $data['challengee']  = array('pair_id' => $pairs[0]->id,
                                             'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_one_id)->first()->toArray(),
                                                              User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_two_id)->first()->toArray()));
                $user_data['challenge'] = $data;
            }
            $challenge->delete();
        }
        return $user_data;

	}

	/*
     * Records the responses to challenge requests
     *
	 * @param	int		$event_id			    Event ID
	 * @param	array	$responses              Challenge response data
     *
     */
    public function challenge_responses($event_id, $responses){

        foreach($responses as $response){
            $this->challenge_response($event_id, $response['challenge_id'], $response['preferred_start_time']);
        }
        return true;

    }

	/*
     * Records the response to a challenge request
     *
	 * @param	int		$event_id			    Event ID
	 * @param	int		$challenge_id			ID of challenge
	 * @param	string	$preferred_start_time	Flag marking accept/deny
     *
     * @return  boolean
     *
     */
    public function challenge_response($event_id, $challenge_id, $preferred_start_time){

        $challenge = Challenge::find($challenge_id);
        if($preferred_start_time === 'unavailable'){
            $challenge->update(array('responded' => 1));
        }
        else{
		    $event = Event::find($challenge->event_id);
            $rule = $event->event_rules()->first();
            if($challenge->line()->first()->line_scores()->get()->count() < $rule->num_sets){
                for ($i = 0; $i < $rule->num_sets; $i++){
                    LineScore::create(array('line_id' => $challenge->line_id,
                                            'set_number' => $i+1));
                }
            }

            $challenge->update(array('accepted_date' => DB::raw('CURRENT_TIMESTAMP()'),
                                     'play_by_date' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ' . $rule->days_play_challenge . ' DAY)'),
                                     'responded' => 1
                                 ));
            // get the challenge again to get the play_by_date
            $challenge = Challenge::find($challenge_id);
        }
        return true;

	}

	/*
     * Gets specific challenge
     *
     * @param 	string	$token		RSVP token
	 * @param	int		 $id		ID of challenge
	 *
     * @return  collection
     *
     */
	public function get_challenge_by_rsvp_token($token, $id){

		$result = RsvpToken::where('token', '=', $token);
		if($result->exists()){
            $challenges = Challenge::where('id', '=', $id)->get();
            if(count($challenges) > 0){
                return $this->get_challenge_data($challenges)[0];
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }

	}

	/*
     * Creates a pair record of two users
     *
	 * @param	int		 $id					ID of event
     * @param	int	     $user_id1	            User 1 id
     * @param	int	     $user_id2	            User 2 id
	 *
     * @return  boolean
     *
     */
	public function add_pair($id, $user_id1, $user_id2){

		$pairs = Pair::where('event_id', '=', $id)->where('ladder_ranking','>',0)->orderBy('ladder_ranking')->get();
		$count = $pairs->count();
        if($count > 0){
            $ladder_ranking = $pairs[$count-1]->ladder_ranking+1;
		}
		else{
			$ladder_ranking = 1;
		}
		if(Pair::where('event_id', '=', $id)->where('user_one_id', '=', $user_id1)->where('user_two_id','=',$user_id2)->get()->count() ||
		   Pair::where('event_id', '=', $id)->where('user_one_id', '=', $user_id2)->where('user_two_id','=',$user_id1)->get()->count()){
            return 'Pair exists';
        }
        else{
		    $pair = Pair::create(array(
			    'event_id' => $id,
			    'user_one_id' => $user_id1,
			    'user_two_id' => $user_id2,
			    'ladder_ranking' => $ladder_ranking
		    ));
            return true;
	    }

	}

	/*
     * Returns a withdrawn pair
     *
	 * @param	int		 $id					ID of event
     * @param	int	     $pair_id	            ID of pair being returned
	 *
     * @return  boolean
     *
     */
    public function return_pair($id, $pair_id){

        $pairs = Pair::where('event_id', '=', $id)->where('ladder_ranking','>',0)->orderBy('ladder_ranking')->get();
        $count = $pairs->count();
        if($count > 0){
            $ladder_ranking = $pairs[$count-1]->ladder_ranking+1;
        }
        else{
            $ladder_ranking = 1;
        }
		$pair = Pair::find($pair_id);
		$pair->update(array(
		    'status' => null,
		    'ladder_ranking' => $ladder_ranking
        ));

        $event = Event::find($id);
        foreach(array($pair->user_one_id, $pair->user_two_id) as $participant_id){
            if(($event->users()->find($participant_id)->pivot->confirmed === 1) && ($event->users()->find($participant_id)->pivot->unavailable === 1)){
                $this->return_participant($pair->event_id, $participant_id);
            }
        }

        return true;

	}

	/*
	 * Updates pair data
	 *
	 * @param	collection	$pair_data		Users update fields
	 *
	 * @return  boolean
	 *
	 */
    public function update_pairs($pair_data){

        foreach($pair_data as $data){
            $pair = Pair::find(intval($data['id']));
            $pair->update(array(
			    'ladder_ranking' => intval($data['ladder_ranking'])
		    ));
        }
        return true;

    }

	/*
	 * Gets extra pairs data
	 *
	 * @param	collection	$pair_data		Pairs
	 *
	 * @return  collection  $pair_data      Update pairs
	 *
	 */
	private function get_pairs_data($pairs){

        foreach($pairs as $pair){
            $pair['total_challenger'] = Challenge::where('event_id','=',$pair->event_id)->where('played_date','=',null)->where('challenger_id', '=', $pair->id)->get()->count();
            $pair['total_challengee'] = Challenge::where('event_id','=',$pair->event_id)->where('played_date','=',null)->where('challengee_id', '=', $pair->id)->get()->count();
		    $pair['user_one'] = User::find($pair->user_one_id);
		    $pair['user_two'] = User::find($pair->user_two_id);
            $pair['wins'] = Line::where('event_id','=',$pair->event_id)->where('winning_pair_id', '=', $pair->id)->get()->count();
            $pair['loses'] = Line::where('event_id','=',$pair->event_id)->where(function($query) use ($pair){
                $query->where('pair_one_id', '=', $pair->id)->orWhere('pair_two_id','=',$pair->id);
            })->where('winning_pair_id', '!=', $pair->id)->get()->count();
		    $pair['in_challenge'] = $this->in_challenge($pair->event_id, $pair->id);
		}
        return $pairs;

    }

	/*
     * Gets all undropped pairs for a specific event
     *
	 * @param	int		 $id					ID of event
	 *
     * @return  collection
     *
     */
    public function get_pairs($id){

        $pairs = Pair::where('event_id', '=', $id)->where(function($query){
            $query->where('status', '=', null)->orWhere('status', '!=', 'Dropped')->orderBy('ladder_ranking');
        })->get();
        return $this->get_pairs_data($pairs);

    }

	/*
     * Gets all active pairs for a specific event
     *
	 * @param	int		 $id					ID of event
	 *
     * @return  collection
     *
     */
	public function get_active_pairs($id){

        $pairs = Pair::where('event_id', '=', $id)->where('status', '=', null)->orderBy('ladder_ranking')->get();
        return $this->get_pairs_data($pairs);

    }


	/*
     * Gets get specific pair
     *
	 * @param	int		 $id					ID of pair
	 *
     * @return  collection
     *
     */
	public function get_pair($id){

        $pair = Pair::find($id);
        if($pair){
            $pair['user_one'] = User::find($pair->user_one_id);
            $pair['user_two'] = User::find($pair->user_two_id);
        }
        return $pair;

	}

	/*
     * Withdraw pairs for an event
     *
	 * @param	int		 $event_id				ID of event pairs are in
	 * @param	array	 $pair_ids			    IDs of pairs to be withdrawn
	 * @param	string 	 $withdraw_type			Withdraw type 
	 *
     * @return  boolean
     *
     */
	public function withdraw_pairs($event_id, $pair_ids, $withdraw_type){

        // find all the challenges these pairs are in
		$challenges = Challenge::where('event_id', '=', $event_id)->where(function($query) use ($pair_ids){
			$query->whereIn('challenger_id', $pair_ids)->orWhereIn('challengee_id', $pair_ids);
		});

        // data about users affected by deleted challenges
        $user_data = array('event_sub_type' => 'doubles',
                           'challenges' => array());
        foreach($challenges->get() as $challenge){
            $data = array('challenge_id' => $challenge->id);
            $pairs = Pair::where('id', '=', $challenge->challenger_id)->get();
            $data['challenger']  = array('pair_id' => $pairs[0]->id,
                                         'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_one_id)->first()->toArray(),
                                                          User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_two_id)->first()->toArray())
                                        );
            $pairs = Pair::where('id', '=', $challenge->challengee_id)->get();
            $data['challengee']  = array('pair_id' => $pairs[0]->id,
                                         'users' => array(User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_one_id)->first()->toArray(),
                                                          User::select('id', 'first_name', 'last_name', 'email')->where('id', '=', $pairs[0]->user_two_id)->first()->toArray()));
            array_push($user_data['challenges'], $data);
        }

        // delete the challenges
        if($challenges->exists() && count($challenges) > 0){
            $challenges->delete();
        }

        // update pairs user was in to reflect withdrawal type (dropped or out)
        $pairs = Pair::whereIn('id', $pair_ids)->get();
        foreach($pairs as $pair){
            $pair->update(array(
                'status' => $withdraw_type,
                'ladder_ranking' => 0
            ));
        }

        // re-number rankings
        $rankings = Pair::where('event_id','=',$event_id)->where('ladder_ranking','>',0)->orderBy('ladder_ranking')->get();
        for ($i = 0; $i < count($rankings); $i++){
            $rankings[$i]->update(array(
                'ladder_ranking' => $i + 1
            ));
        }

        // return information about affected participants
        return $user_data;

    }

	/*
     * Withdraw pairs for an event
     *
	 * @param	int		 $event_id				ID of event pairs are in
	 * @param	int 	 $user_id			    User to get pairs for
	 *
     * @return  boolean
     *
     */
    public function get_withdrawn_pairs($event_id, $user_id){
		$query = Pair::where('event_id', '=', $event_id)->where('status', '=', 'out')->orderBy('ladder_ranking');
        if($user_id){
		    $pairs = $query->where(function($query1) use ($user_id){
			    $query1->where('user_one_id', '=', $user_id)->orWhere('user_two_id', '=', $user_id);
            })->get();
        }
        else{
            $pairs = $query->get();
        }
        return $this->get_pairs_data($pairs);
    }

	/*
     * Gets user settings
     *
	 * @param	int		 $event_id				ID of event
	 * @param	int 	 $user_id			    User ID
	 *
     * @return  array    $settings              User settings
     *
     */
    public function get_user_settings($event_id, $user_id){

		$users = Event::find($event_id)->users()->where('user_id','=',$user_id)->get();
		if($users->count() > 0){
			$receive_daily_summary = $users->first()->pivot->receive_daily_summary;
		}
		else{
			$receive_daily_summary = null;
		}
        if(is_null($receive_daily_summary)){
            if(User::find($user_id)->privilege == 'facility leader'){
                // facility leaders who haven't defined their
                // receive_daily_summary setting default to 1
                $receive_daily_summary = 1;
            }
            else{
                // participants who haven't defined their
                // receive_daily_summary setting default to 0
                $receive_daily_summary = 0;
            }
        }
        return array('receive_daily_summary' => $receive_daily_summary);

    }

	/*
     * Sets user settings
     *
	 * @param	int		 $event_id				ID of event
	 * @param	int 	 $user_id			    User ID
	 * @param	array 	 $settings			    User settings
	 *
     * @return  boolean
     *
     */
    public function set_user_settings($event_id, $user_id, $settings){

        $event = Event::find($event_id);
		$users = $event->users()->where('user_id','=',$user_id)->get();
		// check to see if the user is part of the ladder
		if($users->count() == 0){
			// if the user is a facility leader that is not a part of the ladder,
			// create a disabled user event record to store the 
			// receive_daily_summary setting
			if(User::find($user_id)->privilege == 'facility leader'){
				$user_data = array(
					'confirmed' => 0,
					'unavailable' => 1,
					'rsvped' => DB::raw('CURRENT_TIMESTAMP()'),
					'receive_daily_summary' => $settings['receive_daily_summary']
				);
				$event->users()->sync(array(
					$user_id => $user_data
				), false);
        		return true;
			}
			else{
				return false;
			}
		}
		else{
			$event->users()->updateExistingPivot($user_id, array(
		    	'receive_daily_summary' => $settings['receive_daily_summary']
			));
        	return true;
		}

    }

	/*
     * Returns all do not match team requests for an event
     *
	 * @param	int		 $id					ID of event
     *
     * @return  collection
     *
     */
	public function do_not_match_teams($id){

		$event = Event::with('event_do_not_match_teams.pair_one', 'event_do_not_match_teams.pair_two')->find($id);
		return $event->event_do_not_match_teams;

	}

	/*
	 * Gets participant data
	 *
	 * @param	int			$event_id		Event data is for
	 * @param	collection	$user_data		Users update fields
	 *
	 * @return  boolean
	 *
	 */
    public function update_participants($event_id, $user_data){

		$event = Event::find($event_id);
        foreach($user_data as $user){
		    $event->users()->updateExistingPivot(intval($user['id']), array(
			    'singles_ladder_ranking' => intval($user['ladder_ranking'])
		    ));
        }

    }

}