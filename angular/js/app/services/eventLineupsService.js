teamsRIt.service('eventLineupsService', function($q, $http, internalConstants){

	// Update lineups for our league event
	this.updateLineups = function(eventId, lineups){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/lineups',
			data: $.param({
				lineups: lineups
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