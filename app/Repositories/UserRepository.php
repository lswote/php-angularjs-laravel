<?php

namespace App\Repositories;

use App\Interfaces\UserInterface;
use App\Models\User;
use App\Models\Facility;
use App\Jobs\SendFacilityLeaderWelcome;

class UserRepository implements UserInterface{

    /*
     * Returns all users who match the search criteria
     *
     * @param   array   $request            Request parameters of the call
     *
     * @return  collection
     *
     */
    public function get($request){

        if($request === ''){
            return User::withTrashed()->with('facilities')->get();
        }
        else{
            return User::withTrashed()->with('facilities')->where(array_only($request, User::$search_columns))->get();
        }

    }

    /*
     * Tells us whether a user matching the parameters passed in exists
     *
     * @param   array   $request            Request parameters of the call
     *
     * @return  boolean
     *
     */
    public function exist($request){

    	if($request === ''){
            return User::exists();
        }
        else{
            return User::where(array_only($request, User::$search_columns))->exists();
        }

	}

	/*
     * Creates a new user and associates the user with a facility
     *
     * @param   array   $request            Request parameters of the call
	 * @param	string	$privilege			Privilege level of new user
	 * @param	int		$facility_id		ID of facility to associate with user
     *
     * @return  object
     *
     */
	public function create($request, $privilege, $facility_id){

    	$user = User::create(array(
			'first_name' => $request['first_name'],
			'last_name' => $request['last_name'],
			'email' => $request['email'],
			'username' => $request['username'],
			'password' => bcrypt($request['password']),
			'active' => 1,
			'privilege' => $privilege,
		));
    	$user->facilities()->attach($facility_id);
    	if($privilege === 'facility leader'){
    		$facility = Facility::find($request['facility_id']);
    		dispatch(new SendFacilityLeaderWelcome($request['username'], $facility->name, $request['first_name'], $request['password'], $request['email']));
		}
    	return $user;

	}

    /*
     * Updates an user
     *
     * @param   array   $request    Request parameters of the call
     * @param   int     $id         ID of user to update
     *
     * @return  int
     *
     */
    public function update($request, $id){

    	// Don't allow the user to change their privilege level through this endpoint
		if(isset($request['privilege'])){
    		unset($request['privilege']);
		}
    	if(isset($request['password'])){
			$request['password'] = bcrypt($request['password']);
		}
        $user = User::where('id', '=', $id);
        return $user->update($request);

    }

    /*
     * Updates a user's privilege
     *
     * @param   int     $id         ID of user to reactivate
     * @param   string	$privilege	New privilege to assign to user
	 *
     * @return  int
     *
     */
    public function privilege($id, $privilege){

    	if(in_array($privilege, array('admin', 'facility leader', 'participant'))){
    		$user = User::where('id', '=', $id);
			return $user->update(array(
				'privilege' => $privilege
			));
		}
		else{
    		return 'Privilege level not found';
		}

	}

    /*
     * Deactivates a user
     *
     * @param   int     $id         ID of user to deactivate
     *
     * @return  mixed
     *
     */
    public function deactivate($id){

		$user = User::where('id', '=', $id);
		if($user->exists()){
			return $user->delete();
		}
		else{
			return 'No user found with the given ID';
		}

	}

	/*
     * Reactivates a user
     *
     * @param   int     $id         ID of user to reactivate
     *
     * @return  mixed
     *
     */
    public function reactivate($id){

		$user = User::where('id', '=', $id)->withTrashed();
		if($user->exists()){
			return $user->restore();
		}
		else{
			return 'No user found with the given ID';
		}

	}

}