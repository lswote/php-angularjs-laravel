<?php

namespace App\Repositories;

use App\Interfaces\FacilityInterface;
use App\Models\Facility;
use App\Models\FacilitySurface;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\App;
use App\Jobs\SendParticipantWelcome;

class FacilityRepository implements FacilityInterface{

	private $s3_client;

	public function __construct(){

		$this->s3_client = App::make('aws')->createClient('s3');

	}

	// Build our add participant request object
	private function build_add_participant_request_array($values){

    	return array(
			'first_name' => trim($values[0]),
			'last_name' => trim($values[1]),
			'gender' => trim($values[2]),
			'email' => trim($values[3]),
			'username' => trim($values[4]),
			'phone' => trim($values[5]),
			'room' => trim($values[6]),
			'password' => trim($values[7]),
			'active' => trim($values[8]) === 'inactive' ? 0 : 1,
			'membership_type' => trim($values[9]) === 'guest' ? trim($values[9]) : 'member',
			'age_type' => trim($values[10]) === 'child' ? trim($values[10]) : 'adult'
		);

    }

    // Turns array into CSV
	private function array_to_csv(array &$array){

		if(count($array) == 0){
			return null;
		}
		ob_start();
		$df = fopen('php://output', 'w');
		foreach($array as $row){
			fputcsv($df, $row);
		}
		fclose($df);
		return ob_get_clean();

	}

	/*
     * Returns all facilities
     *
     * @return  collection
     *
     */
	public function get(){

		return Facility::with('facility_leaders')->get();

	}

	/*
     * Returns info about a facility
     *
	 * @param	int		$id			ID of facility
     *
     * @return  object
     *
     */
	public function get_by_id($id){

		$facility = Facility::with(array('users.activities' => function($query)use($id){
			$query->wherePivot('facility_id', '=', $id);
		}))->with('activities', 'facility_leaders')->find($id);
		return $facility;

	}

	/*
     * Creates a new facility
     *
	 * @param	{string}	name				Facility name
	 * @param	{string}	address				Street address
	 * @param	{string}	city			    City where facility is located
	 * @param	{string}	state				State where facility is located
	 * @param	{int}		zip					Zip of where facility is located
	 * @param	{int}		parent_id			Master Facility id
	 * @param	{date}		expiration_date		Contract expiration date
	 * @param	{string}	paypal_link			Paypal payment link for new facility
     *
     * @return  int
     *
     */
	public function create($name, $address, $city, $state, $zip, $parent_id, $expiration_date, $paypal_link){
		
		$facility = Facility::create(array(
			'name' => $name,
			'address' => !empty($address) ? $address : null,
			'city' => !empty($city) ? $city : null,
			'state' => !empty($state) ? $state : null,
			'zip' => !empty($zip) ? $zip : null,
			'contract_expiration_date' => $expiration_date,
			'paypal_link' => !empty($paypal_link) ? $paypal_link : null
		));
		// If no parent ID given, set facility's ID as the parent ID
		if(empty($parent_id)){
			$facility->update(array(
				'parent_id' => $facility->id,
			));
		}
		for($i = 1; $i <= 20; $i++){
			FacilitySurface::create(array(
				'facility_id' => $facility->id,
				'facility_surface_number' => $i
			));
		}
		return $facility->id;
		
	}

	/*
     * Updates a facility
     *
	 * @param	{int}		id					Facility id
	 * @param	{string}	name				Facility name
	 * @param	{string}	address				Street address
	 * @param	{string}	city			    City where facility is located
	 * @param	{string}	state				State where facility is located
	 * @param	{int}		zip					Zip of where facility is located
	 * @param	{int}		parent_id			Master Facility id
	 * @param	{date}		expiration_date		Contract expiration date
	 * @param	{string}	paypal_link			Paypal payment link for facility
     *
     * @return  int
     *
     */
	public function update($id, $name, $address, $city, $state, $zip, $parent_id, $expiration_date, $paypal_link){
		
		return Facility::find($id)->update(array(
			'name' => $name,
			'address' => !empty($address) ? $address : null,
			'city' => !empty($city) ? $city : null,
			'state' => !empty($state) ? $state : null,
			'zip' => !empty($zip) ? $zip : null,
			'parent_id' => !empty($parent_id) ? $parent_id : null,
			'contract_expiration_date' => $expiration_date,
			'paypal_link' => !empty($paypal_link) ? $paypal_link : null
		));

	}

