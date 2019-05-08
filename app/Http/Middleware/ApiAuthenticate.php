<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Closure;
use App\Http\Controllers\ApiController;

class ApiAuthenticate extends ApiController{

    private $tokens, $users;

    public function __construct(ResponseFactory $response, Request $request, \App\Interfaces\TokenInterface $tokens, \App\Interfaces\UserInterface $users){

    	parent::__construct($response, $request);

        $this->tokens = $tokens;
        $this->users = $users;

    }

	// Check if user auth is valid
    private function user_auth($request, $next){

		$token = !empty($request->header('API-Token')) ? $request->header('API-Token') : $request->api_token;
		$result = $this->tokens->is_active($token, true);
		if($result !== false){
			$request->attributes->add(array(
				'auth_user_id' => $result['user_id'],
				'facility_id' => $result['facility_id'],
				'privilege' => $result['privilege'],
			));
			return $next($request);
		}
		else{
			return $this->respond(array(
				'success' => false,
				'error' => 'Invalid API Token'
			), 403);
		}

	}

    /**
     * Authenticate an incoming API request
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next){

    	return $this->user_auth($request, $next);

    }

}