<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventDoNotMatchTeam extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'event_do_not_match_teams';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'pair_one_id', 'pair_two_id'];

    // Our fillable columns plus created_at and ID columns
    public static $search_columns = ['event_id', 'pair_one_id', 'pair_two_id', 'created_at', 'id'];

    // Prevent model from setting default updated_at column
    public function setUpdatedAt($value){

    	return null;

	}

    // Prevent model from using default updated_at column
    public function getUpdatedAtColumn(){

    	return null;

    }

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

    // Defines the relationship between this table and the users table through the pair_one_id column
    public function pair_one(){

    	return $this->belongsTo('App\Models\User', 'pair_one_id');

	}

	// Defines the relationship between this table and the users table through the pair_two_id column
	public function pair_two(){

		return $this->belongsTo('App\Models\User', 'pair_two_id');

	}

	// Returns any do not play request for a team
	public function teams(){

    	return $this->pair_one()->merge($this->pair_two());

	}

}