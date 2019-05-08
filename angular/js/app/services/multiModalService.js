teamsRIt.service('multiModalService', function($q, $http, internalConstants){

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

	this.getCaptain = function(eventId){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/captain/get'
		})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	this.getEventLeader = function(eventId){
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

	this.getFacilityInfo = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: internalConstants.baseURL + 'v1/facility'
		})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	this.delete_participant = function(eventId, userId){
		var deferred = $q.defer();
		$http({
			method: 'DELETE',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/participant/delete',
			data: $.param({
				user_id: userId
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

	// Adds facility / directions to list of multifacility locations
	this.addDirections = function(eventId, facility){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/directions/add',
			data: $.param({
				facility: facility
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

	this.editDirections = function(eventId, facilityId, facility){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/directions/edit',
			data: $.param({
				facility_id: facilityId,
				facility: facility
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

	this.deleteDirections = function(eventId, facilityId){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/directions/delete',
			data: $.param({
				facility_id: facilityId
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

	this.getDirections = function(eventId){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/directions/get'
		})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	this.updateMatches = function(eventId, matches){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/matches/update',
			data: $.param({
				matches: matches
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

	// Get all matches for an event
	this.getEventMatches = function(eventId){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/matches/multi'
		})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	// Send custom email
	this.sendCustomEmail = function(eventId, recipients, data){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/email/custom',
			data: $.param({
				event_id: eventId,
				recipient_emails: recipients,
				data: data
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

    // Generates match directions
    this.generateMatchDirections = function(id, size, rounds){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/match/directions',
			data: $.param({
				size: size,
				rounds: rounds
			}),
		    responseType: 'arraybuffer'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Generates a scorecard
    this.generateScorecard = function(id, size, round, roundDate){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/scorecard/multi',
			data: $.param({
				size: size,
				round: round,
				round_date: roundDate
			}),
		    responseType: 'arraybuffer'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.sendTeamMemberLineup = function(id, recipients, message, roundDate, directions){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/lineup/email',
			data: $.param({
				recipients: recipients,
				message: message,
				round_date: roundDate,
				directions: directions
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

    // Sends e-mail related to availability for participants
    this.sendIndividualAvailability = function(id, recipients, rounds){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/availability/email',
			data: $.param({
				recipients: recipients,
				rounds: rounds
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

    // Update multifacility match lines
    this.updateMatchLines = function(id, lines){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/event/' + id + '/lines/multi',
			data: $.param({
				lines: lines
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