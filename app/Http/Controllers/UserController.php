<?php

namespace App\Http\Controllers;

use App\Interfaces\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Models\User;

class UserController extends ApiController{

	private $users;

    public function __construct(ResponseFactory $response, Request $request, UserInterface $users){

    	parent::__construct($response, $request);

    	$this->users = $users;

    }

    /**
     * @api {put} /user/{id}						Updates an existing user
     * @apiVersion 1.0.0
     * @apiName PUT user
     * @apiGroup Users
	 *
	 * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
			{
                   "success": true,
	  			   "error": null
            }
     */
	public function put(Request $request, $id){

		if(in_array($request->get('privilege'), array('admin', 'facility leader'))){
			$request = $this->sanitizeRequest($request);
			$this->users->update($request, $id);
			return $this->respondSuccess();
		}
		else{
			return $this->respondUnauthorized();
		}

	}

}