	/*
     * Deletes a facility
     *
	 * @param	{int}		id					ID of facility to delete
     *
     * @return  mixed
     *
     */
	public function delete($id){

		$facility = Facility::where('id', '=', $id);
		if($facility->exists()){
			return $facility->delete();
		}
		else{
			return 'Invalid ID provided';
		}

	}

	/*
     * Updates a facility's image
     *
	 * @param	int		$id			ID of facility to update
     * @param 	string	$url		URL of the new image
	 * @param 	int	 	$disable	Whether we want to show / hide the banner image
     *
     * @return  array
     *
     */
    public function image($id, $url, $disable){

    	$facility = Facility::find($id);
    	$params = array(
    		'disable_image_banner' => $disable
		);
    	if(!empty($url)){
    		$params['image_url'] = $url;
		}
    	$facility->update($params);
    	if(empty($url)){
    		$params['image_url'] = $facility->image_url;
		}
    	return $params;

	}

	/*
     * Add a participant to a facility
     *
	 * @param	int		$id			ID of facility to add participant to
     * @param 	array	$request	Request object
     *
     * @return  boolean
     *
     */
    public function add_participant($id, $request){

    	if(User::where('username', '=', $request['username'])->exists()){
    		return 'Username taken';
		}
    	$facility = Facility::find($id);
		$user = User::create(array(
			'first_name' => $request['first_name'],
			'last_name' => $request['last_name'],
			'sex' => strtolower($request['gender']),
			'email' => $request['email'],
			'username' => $request['username'],
			'phone' => $request['phone'],
			'password' => bcrypt($request['password']),
			'room' => $request['room'],
			'membership_type' => $request['membership_type'],
			'active' => $request['active'],
			'age_type' => $request['age_type'],
			'privilege' => 'participant'
		));
    	$user->facilities()->attach($id);
		dispatch(new SendParticipantWelcome($request['username'], $facility->name, $request['first_name'], $request['password'], $request['email']));
		return true;

	}

	/*
     * Adds participants to a facility using an uploaded file
     *
	 * @param	int		$id			ID of facility to add participants to
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
    public function add_participants($id, $file_key){

		$result = $this->s3_client->getObject(array(
			'Bucket' => env('AWS_S3_BUCKET', 'teams-r-it-images'),
			'Key' => $file_key
		));
		$body = $result['Body'];
		$line = strtok($body, "\r\n");
		$line_count = 2;
		$num_of_accounts_created = 0;
		$lines_not_added = array();
		while($line !== false){
			$line = strtok("\r\n");
			$values = explode(',', $line);
			if(count($values) > 1){
				if(!empty($values[0]) && !empty($values[1]) && !empty($values[2]) && !empty($values[4]) && !empty($values[7])){
					$request = $this->build_add_participant_request_array($values);
					if($this->add_participant($id, $request) === true){
						$num_of_accounts_created = $num_of_accounts_created + 1;
					}
					else{
						array_push($lines_not_added, $line_count);
					}
				}
				else{
					array_push($lines_not_added, $line_count);
				}
			}
			$line_count = $line_count + 1;
		}
		return array(
			'imported_count' => $num_of_accounts_created,
			'lines_not_added' => $lines_not_added
		);

	}

	/*
     * Returns a list of all the participants at a facility
     *
	 * @param	int		$id			ID of facility
     *
     * @return  collection
     *
     */
	public function get_participants($id){

    	$facility = Facility::with('users')->find($id);
    	return $facility->users;

	}

