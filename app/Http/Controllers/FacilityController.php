<?php

namespace App\Http\Controllers;

use App\Interfaces\FacilityInterface;
use App\Interfaces\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class FacilityController extends ApiController{

	private $facilities, $users;

    public function __construct(ResponseFactory $response, Request $request, FacilityInterface $facilities, UserInterface $users){

    	parent::__construct($response, $request);

    	$this->facilities = $facilities;
    	$this->users = $users;

    }

    // Allow for file download
	private function download_send_headers($filename){

		// Disable caching
		$now = gmdate("D, d M Y H:i:s");
		header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
		header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
		header("Last-Modified: {$now} GMT");
		// Force download
		header("Content-Type: application/force-download");
		header("Content-Type: application/octet-stream");
		header("Content-Type: application/download");
		// Disposition / encoding on response body
		header("Content-Disposition: attachment;filename={$filename}");
		header("Content-Transfer-Encoding: binary");

    }

    /**
     * @api {get} /facilities						Get all existing facilities
     * @apiVersion 1.0.0
     * @apiName GET facilities
     * @apiGroup Facilities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null,
	 			   "facilities": [{
						"id": 1,
						"name": "Brookhaven Country Day",
						"image_url": null,
						"address": "3482 Peachtree Day NE",
						"city": "Atlanta",
						"state": "GA",
						"zip": 30301,
						"disabled": 0,
						"created_at": "2018-02-26T15:32:09+00:00",
						"updated_at": "2018-02-26T15:32:09+00:00"
					}]
            }
     */
	public function get(Request $request){

		if(in_array($request->get('privilege'), array('admin'))){
			$facilities = $this->facilities->get();
			return $this->respondSuccess('facilities', $facilities);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

    /**
     * @api {get} /facility/{id}					Gets info about a facility
     * @apiVersion 1.0.0
     * @apiName GET facility
     * @apiGroup Facilities
	 *
	 * @apiParam	{id}	id						ID of facility
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null,
	 			   "facility": {
						"id": 1,
						"name": "Brookhaven Country Day",
						"image_url": "found you",
						"address": "3482 Peachtree Day NE",
						"city": "Atlanta",
						"state": "GA",
						"zip": 30301,
						"disabled": 0,
						"created_at": "2018-02-24T21:26:46+00:00",
						"updated_at": "2018-02-26T02:37:11+00:00"
					}
            }
     */
	public function get_by_id(Request $request, $id){

		if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
			if($request->get('privilege') === 'facility leader'){
				$user = User::where('id', '=', $request->get('auth_user_id'))->with('facilities')->get()[0];
				$facility_id = $user->facilities[0]->id;
			}
			if($request->get('privilege') === 'admin' || $facility_id == $id){
				$facility = $this->facilities->get_by_id($id);
				return $this->respondSuccess('facility', $facility);
			}

		}
		return $this->respondUnauthorized();

	}

	/**
     * @api {get} /facility							Gets info about your own facility
     * @apiVersion 1.0.0
     * @apiName GET own facility
     * @apiGroup Facilities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null,
	 			   "facility": {
						"id": 1,
						"name": "Brookhaven Country Day",
						"image_url": "found you",
						"address": "3482 Peachtree Day NE",
						"city": "Atlanta",
						"state": "GA",
						"zip": 30301,
						"disabled": 0,
						"created_at": "2018-02-24T21:26:46+00:00",
						"updated_at": "2018-02-26T02:37:11+00:00"
					}
            }
     */
	public function get_own_facility_info(Request $request){

		$user = User::where('id', '=', $request->get('auth_user_id'))->with('facilities')->get()[0];
		$facility_id = $user->facilities[0]->id;
		$facility = $this->facilities->get_by_id($facility_id);
		return $this->respondSuccess('facility', $facility);

	}

	/**
     * @api {post} /facility						Creates a new facility
     * @apiVersion 1.0.0
     * @apiName POST facility
     * @apiGroup Facilities
	 *
	 * @apiParam	{string}	name				Facility name
	 * @apiParam	{string}	address				Street address
	 * @apiParam	{string}	city			    City where facility is located
	 * @apiParam	{string}	state				State where facility is located
	 * @apiParam	{int}		zip					Zip of where facility is located
	 * @apiParam	{int}		parent_id			Master Facility id
	 * @apiParam	{date}		expiration_date		Contract expiration date
	 * @apiParam	{string}	paypal_link			Paypal payment link for facility
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	            "facility_id": 394
            }
     */
	public function post(Request $request){

		if(in_array($request->get('privilege'), array('admin'))){
			$facility_id = $this->facilities->create($request['name'], $request['address'], $request['city'], $request['state'], $request['zip'], $request['parent_id'],
													 $request['expiration_date'], $request['paypal_link']);
			return $this->respondSuccess('facility_id', $facility_id);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /facility/{id}					Updates an existing facility
     * @apiVersion 1.0.0
     * @apiName PUT facility
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}		id					Facility ID
	 * @apiParam	{string}	name				Facility name
	 * @apiParam	{string}	address				Street address
	 * @apiParam	{string}	city			    City where facility is located
	 * @apiParam	{string}	state				State where facility is located
	 * @apiParam	{int}		zip					Zip of where facility is located
	 * @apiParam	{int}		parent_id			Master Facility id
	 * @apiParam	{date}		expiration_date		Contract expiration date
	 *
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function put(Request $request, $id){

		if(in_array($request->get('privilege'), array('admin'))){
			$this->facilities->update($id, $request['name'], $request['address'], $request['city'], $request['state'], $request['zip'], $request['parent_id'],
									  $request['expiration_date'], $request['paypal_link']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /facility/leader				 	Creates a new user and adds the user as a facility leader
     * @apiVersion 1.0.0
     * @apiName POST facility leader
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}		facility_id			ID of facility to add leader for
	 * @apiParam	{string}	first_name			First name of new user
	 * @apiParam	{string}	last_name			Last name of new user
	 * @apiParam	{string}	email				E-mail of new user
	 * @apiParam	{string}	username			Username of new user
	 * @apiParam	{string}	password			Password for new user
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	            "user_id": 394
            }
     */
	public function create_and_add_leader(Request $request){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_facilities_ids = $user->facilities()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['facility_id'], $leader_of_facilities_ids)){
			$user = $this->users->create($request, 'facility leader', $request['facility_id']);
			$user->facility_leaders()->attach($request['facility_id']);
			return $this->respondSuccess('user_id', $user->id);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /facility/{id}/leader		Delete facility leader
     * @apiVersion 1.0.0
     * @apiName DELETE facility leader
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}	facility_id					Facility ID
	 * @apiParam	{int}	leader_id					Facility leader ID
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null
            }
     */
	public function delete_leader(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_facilities_ids = $user->facilities()->pluck('id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($request['facility_id'], $leader_of_facilities_ids)){
			$user = User::find($request['leader_id']);
			$user->facility_leaders()->detach($id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /facility/participants		Get list of participants for a facility
     * @apiVersion 1.0.0
     * @apiName GET facility participants
     * @apiGroup Facilities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null,
	 			"participants":
            }
     */
	public function get_participants(Request $request){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$user = User::find($request->get('auth_user_id'));
			$facility_id = $user->facilities()->first()['id'];
			return $this->respondSuccess('participants', $this->facilities->get_participants($facility_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /facility/{id}/participants/export			Export list of facility participants as a CSV file
     * @apiVersion 1.0.0
     * @apiName GET facility participants export
     * @apiGroup Events
	 *
	 * @apiParam	{int}		id							ID of facility
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    CSV File
            }
     */
	public function get_participants_export(Request $request, $id){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$facility = $this->facilities->get_by_id($id);
			$this->download_send_headers(str_replace(' ', '-', $facility->name) . '-Participants.csv');
			echo $this->facilities->get_participants_export($id, $request);
			die();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /facility/participant		Adds a participant to a facility
     * @apiVersion 1.0.0
     * @apiName POST facility participant
     * @apiGroup Facilities
	 *
	 * @apiParam	{string}	first_name			First name of new participant
	 * @apiParam	{string}	last_name			Last name of new participant
	 * @apiParam	{string}	gender				Sex of new user
	 * @apiParam	{string}	email				E-mail of user who we want
	 * @apiParam	{string}	username			Username of user who we want
	 * @apiParam	{string}	phone				Phone number of user
	 * @apiParam	{string}	password			User's password
	 * @apiParam	{string}	membership_type		Membership type of user
	 * @apiParam	{int}		active				Whether user is active or not
	 * @apiParam	{string}	age_type			Age type of user
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null
            }
     */
	public function add_participant(Request $request){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$requested_username_array = array(
				'username' => $request['username']
			);
			if($this->users->exist($requested_username_array)){
				return $this->respond(array(
					'success' => false,
					'error' => 'Username taken'
				), 400);
			}
			$user = User::find($request->get('auth_user_id'));
			$facility_id = $user->facilities()->first()['id'];
			$result = $this->facilities->add_participant($facility_id, $request);
			if($result === true){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /facility/participants		Adds participants to a facility using a file uploaded by the user
     * @apiVersion 1.0.0
     * @apiName POST facility participants
     * @apiGroup Facilities
	 *
	 * @apiParam	{string}	file_key		S3 File key
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null,
	 			"results": {
					"imported_count": 4,
					"lines_not_added": [1]
				}
            }
     */
	public function add_participants(Request $request){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$user = User::find($request->get('auth_user_id'));
			$facility_id = $user->facilities()->first()['id'];
			$result = $this->facilities->add_participants($facility_id, $request['file_key']);
			return $this->respondSuccess('results', $result);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /facility/{id}				 	Deletes a facility
     * @apiVersion 1.0.0
     * @apiName DELETE facility
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}		facility_id			ID of facility to delete
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function delete(Request $request, $id){

		if(in_array($request->get('privilege'), array('admin'))){
			$result = $this->facilities->delete($id);
			if(!is_string($result)){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}
	}

	/**
     * @api {put} /facility/image					Updates a facility's image
     * @apiVersion 1.0.0
     * @apiName PUT facility image
     * @apiGroup Facilities
	 *
	 * @apiParam	{string}	url					URL of new image
	 * @apiParam	{int}		disable				Whether to show / hide the banner image
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
				"facility": {
	 				"image_url": "http://hellochica.com/sarah-smith.jpg",
	 				"disable_image_banner": 0
                }
	 		}
     */
	public function image(Request $request){

		if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
			$user = User::where('id', '=', $request->get('auth_user_id'))->with('facilities')->get()[0];
			$facility_id = $user->facilities[0]->id;
			return $this->respondSuccess('facility', $this->facilities->image($facility_id, $request['url'], $request['disable']));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {put} /facility/{id}/activities				Updates activities associated with a facility
     * @apiVersion 1.0.0
     * @apiName PUT facility activities
     * @apiGroup Facilities
	 *
	 * @apiParam	{array}		facility_activities		Activities associated with facility
	 * @apiParam	{int}		id						ID of facility to update
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function update_activities(Request $request, $id){

		$user = User::where('id', '=', $request->get('auth_user_id'))->with('facility_leaders')->get()[0];
		$facility_ids = $user->facilities->pluck('id')->toArray();
		if($request->get('privilege') === 'admin' || ($request->get('privilege') === 'facility leader' && in_array($id, $facility_ids))){
			$this->facilities->update_activities($id, $request['facility_activities']);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /facility/participants/activities		Associates pariticpants to activities at a facility using a file uploaded by the user
     * @apiVersion 1.0.0
     * @apiName POST facility participants activities
     * @apiGroup Facilities
	 *
	 * @apiParam	{string}	file_key					S3 File key
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null,
	 			"results": {
					"imported_count": 4,
					"lines_not_added": [1]
				}
            }
     */
	public function add_participants_activities(Request $request){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$user = User::find($request->get('auth_user_id'));
			$facility_id = $user->facilities()->first()['id'];
			$result = $this->facilities->add_participants_activities($facility_id, $request['file_key']);
			return $this->respondSuccess('results', $result);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {delete} /facility/participant/activity/delete		Delete pariticipant activity
     * @apiVersion 1.0.0
     * @apiName DELETE facility participants activities
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}	facility_id					Facility ID
	 * @apiParam	{int}	activity_id					Activity ID
	 * @apiParam	{int}	user_id						User ID
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null
            }
     */
	public function delete_participant_activity(Request $request){

		$user = User::find($request->get('auth_user_id'));
		$facility_id = $user->facilities()->first()['id'];
		if(in_array($request->get('privilege'), array('facility leader')) || ($request['facility_id'] == $facility_id && $request['user_id'] == $user->id)){
			$result = $this->facilities->delete_participant_activity($request['facility_id'], $request['activity_id'], $request['user_id']);
			return $this->respondSuccess('results', $result);
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {post} /facility/participant/{id}/activities		Associates a particpant to activities at a facility
     * @apiVersion 1.0.0
     * @apiName POST facility participants activities
     * @apiGroup Facilities
	 *
	 * @apiParam	{int}	id							Participant ID
	 * @apiParam	{array}	activities					Activities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null
				}
            }
     */
	public function add_participant_activities(Request $request, $id){

		$user = User::find($request->get('auth_user_id'));
		if(in_array($request->get('privilege'), array('facility leader')) || $id == $user->id){
			$facility_id = $user->facilities()->first()['id'];
			$participant = User::find($id);
			foreach($request['activities'] as $activity){
				$this->facilities->associate_participant_to_activity($participant, $activity['id'], $activity['skill_level'], $activity['ranking'], $facility_id);
			}
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /facility/participants/activities			Get pariticpants activities at a facility
     * @apiVersion 1.0.0
     * @apiName GET facility participants activities
     * @apiGroup Facilities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    CSV File
            }
     */
	public function get_participants_activities(Request $request){

		if(in_array($request->get('privilege'), array('facility leader'))){
			$user = User::find($request->get('auth_user_id'));
			$facility = $user->facilities()->first();
			$this->download_send_headers(str_replace(' ', '-', $facility->name) . '-Participants-Activities.csv');
			echo $this->facilities->get_participants_activities($facility->id);
			die();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
     * @api {get} /facility/{id}/activity/{activity_id}/rankings	Get pariticpants' rankings for an activity
     * @apiVersion 1.0.0
     * @apiName GET facility activity rankings
     * @apiGroup Facilities
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null,
	 			"participants_rankings": [{
					"id": 2,
					"first_name": "Lo",
					"last_name": "Bo",
					"sex": "female",
					"email": "pihish1@yahoo.com",
					"username": "pihish1",
					"phone": "666-444-9999",
					"room": null,
					"membership_type": "member",
					"age_type": "adult",
					"image_url": null,
					"privilege": "participant",
					"active": 1,
					"created_at": "2018-05-22T22:06:59+00:00",
					"updated_at": "2018-05-22T22:06:59+00:00",
					"deleted_at": "1970-01-01T00:00:00+00:00",
					"pivot": {
						"activity_id": 1,
						"user_id": 2,
						"facility_id": 1,
						"skill_level": null,
						"ranking": null
					}
				}]
            }
     */
	public function get_participants_rankings(Request $request, $id, $activity_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_event_facility_ids = $user->event_leaders()->pluck('facility_id')->toArray();
		$event_facility_ids = $user->events()->pluck('facility_id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_event_facility_ids) || in_array($id, $event_facility_ids)){
			return $this->respondSuccess('participants_rankings', $this->facilities->get_participants_rankings($id, $activity_id));
		}
		else{
			return $this->respondUnauthorized();
		}

	}

	/**
	 * @api {put} /facility/{id}/activity/{activity_id}/user/{user_id]/rankings				Update a user's ranking
     * @apiVersion 1.0.0
     * @apiName PUT facility activity ranking
     * @apiGroup Facilities
	 *
	 * @apiParam	{decimal}	ranking														New user ranking
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
			    "success": true,
	  			"error": null
            }
     */
	public function update_participant_ranking(Request $request, $id, $activity_id, $user_id){

		$user = User::find($request->get('auth_user_id'));
		$leader_of_event_facility_ids = $user->event_leaders()->pluck('facility_id')->toArray();
		if(in_array($request->get('privilege'), array('admin', 'facility leader')) || in_array($id, $leader_of_event_facility_ids)){
			$result = $this->facilities->update_participant_ranking($id, $activity_id, $user_id, $request['ranking']);
			if(!is_string($result)){
				return $this->respondSuccess();
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => $result
				), 400);
			}
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}