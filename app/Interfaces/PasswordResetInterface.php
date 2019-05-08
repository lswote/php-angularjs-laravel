<?php

namespace App\Interfaces;

interface PasswordResetInterface{

	/*
     * Tells us whether a token is currently active
     *
     * @param   string   $token    				Token to check
     *
     * @return  mixed
     *
     */
    public function is_active($token);

	/*
     * Creates a new password reset token
     *
     * @param   string	$username				Username associated with user we want to generate a token for
     *
     * @return  string
     *
     */
    public function create($username);

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