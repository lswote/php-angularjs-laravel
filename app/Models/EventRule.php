<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class EventRule extends Model{


    // Name of our database table
    protected $table = 'event_rules';


    // Columns that are mass assignable
    protected $fillable = ['event_id', 'num_sets', 'num_challenges', 'num_opp_challenges', 'num_team_challenges', 'num_spots_up', 'num_spots_down', 'allow_challenge_next',
						   'switch_or_jump', 'deny_challenge_rank', 'deny_accept_rank', 'withdrawal_rank', 'accept_not_played_rank', 'days_accept_challenge', 'days_play_challenge',
						   'days_after_completed'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'num_sets', 'num_challenges', 'num_opp_challenges', 'num_team_challenges', 'num_spots_up', 'num_spots_down', 'allow_challenge_next', 'switch_or_jump', 'deny_challenge_rank',
        							 'deny_accept_rank', 'withdrawal_rank', 'accept_not_played_rank', 'days_accept_challenge', 'days_play_challenge', 'days_after_completed', 'created_at', 'updated_at', 'id'];


    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

}