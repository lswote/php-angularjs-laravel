<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Token;
use App\Interfaces\TokenInterface;

class TokenRepository implements TokenInterface{

	// Adds 24 hours to the expires_at datetime
	private function update_expires_at_date($token){

		return Token::where('token', '=', $token)->update(array(
        	'expires_at' => DB::raw('DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)')
		));

	}

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
     * Tells us whether a token is currently active.  Updates the expires_at date of the token if it's requested and we find the token
     *
     * @param   string   $token    				Token to check
     * @param 	boolean	 $update_expires_at		Whether to update the expires_at value if the token exists and is active
     *
     * @return  mixed
     *
     */
    public function is_active($token, $update_expires_at){

		$result = Token::where('token', '=', $token)->where('expires_at', '>', DB::raw('CURRENT_TIMESTAMP()'))
												    ->with('users.facilities')
												    ->get();
		if(count($result) > 0){
			if($update_expires_at === true){
				$this->update_expires_at_date($token);
			}
			if($result[0]->users){
				return array(
					'user_id' => $result[0]->user_id,
					'first_name' => $result[0]->users->first_name,
					'last_name' => $result[0]->users->last_name,
					'email' => $result[0]->users->email,
					'username' => $result[0]->users->username,
					'privilege' => $result[0]->users->privilege,
					'facility_id' => isset($result[0]->users->facilities[0]) ? $result[0]->users->facilities[0]->id : null
				);
			}

		}
		return false;

    }

    /*
     * Creates a new API token
     *
     * @param   int		$user_id		ID of user that the token is associated with
     *
     * @return  string
     *
     */
    public function create($user_id){

    	$token = $this->token_generator(64);
    	// Recursive function to generate another token if current token is taken
    	if($this->is_active($token, false) !== false){
    		$this->create($user_id);
		}
        Token::create(array(
        	'user_id' => $user_id,
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

        return Token::where('token', '=', $token)->update(array(
        	'expires_at' => DB::raw('CURRENT_TIMESTAMP()')
		));

    }

}