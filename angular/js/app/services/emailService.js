teamsRIt.service('emailService', function($q, $http, internalConstants){

    // Get list of participants who match criteria set out by event
    this.getPotentialParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/default'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who do match criteria set out by event
    this.getPotentialAdditionalParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/additional'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who have been confirmed
    this.getConfirmedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/confirmed'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who have been confirmed and assigned to lines
    this.getConfirmedParticipantsWithLines = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/confirmed/with-lines'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who have not responded to an invite
    this.getNotRespondedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/unconfirmed'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who have been waitlisted
    this.getWaitlistedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/waitlisted'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Sends out an invite e-mail for an event to potential participants
    this.potentialParticipants = function(eventId, recipientEmails, customMessage){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/participants/potential',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipientEmails,
				custom_message: customMessage
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

    // Sends out an e-mail to confirmed participants
    this.participants = function(eventId, recipientEmails, customMessage){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/participants',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipientEmails,
				custom_message: customMessage
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

    // Sends out an e-mail reminder to confirmed participants
    this.participantsReminder = function(eventId, recipientEmails, customMessage){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/participants/reminder',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipientEmails,
				custom_message: customMessage
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

    // Sends out an e-mail to participants who have not RSVPed
    this.notRespondedParticipants = function(eventId, recipientEmails, customMessage){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/participants/not-responded',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipientEmails,
				custom_message: customMessage
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

    // Sends out an e-mail to waitlisted participants
    this.waitlistedParticipants = function(eventId, recipientEmails, customMessage){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/participants/waitlisted',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipientEmails,
				custom_message: customMessage
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