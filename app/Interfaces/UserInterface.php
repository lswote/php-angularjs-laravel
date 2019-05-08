<?php

namespace App\Interfaces;

interface UserInterface{

    /*
     * Returns all users who match the search criteria
     *
     * @param   array   $request            Request parameters of the call
     *
     * @return  collection
     *
     */
    public function get($request);

    /*
     * Tells us whether a user matching the parameters passed in exists
     *
     * @param   array   $request            Request parameters of the call
     *
     * @return  boolean
     *
     */
    public function exist($request);

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
	public function create($request, $privilege, $facility_id);

    /*
     * Updates an user
     *
     * @param   array   $request    Request parameters of the call
     * @param   int     $id         ID of user to update
     *
     * @return  int
     *
     */
    public function update($request, $id);

    /*
     * Updates a user's privilege
     *
     * @param   int     $id         ID of user to reactivate
     * @param   string	$privilege	New privilege to assign to user
	 *
     * @return  int
     *
     */
    public function privilege($id, $privilege);

    /*
     * Deactivates a user
     *
     * @param   int     $id         ID of user to deactivate
     *
     * @return  mixed
     *
     */
    public function deactivate($id);

    /*
     * Reactivates a user
     *
     * @param   int     $id         ID of user to reactivate
     *
     * @return  mixed
     *
     */
    public function reactivate($id);

}