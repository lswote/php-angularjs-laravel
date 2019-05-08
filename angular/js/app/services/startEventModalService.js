teamsRIt.service('startEventModalService', function($q, $http, internalConstants){

	// Starts an event
	this.startEvent = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/start'
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