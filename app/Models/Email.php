<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Email extends Model{

    // Name of our database table
    protected $table = 'emails';

    // Columns that are mass assignable
    protected $fillable = ['email_type_name', 'event_id', 'to_email_addresses', 'subject', 'content'];

    // Our fillable columns plus created_at and ID columns
    public static $search_columns = ['email_type_name', 'event_id', 'to_email_addresses', 'subject', 'content', 'created_at', 'id'];

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

}