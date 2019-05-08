teamsRIt.service('deleteFacilityLeaderModalService', function($q, $http, internalConstants){

    // Deletes a facility leader
    this.deleteFacilityLeader = function(facilityId, leaderId){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/facility/' + facilityId + '/leader',
			data: $.param({
				leader_id: leaderId
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