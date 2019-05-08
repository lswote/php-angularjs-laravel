teamsRIt.service('eventToDosService', function($q, $http, $rootScope, internalConstants){

    this.getEventTodos = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/todos'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.updateEventTodos = function(eventId, todos){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/todos',
            data: $.param({
                event_id: eventId,
                event_to_dos: todos
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

    this.deleteEventTodo = function(eventId, todoId){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/todos/' + todoId
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
