<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MultiOpponentFacility extends Model{

    // Name of our database table
    protected $table = 'multi_opponent_facilities';

    // Columns that are mass assignable
    protected $fillable = ['name', 'address', 'city', 'state', 'zip', 'directions'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    protected $search_columns = ['name', 'address', 'city', 'state', 'zip', 'directions', 'created_at', 'updated_at', 'id'];

	// Defines the relationship between this table and the matches table through the multi_opponent_facility_id column
	public function match_opponent_facility(){

		return $this->hasMany('App\Models\Match', 'multi_opponent_facility_id');

	}

}