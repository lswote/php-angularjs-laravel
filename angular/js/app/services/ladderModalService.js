teamsRIt.service('ladderModalService', function($q, $http, internalConstants){

	// Get all events associated with a user
    this.getEvent = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId

        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Update start time for an event
    this.updateStartDate = function(eventId, startDate){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/start_date',
            data: $.param({
                start_date: startDate
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

    // Get list of participants who have been confirmed
    this.getConfirmedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/available'
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
    this.getNonDroppedParticipants = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/nondropped'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get list of participants who have been confirmed and not withdrawn
    this.getWithdrawnParticipants = function(eventId, userId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/withdrawn/' + userId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.updateParticipants = function(eventId, participants){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/update',
            data: $.param({
                participants: participants
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

    this.withdrawParticipant = function(eventId, participantId, withdrawType){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participant/withdraw',
            data: $.param({
                user_id: participantId,
                withdraw_type: withdrawType
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

    this.returnParticipant = function(eventId, participantId){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/participant/return/' + participantId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.getPairs = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pairs'

        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.getActivePairs = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pairs/active'

        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.addPair = function(eventId, userId1, userId2){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pair/add',
            data: $.param({
                userid1: userId1,
                userid2: userId2
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

    this.updatePairs = function(eventId, pairs){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pairs/update',
            data: $.param({
                pairs: pairs
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

    this.withdrawPairs = function(eventId, pairIds, withdrawType){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pairs/withdraw',
            data: $.param({
                pair_ids: pairIds,
                withdraw_type: withdrawType
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

    this.getWithdrawnPairs = function(eventId, userId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pairs/withdrawn/get/' + userId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.returnPair = function(eventId, pairId){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/pair/return/' + pairId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

   // Get list of challenges for this participant
    this.getChallenges = function(eventId, participantId){

        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenges/' + participantId
        })  
            .success(function(data){
                deferred.resolve(data);
            })  
            .error(function(data){
                deferred.reject(data);
            }); 
        return deferred.promise;
    };  

   // Get list of challenges who have been confirmed
    this.getAcceptedChallenges = function(eventId, accessId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenges/accepted/' + accessId
        })  
            .success(function(data){
                deferred.resolve(data);
            })  
            .error(function(data){
                deferred.reject(data);
            }); 
        return deferred.promise;
    };  

   // Get list of challenges who have been confirmed and unplayed
    this.getUnplayedChallenges = function(eventId, accessId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenges/unplayed/' + accessId
        })  
            .success(function(data){
                deferred.resolve(data);
            })  
            .error(function(data){
                deferred.reject(data);
            }); 
        return deferred.promise;
    };  

   // Get list of challenges who have been confirmed and played
    this.getPlayedChallenges = function(eventId, accessId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenges/played/' + accessId
        })  
            .success(function(data){
                deferred.resolve(data);
            })  
            .error(function(data){
                deferred.reject(data);
            }); 
        return deferred.promise;
    };  

   // Get list of challenges who have not been confirmed
    this.getUnacceptedChallenges = function(eventId, accessId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenges/unaccepted/' + accessId
        })  
            .success(function(data){
                deferred.resolve(data);
            })  
            .error(function(data){
                deferred.reject(data);
            }); 
        return deferred.promise;
    };  

    this.addChallenge = function(eventId, userId1, userId2){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenge/add',
            data: $.param({
                challenger_id: userId1,
                challengee_id: userId2
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

    // delete challenge
    this.deleteChallenge = function(eventId, challengeId){

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenge/delete',
            data: $.param({
                challenge_id: challengeId
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

    // update challenge
    this.updateChallenge = function(eventId, challengeData){

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenge/update',
            data: $.param({
                challenge_data: challengeData
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

    // reset challenge
    this.resetChallenge = function(eventId, challengeId){

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenge/reset',
            data: $.param({
                challenge_id: challengeId
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

    this.emailChallengers = function(eventId, recipientEmails, messageData, id){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/challenge',
            data: $.param({
                event_id: eventId,
                recipient_emails: recipientEmails,
                messageData: messageData,
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

    this.notifyChallengers = function(eventId, challengeData){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/notify_challengers',
            data: $.param({
                event_id: eventId,
                challenge_data: challengeData
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

    this.emailUpdatedChallenges = function(eventId, recipientEmails, customMessage, challenger, challengee){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/email/notify_challenge_update',
            data: $.param({
                event_id: eventId,
                recipient_emails: recipientEmails,
                custom_message: customMessage,
                challenger: challenger,
                challengee: challengee
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

    // Gets user settings
    this.getUserSettings = function(eventId, userId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/settings/' + userId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Sets user settings
    this.saveUserSettings = function(eventId, userId, settings){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/settings/' + userId,
            data: $.param({
                settings: settings
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

    // Send challenge responses
    this.challengeResponses = function(eventId, responses){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/challenge/responses',
            data: $.param({
                responses: responses
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

    // Get summary report
    this.getSummaryReport = function(eventId, days){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/summaryreport' + '?days='+days
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
