teamsRIt.service('changePasswordModalService', function($q, $http, internalConstants){

	// Makes a request to change the current user's password
    this.changePassword = function(currentPassword, newPassword){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/password',
			data: $.param({
				current_password: currentPassword,
				new_password: newPassword
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