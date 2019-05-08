<?php

namespace App\Http\Controllers;

use App\Models\RegistrationToken;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendPasswordReset;

class ApiAuthController extends ApiController{

	private $tokens, $users, $password_resets;

    public function __construct(ResponseFactory $response, Request $request, \App\Interfaces\TokenInterface $tokens,
								\App\Interfaces\UserInterface $users, \App\Interfaces\PasswordResetInterface $password_resets){

    	parent::__construct($response, $request);

        $this->tokens = $tokens;
		$this->users = $users;
		$this->password_resets = $password_resets;

    }

    /**
     * @api {post} /login	Returns an API token if credentials provided are valid
     * @apiVersion 1.0.0
     * @apiName POST login
     * @apiGroup Auth
     *
     * @apiParam    {string}    username        Username to verify
     * @apiParam    {string}    password        Password to verify
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  		    "user": {
	  				"token": "gag0iigeu9gw7n7n3am9wp8xdgyxp0kgzvn6cyjgiqbezhqu8wzkjx3fjw7w60dw",
                    "id": 3,
					"first_name": "Giant",
	                "last_name": "Sloth",
					"email": "admin@teamsrit.com",
	                "username": "admin",
	                "facility_id": 4
					"privilege": "admin"
	  			}
            }
     */
	public function login(Request $request){

    	$result = Auth::attempt(array(
    		'username' => $request['username'],
			'password' => $request['password']
		));
    	if($result){
    		$token = $this->tokens->create(Auth::user()->id);
    		$user = $this->users->get(array(
				'id' => Auth::user()->id
			))[0];
    		return $this->respondSuccess('user', array(
				'token' => $token,
				'id' => Auth::user()->id,
				'first_name' => Auth::user()->first_name,
				'last_name' => Auth::user()->last_name,
				'email' => Auth::user()->email,
				'username' => Auth::user()->username,
				'facility_id' => isset($user->facilities[0]) ? $user->facilities[0]->id : null,
				'privilege' => Auth::user()->privilege
			));
		}
		else{
    		return $this->respond(array(
    			'success' => false,
				'error' => 'Invalid credentials'
			), 403);
		}

	}

	/**
     * @api {delete} /logout	Deactivates an API token
     * @apiVersion 1.0.0
     * @apiName DELETE logout
     * @apiGroup Auth
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
            }
     */
	public function logout(Request $request){

		$result = $this->tokens->void($request->header('API-Token'));
		if($result > 0){
			return $this->respondSuccess();
		}
		else{
			return $this->respond(array(
    			'success' => false,
				'error' => 'Token provided was not active',
			), 400);
		}

	}

	/**
     * @api {get} /v1/verify	If request makes it to this function, it has a valid API token attached to its header
     * @apiVersion 1.0.0
     * @apiName GET verify
     * @apiGroup Auth
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
				"user": {
                    "id": 3,
					"first_name": "Giant",
	                "last_name": "Sloth",
					"email": "admin@teamsrit.com",
	                "username": "admin",
	                "facility_id": 4
					"privilege": "admin"
				}
            }
     */
	public function verifyToken(Request $request){

		$token = $request->header('API-Token');
		$token = filter_var($token, FILTER_SANITIZE_STRING);

		$result = $this->tokens->is_active($token, false);
		return $this->respondSuccess('user', array(
			'id' => $result['user_id'],
			'first_name' => $result['first_name'],
			'last_name' => $result['last_name'],
			'email' => $result['email'],
			'username' => $result['username'],
			'facility_id' => $result['facility_id'],
			'privilege' => $result['privilege']
		));

	}

