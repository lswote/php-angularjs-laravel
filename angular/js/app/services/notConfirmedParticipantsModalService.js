teamsRIt.service('notConfirmedParticipantsModalService', function($q, $http, internalConstants){

	// Get all non-confirmed users
    this.getNotConfirmedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/unconfirmed'
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