	/*
	 * Get a list of all participants corresponding to an event in CSV format
	 *
	 * @param 	int	 	$id				ID of event to look up
     * @param	collection				Values to narrow down search by
	 *
	 * @return  file
	 *
	 */
	public function get_participants_export($id, $request){

		$data = array(array('First Name', 'Last Name', 'Gender', 'E-Mail', 'Username', 'Phone', 'Room', 'Password', 'Active', 'Membership Type', 'Age Type', 'Affiliation'));
		$facility = Facility::with(array(
			'users' => function($query)use($request){
				if($request['gender'] != 'both'){
					$query->where('sex','=',$request['gender']);
				}
				if($request['membership'] != 'both'){
					$query->where('membership_type','=',$request['membership']);
				}
				if($request['age'] != 'both'){
					$query->where('age_type','=',$request['age']);
				}
				if($request['status'] != 'both'){
					$query->where('active','=',$request['status'] == 'active');
				}
				if($request['affiliation'] != 'all'){
					$query->where('affiliation','like','%'.$request['affiliationValue'].'%');
				}
			}
		))->find($id);
		foreach($facility->users as $user){
			$user_array = array($user->first_name, $user->last_name, $user->sex, $user->email, $user->username, $user->phone, $user->room, 'password', $user->active, $user->membership_type, $user->age_type, $user->affiliation);
			array_push($data, $user_array);
		}
		return $this->array_to_csv($data);

	}

	/*
     * Updates activities a facility can host events for
     *
	 * @param	int		$id				ID of facility
	 * @param	array	$activities		Activities to associate with facility
     *
     * @return  void
     *
     */
	public function update_activities($id, $activities){

		$facility = Facility::find($id);
		$facility->activities()->sync($activities);

	}

	// Associate activities to a participant
	private function associate_participant_to_activities($facility_id, $user, $values){

		$facility = Facility::find($facility_id);
		$facility_activity_names = $facility->activities()->pluck('name')->toArray();
		$user = $user->get()->first();
		for($x = 1; $x <= 10; $x++){
			$activity_name_index = ($x * 3) - 2;
			$activity_skill_level_index = $activity_name_index + 1;
			$activity_ranking_index = $activity_name_index + 2;
			if(!empty($values[$activity_name_index]) && in_array(ucwords(strtolower($values[$activity_name_index])), $facility_activity_names)){
				$activity = Activity::where('name', '=', $values[$activity_name_index])->get()[0];
				$this->associate_participant_to_activity($user, $activity->id, $values[$activity_skill_level_index], $values[$activity_ranking_index], $facility_id);
			}
		}

	}

	/*
     * Associates participant to activity at a facility
     *
	 * @param	object	$participant		Participant
	 * @param	int		$activity_id		Activity ID
     * @param 	string  $skill_level		Skill level
     * @param 	float  	$ranking			Ranking
	 * @param	int		$facility_id		Facility ID
     *
     */
	public function associate_participant_to_activity($participant, $activity_id, $skill_level, $ranking, $facility_id){

    	$skill_levels = array('need education', 'beginner', 'intermediate', 'advanced', 'expert');
		$participant->activities()->sync(array(
			$activity_id => array(
				'skill_level' => in_array(strtolower($skill_level), $skill_levels) ? ucwords(strtolower($skill_level)) : null,
				'ranking' => !empty($ranking) ? $ranking : null,
				'facility_id' => $facility_id
			)
		), false);

	}

	/*
     * Deletes participant activity record
     *
	 * @param	int		$facility_id					Facility ID
	 * @param	int		$activity_id					Activity ID
	 * @param	int		$user_id						User ID
     *
     */
	public function delete_participant_activity($facility_id, $activity_id, $user_id){

		$user = User::find($user_id);
		$user->activities()->wherePivot('activity_id','=',$activity_id)->wherePivot('facility_id','=',$facility_id)->detach();
		
	}

