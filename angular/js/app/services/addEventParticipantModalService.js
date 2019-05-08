teamsRIt.service('addEventParticipantModalService', function($q, $http, internalConstants){

	// Get list of all users who have already been invited to event
    this.getEventParticipants = function(id){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + id + '/participants'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Creates a new event participant
    this.addEventParticipant = function(id, username, participantType){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/participant',
			data: $.param({
                username: username,
                type: participantType
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