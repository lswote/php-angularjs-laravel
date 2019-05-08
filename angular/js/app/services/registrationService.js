teamsRIt.service('registrationService', function($q, $http, internalConstants){

    // Registers a new user
    this.register = function(token, email, username, password, firstName, lastName){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'register',
            data: $.param({
				token: token,
                email: email,
				username: username,
                password: password,
				first_name: firstName,
				last_name: lastName
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