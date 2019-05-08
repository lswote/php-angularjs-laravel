<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LineScore extends Model{

    // Name of our database table
    protected $table = 'line_scores';

    // Columns that are mass assignable
    protected $fillable = ['line_id', 'set_number', 'pair_one_score', 'pair_two_score', 'pair_three_score', 'pair_four_score', 'pair_five_score'];

    // Our fillable columns plus created_at, updated_at, and ID columns
    public static $search_columns = ['line_id', 'set_number', 'pair_one_score', 'pair_two_score', 'pair_three_score', 'pair_four_score', 'pair_five_score', 'created_at',
									 'updated_at', 'id'];

    // Defines the relationship between this table and the lines table
    public function lines(){

        return $this->belongsTo('App\Models\Line', 'line_id');

    }

}