teamsRIt.service('authService', function($q, $http, internalConstants){

    // Auths our login credentials and returns an API token if our credentials are valid
    this.login = function(username, password){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'login',
            data: $.param({
                username: username,
                password: password
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

    // Checks whether our API token is valid
    this.authAPIToken = function(){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/verify'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Deactivates user's API token
    this.logout = function(){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'logout'
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