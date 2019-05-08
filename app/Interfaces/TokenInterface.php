<?php

namespace App\Interfaces;

interface TokenInterface{

    /*
     * Tells us whether a token is currently active.  Updates the expires_at date of the token if it's requested and we find the token
     *
     * @param   string   $token    				Token to check
     * @param 	boolean	 $update_expires_at		Whether to update the expires_at value if the token exists and is active
     *
     * @return  mixed
     *
     */
    public function is_active($token, $update_expires_at);

    /*
     * Creates a new API token
     *
     * @param   int		$user_id		ID of user that the token is associated with
     *
     * @return  string
     *
     */
    public function create($user_id);

    /*
     * Expire the token passed in
     *
     * @param   string   $token    Token to void
     *
     * @return  int
     *
     */
    public function void($token);

}