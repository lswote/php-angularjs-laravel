teamsRIt.service('playingSurfacesModalService', function($q, $http, internalConstants){

	// Get surfaces associated with our event / facility
    this.getSurfaces = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/surfaces'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Update surfaces used by an event
    this.updateSelectedSurfaces = function(eventId, selectedSurfaces){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/surfaces',
			data: $.param({
				selected_surfaces: selectedSurfaces
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