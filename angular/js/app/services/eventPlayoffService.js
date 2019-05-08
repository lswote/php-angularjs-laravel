teamsRIt.service('eventPlayoffService', function($q, $http, internalConstants){

	// Get our playoff matches
	this.getPlayoffMatches = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/matches/playoff'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Get team scores for our event
	this.getTeamScores = function(eventId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/scores'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Update our playoff matches / team seedings
	this.updatePlayoffMatches = function(eventId, playoffMatches){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/matches',
			data: $.param({
				matches: playoffMatches
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