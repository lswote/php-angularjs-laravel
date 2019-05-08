<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationToken extends Model{

    // Name of our database table
    protected $table = 'registration_tokens';

    // Columns that are mass assignable
    protected $fillable = ['facility_id', 'event_id', 'token', 'expires_at'];

    // Our fillable columns plus created_at and and ID columns
    public static $search_columns = ['facility_id', 'event_id', 'token', 'expires_at', 'created_at', 'id'];

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

        return $this->belongsTo('App\Models\Facility', 'facility');

    }

    // Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

}