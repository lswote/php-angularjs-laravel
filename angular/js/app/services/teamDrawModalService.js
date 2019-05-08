teamsRIt.service('teamDrawModalService', function($q, $http, internalConstants){

	// Get the next unassigned group for the event
	this.getNextUnassignedGroup = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/unassigned-group'
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