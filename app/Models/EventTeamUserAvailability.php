<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTeamUserAvailability extends Model{

    // Name of our database table
    protected $table = 'event_team_user_availability';

    // Columns that are mass assignable
    protected $fillable = ['event_team_user_id', 'round', 'date', 'status', 'line_id'];

    // Our fillable columns plus the created_at, updated_at, and ID columns
    public static $search_columns = ['event_team_user_id', 'round', 'date', 'status', 'line_id', 'created_at', 'updated_at', 'id'];

	// Defines the relationship between this table and the event_team_users table
    public function event_team_users(){

        return $this->belongsTo('App\Models\EventTeamUser', 'event_team_user_id');

    }

    // Defines the relationship between this table and the lines table
    public function lines(){

    	return $this->belongsTo('App\Models\Line', 'line_id');

	}

	// Defines the relationship between this table and the event_team_sub_assignments table
    public function event_team_sub_assignments(){

    	return $this->hasMany('App\Models\EventTeamSubAssignment', 'event_team_user_availability_id');

	}

}