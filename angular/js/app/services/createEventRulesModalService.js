teamsRIt.service('createEventRulesModalService', function($q, $http, internalConstants){

    // Creates a new set of event rules
    this.createLadderRules = function(eventId, eventRules){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/rules',
				data: $.param({
                event_id: eventRules.eventId,
                default_values: 0,
                num_sets: eventRules.numSets,
                num_challenges: eventRules.numChallenges,
                num_opp_challenges: eventRules.numOppChallenges,
                num_team_challenges: eventRules.numTeamChallenges,
                num_spots_up: eventRules.numSpotsUp,
                num_spots_down: eventRules.numSpotsDown,
                allow_challenge_next: eventRules.allowChallengeNext,
                switch_or_jump: eventRules.switchOrJump,
                deny_challenge_rank: eventRules.denyChallengeRank,
                deny_accept_rank: eventRules.denyAcceptRank,
                withdrawal_rank: eventRules.withdrawalRank,
                accept_not_played_rank: eventRules.acceptNotPlayedRank,
                days_accept_challenge: eventRules.daysAcceptChallenge,
                days_play_challenge: eventRules.daysPlayChallenge,
                days_after_completed: eventRules.daysAfterCompleted
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
    this.getLadderRules = function(eventId){
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

	// Get event
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

    this.updateEvent = function(eventId, event){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/notes',
				data: $.param({
                notes: event.notes
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
