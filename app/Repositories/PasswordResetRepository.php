<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\PasswordReset;
use App\Interfaces\PasswordResetInterface;

class PasswordResetRepository implements PasswordResetInterface{

	// Generates a random API token
	private function token_generator($length){

		$keyspace = '0123456789abcdefghijklmnopqrstuvwxyz';
		$str = '';
		$max = mb_strlen($keyspace, '8bit') - 1;
		for($i = 0; $i < $length; ++$i){
			$str = $str . $keyspace[random_int(0, $max)];
		}
		return $str;

	}

    /*
     * Tells us whether a token is currently active
     *
     * @param   string   $token    				Token to check
     *
     * @return  mixed
     *
     */
    public function is_active($token){

		$token = PasswordReset::where('token', '=', $token)->where('expires_at', '>', DB::raw('CURRENT_TIMESTAMP()'));
		if($token->exists()){
			$token = $token->first();
			return $token->username;
		}
		else{
			return false;
		}

    }

    /*
     * Creates a new password reset token
     *
     * @param   string	$username				Username associated with user we want to generate a token for
     *
     * @return  string
     *
     */
    public function create($username){

    	$token = $this->token_generator(64);
    	// Recursive function to generate another token if current token is taken
    	if($this->is_active($token) !== false){
    		$this->create($username);
		}
        PasswordReset::create(array(
        	'username' => $username,
			'token' => $token,
			'expires_at' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)')
		));
        return $token;

    }

    /*
     * Expire the token passed in
     *
     * @param   string   $token    Token to void
     *
     * @return  int
     *
     */
    public function void($token){

        return Passwordreset::where('token', '=', $token)->update(array(
        	'expires_at' => DB::raw('CURRENT_TIMESTAMP()')
		));

    }

}