teamsRIt.service('eventSignupsService', function($q, $http, internalConstants){

	// Update sign up status for current user
    this.updateSignup = function(eventUser){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventUser.event_id + '/signup',
			data: $.param({
				event_user: eventUser
            })
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Update sign up statuses for users
    this.updateSignups = function(eventUsers, completeEventSetupDone){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventUsers[0].event_id + '/users/signups',
			data: $.param({
				event_users: eventUsers,
				complete_event_setup_done: completeEventSetupDone
            })
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

});