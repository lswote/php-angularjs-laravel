teamsRIt.service('createEventModalService', function($q, $http, internalConstants){

    // Creates a new event
    this.create = function(event){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event',
			data: $.param({
                name: event.name,
                activity_id: event.activityId,
                event_type: event.eventType,
                event_sub_type: event.eventSubType,
                type_of_play: event.typeOfPlay,
                rounds_interval_metric: event.roundsIntervalMetric,
                rounds_interval: event.roundsInterval,
                rounds: event.rounds,
                standard_line_duration: event.standardLineDuration,
                gender_type: event.genderType,
                participant_charge: event.participantCharge,
                charge_cc: event.chargeCc,
                start_date: event.startDate,
                start_time: event.startTime,
                num_of_start_times: event.numOfStartTimes,
                event_leader_username: event.eventLeaderUsername,
                for_age_type: event.ageType,
                for_membership_type: event.membershipType,
                for_active: event.activeStatus
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