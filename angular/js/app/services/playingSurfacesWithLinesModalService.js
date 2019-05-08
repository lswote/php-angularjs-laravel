teamsRIt.service('playingSurfacesWithLinesModalService', function($q, $http, internalConstants){

	// Get surfaces selected for our event
    this.getSurfaces = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/surfaces/selected'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Updates surface assignments for matches
    this.updateSurfaceAssignments = function(eventId, matches){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/lines/surfaces',
			data: $.param({
                lines_surfaces: matches
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