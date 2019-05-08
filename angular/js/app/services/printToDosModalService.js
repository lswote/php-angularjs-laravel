teamsRIt.service('printToDosModalService', function($q, $http, internalConstants){

    // Update multifacility match lines
    this.printToDos = function(id, tasks, status, size){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/todos/print',
			data: $.param({
				tasks: tasks,
				status: status,
				size: size
			}),
		    responseType: 'arraybuffer'
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