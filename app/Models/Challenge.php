<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Challenge extends Model{



    // Name of our database table
    protected $table = 'challenges';


    // Columns that are mass assignable
    protected $fillable = ['event_id', 'challenger_id', 'challengee_id', 'challenge_date', 'accept_by_date',
        'accepted_date', 'play_by_date', 'played_date', 'responded', 'line_id', 'result_status'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['challenger_id', 'challengee_id', 'challenge_date', 'accept_by_date',
        'accepted_date', 'play_by_date', 'played_date', 'responded', 'line_id', 'result_status', 'created_at', 'updated_at', 'id'];


    // Defines the relationship between this table and the events table through event_id
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table the users table through challenger_id
    public function challenger(){

        return $this->belongsTo('App\Models\User', 'challenger_id');

    }

    // Defines the relationship between this table the users table through challengee_id
    public function challengee(){

        return $this->belongsTo('App\Models\User', 'challengee_id');

    }

    // Defines the relationship between this table the users table through lines table
    public function line(){

        return $this->belongsTo('App\Models\Line', 'line_id');

    }

}
