teamsRIt.service('addSubAvailabilityModalService', function($q, $http, internalConstants){

	// Get current subs for an event
	this.getSubstitutes = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/substitutes'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

	// Adds a new sub to our event
    this.addSubstitute = function(eventId, username){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/substitute',
			data: $.param({
				username: username
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