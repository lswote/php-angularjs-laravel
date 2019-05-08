teamsRIt.service('addWaitlistedParticipantToTeamModalService', function($q, $http, internalConstants){

	// Get open team slots for an event
    this.getOpenSlots = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/open/slots'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Designate event team user slot as its team's captain
    this.setAsCaptain = function(eventId, eventTeamUserId){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/team/captain',
			data: $.param({
				event_team_user_id: eventTeamUserId
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