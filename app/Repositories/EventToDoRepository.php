<?php

namespace App\Repositories;

use App\Interfaces\EventToDoInterface;
use App\Models\EventToDo;
use App\Models\Event;
use Illuminate\Support\Facades\View;

class EventToDoRepository implements EventToDoInterface{

	/*
     * Return to dos for an event
     *
     * @param 	int	 	$event_id					ID of event
     *
     * @return  collection
     *
     */
	public function get($event_id){

		return EventToDo::where('event_id', '=', $event_id)->orderBy('primary_id')->orderBy('secondary_id')->get();

	}

	/*
     * Create or update event to do records
     *
     * @param 	int	 	$event_id					ID of event associated with records
     * @param	array	$event_to_dos				To do records
	 *
     * @return  void
     *
     */
	public function create_or_update($event_id, $event_to_dos){

		foreach($event_to_dos as $event_to_do){
			$to_do = EventToDo::where('event_id', '=', $event_id)->where('primary_id', '=', $event_to_do['primary_id'])->where('secondary_id', '=', $event_to_do['secondary_id']);
			if($to_do->exists()){
				$to_do->update(array(
					'previous_to_do_primary_id' => $event_to_do['previous_to_do_primary_id'],
					'previous_to_do_secondary_id' => $event_to_do['previous_to_do_secondary_id'],
					'days_from_previous_to_do' => $event_to_do['days_from_previous_to_do'],
					'status' => in_array($event_to_do['status'], array('in-progress', 'complete')) ? $event_to_do['status'] : null,
					'description' => $event_to_do['description'],
					'assigned_user' => $event_to_do['assigned_user']
				));
			}
			else{
				EventToDo::create(array(
					'event_id' => $event_id,
					'primary_id' => $event_to_do['primary_id'],
					'secondary_id' => $event_to_do['secondary_id'],
					'previous_to_do_primary_id' => $event_to_do['previous_to_do_primary_id'],
					'previous_to_do_secondary_id' => $event_to_do['previous_to_do_secondary_id'],
					'days_from_previous_to_do' => $event_to_do['days_from_previous_to_do'],
					'status' => in_array($event_to_do['status'], array('in-progress', 'complete')) ? $event_to_do['status'] : null,
					'description' => $event_to_do['description'],
					'assigned_user' => $event_to_do['assigned_user']
				));
			}
		}

	}

	/*
     * Deletes a to do record
     *
     * @param	int		$event_id					ID of event
     * @param	int		$to_do_id					ID of to do to delete
	 *
     * @return  mixed
     *
     */
	public function delete($event_id, $to_do_id){

		$to_do = EventToDo::where('id', '=', $to_do_id);
		if($to_do->exists()){
			return $to_do->delete();
		}
		else{
			return 'Invalid ID provided';
		}

	}

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
	public function print($event_id, $tasks, $status, $size){

		$event = Event::find($event_id);
		$format = array(
			'small' => 'A4',
			'medium' => 'Legal',
			'large' => 'A4'
		);
		$mpdf = new \Mpdf\Mpdf(array(
			'format' => $format[$size]
		));
		$statuses = array(
			'all' => 'All',
			'complete' => 'Complete',
			'!complete' => 'Not Complete',
			'in-progress' => 'In Progress'
		);
		$to_dos_data = array(
			'event_name' => $event->name,
			'tasks' => $tasks,
			'statuses' => $statuses,
			'status' => $statuses[$status]
		);
		$view = View::make('todos.tasks', $to_dos_data);
		$mpdf->WriteHTML($view->render());
		return $mpdf->Output();

	}

}