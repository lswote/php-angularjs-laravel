<?php

namespace App\Interfaces;

interface EventRuleInterface{

    /*
     * Creates a new set of rules for an event in event_rules table
     *
     * @param   int      $user_id                   ID of user creating a set of rules for an event
     * @param   int 	 $event_id				    ID of our event
     * @param 	int 	 $num_sets				    No. of "sets" for each challenge
     * @param   int      $num_challenges            No. of total challenges allowed
     * @param   int      $num_opp_challenges        No. of opponent challenges allowed
     * @oaram   int      $num_team_challenges       No. of challenges a player/team can issue
     * @param   int      $num_spots_up              No. of spots can challenge up
     * @param   int      $num_spots_down            No. of spots can challenge down
     * @param   boolean  $allow_challenge_next      Allow to challenge "next in line"
     * @oaran   string   $switch_or_jump            Switch (S) or Jump Above (J) if lower ranked team wins
     * @oaram   boolean  $deny_challenge_rank       Does denying a challenge result in change in ranking
     * @param   boolean  $deny_accept_rank          Does not accepting challenge result in change in ranking
	 * @param   boolean  $withdrawal_rank           Does withdrawal after accepting result in change in ranking
     * @param   boolean  $accept_not_played_rank    Does accepting and not playing result in change in ranking
     * @param   int      $days_accept_challenge     Days to accept a challenge
     * @param   int      $days_play_challenge       Days to play a challenge before it expires
     * @param   int      $days_after_completed      Days after a completed challenge before issuing a new challenge
     *
     * @return int
     *
     */
    public function create($user_id, $event_id, $default_values_flag, $num_sets = null, $num_challenges = null, $num_opp_challenges = null, $num_team_challenges = null,
                           $num_spots_up = null, $num_spots_down = null, $allow_challenge_next = null, $switch_or_jump = null, $deny_challenge_rank = null, $deny_accept_rank = null,
                           $withdrawal_rank = null, $accept_not_played_rank = null, $days_accept_challenge = null, $days_play_challenge = null, $days_after_completed = null);


    /*
     * Make updates to rules for an event
     *
     * @param   int      $user_id                   ID of user creating a set of rules for an event
     * @param   int 	 $event_id				    ID of our event
     * @param 	int 	 $num_sets				    No. of "sets" for each challenge
     * @param   int      $num_challenges            No. of total challenges allowed
     * @param   int      $num_opp_challenges        No. of opponent challenges allowed
     * @oaram   int      $num_team_challenges       No. of challenges a player/team can issue
     * @param   int      $num_spots_up              No. of spots can challenge up
     * @param   int      $num_spots_down            No. of spots can challenge down
     * @param   boolean  $allow_challenge_next      Allow to challenge "next in line"
     * @oaran   string   $switch_or_jump            Switch (S) or Jump Above (J) if lower ranked team wins
     * @oaram   boolean  $deny_challenge_rank       Does denying a challenge result in change in ranking
     * @param   boolean  $deny_accept_rank          Does not accepting challenge result in change in ranking
	 * @param   boolean  $withdrawal_rank           Does withdrawal after accepting result in change in ranking
     * @param   boolean  $accept_not_played_rank    Does accepting and not playing result in change in ranking
     * @param   int      $days_accept_challenge     Days to accept a challenge
     * @param   int      $days_play_challenge       Days to play a challenge before it expires
     * @param   int      $days_after_completed      Days after a completed challenge before issuing a new challenge
     *
     * @return void
     *
     */
    public function update($user_id, $event_id, $num_sets, $num_challenges, $num_opp_challenges, $num_team_challenges, $num_spots_up, $num_spots_down, $allow_challenge_next,
                           $switch_or_jump, $deny_challenge_rank, $deny_accept_rank, $withdrawal_rank, $accept_not_played_rank, $days_accept_challenge, $days_play_challenge,
                           $days_after_completed);

     /*
      * Get rules for an event
      *
      * @param int $event_id    ID of our event
      *
      * @return collection
      *
      */
     public function get($event_id);

}