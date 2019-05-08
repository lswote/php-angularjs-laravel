teamsRIt.service('doNotMatchModalService', function($q, $http, internalConstants){

	// Get all do not match requests for an event
    this.getDoNotMatchRequests = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/do_not_match_requests'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Deletes a do not match request
    this.deleteRequest = function(requestId){
    	var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/events/do_not_match_request/' + requestId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	}

});