teamsRIt.service('createFacilityModalService', function($q, $http, internalConstants){

    // Creates a new facility
    this.create = function(facility){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/facility',
			data: $.param({
				name: facility.name,
                address: facility.address,
                city: facility.city,
				state: facility.state,
				zip: facility.zip,
				parent_id: facility.parentId,
				expiration_date: facility.contractExpirationDate,
				paypal_link: facility.paypalLink
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