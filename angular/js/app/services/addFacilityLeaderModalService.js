teamsRIt.service('addFacilityLeaderModalService', function($q, $http, internalConstants){

	// Get available facilities
	this.getFacilities = function(){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/facilities'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

    // Creates a new facility leader
    this.addFacilityLeader = function(leader){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility/leader',
			data: $.param({
				facility_id: leader.facilityId,
				first_name: leader.firstName,
                last_name: leader.lastName,
                email: leader.email,
				username: leader.username,
				password: leader.password
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