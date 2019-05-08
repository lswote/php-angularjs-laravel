teamsRIt.service('dashboardImageModalService', function($q, $http, internalConstants){

    // Updates facility image
    this.image = function(url, disable){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/facility/image',
			data: $.param({
				url: url,
				disable: disable
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