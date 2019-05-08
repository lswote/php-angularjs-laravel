teamsRIt.service('addEventLeaderModalService', function($q, $http, internalConstants){

    // Creates a new event leader
    this.addEventLeader = function(id, leader){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/leader',
			data: $.param({
                username: leader.username
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