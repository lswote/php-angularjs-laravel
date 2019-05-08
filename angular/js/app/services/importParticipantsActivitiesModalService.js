teamsRIt.service('importParticipantsActivitiesModalService', function($q, $http, internalConstants){

    // Tells the system to process our import participants activities list
    this.upload = function(fileKey){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility/participants/activities',
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