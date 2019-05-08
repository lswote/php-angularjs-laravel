<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Match extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'matches';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'round', 'date', 'event_team_one_id', 'event_team_two_id', 'event_team_one_score', 'event_team_two_score', 'winning_team_id',
						   'multi_opponent_facility_id', 'home_away'];

    // Our fillable columns plus created_at, updated_at, and ID columns
	public static $search_columns = ['event_id', 'round', 'date', 'event_team_one_id', 'event_team_two_id', 'event_team_one_score', 'event_team_two_score', 'winning_team_id',
									 'multi_opponent_facility_id', 'home_away', 'created_at', 'updated_at', 'id'];

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the event_teams table through the event_team_one_id column
    public function team_one(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_one_id');

	}

	// Defines the relationship between this table and the event_teams table through the event_team_two_id column
    public function team_two(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_two_id');

	}

	// Defines the relationship between this table and the event_teams table through the event_team_three_id column
    public function team_three(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_three_id');

	}

	// Defines the relationship between this table and the event_teams table through the event_team_four_id column
    public function team_four(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_four_id');

	}

	// Defines the relationship between this table and the event_teams table through the event_team_five_id column
    public function team_five(){

    	return $this->belongsTo('App\Models\EventTeam', 'event_team_five_id');

	}

	// Defines the relationship between this table and the Multi Opponent Facility table through the multi_opponent_facility_id column
    public function multi_opponent_facility(){

    	return $this->belongsTo('App\Models\MultiOpponentFacility', 'multi_opponent_facility_id');

	}

	// Defines the relationship between this table and lines table
	public function lines(){

    	return $this->hasMany('App\Models\Line', 'match_id');

	}

}