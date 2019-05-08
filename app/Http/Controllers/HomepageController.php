<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use App\Jobs\SendHomepageMessage;

class HomepageController extends ApiController{

    public function __construct(ResponseFactory $response, Request $request){

    	parent::__construct($response, $request);

    }

    /**
     * @api {post} /contact						Sends a message to an internal e-mail address from the homepage
     * @apiVersion 1.0.0
     * @apiName POST homepage contact
     * @apiGroup Homepage
     *
	 * @apiParam	{string}	name			Name of person sending message
     * @apiParam    {string}    email         	E-mail to reply to
     * @apiParam    {string}    subject         Subject of message
	 * @apiParam	{string}	body			Message content
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
            {
                "success": true,
	  			"error": null
            }
     */
	public function post(Request $request){

		try{
    		dispatch(new SendHomepageMessage($request->all()));
			return $this->respondSuccess();
		}
		catch(\Exception $e){
    		return $this->respond(array(
    			'success' => false,
				'error' => $e->getMessage()
			), 400);
		}

	}

}