	/**
     * @api {post} /register	Registers a new user
     * @apiVersion 1.0.0
     * @apiName POST register
     * @apiGroup Auth
     *
	 * @apiParam	{string}	first_name		First name of user
	 * @apiParam	{string}	last_name 		Last name of user
     * @apiParam    {string}    email         	E-Mail of user
	 * @apiParam    {string}    username        Username of user
     * @apiParam    {string}    password        Password for user
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	  		    "user": {
	  				"token": "gag0iigeu9gw7n7n3am9wp8xdgyxp0kgzvn6cyjgiqbezhqu8wzkjx3fjw7w60dw",
                    "id": 3,
					"first_name": "Giant",
	                "last_name": "Sloth",
					"email": "admin@teamsrit.com",
	                "username": "admin",
	                "facility_id": 4
					"privilege": "admin"
	  			}
            }
     */
	public function register(Request $request){

		$requested_email_array = array(
			'email' => $request['email']
		);
		if($this->users->exist($requested_email_array)){
			return $this->respond(array(
				'success' => false,
				'error' => 'E-Mail taken'
			), 400);
		}
		else{
			$registration_token = RegistrationToken::where('token', '=', $request['token']);
			if($registration_token->exists()){
				$registration_token = $registration_token->get()[0];
				$user = $this->users->create($request, 'participant', $registration_token->facility_id);
				// Associate signed up user with an event
				if(!empty($registration_token->event_id)){
					$user->events()->attach($registration_token->event_id, array(
						'confirmed' => 1
					));
				}
				$token = $this->tokens->create($user->id);
				return $this->respondSuccess('user', array(
					'token' => $token,
					'id' => $user->id,
					'first_name' => $user->first_name,
					'last_name' => $user->first_name,
					'email' => $user->email,
					'username' => $user->username,
					'facility_id' => $registration_token->facility_id,
					'privilege' => 'participant'
				));
			}
			else{
				return $this->respond(array(
					'success' => false,
					'error' => 'Invalid token'
				), 400);
			}
		}

	}

	/**
     * @api {post} /password/reset/email		Sends a password reset e-mail to an user
     * @apiVersion 1.0.0
     * @apiName POST password reset e-mail
     * @apiGroup Auth
     *
     * @apiParam    {string}    username        Username of user that we want to reset password for
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function postEmail(Request $request){

        try{
        	$user = User::where('username', '=', $request['username']);
        	if($user->exists()){
        		$user = $user->first();
				$token = $this->password_resets->create($request['username']);
				dispatch(new SendPasswordReset($user, $token));
        		return $this->respondSuccess();
			}
			else{
        		return $this->response->json(array(
					'success' => false,
					'error' => 'Invalid username'
				), 400);
			}
        }
        catch(\Exception $e){
            return $this->response->json(array(
				'success' => false,
				'error' => trans($e->getMessage())
			), 400);
        }

    }

	/**
     * @api {put} /password/reset						Resets an user's password
     * @apiVersion 1.0.0
     * @apiName PUT password reset
     * @apiGroup Auth
     *
     * @apiParam    {string}    username         		Username associated with user
     * @apiParam    {string}    password        		New password
	 * @apiParam    {string}    password_confirmation   New password confirmation
	 * @apiParam    {string}    token         			Token to help verify that request has permission to reset user password
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null,
	 			"user": {
	  				"token": "gag0iigeu9gw7n7n3am9wp8xdgyxp0kgzvn6cyjgiqbezhqu8wzkjx3fjw7w60dw",
                    "id": 3,
					"first_name": "Giant",
	                "last_name": "Sloth",
					"email": "admin@teamsrit.com",
	                "username": "admin",
	                "facility_id": 4
					"privilege": "admin"
	  			}
            }
     */
    public function postReset(Request $request){

    	$result = $this->password_resets->is_active($request['token']);
    	if($result !== false){
    		$user = User::where('username', '=', $result)->first();
    		$user->update(array(
    			'password' => bcrypt($request['password'])
			));
    		$this->password_resets->void($request['token']);
    		$token = $this->tokens->create($user->id);
			return $this->respondSuccess('user', array(
				'token' => $token,
				'id' => $user->id,
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'email' => $user->email,
				'username' => $user->username,
				'facility_id' => isset($user->facilities[0]) ? $user->facilities[0]->id : null,
				'privilege' => $user->privilege
			));
		}
		else{
    		return $this->response->json(array(
				'success' => false,
				'error' => 'Invalid token'
			), 400);
		}

    }

    /**
     * @api {put} /password								Change the current user's password
     * @apiVersion 1.0.0
     * @apiName PUT password
     * @apiGroup Auth
     *
     * @apiParam    {string}    current_password        Current user password
	 * @apiParam    {string}    new_password   			New password for user
	 *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
    public function put(Request $request){

    	$user = User::find($request->get('auth_user_id'));
    	$result = Hash::check($request['current_password'], $user->password);
    	if($result){
    		$user->update(array(
    			'password' => bcrypt($request['new_password'])
			));
    		return $this->respondSuccess();
		}
		else{
    		return $this->respond(array(
    			'success' => false,
				'error' => 'Current password is invalid'
			), 403);
		}

	}

}