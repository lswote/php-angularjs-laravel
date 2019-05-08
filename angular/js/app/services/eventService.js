teamsRIt.service('eventService', function($q, $http, internalConstants){

	// Get all events where our user is a leader
    this.getEventsAsLeader = function(){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/events/leader'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get all events where our user is a leader
    this.getEventsAsCaptain = function(){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/events/captain'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Get leaders for an event
    this.getEventLeaders = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/leaders'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Remove an event leader
    this.deleteEventLeader = function(eventId, userId){
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/leader/' + userId
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Creates lines for an event
    this.createEventLines = function(eventId, sets, linesAggregate){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/lines',
            data: $.param({
                event_id: eventId,
                sets: sets,
                lines_aggregate: linesAggregate
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

    // Creates teams for an event
    this.createEventTeams = function(eventId, linesAggregate, numOfFemalesToRemove, numOfMalesToRemove){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams',
            data: $.param({
                per_round_lines_aggregate: linesAggregate,
                num_of_females_to_remove: numOfFemalesToRemove,
                num_of_males_to_remove: numOfMalesToRemove
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

    // Creates a team for a multifacility event
    this.createEventTeam = function(eventId, linesAggregate){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/team',
            data: $.param({
                per_round_lines_aggregate: linesAggregate
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

    // Get all lines for an event
    this.getEventLines = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/lines'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Updates matches for an event
    this.updateEventMatches = function(eventId, matches){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/lines',
            data: $.param({
                lines: matches
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

    // Updates scores for lines
    this.updateEventLinesScores = function(linesScores){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/lines/scores',
            data: $.param({
                lines_scores: linesScores
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

    // Tell us whether results for an event's matches have been entered
    this.getEventMatchResultsEntered = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/lines/results-entered'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Grab group / team info about an event
    this.getEventTeams = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Update an event's team / group assignments
    this.updateEventTeams = function(eventId, eventTeams){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams',
            data: $.param({
                event_teams: eventTeams
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

    // Tells the system our team draw participant assignments are complete
    this.updateEventTeamsComplete = function(eventId){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + eventId + '/teams/complete'
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