<?php

namespace App\Interfaces;

interface EventToDoInterface{

	/*
     * Return to dos for an event
     *
     * @param 	int	 	$event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get($event_id);

	/*
     * Create or update event to do records
     *
     * @param 	int	 	$event_id					ID of event associated with records
     * @param	array	$event_to_dos				To do records
	 *
     * @return  void
     *
     */
	public function create_or_update($event_id, $event_to_dos);

	/*
     * Deletes a to do record
     *
     * @param	int		$event_id					ID of event
     * @param	int		$to_do_id					ID of to do to delete
	 *
     * @return  mixed
     *
     */
	public function delete($event_id, $to_do_id);

	/*
     * Prints to do records
     *
     * @param	int		$event_id					ID of event
     * @param	int		$tasks						To do tasks
     * @param	string	$status						Status
     * @param	string	$size						Size of paper
	 *
     * @return  pdf
     *
     */
	public function print($event_id, $tasks, $status, $size);

}