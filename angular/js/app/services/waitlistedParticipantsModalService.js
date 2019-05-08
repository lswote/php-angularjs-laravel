teamsRIt.service('waitlistedParticipantsModalService', function($q, $http, internalConstants){

	// Get all waitlisted users
    this.getWaitlistedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/waitlisted'
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