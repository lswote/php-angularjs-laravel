teamsRIt.service('editParticipantContactInfoModalService', function($q, $http, internalConstants){

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

	this.update_participants = function(eventId, participants){
		console.log(eventId, participants);
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: internalConstants.baseURL + 'v1/event/' + eventId + '/participants/updatecontact',
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

});