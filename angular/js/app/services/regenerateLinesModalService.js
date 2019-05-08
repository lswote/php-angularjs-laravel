teamsRIt.service('regenerateLinesModalService', function($q, $http, internalConstants){

	// Regenerates matches / lines for an event
	this.regenerateLines = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/lines/regenerate'
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