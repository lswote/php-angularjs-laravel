teamsRIt.service('forgotPasswordService', function($q, $http, internalConstants){

    // Sends a password reset e-mail
    this.sendEmail = function(username){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'password/reset/email',
            data: $.param({
                username: username
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