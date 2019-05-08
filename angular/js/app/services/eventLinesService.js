teamsRIt.service('eventLinesService', function($q, $http, internalConstants){

	// Get users' rankings
	this.getParticipantsRankings = function(activityId, facilityId){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/facility/' + facilityId + '/activity/' + activityId + '/rankings'
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