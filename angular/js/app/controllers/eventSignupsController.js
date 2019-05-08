teamsRIt.controller('eventSignupsController', function($scope, $rootScope, $routeParams, $window, eventSignupsService, eventService, editEventModalService, dashboardService,
													   eventLinesService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventSignups';
	// Our search filters
	$scope.filters = {
		name: null,
		gender: null,
		status: null,
		preferredStartTime: null
	};
	// Default sort config
	$scope.sort =  {
		sortBy: 'name'
	};
	$scope.sortByArray = ['sex', 'first_name', 'last_name'];

	// Get all events where our user is a participant
	$scope.getEventsAsParticipant = function(){
		dashboardService.getEvents().then(function(data){
			$scope.participantEvents = data.events;
			var index = helperService.findArrayIndex($scope.participantEvents, 'id', $routeParams.id);
			if(index !== false){
				$scope.displayEventForm = true;
				$scope.isEventLeader = false;
				$scope.participants = [{
					id: $rootScope.user.id,
					first_name: $rootScope.user.first_name,
					last_name: $rootScope.user.last_name,
					sex: $scope.participantEvents[index].users[0].sex,
					events: [{
						pivot: $scope.participantEvents[index].users[0].pivot
					}]
				}];
				$scope.parseParticipants();
				$scope.event = {
					id: $scope.participantEvents[index].id,
					startTime: $scope.participantEvents[index].start_time,
					numOfStartTimes: $scope.participantEvents[index].num_of_start_times,
					standardLineDuration: $scope.participantEvents[index].standard_line_duration,
					activityId: $scope.participantEvents[index].activity_id,
					facilityId: $scope.participantEvents[index].facility_id
				};
				$scope.getParticipantsRankings();
				$scope.parseAvailableStartTimes();
			}
			else{
				$scope.displayEventForm = false;
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Get all events where our user is a leader
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || ($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false))){
				$scope.isEventLeader = true;
				$scope.getEvent();
			}
			else{
				if($rootScope.user.privilege === 'participant'){
					$scope.getEventsAsParticipant();
				}
				else{
					$scope.displayEventForm = false;
				}
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get our users' rankings for this activity at our facility
	$scope.getParticipantsRankings = function(){
		eventLinesService.getParticipantsRankings($scope.event.activityId, $scope.event.facilityId).then(function(data){
			for(var i = 0; i < data.participants_rankings.length; i++){
				var index = helperService.findArrayIndex($scope.participants, 'id', data.participants_rankings[i].id);
				if(index !== false){
					$scope.participants[index].ranking = data.participants_rankings[i].pivot.ranking ? data.participants_rankings[i].pivot.ranking : '0.00';
				}
			}
			$scope.filterParticipants();
		});
	};

	// Parse our scope.participants array
	$scope.parseParticipants = function(){
		for(var i = 0; i < $scope.participants.length; i++){
			var status;
			if($scope.isEventLeader === true){
				if($scope.participants[i].events[0].pivot.confirmed === 0 && $scope.participants[i].events[0].pivot.waitlisted === 0 &&
				   $scope.participants[i].events[0].pivot.unavailable === 0){
					status = 'available'
				}
				else if($scope.participants[i].events[0].pivot.confirmed === 1){
					status = 'in';
				}
				else if($scope.participants[i].events[0].pivot.waitlisted === 1){
					status = 'waitlisted';
				}
				else if($scope.participants[i].events[0].pivot.unavailable === 1){
					status = 'unavailable'
				}
				else{
					status = '';
				}
			}
			else{
				if($scope.participants[i].events[0].pivot.unavailable === 1){
					status = 'unavailable'
				}
				else{
					status = 'available';
				}
			}
			$scope.participants[i].events[0].pivot.status = status;
			$scope.participants[i].events[0].pivot.rsvped_formatted = helperService.formatDate($scope.participants[i].events[0].pivot.rsvped).slice(0, -4) + ' ' +
																   	  helperService.formatTime($scope.participants[i].events[0].pivot.rsvped);
			$scope.participants[i].events[0].pivot.preferred_start_time_formatted = $scope.participants[i].events[0].pivot.preferred_start_time ? helperService.parseTime($scope.participants[i].events[0].pivot.preferred_start_time) : '';
		}
	};

	// Filter participants by name
	$scope.filterParticipantsByName = function(participants){
		var filteredParticipants = [];
		var fullName;
		for(var i = 0; i < participants.length; i++){
			fullName = participants[i].first_name.toLowerCase() + ' ' + participants[i].last_name.toLowerCase();
			if(fullName.indexOf($scope.filters.name.toLowerCase()) > -1){
				filteredParticipants.push(participants[i]);
			}
		}
		return filteredParticipants;
	};

	// Filter participants by gender
	$scope.filterParticipantsByGender = function(participants){
		var filteredParticipants = [];
		for(var i = 0; i < participants.length; i++){
			if(participants[i].sex.toLowerCase() === $scope.filters.gender){
				filteredParticipants.push(participants[i]);
			}
		}
		return filteredParticipants;
	};

	// Filter participants by status
	$scope.filterParticipantsByStatus = function(participants){
		var filteredParticipants = [];
		for(var i = 0; i < participants.length; i++){
			if(participants[i].events[0].pivot.status === $scope.filters.status){
				filteredParticipants.push(participants[i]);
			}
		}
		return filteredParticipants;
	};

	// Filter participants by preferred start time
	$scope.filterParticipantsByPreferredStartTime = function(participants){
		var filteredParticipants = [];
		for(var i = 0; i < participants.length; i++){
			if(participants[i].events[0].pivot.preferred_start_time === $scope.filters.preferredStartTime){
				filteredParticipants.push(participants[i]);
			}
		}
		return filteredParticipants;
	};

	// Filter participants
	$scope.filterParticipants = function(){
		$scope.foundParticipants = angular.copy($scope.participants);
		for(var i in $scope.filters){
			if($scope.filters.hasOwnProperty(i)){
				if(i === 'name' && $scope.filters[i]){
					$scope.foundParticipants = $scope.filterParticipantsByName($scope.foundParticipants);
				}
				if(i === 'gender' && $scope.filters[i]){
					$scope.foundParticipants = $scope.filterParticipantsByGender($scope.foundParticipants);
				}
				if(i === 'status' && $scope.filters[i]){
					$scope.foundParticipants = $scope.filterParticipantsByStatus($scope.foundParticipants);
				}
				if(i === 'preferredStartTime' && $scope.filters[i]){
					$scope.foundParticipants = $scope.filterParticipantsByPreferredStartTime($scope.foundParticipants);
				}
			}
		}
	};

	// Update our sort by array based on the sort option chosen
	$scope.$watch('sort.sortBy', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue === 'name'){
				$scope.sortByArray = ['sex', 'first_name', 'last_name'];
			}
			else if(newValue === 'ranking'){
				$scope.sortByArray = ['sex', '-ranking'];
			}
		}
	});

	// Keep our scope.participants array properties in sync with scope.foundParticipants
	$scope.$watch('foundParticipants', function(newValue, oldValue){
		if(newValue !== oldValue){
			for(var i = 0; i < newValue.length; i++){
				var index = helperService.findArrayIndex($scope.participants, 'id', newValue[i].id);
				$scope.participants[index].events[0].pivot.status = newValue[i].events[0].pivot.status;
				$scope.participants[index].events[0].pivot.preferred_start_time = newValue[i].events[0].pivot.preferred_start_time;
			}
		}
	}, true);

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id, true).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				eventType: data.event.event_type,
				typeOfPlay: data.event.type_of_play,
				eventLeaderName: data.event.event_leaders.length > 0 ? data.event.event_leaders[0].first_name + ' ' + data.event.event_leaders[0].last_name : null,
				startDate: data.event.start_date,
				startTime: data.event.start_time,
				numOfStartTimes: data.event.num_of_start_times,
				standardLineDuration: data.event.standard_line_duration,
				activityId: data.event.activity_id,
				facilityId: data.event.facility_id
			};
			$scope.completeEventSetupDone = data.event.comb_play !== null ? 1 : 0;
			$scope.participants = data.event.users;
			$scope.parseParticipants();
			$scope.getParticipantsRankings();
			$scope.parseAvailableStartTimes();
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Bring function into scope
	$scope.findArrayIndex = helperService.findArrayIndex;

	// Filter our participants results based on the search term provided
	$scope.$watch('filters', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterParticipants();
		}
	}, true);

	// Parse the available start times for our event
	$scope.parseAvailableStartTimes = function(){
		$scope.availableStartTimes = [{
			start_time: $scope.event.startTime,
			start_time_formatted: helperService.parseTime($scope.event.startTime)
		}];
		for(var i = 1; i < $scope.event.numOfStartTimes; i++){
			var startTimeInMinutes = helperService.convertMilitaryTimeToMinutes($scope.event.startTime) + ($scope.event.standardLineDuration * i);
			var startTimeString = helperService.convertMinutesToMilitaryTime(startTimeInMinutes);
			$scope.availableStartTimes.push({
				start_time: startTimeString,
				start_time_formatted: helperService.parseTime(startTimeString)
			});
		}
	};

	// Build our user signups array
	$scope.buildSignupsArray = function(){
		var signupsArray = [];
		for(var i = 0; i < $scope.participants.length; i++){
			signupsArray.push($scope.participants[i].events[0].pivot);
		}
		return signupsArray;
	};

	// Update our user event sign up statuses
	$scope.updateStatuses = function(exit){
		$scope.callInProgress = true;
		var signupsArray = $scope.buildSignupsArray();
		if($scope.isEventLeader){
			eventSignupsService.updateSignups(signupsArray, $scope.completeEventSetupDone).then(function(){
				$window.alert('Signup Statuses Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Signup statuses not updated');
			});
		}
		else{
			eventSignupsService.updateSignup(signupsArray[0]).then(function(){
				$window.alert('Your Status Has Been Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Signup status not updated');
			});
		}
	}

});