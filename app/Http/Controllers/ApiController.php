<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class ApiController extends Controller{

	protected $datetimeColumns = ['created_at', 'updated_at', 'expires_at', 'deleted_at'];

	public $response, $request;

	public function __construct(ResponseFactory $response, Request $request){

		$this->response = $response;
		$this->request = $request;

	}

	// Tells us whether the string given is valid JSON
	protected function isJson($variable){

		if(gettype($variable) != 'string'){
			return false;
		}
		json_decode($variable);
		return (json_last_error() == JSON_ERROR_NONE);

	}

	// Check to see if a value is a datetime value.  If so, convert it to ISO 8601
	protected function checkForDatetime($key, $value){

		if(in_array($key, $this->datetimeColumns, true)){
			return date('c', strtotime($value));
		}
		else{
			return $value;
		}

	}

	// Recursively traverse an array
	protected function traverseArray($array){

		foreach($array as $key => $value){
			if(is_array($value)){
				$array[$key] = $this->traverseArray($value);
			}
			else{
				$array[$key] = $this->checkForDatetime($key, $value);
			}
		}
		return $array;

	}

	// Returns a JSON string with the appropriate HTTP code
	public function respond($data, $status_code = 200){

		// If this is an internal request we only return the data
		if($this->request->input('no-json')){
			return $data;
		}
		if($this->isJson($data)){
			return $this->response->make($data, $status_code);
		}
		return $this->response->json($data, $status_code);

	}

	// Respond success in our standard response format with the appropriate data
	public function respondSuccess($key = null, $value = null){

		$response = array(
			'success' => true,
			'error' => null
		);
		// Check to see if our key value is an array.  If not, convert it to an array
		if(!is_array($value)){
			$value = json_decode(json_encode($value), true);
		}
		if($value && is_array($value)){
			$value = $this->traverseArray($value);
		}
		if($key !== null){
			$response[$key] = $value;
		}
		return $this->respond($response, 200);

	}

	// Standard not found response
	public function respondNotFound(){

		return $this->respond(array(
			'success' => false,
			'error' => 'Resource not found'
		), 404);

	}

	// Standard record created response
	public function respondCreated(){

		return $this->respond(array(
			'success' => true,
			'error' => null
		), 201);

	}

	// Standard update success response
	public function respondUpdated(){

		return $this->respond(array(
			'success' => true,
			'error' => null
		), 202);

	}

	// Standard unauthorized response
	public function respondUnauthorized($message = 'Unauthorized'){

		$message = filter_var($message, FILTER_SANITIZE_STRING);
		return $this->respond(array(
			'success' => false,
			'error' => $message
		), 401);

	}

	// Turn our request object to an array
	public function sanitizeRequest(Request $request){

		$request = $request->toArray();
		return $request;

	}

}