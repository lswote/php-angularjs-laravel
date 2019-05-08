<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model{

    // Name of our database table
    protected $table = 'events';

    // Columns that are mass assignable
    protected $fillable = ['facility_id', 'name', 'activity_id', 'event_type', 'event_sub_type', 'type_of_play', 'rounds', 'num_of_playoff_rounds',
						   'rounds_interval_metric', 'rounds_interval', 'women_sitting_per_round', 'men_sitting_per_round',
						   'standard_line_duration', 'gender_type', 'team_assignment_method', 'participant_charge', 'charge_cc', 'comb_play', 'image_url',
						   'start_date', 'start_time', 'teams_per_line', 'singles_only', 'single_women_lines', 'single_men_lines', 'max_playing_surfaces', 'ranked', 'sets',
						   'line_scoring_format', 'num_of_start_times', 'standard_line_duration', 'for_membership_type', 'for_age_type', 'for_active', 'started', 'completed',
						   'num_of_teams', 'notes'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['facility_id', 'name', 'activity_id', 'event_type', 'event_sub_type', 'type_of_play', 'rounds', 'num_of_playoff_rounds',
									 'rounds_interval_metric', 'rounds_interval', 'women_sitting_per_round', 'men_sitting_per_round', 'standard_line_duration', 'gender_type',
									 'team_assignment_method', 'participant_charge', 'charge_cc', 'comb_play', 'image_url', 'start_date',
									 'start_time', 'teams_per_line', 'singles_only', 'single_women_lines', 'single_men_lines', 'max_playing_surfaces', 'ranked', 'sets',
									 'line_scoring_format', 'num_of_start_times', 'standard_line_duration', 'for_membership_type', 'for_age_type', 'for_active', 'started', 'completed',
									 'num_of_teams', 'notes', 'created_at', 'updated_at', 'id'];

    // Custom column returned with gets
    protected $appends = array('start_date_formatted');

    // Return start date in Mar 11, 18 format
    public function getStartDateFormattedAttribute(){

    	return date('M j, y', strtotime($this->start_date));

	}

    // Defines the relationship between this table and the facilities table
    public function facilities(){

        return $this->belongsTo('App\Models\Facility', 'facility_id');

    }

    // Defines the relationship between this table and the registration_tokens table
    public function registration_tokens(){

    	return $this->hasMany('App\Models\Event', 'event_id');

	}

	// Defines the relationship between this table and the users table
	public function users(){

		return $this->belongsToMany('App\Models\User', 'user_event')->withPivot('confirmed', 'waitlisted', 'substitute', 'unavailable', 'preferred_start_time',
																				'singles_ladder_ranking', 'wild', 'receive_daily_summary', 'rsvped');

	}

	// Defines the relationship between this table and the users table using the user_event_leader table
	public function event_leaders(){

		return $this->belongsToMany('App\Models\User', 'user_event_leader');

	}

	// Defines the relationship between this table and the lines table
	public function lines(){

    	return $this->hasMany('App\Models\Line', 'event_id');

	}

	// Defines the relationship between this table and the event_do_not_match_teams table
	public function event_do_not_match_teams(){

    	return $this->hasMany('App\Models\EventDoNotMatchTeam', 'event_id');

	}

	// Defines the relationship between this table and the rsvp_tokens table
    public function rsvp_tokens(){

    	return $this->hasMany('App\Models\RsvpToken', 'event_id');

	}

	// Defines the relationship between this table and the facility surfaces table
    public function facility_surfaces(){

    	return $this->belongsToMany('App\Models\FacilitySurface', 'event_facility_surface')->withPivot('event_surface_number', 'emergency_surface');

	}

    // Defines the relationship between this table and the challenges table
    public function challenges(){

        return $this->hasMany('App\Models\Challenge', 'event_id');

    }

    // Defines the relationship between this table and the event_rules table
    public function event_rules(){

        return $this->hasMany('App\Models\EventRule', 'event_id');

    }

    // Defines the relationship between this table and the activities table
    public function activities(){

    	return $this->belongsTo('App\Models\Activity', 'activity_id');

	}

	// Defines the relationship between this table and the event_teams table
    public function event_teams(){

        return $this->hasMany('App\Models\EventTeam', 'event_id');

    }

	// Defines the relationship between this table and the event_team_users table
    public function event_team_users(){

        return $this->hasMany('App\Models\EventTeamUser', 'event_id');

    }

    // Defines the relationship between this table and the event_team_sub_assignments table
    public function event_team_sub_assignments(){

        return $this->hasMany('App\Models\EventTeamSubAssignment', 'event_id');

    }

    // Defines the relationship between this table and the event_to_dos table
    public function event_to_dos(){

        return $this->hasMany('App\Models\EventToDo', 'event_id');

    }

}