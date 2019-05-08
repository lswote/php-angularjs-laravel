teamsRIt.service('editCaptainsModalService', function($q, $http, internalConstants){

	// Update event team captains for an event
    this.updateEventTeamCaptains = function(eventId, eventTeamUsers){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/captains',
			data: $.param({
				event_team_users: eventTeamUsers
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