teamsRIt.service('editFacilityModalService', function($q, $http, internalConstants){

    // Updates a facility
    this.update = function(facility){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/facility/' + facility.id,
			data: $.param({
                name: facility.name,
				address: facility.address,
				city: facility.city,
				state: facility.state,
				zip: facility.zip,
				parent_id: facility.parent_id,
				expiration_date: facility.contract_expiration_date,
				paypal_link: facility.paypal_link
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