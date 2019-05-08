teamsRIt.controller('addWaitlistedParticipantToTeamModalController', function($scope, $rootScope, $window, addWaitlistedParticipantToTeamModalService, 
																			  waitlistedParticipantsModalService, eventService, helperService){

	// Default values
	$scope.selectedParticipantId = null;
	$scope.selectedSex = null;
	$scope.selectedTeamId = null;
	$scope.selectedEventTeamUserId = null;
	$scope.addAsCaptain = null;

	// Object that determines which input error to show
	$scope.addWaitlistedParticipantToTeamErrors = {
		selectedParticipantId: false,
		selectedTeamId: false,
		selectedEventTeamUserId: false,
		addAsCaptain: false
	};

	// Check our inputs
	$scope.checkAddWaitlistedParticipantToTeamInputs = function(){
		var noErrors = true;
		if(!$scope.selectedParticipantId){
			$scope.addWaitlistedParticipantToTeamErrors.selectedParticipantId = true;
			noErrors = false;
		}
		if(!$scope.selectedTeamId){
			$scope.addWaitlistedParticipantToTeamErrors.selectedTeamId = true;
			noErrors = false;
		}
		if(!$scope.selectedEventTeamUserId){
			$scope.addWaitlistedParticipantToTeamErrors.selectedEventTeamUserId = true;
			noErrors = false;
		}
		if(!$scope.addAsCaptain && $scope.addAsCaptain != 0){
			$scope.addWaitlistedParticipantToTeamErrors.addAsCaptain = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all form errors
	$scope.resetAddWaitlistedParticipantToTeamErrors = function(){
		for(var i in $scope.addWaitlistedParticipantToTeamErrors){
			if($scope.addWaitlistedParticipantToTeamErrors.hasOwnProperty(i)){
				$scope.addWaitlistedParticipantToTeamErrors[i] = false;
			}
		}
	};

	// Get all waitlisted participants
	$scope.getWaitlistedParticipants = function(){
		waitlistedParticipantsModalService.getWaitlistedParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.waitlistedParticipants = data.waitlisted_participants;
		});
	};
	$scope.getWaitlistedParticipants();

	// Set the selected gender when we select a participant
	$scope.$watch('selectedParticipantId', function(newValue, oldValue){
		if(newValue !== oldValue){
			var oldSelectedSex = $scope.selectedSex;
			var index = helperService.findArrayIndex($scope.waitlistedParticipants, 'id', newValue);
			$scope.selectedSex = index !== false ? $scope.waitlistedParticipants[index].sex : null;
			if($scope.selectedSex === null || (oldSelectedSex !== $scope.selectedSex)){
				$scope.selectedTeamId = null;
			}
		}
	});

	// Build our event teams array
	$scope.parseOpenSlots = function(){
		$scope.teamsWithOpenFemaleSlots = [];
		$scope.teamsWithOpenMaleSlots = [];
		for(var i = 0; i < $scope.openSlots.length; i++){
			var index;
			if($scope.openSlots[i].sex === 'female'){
				index = helperService.findArrayIndex($scope.teamsWithOpenFemaleSlots, 'id', $scope.openSlots[i].event_team_id);
				if(index === false){
					$scope.teamsWithOpenFemaleSlots.push($scope.openSlots[i].event_teams);
				}	
			}
			else if($scope.openSlots[i].sex === 'male'){
				index = helperService.findArrayIndex($scope.teamsWithOpenMaleSlots, 'id', $scope.openSlots[i].event_team_id);
				if(index === false){
					$scope.teamsWithOpenMaleSlots.push($scope.openSlots[i].event_teams);
				}
			}
		}
	};

	// Get open team slots
	$scope.getOpenSlots = function(){
		addWaitlistedParticipantToTeamModalService.getOpenSlots($rootScope.selectedEvent.id).then(function(data){
			$scope.openSlots = data.open_slots;
			$scope.parseOpenSlots();
		});
	};
	$scope.getOpenSlots();

	// Build our $scope.groupsWithOpenSlots array
	$scope.updateGroupsWithOpenSlots = function(){
		$scope.groupsWithOpenSlots = [];
		for(var i = 0; i < $scope.openSlots.length; i++){
			if($scope.selectedTeamId == $scope.openSlots[i].event_team_id){
				var index = helperService.findArrayIndex($scope.groupsWithOpenSlots, 'group_number', $scope.openSlots[i].group_number);
				if(index === false){
					$scope.groupsWithOpenSlots.push({
						event_team_user_id: $scope.openSlots[i].id,
						event_team_id: $scope.openSlots[i].event_team_id,
						group_number: $scope.openSlots[i].group_number
					});
				}
			}
		}
	};

	// Update our groups with open slots array when the selected team is changed
	$scope.$watch('selectedTeamId', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.updateGroupsWithOpenSlots();
			$scope.selectedEventTeamUserId = null;
		}
	});

	// Reset our inputs
	$scope.resetInputs = function(){
		$scope.selectedParticipantId = null;
		$scope.selectedSex = null;
		$scope.selectedTeamId = null;
		$scope.selectedEventTeamUserId = null;
		$scope.addAsCaptain = null;
	};

	// Calls to make and variable to set once update is complete
	$scope.updateCompleteRoutine = function(){
		$scope.getOpenSlots();
		$scope.getWaitlistedParticipants();
		$scope.resetInputs();
		$scope.callSuccess = true;
	};

	// Adds a waitlisted participant to the selected team / group
	$scope.addWaitlistedParticipant = function(){
		$scope.callInProgress = true;
		$scope.resetAddWaitlistedParticipantToTeamErrors();
		if($scope.checkAddWaitlistedParticipantToTeamInputs() === true){
			$scope.callSuccess = false;
			eventService.updateEventTeams($rootScope.selectedEvent.id, [{
				id: $scope.selectedEventTeamUserId,
				user_id: $scope.selectedParticipantId
			}]).then(function(){
				if($scope.addAsCaptain == 1){
					return addWaitlistedParticipantToTeamModalService.setAsCaptain($rootScope.selectedEvent.id, $scope.selectedEventTeamUserId);
				}
				else{
					$scope.updateCompleteRoutine();
				}
			}).then(function(){
				$scope.updateCompleteRoutine();
			}, function(){
				$window.alert('Something went wrong.  Waitlisted participant not added');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});