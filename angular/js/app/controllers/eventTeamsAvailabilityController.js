teamsRIt.controller('eventTeamsAvailabilityController', function($scope, $rootScope, $routeParams, $window, eventTeamsAvailabilityService, eventService, editEventModalService,
																 dashboardService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventTeamsAvailability';
	// Our search filters
	$scope.filters = {
		gender: null,
		team: null,
		name: null,
		startDate: null,
		endDate: null
	};

	// Get all events where our user is a participant
	$scope.getEventsAsParticipant = function(){
		dashboardService.getEvents().then(function(data){
			$scope.participantEvents = data.events;
			var index = helperService.findArrayIndex($scope.participantEvents, 'id', $routeParams.id);
			if(index !== false){
				$scope.displayEventForm = true;
				$scope.isEventLeader = false;
				$scope.event = {
					id: $scope.participantEvents[index].id,
					name: $scope.participantEvents[index].name,
					activity_id: $scope.participantEvents[index].activity_id,
					facility_id: $scope.participantEvents[index].facility_id,
					event_type: $scope.participantEvents[index].event_type
				};
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
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false)){
				$scope.isEventLeader = true;
				$scope.getEvent();
			}
			else{
				eventService.getEventsAsCaptain().then(function(data){
					if($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false){
						$scope.isEventLeader = true;
						$scope.getEvent();
    				}
					else{
						if($rootScope.user.privilege === 'participant'){
							$scope.getEventsAsParticipant();
						}
					}
				});
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				activity_id: data.event.activity_id,
				facility_id: data.event.facility_id,
				event_type: data.event.event_type
			};
			$scope.eventUsers = data.event.users;
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Set start date filter if event is in progress
	$scope.setStartDateFilter = function(){
		var todaysDate = helperService.getTodaysDate();
		if(todaysDate > $scope.filters.startDate && todaysDate <= $scope.filters.endDate){
			for(var i = 1; i < $scope.roundDates.length; i++){
				if(todaysDate >= $scope.roundDates[i - 1]){
					$scope.filters.startDate = $scope.roundDates[i];
				}
			}
		}
	};

	// Get list of unique users
	$scope.parseUsersAvailability = function(){
		$scope.users = [];
		$scope.roundDates = [];
		$scope.teams = [];
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if(helperService.findArrayIndex($scope.users, 'id', $scope.usersAvailability[i].user.id) === false){
				$scope.users.push($scope.usersAvailability[i].user);
			}
			if($scope.roundDates.indexOf($scope.usersAvailability[i].date) === -1){
				$scope.roundDates.push($scope.usersAvailability[i].date);
			}
			if($scope.teams.indexOf($scope.usersAvailability[i].user.team_name) === -1){
				$scope.teams.push($scope.usersAvailability[i].user.team_name);
			}
		}
		$scope.filters.startDate = $scope.roundDates[0];
		$scope.filters.endDate = $scope.roundDates[$scope.roundDates.length - 1];
		$scope.setStartDateFilter();
	};

	// Filter participants by name
	$scope.filterUsersByName = function(users){
		var filteredUsers = [];
		var fullName;
		for(var i = 0; i < users.length; i++){
			fullName = users[i].first_name.toLowerCase() + ' ' + users[i].last_name.toLowerCase();
			if(fullName.indexOf($scope.filters.name.toLowerCase()) > -1){
				filteredUsers.push(users[i]);
			}
		}
		return filteredUsers;
	};

	// Filter participants by gender
	$scope.filterUsersByGender = function(users){
		var filteredUsers = [];
		for(var i = 0; i < users.length; i++){
			if(users[i].sex.toLowerCase() === $scope.filters.gender){
				filteredUsers.push(users[i]);
			}
		}
		return filteredUsers;
	};

	// Filter participants by team
	$scope.filterUsersByTeam = function(users){
		var filteredUsers = [];
		for(var i = 0; i < users.length; i++){
			if(users[i].team_name.toLowerCase() === $scope.filters.team){
				filteredUsers.push(users[i]);
			}
		}
		return filteredUsers;
	};

	// Filter shown users based on filters set
	$scope.filterUsers = function(){
		$scope.foundUsers = angular.copy($scope.users);
		for(var i in $scope.filters){
			if($scope.filters.hasOwnProperty(i)){
				if(i === 'name' && $scope.filters[i]){
					$scope.foundUsers = $scope.filterUsersByName($scope.foundUsers);
				}
				if(i === 'gender' && $scope.filters[i]){
					$scope.foundUsers = $scope.filterUsersByGender($scope.foundUsers);
				}
				if(i === 'team' && $scope.filters[i]){
					$scope.foundUsers = $scope.filterUsersByTeam($scope.foundUsers);
				}
			}
		}
	};

	// Filter rounds shown
	$scope.filterRounds = function(){
		$scope.shownRoundDates = [];
		for(var i = 0; i < $scope.roundDates.length; i++){
			if($scope.roundDates[i] >= $scope.filters.startDate && $scope.roundDates[i] <= $scope.filters.endDate){
				$scope.shownRoundDates.push($scope.roundDates[i]);
			}
		}
	};

	// Make sure end date is the same or after the start date
	$scope.$watch('filters.startDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.filters.endDate < newValue){
				$scope.filters.endDate = newValue;
			}
		}
	});

	// Make sure start date is the same or before the end date
	$scope.$watch('filters.endDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.filters.startDate > newValue){
				$scope.filters.startDate = newValue;
			}
		}
	});

	// Update visible users based on filters selected
	$scope.$watch('filters', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterUsers();
			$scope.filterRounds();
		}
	}, true);

	// Get user availability info
	$scope.getAvailability = function(){
		eventTeamsAvailabilityService.getAvailability($routeParams.id).then(function(data){
			$scope.usersAvailability = data.user_availability;
			$scope.parseUsersAvailability();
		});
	};
	$scope.getAvailability();

	// Update round availabilities
	$scope.updateAvailability = function(exit){
		$scope.callInProgress = true;
		if($scope.isEventLeader){
			eventTeamsAvailabilityService.updateAvailabilities($routeParams.id, $scope.usersAvailability).then(function(){
				$window.alert('Availabilites Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Availabilites not updated');
			});
		}
		else{
			eventTeamsAvailabilityService.updateAvailability($routeParams.id, $scope.usersAvailability).then(function(){
				$window.alert('Your Availability Has Been Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Availability not updated');
			});
		}
	};

	// Return the corresponding record ID given the user ID and date
	$scope.findEventTeamUserAvailabilityId = function(userId, date){
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.usersAvailability[i].user.id === userId && $scope.usersAvailability[i].date === date){
				return i;
			}
		}
		return false;
	};

	// Make helper function available in scope
	$scope.formatDate = helperService.formatDate;

});