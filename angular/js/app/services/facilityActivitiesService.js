teamsRIt.service('facilityActivitiesService', function($q, $http, internalConstants){

	// Get info about a facility
	this.getFacilityInfo = function(id){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/facility/' + id
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Updates a facility's activities
	this.update = function(id, facilityActivities){
		var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/facility/' + id + '/activities',
			data: $.param({
                facility_activities: facilityActivities
            })
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	}

});