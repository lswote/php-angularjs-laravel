teamsRIt.service('perRoundLinesModalService', function($q, $http, internalConstants){

	// Get number and type of lines for a match
    this.getLinesPerMatch = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/match/lines'
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