teamsRIt.service('rsvpService', function($q, $http, internalConstants){

	// Get event info
	this.getEvent = function(token){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'event?token=' + token
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Get challenge info
	this.getChallenge = function(token, id){
		var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'event/challenge?token=' + token + '&id=' + id
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// RSVP for an event
	this.rsvp = function(token, preferredStartTime, action, actionId){
		var deferred = $q.defer();
		var paramsString = '?token=' + token;
        if(preferredStartTime){
			paramsString = paramsString + '&preferred_start_time=' + preferredStartTime;
		}
        if(action){
			paramsString = paramsString + '&action=' + action;
		}
        if(actionId){
			paramsString = paramsString + '&action_id=' + actionId;
		}
		$http({
            method: 'POST',
            url: internalConstants.baseURL + 'event/rsvp' + paramsString
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
	};

	// Sends e-mail to challenger
    this.emailChallenger = function(token, eventId, preferredStartTime, recipientEmails, challenger, challengee, playByDate, id){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'event/notify_challenger',
            data: $.param({
                token: token,
                event_id: eventId,
                preferred_start_time: preferredStartTime,
                recipient_emails: recipientEmails,
                challenger: challenger,
                challengee: challengee,
                play_by_date: playByDate,
                challenge_id: id
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

    // Gets a set of event rules matching event ID
    this.getRules = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/rules',
            data: $.param({
                event_id: eventId
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