	/*
     * Associates participants to activities at a facility using an uploaded file
     *
	 * @param	int		$id			ID of facility
     * @param 	string  $file_key	S3 file key
     *
     * @return  array
     *
     */
    public function add_participants_activities($id, $file_key){

		$result = $this->s3_client->getObject(array(
			'Bucket' => env('AWS_S3_BUCKET', 'teams-r-it-images'),
			'Key' => $file_key
		));
		$body = $result['Body'];
		$line = strtok($body, "\r\n");
		$line_count = 2;
		$num_of_users_processed = 0;
		$lines_not_added = array();
		while($line !== false){
			$line = strtok("\r\n");
			$values = explode(',', $line);
			if(count($values) > 1){
				if(!empty($values[0])){
					$user = User::where('username', '=', $values[0]);
					if($user->exists()){
						$this->associate_participant_to_activities($id, $user, $values);
						$num_of_users_processed = $num_of_users_processed + 1;
					}
					else{
						array_push($lines_not_added, $line_count);
					}
				}
				else{
					array_push($lines_not_added, $line_count);
				}
			}
			$line_count = $line_count + 1;
		}
		return array(
			'imported_count' => $num_of_users_processed,
			'lines_not_added' => $lines_not_added
		);

	}

	/*
     * Generates a CSV file with a facility's participants activities
     *
	 * @param	int		$id			ID of facility
     *
     * @return  file
     *
     */
	public function get_participants_activities($id){

		$data = array(array('Username'));
		$facility = Facility::with('users')->find($id);
		$max_num_of_activities = 0;
		foreach($facility->users as $user){
			$user_array = array($user->username);
			$user_activities = $user->activities()->wherePivot('facility_id', '=', $facility->id)->select('activity_id', 'skill_level', 'ranking', 'name')->get();
			$current_num_of_activities = 0;
			foreach($user_activities as $activity){
				array_push($user_array, $activity->name, $activity->pivot->skill_level, $activity->pivot->ranking);
				$current_num_of_activities = $current_num_of_activities + 1;
				if($current_num_of_activities > $max_num_of_activities){
					$max_num_of_activities = $current_num_of_activities;
				}
			}
			array_push($data, $user_array);
		}
		for($i = 1; $i <= $max_num_of_activities; $i++){
			array_push($data[0], "Activity $i", "Activity $i Skill", "Activity $i Ranking");
		}
		return $this->array_to_csv($data);

	}

	/*
     * Get player rankings for a facility / activity combo
     *
	 * @param	int		$id				ID of facility
	 * @param	int		$activity_id	ID of activity
     *
     * @return  collection
     *
     */
	public function get_participants_rankings($id, $activity_id){

		$activity = Activity::with(array('users' => function($query)use($id){
			$query->wherePivot('facility_id', '=', $id);
		}))->find($activity_id);
		return $activity->users;

	}

	/*
     * Get player rankings for a facility / activity combo
     *
	 * @param	int		$id				ID of facility
	 * @param	int		$activity_id	ID of activity
	 * @param	int		$user_id		ID of user whose ranking we want to update
	 * @param	decimal $ranking		New user ranking
     *
     * @return  mixed
     *
     */
	public function update_participant_ranking($id, $activity_id, $user_id, $ranking){

		if(is_numeric($ranking)){
			$user = User::with(array('activities' => function($query)use($id, $activity_id){
				$query->wherePivot('facility_id', '=', $id)->wherePivot('activity_id', '=', $activity_id);
			}))->find($user_id);
			if($user && !$user->activities->isEmpty()){
				$user->activities()->updateExistingPivot($activity_id, array(
					'ranking' => $ranking
				));
				return true;
			}
			else{
				return 'User / facility / activity combo not found';
			}
		}
		else{
			return 'Ranking provided must be an integer or floating number';
		}

	}

	/*
     * Get facility IDs of events where the user is a captain
     *
	 * @param	int		$user_id		ID of user we want to look up
     *
     * @return  array
     *
     */
	public function get_user_captain_facilities($user_id){

		return Facility::whereHas('events.event_team_users', function($query)use($user_id){
			$query->where('user_id', '=', $user_id)->where('captain', '=', 1);
		})->pluck('id')->toArray();

	}

}