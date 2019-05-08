<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model{

    // Name of our database table
    protected $table = 'password_resets';

    // Columns that are mass assignable
    protected $fillable = ['username', 'token', 'expires_at'];

    // Our fillable columns plus the created_at column
    public static $search_columns = ['username', 'token', 'expires_at', 'created_at'];

    // Prevent model from setting default updated_at column
    public function setUpdatedAt($value){

    	return null;

	}

    // Prevent model from using default updated_at column
    public function getUpdatedAtColumn(){

    	return null;

    }

}