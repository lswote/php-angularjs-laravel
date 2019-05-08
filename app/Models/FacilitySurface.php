<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacilitySurface extends Model{

    // Name of our database table
    protected $table = 'facility_surfaces';

    // Columns that are mass assignable
    protected $fillable = ['facility_id', 'facility_surface_number'];

    // Our fillable columns plus created_at and ID columns
    public static $search_columns = ['facility_id', 'facility_surface_number', 'created_at', 'id'];

    // Prevent model from setting default updated_at column
    public function setUpdatedAt($value){

    	return null;

	}

    // Prevent model from using default updated_at column
    public function getUpdatedAtColumn(){

    	return null;

    }

    // Defines the relationship between this table and the facilities table
    public function facilities(){

        return $this->belongsTo('App\Models\Facility', 'facility_id');

    }

    // Defines the relationship between this table and the events table
    public function events(){

    	return $this->belongsToMany('App\Models\Event', 'event_facility_surface')->withPivot('event_surface_number', 'emergency_surface');

	}

}