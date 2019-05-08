<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facility extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'facilities';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['name', 'image_url', 'disable_image_banner', 'address', 'city', 'state', 'zip', 'paypal_link', 'contract_expiration_date', 'parent_id'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['name', 'image_url', 'disable_image_banner', 'address', 'city', 'state', 'zip', 'paypal_link', 'contract_expiration_date', 'parent_id', 'created_at', 'updated_at', 'id'];

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->hasMany('App\Models\Event', 'facility_id');

    }

    // Defines the relationship between this table and the registration_tokens table
    public function registration_tokens(){

    	return $this->hasMany('App\Models\RegistrationToken', 'facility_id');

	}

	// Defines the relationship between this table and the users table
	public function users(){

		return $this->belongsToMany('App\Models\User', 'user_facility');

	}

	// Defines the relationship between this table and the users table using the user_facility_leader table
	public function facility_leaders(){

		return $this->belongsToMany('App\Models\User', 'user_facility_leader');

	}

	// Defines the relationship between this table and the facility_surfaces table
    public function facility_surfaces(){

        return $this->hasMany('App\Models\FacilitySurface', 'facility_id');

    }

    // Defines the relationship between this table and the activities table
	public function activities(){

		return $this->belongsToMany('App\Models\Activity', 'activity_facility')->withPivot('two_teams_per_line', 'three_teams_per_line', 'four_teams_per_line',
																						   'five_teams_per_line', 'doubles', 'competition_scoring_format', 'line_scoring_format',
																						   'point', 'surface_type', 'line_type', 'num_of_surfaces', 'next_event_date',
																						   'next_event_type');

	}

    // Defines the relationship between this record and its parent record
    public function parent(){

        return $this->belongsTo('App\Models\Facility', 'parent_id');

    }

    // Defines the relationship between this record and its child records
    public function children(){

        return $this->hasMany('App\Models\Facility', 'parent_id');

    }

}