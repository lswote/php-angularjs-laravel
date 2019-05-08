teamsRIt.service('eventTeamsAvailabilityService', function($q, $http, internalConstants){

	// Get user availability info
	this.getAvailability = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/availability'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Update users' availabilities
	this.updateAvailabilities = function(eventId, usersAvailabilities){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/availabilities',
			data: $.param({
				users_availabilities: usersAvailabilities
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

	// Update user's availability
	this.updateAvailability = function(eventId, userAvailabilities){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/availability',
			data: $.param({
				user_availabilities: userAvailabilities
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