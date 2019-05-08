<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Pair extends Model{

    // Name of our database table
    protected $table = 'pairs';

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'user_one_id', 'user_two_id', 'status', 'ladder_ranking', 'wild'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'user_one_id', 'user_two_id', 'status', 'ladder_ranking', 'wild', 'created_at', 'id'];

    // Prevent model from setting default updated_at column
    public function setUpdatedAt($value){

    	return null;

	}

    // Prevent model from using default updated_at column
    public function getUpdatedAtColumn(){

    	return null;

    }

    // Overwrite morphMany() so we can use custom columns
	public function morphMany($related, $name, $type = null, $id = null, $localKey = null){

		$instance = new $related;
		$table = $instance->getTable();
		$localKey = $localKey ? : $this->getKeyName();
		return new MorphMany($instance->newQuery(), $this, $table . '.' . $type, $table . '.' . $id, $localKey);

    }

    // Defines the relationship between this table and the users table through the user_one_id column
    public function user_one(){

    	return $this->belongsTo('App\Models\User', 'user_one_id');

	}

	// Defines the relationship between this table and the users table through the user_two_id column
    public function user_two(){

    	return $this->belongsTo('App\Models\User', 'user_two_id');

	}

    // Defines the relationship between this table and the lines table through the pair_one_id column
	public function line_pair_one(){

    	return $this->morphMany('App\Models\Line', null, 'line_type', 'pair_one_id');

	}

	// Defines the relationship between this table and the lines table through the pair_two_id column
	public function line_pair_two(){

    	return $this->morphMany('App\Models\Line', null, 'line_type', 'pair_two_id');

	}

    // Defines the relationship between this table and the events table through the event_id column
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

}