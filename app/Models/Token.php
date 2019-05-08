<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model{

    // Name of our database table
    protected $table = 'tokens';

    // Columns that are mass assignable
    protected $fillable = ['user_id', 'token', 'expires_at'];

    // Our fillable columns plus created_at and and ID columns
    public static $search_columns = ['user_id', 'token', 'expires_at', 'created_at', 'id'];

    // Prevent model from setting default updated_at column
    public function setUpdatedAt($value){

    	return null;

	}

    // Prevent model from using default updated_at column
    public function getUpdatedAtColumn(){

    	return null;

    }

    // Defines the relationship between this table and the users table
    public function users(){

        return $this->belongsTo('App\Models\User', 'user_id');

    }

}