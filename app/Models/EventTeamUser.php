<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventTeamUser extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'event_team_users';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'event_team_id', 'group_number', 'sex', 'user_id', 'captain'];

    // Our fillable columns plus the created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'event_team_id', 'group_number', 'sex', 'user_id', 'captain', 'created_at', 'updated_at', 'id'];

	// Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the users table
    public function users(){

        return $this->belongsTo('App\Models\User', 'user_id');

    }

    // Defines the relationship between this table and the event_teams table
    public function event_teams(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_id');
    	
	}

	// Defines the relationship between this table and the event_team_user_availability table
    public function event_team_user_availability(){

        return $this->hasMany('App\Models\EventTeamUserAvailability', 'event_team_user_id');

    }

}