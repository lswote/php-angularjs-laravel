<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model{

    // Name of our database table
    protected $table = 'activities';

    // Columns that are mass assignable
    protected $fillable = ['name', 'two_teams_per_line', 'three_teams_per_line', 'four_teams_per_line', 'five_teams_per_line', 'doubles', 'competition_scoring_format',
						   'line_scoring_format', 'point', 'surface_type', 'line_type'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['name', 'two_teams_per_line', 'three_teams_per_line', 'four_teams_per_line', 'five_teams_per_line', 'doubles', 'competition_scoring_format',
						   			 'line_scoring_format', 'point', 'surface_type', 'line_type', 'created_at', 'updated_at', 'id'];


    // Defines the relationship between this table and the facilities table
	public function facilities(){

		return $this->belongsToMany('App\Models\Facility', 'activity_facility')->withPivot('two_teams_per_line', 'three_teams_per_line', 'four_teams_per_line',
																						   'five_teams_per_line', 'doubles', 'competition_scoring_format', 'line_scoring_format',
																						   'point', 'surface_type', 'line_type', 'num_of_surfaces', 'next_event_date',
																						   'next_event_type');

	}

	// Defines the relationship between this table and the users table
	public function users(){

		return $this->belongsToMany('App\Models\User', 'user_activity')->withPivot('facility_id', 'skill_level', 'ranking');

	}

	// Defines the relationship between this table and the events table
	public function events(){

		return $this->hasMany('App\Models\Event', 'activity_id');

	}

}