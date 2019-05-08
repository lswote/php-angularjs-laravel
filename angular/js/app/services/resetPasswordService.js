teamsRIt.service('resetPasswordService', function($q, $http, internalConstants){

    // Resets a user's password
    this.reset = function(token, newPassword){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'password/reset',
            data: $.param({
				token: token,
                password: newPassword,
				password_confirmation: newPassword
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