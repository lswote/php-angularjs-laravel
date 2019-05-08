<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Line extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'lines';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'match_id', 'event_surface_number', 'line_type', 'line_play_type', 'line_play_type_number', 'pair_one_id', 'pair_two_id', 'start_time',
						   'winning_pair_id', 'ranking_updated'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'match_id', 'event_surface_number', 'line_type', 'line_play_type', 'line_play_type_number', 'pair_one_id', 'pair_two_id',
									 'start_time', 'winning_pair_id', 'ranking_updated', 'created_at', 'updated_at', 'id'];

    // Custom column returned with gets
    protected $appends = array('start_time_formatted');

    // Return start time in 4:30 format
    public function getStartTimeFormattedAttribute(){

    	return date('g:i', strtotime($this->start_time));

	}

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the users / pairs table through the pair_one_id column
    public function pair_one(){

    	return $this->morphTo(null, 'line_type', 'pair_one_id');

	}

	// Defines the relationship between this table and the users / pairs table through the pair_two_id column
    public function pair_two(){

    	return $this->morphTo(null, 'line_type', 'pair_two_id');

	}

	// Defines the relationship between this table and the users table through the pair_three_id column
	public function pair_three(){

		return $this->belongsTo('App\Models\User', 'pair_three_id');

	}

	// Defines the relationship between this table and the users table through the pair_four_id column
	public function pair_four(){

		return $this->belongsTo('App\Models\User', 'pair_four_id');

	}

	// Defines the relationship between this table and the users table through the pair_five_id column
	public function pair_five(){

		return $this->belongsTo('App\Models\User', 'pair_five_id');

	}

	// Defines the relationship between this table and line_scores table
	public function line_scores(){

    	return $this->hasMany('App\Models\LineScore', 'line_id');

	}

	// Defines the relationship between this table and matches table
	public function matches(){

    	return $this->belongsTo('App\Models\Match', 'match_id');

	}

	// Defines the relationship between this table and event_team_user_availability table
	public function event_team_user_availability(){

    	return $this->hasMany('App\Models\EventTeamUserAvailability', 'line_id');

	}

}