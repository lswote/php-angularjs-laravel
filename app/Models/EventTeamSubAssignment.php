<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTeamSubAssignment extends Model{

    // Name of our database table
    protected $table = 'event_team_sub_assignments';

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'event_team_id', 'event_team_user_availability_id'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'event_team_id', 'event_team_user_availability_id', 'created_at', 'updated_at', 'id'];

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the event_teams table
    public function event_teams(){

        return $this->belongsTo('App\Models\EventTeam', 'event_team_id');

    }

    // Defines the relationship between this table and the event_team_user_availabilities table
    public function event_team_user_availabilities(){

    	return $this->belongsTo('App\Models\EventTeamUserAvailability', 'event_team_user_availability_id');

	}

}