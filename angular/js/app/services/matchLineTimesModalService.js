teamsRIt.service('matchLineTimesModalService', function($q, $http, internalConstants){

    // Get all matches for an event
    this.getEventMatches = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/matches'
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