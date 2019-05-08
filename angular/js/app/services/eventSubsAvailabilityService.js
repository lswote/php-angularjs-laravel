teamsRIt.service('eventSubsAvailabilityService', function($q, $http, internalConstants){

	// Get subs availability info
	this.getSubsAvailability = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/subs/availability'
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