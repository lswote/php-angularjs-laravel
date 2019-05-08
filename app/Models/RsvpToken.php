<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RsvpToken extends Model{

    // Name of our database table
    protected $table = 'rsvp_tokens';

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'user_id', 'token'];

    // Our fillable columns plus created_at and and ID columns
    public static $search_columns = ['event_id', 'user_id', 'token', 'created_at', 'id'];

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

    // Defines the relationship between this table and the users table
    public function users(){

        return $this->belongsTo('App\Models\User', 'user_id');

    }

}