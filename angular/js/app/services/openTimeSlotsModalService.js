teamsRIt.service('openTimeSlotsModalService', function($q, $http, internalConstants){

	// Get info related to open time slots
    this.getOpenTimeSlotsInfo = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/open-time-slots'
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