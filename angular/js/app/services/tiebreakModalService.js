teamsRIt.service('tiebreakModalService', function($q, $http, internalConstants){

	// Get teams with loss stats
	this.getTeamsWithStats = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/stats'
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