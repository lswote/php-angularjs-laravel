teamsRIt.controller('eventTeamsController', function($scope, $rootScope, $routeParams, $window, eventLinesService, eventService, editEventModalService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventTeams';
	// Default filter values
	$scope.startGroup = '1';
	$scope.showGender = null;
	// Selected checkboxes
	$scope.selectedUsers = [];
	// Selected checkboxes detailed
	$scope.selectedUsersDetailed = [];

	// Get all events where our user is a leader
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || ($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false))){
				$scope.getEvent();
			}
			else{
				eventService.getEventsAsCaptain().then(function(data){
					if($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false){
						$scope.getEvent();
					}
					else{
						$scope.displayEventForm = false;
					}
				}, function(){
					$scope.displayEventForm = false;
				});
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get our users' rankings for this activity at our facility
	$scope.getParticipantsRankings = function(){
		eventLinesService.getParticipantsRankings($scope.event.activityId, $scope.event.facilityId).then(function(data){
			$scope.participantRankings = data.participants_rankings;
		});
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				eventType: data.event.event_type,
				activityId: data.event.activity_id,
				facilityId: data.event.facility_id
			};
			$scope.eventUsers = data.event.users;
			$scope.getParticipantsRankings();
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Build arrays for our group filter dropdowns
	$scope.buildEventTeamsCountArrays = function(){
		var maxWomenGroupNumber = 0;
		var maxMenGroupNumber = 0;
		for(var i = 0; i < $scope.eventTeamUsers.length; i++){
			if($scope.eventTeamUsers[i].sex === 'female'){
				if($scope.eventTeamUsers[i].group_number > maxWomenGroupNumber){
					maxWomenGroupNumber = $scope.eventTeamUsers[i].group_number;
				}	
			}
			else if($scope.eventTeamUsers[i].sex === 'male'){
				if($scope.eventTeamUsers[i].group_number > maxMenGroupNumber){
					maxMenGroupNumber = $scope.eventTeamUsers[i].group_number;
				}
			}
		}
		$scope.eventWomenGroupsCountArray = [];
		for(var y = 1; y <= maxWomenGroupNumber; y++){
			$scope.eventWomenGroupsCountArray.push(y);
		}
		$scope.eventMenGroupsCountArray = [];
		for(var z = 1; z <= maxMenGroupNumber; z++){
			$scope.eventMenGroupsCountArray.push(z);
		}
		if($scope.eventWomenGroupsCountArray.length > $scope.eventMenGroupsCountArray.length){
			$scope.eventGroupsCountArray = $scope.eventWomenGroupsCountArray;
			$scope.endGroup = $scope.eventWomenGroupsCountArray.length.toString();
		}
		else{
			$scope.eventGroupsCountArray = $scope.eventMenGroupsCountArray;
			$scope.endGroup = $scope.eventMenGroupsCountArray.length.toString();
		}
	};

	// Get all group / team info for an event
	$scope.getEventTeams = function(){
		eventService.getEventTeams($routeParams.id).then(function(data){
			$scope.eventTeamUsers = data.event_team_users;
			$scope.buildEventTeamsCountArrays();
		});
	};
	$scope.getEventTeams();

	// Bring functions into scope
	$scope.findArrayIndex = helperService.findArrayIndex;
	$scope.capitalizeWords = helperService.capitalizeWords;
	$scope.parseTime = helperService.parseTime;

	// Clear selected users if any filters are changed
	$scope.$watch('[startGroup, endGroup, showGender]', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.clearSelectedUsers();
		}
	}, true);

	// Make sure end group is always at least as high or higher than the start group
	$scope.$watch('startGroup', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.endGroup < newValue){
				$scope.endGroup = newValue;
			}
		}
	});

	// Update our scope.endGroup value depending on the gender dropdown selected
	$scope.$watch('showGender', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue === 'female'){
				$scope.eventGroupsCountArray = $scope.eventWomenGroupsCountArray;
			}
			else if(newValue === 'male'){
				$scope.eventGroupsCountArray = $scope.eventMenGroupsCountArray;
			}
			else{
				$scope.eventGroupsCountArray = $scope.eventWomenGroupsCountArray.length > $scope.eventMenGroupsCountArray.length ? $scope.eventWomenGroupsCountArray : $scope.eventMenGroupsCountArray;
			}
			if($scope.endGroup > $scope.eventGroupsCountArray.length){
				$scope.endGroup = $scope.eventGroupsCountArray.length.toString();
			}
		}
	});

	// Our custom filter
	$scope.groupsAndGenderFilter = function(slot){
		if(slot.sex === $scope.showGender || !$scope.showGender){
			if(slot.group_number >= $scope.startGroup && slot.group_number <= $scope.endGroup){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	};

	// Toggle method for our checkboxes
	$scope.toggleSelectedUsers = function(userId, userSex){
		var index = $scope.selectedUsers.indexOf(userId);
		if(index > -1){
			$scope.selectedUsers.splice(index, 1);
			if($scope.selectedUsers.length === 0){
				$scope.selectedUserSex = null;
			}
		}
		else{
			$scope.selectedUsers.push(userId);
			if($scope.selectedUsers.length === 1){
				$scope.selectedUserSex = userSex;
			}
		}
	};

	// Our custom checkbox disable filter
	$scope.disableCheckbox = function(userId, userSex){
		if(($scope.selectedUsers.length >= 2 && $scope.selectedUsers.indexOf(userId) === -1) || ($scope.selectedUserSex && $scope.selectedUserSex !== userSex)){
			return true;
		}
		else{
			return false;
		}
	};

	// Clears our selected users arrays and variables
	$scope.clearSelectedUsers = function(){
		$scope.selectedUsers = [];
		$scope.selectedUserSex = null;
	};

	// Swaps two players
	$scope.swapPlayers = function(){
		var recordOneIndex = helperService.findArrayIndex($scope.eventTeamUsers, 'user_id', $scope.selectedUsers[0]);
		var recordTwoIndex = helperService.findArrayIndex($scope.eventTeamUsers, 'user_id', $scope.selectedUsers[1]);
		var userOneRecord = angular.copy($scope.eventTeamUsers[recordOneIndex]);
		var userTwoRecord = angular.copy($scope.eventTeamUsers[recordTwoIndex]);
		$scope.eventTeamUsers[recordOneIndex]['user_id'] = userTwoRecord.users.id;
		$scope.eventTeamUsers[recordTwoIndex]['user_id'] = userOneRecord.users.id;
		$scope.eventTeamUsers[recordOneIndex].users = userTwoRecord.users;
		$scope.eventTeamUsers[recordTwoIndex].users = userOneRecord.users;
		if($scope.eventTeamUsers[recordOneIndex]['event_team_id'] === $scope.eventTeamUsers[recordTwoIndex]['event_team_id']){
			$scope.eventTeamUsers[recordOneIndex]['captain'] = userTwoRecord.captain;
			$scope.eventTeamUsers[recordTwoIndex]['captain'] = userOneRecord.captain;
		}
		else{
			$scope.eventTeamUsers[recordOneIndex]['captain'] = 0;
			$scope.eventTeamUsers[recordTwoIndex]['captain'] = 0;
		}
		$scope.clearSelectedUsers();
		$scope.playersSwapped = true;
	};

	// Updates our teams / groups info
	$scope.updateEventTeams = function(exit){
		if($scope.playersSwapped === true){
			if($scope.event.eventType === 'round robin' && !$window.confirm('Changing teams / team groups will cause all lineups to be reset')){
				return false;
			}
			$scope.callInProgress = true;
			eventService.updateEventTeams($scope.event.id, $scope.eventTeamUsers).then(function(){
				$window.alert('Event Teams Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Event teams not updated');
			});
		}
		else{
			$window.alert('No changes made');
		}
	};

});