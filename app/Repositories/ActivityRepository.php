<?php

namespace App\Repositories;

use App\Interfaces\ActivityInterface;
use App\Models\Activity;

class ActivityRepository implements ActivityInterface{

	/*
     * Get list of all activities
     *
     * @return  collection
     *
     */
	public function get(){

		return Activity::get();

	}

	/*
     * Creates a new activity
	 *
	 * @param	array	$request		Request object
     *
     * @return  int
     *
     */
	public function create($request){

		$activity = Activity::create(array(
			'name' => $request['name'],
			'two_teams_per_line' => $request['two_teams_per_line'],
			'three_teams_per_line' => $request['three_teams_per_line'],
			'four_teams_per_line' => $request['four_teams_per_line'],
			'five_teams_per_line' => $request['five_teams_per_line'],
			'doubles' => $request['doubles'],
			'competition_scoring_format' => $request['competition_scoring_format'],
			'line_scoring_format' => $request['line_scoring_format'],
			'point' => !empty($request['point']) ? $request['point'] : null,
			'surface_type' => $request['surface_type'],
			'line_type' => $request['line_type'],
		));
		return $activity->id;

	}

	/*
     * Updates an existing activity
	 *
	 * @param	int		$id				ID of activity to update
	 * @param	array	$request		Request object
     *
     * @return  int
     *
     */
	public function update($id, $request){

		$activity = Activity::find($id);
		if(isset($request['point']) && empty($request['point'])){
			$request['point'] = null;
		}
		return $activity->update($request);

	}

}