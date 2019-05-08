teamsRIt.service('editRoundDatesModalService', function($q, $http, internalConstants){

	// Update round dates for an event
	this.updateRoundDates = function(eventId, rounds){
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/match/rounds',
			data: $.param({
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

});