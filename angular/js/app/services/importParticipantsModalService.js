teamsRIt.service('importParticipantsModalService', function($q, $http, internalConstants){

    // Tells the system to process our import participants list for a facility
    this.facility = function(fileKey){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility/participants',
			data: $.param({
				file_key: fileKey
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

    // Tells the system to process our import participants list for an event
    this.event = function(eventId, fileKey){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants',
			data: $.param({
				file_key: fileKey
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