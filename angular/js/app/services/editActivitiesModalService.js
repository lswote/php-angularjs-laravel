teamsRIt.service('editActivitiesModalService', function($q, $http, internalConstants){

    this.addParticipantsActivities = function(participantId, activities){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility/participant/' + participantId + '/activities',
			data: $.param({
				activities: activities
			})
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){activity_id,
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.deleteActivity = function(facilityId, activityId, userId){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/facility/participant/activity/delete',
			data: $.param({
				facility_id: facilityId,
				activity_id: activityId,
				user_id: userId
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