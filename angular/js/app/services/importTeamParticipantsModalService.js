teamsRIt.service('importTeamParticipantsModalService', function($q, $http, internalConstants){

    // Tells the system to process our import
    this.upload = function(eventId, fileKey){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/import',
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