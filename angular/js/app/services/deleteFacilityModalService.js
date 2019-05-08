teamsRIt.service('deleteFacilityModalService', function($q, $http, internalConstants){

    // Deletes a facility
    this.delete = function(facilityId){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/facility/' + facilityId
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