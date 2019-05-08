<?php

namespace App\Library;

use App\Repositories\FacilityRepository;
use App\Models\Event;
use App\Models\EventTeamUser;

class UserGroupCalculator{

	private $facilities;

	private $user_ranking_calculator;

	public function __construct(){

		$this->facilities = new FacilityRepository();

		$this->user_ranking_calculator = new UserRankingCalculator();

	}

	// Return the closeset value
	private function get_closest_value($search, $array){

		$closest = null;
		foreach($array as $value){
			if($closest === null || abs($search - $closest) > abs($value - $search)){
				$closest = $value;
			}
		}
		return array_search($closest, $array);

	}

	// Get all users confirmed for an event
	private function get_confirmed_participants($id){

		$event = Event::with(array(
			'users' => function($query){
				$query->wherePivot('confirmed', '=', 1)->wherePivot('unavailable', '=', 0)->wherePivot('rsvped', '!=', null);
			}
		))->find($id);
		return $event->users;

	}

	// Returns confirmed users with their rankings for an event in array form
	private function get_confirmed_participants_with_rankings($event, $sex){

		$participants = $this->get_confirmed_participants($event->id);
		$participants_rankings = $this->facilities->get_participants_rankings($event->facility_id, $event->activity_id);
		$participants_with_rankings = array();
		foreach($participants as $participant){
			if($participant->sex === $sex){
				$participant_ranking = $participants_rankings->filter(function($participant_ranking)use($participant){
					return $participant_ranking->id == $participant->id;
				})->first();
				if($participant_ranking){
					$participants_with_rankings[$participant->id] = $participant_ranking->pivot->ranking ? $participant_ranking->pivot->ranking : 0;
				}
				else{
					$participants_with_rankings[$participant->id] = 0;
				}
			}
		}
		asort($participants_with_rankings);
		return $participants_with_rankings;

	}

	// Get the group number of the
	public function get_closest_ranked_participant_group_number($event, $user){

		$user_ranking = $this->user_ranking_calculator->get_user_ranking($event, $user->id);
		$confirmed_participants_rankings = $this->get_confirmed_participants_with_rankings($event, $user->sex);
		$closest_user_id = $this->get_closest_value($user_ranking, $confirmed_participants_rankings);
		$closest_user = EventTeamUser::where('event_id', '=', $event->id)->where('user_id', '=', $closest_user_id)->where('event_team_id', '!=', null);
		if($closest_user->exists()){
			$closest_user = $closest_user->first();
			return $closest_user->group_number;
		}
		else{
			return null;
		}

	}

}