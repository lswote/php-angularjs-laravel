<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventTeam extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'event_teams';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'name'];

    // Our fillable columns plus the created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'name', 'created_at', 'updated_at', 'id'];

	// Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the event_team_users table
    public function event_team_users(){

        return $this->hasMany('App\Models\EventTeamUser', 'event_team_id');

    }

     // Defines the relationship between this table and the matches table through the event_team_one_id column
	public function match_team_one(){

		return $this->hasMany('App\Models\Match', 'event_team_one_id');

	}

	// Defines the relationship between this table and the matches table through the event_team_two_id column
	public function match_team_two(){

		return $this->hasMany('App\Models\Match', 'event_team_two_id');

	}

	// Defines the relationship between this table and the matches table through the event_team_three_id column
	public function match_team_three(){

		return $this->hasMany('App\Models\Match', 'event_team_three_id');

	}

	// Defines the relationship between this table and the matches table through the event_team_four_id column
	public function match_team_four(){

		return $this->hasMany('App\Models\Match', 'event_team_four_id');

	}

	// Defines the relationship between this table and the matches table through the event_team_five_id column
	public function match_team_five(){

		return $this->hasMany('App\Models\Match', 'event_team_five_id');

	}

	// Defines the relationship between this table and the event_team_sub_assignments table
    public function event_team_sub_assignments(){

        return $this->hasMany('App\Models\EventTeamSubAssignment', 'event_team_id');

    }

}