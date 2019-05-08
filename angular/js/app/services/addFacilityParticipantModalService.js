teamsRIt.service('addFacilityParticipantModalService', function($q, $http, internalConstants){

    // Creates a new facility participant
    this.addFacilityParticipant = function(participant){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility/participant',
			data: $.param({
				first_name: participant.firstName,
				last_name: participant.lastName,
				gender: participant.gender,
                email: participant.email,
				username: participant.username,
				phone: participant.phone,
				room: participant.room,
				password: participant.password,
				membership_type: participant.membershipType,
				active: participant.active,
				age_type: participant.ageType
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