teamsRIt.service('editParticipantModalService', function($q, $http, internalConstants){

	// Get info about an event
    this.getParticipants = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/facility/participants'
        })
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Update user info
    this.update = function(user) {
        var deferred = $q.defer();
        var fields = ['first_name', 'last_name', 'sex', 'email', 'username', 'phone', 'remember_token', 'room', 'membership_type', 'age_type', 'image_url', 'privilege', 'active',
                      'alta_number', 'usta_number', 'receive_email', 'affiliation'];
        var updateObj = {};
        for(var index = 0; index < fields.length; index++){
            var field = fields[index];
            updateObj[field] = user[field];
        }
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/user/' + user.id,
            data: $.param(updateObj)
        })
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

});