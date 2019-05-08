<?php

namespace App\Interfaces;

interface ActivityInterface{

	/*
     * Get list of all activities
     *
     * @return  collection
     *
     */
	public function get();

	/*
     * Creates a new activity
	 *
	 * @param	array	$request		Request object
     *
     * @return  int
     *
     */
	public function create($request);

	/*
     * Updates an existing activity
	 *
	 * @param	int		$id				ID of activity to update
	 * @param	array	$request		Request object
     *
     * @return  int
     *
     */
	public function update($id, $request);

}