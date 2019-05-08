<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class User extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'users';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that should not be returned on a call
    protected $hidden = ['password'];

    // Columns that are mass assignable
    protected $fillable = ['first_name', 'last_name', 'sex', 'email', 'username', 'phone', 'password', 'room', 'membership_type', 'active', 'age_type', 'member_id',
						   'affilation', 'alta_number', 'receive_email', 'privilege'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['first_name', 'last_name', 'sex', 'email', 'username', 'phone', 'password', 'room', 'membership_type', 'active', 'age_type', 'member_id',
									 'affilation', 'alta_number', 'receive_email', 'privilege', 'created_at', 'updated_at', 'id'];

    // Overwrite morphMany() so we can use custom columns
	public function morphMany($related, $name, $type = null, $id = null, $localKey = null){

		$instance = new $related;
		$table = $instance->getTable();
		$localKey = $localKey ? : $this->getKeyName();
		return new MorphMany($instance->newQuery(), $this, $table . '.' . $type, $table . '.' . $id, $localKey);

    }

    // Defines the relationship between this table and the tokens table
    public function tokens(){

        return $this->hasMany('App\Models\Token', 'user_id');

    }

    // Defines the relationship between this table and the facilities table
    public function facilities(){

    	return $this->belongsToMany('App\Models\Facility', 'user_facility');

	}

	// Defines the relationship between this table and the events table
	public function events(){

		return $this->belongsToMany('App\Models\Event', 'user_event')->withPivot('confirmed', 'waitlisted', 'substitute', 'unavailable', 'preferred_start_time',
																				 'singles_ladder_ranking', 'wild', 'receive_daily_summary', 'rsvped');

	}

	// Defines the relationship between this table and the events table using the user_event_leader table
	public function event_leaders(){

		return $this->belongsToMany('App\Models\Event', 'user_event_leader');

	}

	// Defines the relationship between this table and the facilities table using the user_facility_leader table
	public function facility_leaders(){

		return $this->belongsToMany('App\Models\Facility', 'user_facility_leader');

	}

	// Defines the relationship between this table and the event_do_not_match_teams table through the pair_one_id column
	public function event_do_not_match_pair_one(){

    	return $this->hasMany('App\Models\EventDoNotMatchTeam', 'pair_one_id');

	}

	// Defines the relationship between this table and the event_do_not_match_teams table through the pair_two_id column
	public function event_do_not_match_pair_two(){

    	return $this->hasMany('App\Models\EventDoNotMatchTeam', 'pair_two_id');

	}

	// Returns any do not play request for a team
	public function event_do_not_match_teams(){

    	return $this->pair_one()->merge($this->pair_two());

	}

    // Defines the relationship between this table and the lines table through the pair_one_id column
	public function line_pair_one(){

    	return $this->morphMany('App\Models\Line', null, 'line_type', 'pair_one_id');

	}

	// Defines the relationship between this table and the lines table through the pair_two_id column
	public function line_pair_two(){

    	return $this->morphMany('App\Models\Line', null, 'line_type', 'pair_two_id');

	}

	// Defines the relationship between this table and the lines table through the pair_three_id column
	public function line_pair_three(){

		return $this->hasMany('App\Models\Line', 'pair_three_id');

	}

	// Defines the relationship between this table and the lines table through the pair_four_id column
	public function line_pair_four(){

		return $this->hasMany('App\Models\Line', 'pair_four_id');

	}

	// Defines the relationship between this table and the lines table through the pair_five_id column
	public function line_pair_five(){

		return $this->hasMany('App\Models\Line', 'pair_five_id');

	}

	// Defines the relationship between this table and the rsvp_tokens table
    public function rsvp_tokens(){

    	return $this->hasMany('App\Models\RsvpToken', 'user_id');

	}

	// Defines the relationship between this table and the pairs table through the user_one_id column
	public function pair_user_one(){

		return $this->hasMany('App\Models\Pair', 'user_one_id');

	}

	// Defines the relationship between this table and the pairs table through the user_two_id column
	public function pair_user_two(){

		return $this->hasMany('App\Models\Pair', 'user_two_id');

	}

	// Defines the relationship between this table and the activities table
	public function activities(){

		return $this->belongsToMany('App\Models\Activity', 'user_activity')->withPivot('facility_id', 'skill_level', 'ranking');

	}

	// Defines the relationship between this table and the event_team_users table
	public function event_team_users(){

		return $this->hasMany('App\Models\EventTeamUser', 'user_id');

	}

}
