teamsRIt.service('addSubToLineupModalService', function($q, $http, internalConstants){

	// Adds a sub to a team for a round
    this.addSubstitute = function(eventId, eventTeamId, eventTeamUserAvailabilityId){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/substitute/assignment',
			data: $.param({
				event_team_id: eventTeamId,
				event_team_user_availability_id: eventTeamUserAvailabilityId
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