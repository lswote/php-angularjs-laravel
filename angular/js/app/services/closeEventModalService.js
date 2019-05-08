teamsRIt.service('closeEventModalService', function($q, $http, internalConstants){

	// Closes an event
	this.closeEvent = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/close'
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