<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventToDo extends Model{

	use SoftDeletes;

    // Name of our database table
    protected $table = 'event_to_dos';

    // Column for soft deletes
    protected $dates = ['deleted_at'];

    // Columns that are mass assignable
    protected $fillable = ['event_id', 'primary_id', 'secondary_id', 'previous_to_do_primary_id', 'previous_to_do_secondary_id', 'days_from_previous_to_do', 'status', 'description',
						   'assigned_user'];

    // Our fillable columns plus the created_at, updated_at, and ID columns
    public static $search_columns = ['event_id', 'primary_id', 'secondary_id', 'previous_to_do_primary_id', 'previous_to_do_secondary_id', 'days_from_previous_to_do', 'status',
									 'description', 'assigned_user', 'created_at', 'updated_at', 'id'];

	// Defines the relationship between this table and the events table
    public function events(){

        return $this->belongsTo('App\Models\Event', 'event_id');

    }

}