teamsRIt.service('editEventModalService', function($q, $http, internalConstants){

	// Get info about an event
	this.getEvent = function(eventId, allAssociatedUsers){
		var deferred = $q.defer();
		var param = '';
		if(allAssociatedUsers){
			param = param + '?all_associated_users=1'
		}
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + param
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

    // Edits an event
    this.edit = function(event){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + event.id,
			data: $.param(event)
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