<?php

// Default index page
Route::get('/', function (){
    return view('welcome');
});

// Auth and registration endpoints
Route::post('login', 'ApiAuthController@login');
Route::delete('logout', 'ApiAuthController@logout');
Route::post('register', 'ApiAuthController@register');
Route::post('password/reset/email', 'ApiAuthController@postEmail');
Route::put('password/reset', 'ApiAuthController@postReset');

// Event RSVP endpoints
Route::get('event', 'EmailController@get_event_by_rsvp_token');
Route::get('event/challenge', 'EmailController@get_event_challenge_by_rsvp_token');
Route::post('event/notify_challenger', 'EmailController@notify_challenger');
Route::post('event/rsvp', 'EmailController@rsvp');

// Homepage used endpoint
Route::post('contact', 'HomepageController@post');

// Routes available only after authentication
Route::group(['prefix' => 'v1', 'middleware' => ['auth.api']], function(){

	Route::get('verify', 'ApiAuthController@verifyToken');

	Route::put('password', 'ApiAuthController@put');

	Route::get('facilities', 'FacilityController@get');
	Route::get('facility', 'FacilityController@get_own_facility_info');
	Route::get('facility/participants', 'FacilityController@get_participants');
	Route::get('facility/{id}', 'FacilityController@get_by_id');
	Route::post('facility', 'FacilityController@post');
	Route::post('facility/leader', 'FacilityController@create_and_add_leader');
	Route::delete('facility/{id}/leader', 'FacilityController@delete_leader');
	Route::post('facility/participant', 'FacilityController@add_participant');
	Route::post('facility/participants', 'FacilityController@add_participants');
	Route::post('facility/participants/activities', 'FacilityController@add_participants_activities');
	Route::get('facility/participants/activities', 'FacilityController@get_participants_activities');
	Route::post('facility/participant/{id}/activities', 'FacilityController@add_participant_activities');
	Route::delete('/facility/participant/activity/delete', 'FacilityController@delete_participant_activity');
	Route::get('facility/{id}/participants/export', 'FacilityController@get_participants_export');
	Route::put('facility/{id}', 'FacilityController@put');
	Route::delete('facility/{id}', 'FacilityController@delete');
	Route::put('facility/image', 'FacilityController@image');
	Route::put('facility/{id}/activities', 'FacilityController@update_activities');
	Route::get('facility/{id}/activity/{activity_id}/rankings', 'FacilityController@get_participants_rankings');
	Route::put('facility/{id}/activity/{activity_id}/user/{user_id}/ranking', 'FacilityController@update_participant_ranking');

	Route::get('events', 'EventController@get');
	Route::get('event/{id}', 'EventController@get_by_id');
	Route::get('event/{id}/participants', 'EventController@get_all_participants');
	Route::get('event/{id}/participants/export', 'EventController@get_participants_export');
	Route::post('event/{id}/participants/updatecontact', 'EventController@update_participants_contact_info');
	Route::get('event/{id}/participants/unconfirmed', 'EventController@get_non_confirmed_participants');
	Route::get('event/{id}/participants/confirmed', 'EventController@get_confirmed_participants');
	Route::get('event/{id}/participants/confirmed/with-lines', 'EventController@get_confirmed_participants_with_lines');
	Route::get('event/{id}/participants/waitlisted', 'EventController@get_waitlisted_participants');
	Route::post('event/{id}/do_not_match_request', 'EventController@add_do_not_match_request');
	Route::delete('events/do_not_match_request/{do_not_match_request_id}', 'EventController@delete_do_not_match_request');
	Route::get('events/leader', 'EventController@get_as_event_leader');
	Route::get('events/captain', 'EventController@get_as_captain');
	Route::get('event/{id}/leaders', 'EventController@get_leaders');
	Route::post('event', 'EventController@post');
	Route::post('event/{id}/leader', 'EventController@add_leader');
	Route::delete('event/{id}/leader/{user_id}', 'EventController@delete_leader');
	Route::post('event/{id}/participant', 'EventController@add_participant');
	Route::delete('event/{id}/participant/delete', 'MultifacilityController@delete_participant');
	Route::post('event/{id}/participants', 'EventController@add_participants');
	Route::put('event/{id}', 'EventController@put');
	Route::post('event/{id}/notes', 'EventController@update_notes');
	Route::put('event/{id}/start', 'EventController@start_event');
	Route::post('event/{id}/start_date', 'EventController@update_start_date');
	Route::put('event/{id}/close', 'EventController@close_event');
	Route::get('event/{id}/scorecard/{size}', 'EventController@get_scorecard');
	Route::post('event/{id}/scorecard/multi', 'MultifacilityController@get_scorecard');
	Route::get('event/{id}/surfaces', 'EventController@get_surfaces');
	Route::put('event/{id}/surfaces', 'EventController@update_selected_surfaces');
	Route::get('event/{id}/surfaces/selected', 'EventController@get_selected_surfaces');
	Route::get('event/{id}/participants/default', 'EventController@get_default_participants');
	Route::get('event/{id}/participants/additional', 'EventController@get_additional_participants');
	Route::get('event/{id}/substitutes', 'EventController@get_substitutes');
	Route::post('event/{id}/substitute', 'EventController@add_substitute');
	Route::post('event/{id}/substitute/assignment', 'EventController@add_substitute_assignment');
	Route::put('event/{id}/signup', 'EventController@update_signup');
	Route::put('event/{id}/users/signups', 'EventController@update_signups');
	Route::get('event/{id}/open-time-slots', 'EventController@get_open_time_slots_info');

	Route::get('event/{id}/participants/available', 'LadderEventController@get_available_participants');
	Route::get('event/{id}/participants/withdrawn/{user_id}', 'LadderEventController@get_withdrawn_participants');
	Route::put('event/{id}/participant/withdraw', 'LadderEventController@withdraw_participant');
	Route::put('event/{id}/participant/return/{user_id}', 'LadderEventController@return_participant');
	Route::get('event/{id}/participants/nondropped', 'EventController@get_non_dropped_participants');
	Route::post('event/{id}/participants/update', 'LadderEventController@update_participants');
	Route::get('event/{id}/do_not_match_requests', 'LadderEventController@get_do_not_match_teams_requests');
	Route::get('event/{id}/pairs', 'LadderEventController@get_pairs');
	Route::get('event/{id}/pairs/active', 'LadderEventController@get_active_pairs');
	Route::post('event/{id}/pair/add', 'LadderEventController@add_pair');
	Route::put('event/{id}/pair/return/{pair_id}', 'LadderEventController@return_pair');
	Route::post('event/{id}/pairs/update', 'LadderEventController@update_pairs');
	Route::put('event/{id}/pairs/withdraw', 'LadderEventController@withdraw_pairs');
	Route::get('event/{id}/pairs/withdrawn/get/{user_id}', 'LadderEventController@get_withdrawn_pairs');
	Route::post('event/{id}/challenge/add', 'LadderEventController@add_challenge');
	Route::post('event/{id}/challenge/update', 'LadderEventController@update_challenge');
	Route::post('event/{id}/challenge/reset', 'LadderEventController@reset_challenge');
	Route::post('event/{id}/challenge/responses', 'LadderEventController@challenge_responses');
	Route::post('event/{id}/challenge/delete', 'LadderEventController@delete_challenge');
	Route::get('event/{id}/challenges/{user_id}', 'LadderEventController@get_challenges');
	Route::get('event/{id}/challenges/accepted/{user_id}', 'LadderEventController@get_accepted_challenges');
	Route::get('event/{id}/challenges/unplayed/{user_id}', 'LadderEventController@get_unplayed_challenges');
	Route::get('event/{id}/challenges/played/{user_id}', 'LadderEventController@get_played_challenges');
	Route::get('event/{id}/challenges/unaccepted/{user_id}', 'LadderEventController@get_unaccepted_challenges');
	Route::get('event/{id}/summaryreport', 'ReportController@get_ladder_summary_report');
	Route::get('event/{id}/captain/get', 'MultifacilityController@get_captain');
	Route::get('event/{id}/settings/{user_id}', 'LadderEventController@get_user_settings');
	Route::post('event/{id}/settings/{user_id}', 'LadderEventController@set_user_settings');

	Route::post('event/{id}/rules', 'EventRuleController@create_event_rules');
	Route::put('event/{id}/rules', 'EventRuleController@update_event_rules');
	Route::get('event/{id}/rules', 'EventRuleController@get_event_rules');

	Route::post('event/{id}/directions/add', 'MultifacilityController@add_directions');
	Route::post('event/{id}/directions/edit', 'MultifacilityController@edit_directions');
	Route::post('event/{id}/directions/delete', 'MultifacilityController@delete_directions');
	Route::get('event/{id}/directions/get', 'MultifacilityController@get_directions');

	Route::post('lines', 'LineController@create_lines');
	Route::get('event/{id}/lines', 'LineController@get_event_lines');
	Route::post('event/{id}/lines/multi', 'MultifacilityController@update_match_lines');
	Route::put('event/{id}/lines', 'LineController@update_lines');
	Route::post('event/{id}/lines/regenerate', 'LineController@regenerate_lines');
	Route::put('lines/scores', 'LineController@update_lines_scores');
	Route::put('lines/surfaces', 'LineController@update_lines_surfaces');
	Route::get('event/{id}/lines/results-entered', 'LineController@event_lines_results_entered');

	Route::get('event/{id}/teams', 'EventTeamController@get');
	Route::post('event/{id}/teams', 'EventTeamController@post');
	Route::post('event/{id}/team', 'EventTeamController@create_team');
	Route::put('event/{id}/teams', 'EventTeamController@put');
	Route::get('event/{id}/teams/stats', 'EventTeamController@get_stats');
	Route::put('event/{id}/teams/captains', 'EventTeamController@update_captains');
	Route::post('event/{id}/teams/complete', 'EventTeamController@complete');
	Route::delete('event/{id}/teams', 'EventTeamController@delete');
	Route::get('event/{id}/unassigned-group', 'EventTeamController@get_next_unassigned_group');
	Route::post('event/{id}/teams/import', 'EventTeamController@import');
	Route::get('event/{id}/teams/availability', 'EventTeamController@get_availability');
	Route::get('event/{id}/subs/availability', 'EventTeamController@get_subs_availability');
	Route::put('event/{id}/teams/availabilities', 'EventTeamController@update_availabilities');
	Route::put('event/{id}/teams/availability', 'EventTeamController@update_availability');
	Route::get('event/{id}/standings', 'EventTeamController@get_standings');
	Route::put('event/{id}/lineups', 'EventTeamController@update_lineups');
	Route::post('event/{id}/lineup/email', 'MultifacilityController@send_lineup');
	Route::post('event/{id}/availability/email', 'MultifacilityController@send_availability');
	Route::get('event/{id}/open/slots', 'EventTeamController@get_open_slots');
	Route::put('event/{id}/team/captain', 'EventTeamController@set_new_team_captain');
	Route::get('event/{id}/teams/scores', 'EventMatchController@get_team_scores');

	Route::get('event/{id}/matches', 'EventMatchController@get_event_matches');
	Route::get('event/{id}/matches/playoff', 'EventMatchController@get_event_playoff_matches');
	Route::get('event/{id}/matches/multi', 'MultifacilityController@get_event_matches');
	Route::get('event/{id}/match/lines', 'EventMatchController@get_lines_per_match');
	Route::put('event/{id}/match/rounds', 'EventMatchController@update_round_dates');
	Route::post('event/{id}/matches/update', 'MultifacilityController@update_matches');
	Route::post('event/{id}/match/directions', 'MultifacilityController@get_match_directions');
	Route::put('event/{id}/matches', 'EventMatchController@put');

	Route::get('event/{id}/todos', 'EventToDoController@get');
	Route::put('event/{id}/todos', 'EventToDoController@put');
	Route::post('event/{id}/todos/print', 'EventToDoController@print_todos');
	Route::delete('event/{id}/todos/{to_do_id}', 'EventToDoController@delete');

    Route::post('email/notify_challengers', 'EmailController@notify_challengers');
	Route::post('email/notify_challenge_update', 'EmailController@notify_challenge_update');
	Route::post('email/challenge', 'EmailController@challenge');
	Route::post('email/custom', 'EmailController@send_custom_email');
	Route::post('email/participants/potential', 'EmailController@potential_participants');
	Route::post('email/participants', 'EmailController@participants');
	Route::post('email/participants/reminder', 'EmailController@participants_reminder');
	Route::post('email/participants/not-responded', 'EmailController@not_responded_participants');
	Route::post('email/participants/waitlisted', 'EmailController@waitlisted_participants');

	Route::put('user/{id}', 'UserController@put');

	Route::get('activities', 'ActivityController@get');
	Route::post('activity', 'ActivityController@post');
	Route::put('activity/{id}', 'ActivityController@put');

});