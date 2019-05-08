teamsRIt.controller('addSubToLineupModalController', function($scope, $rootScope, $window, addSubToLineupModalService, eventTeamsAvailabilityService, eventSubsAvailabilityService,
															  helperService){

	// Default values
	$scope.selectedTeamId = null;
	$scope.selectedRoundDate = null;
	$scope.selectedAvailabilityId = null;

	// Object that determines which input error to show
	$scope.addSubToLineupErrors = {
		selectedTeamId: false,
		selectedRoundDate: false,
		selectedAvailabilityId: false
	};

	// Check our inputs
	$scope.checkAddSubToLineupsInputs = function(){
		var noErrors = true;
		if(!$scope.selectedTeamId){
			$scope.addSubToLineupErrors.selectedTeamId = true;
			noErrors = false;
		}
		if(!$scope.selectedRoundDate){
			$scope.addSubToLineupErrors.selectedRoundDate = true;
			noErrors = false;
		}
		if(!$scope.selectedAvailabilityId){
			$scope.addSubToLineupErrors.selectedAvailabilityId = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all form errors
	$scope.resetAddSubToLineupsInputsErrors = function(){
		for(var i in $scope.addSubToLineupErrors){
			if($scope.addSubToLineupErrors.hasOwnProperty(i)){
				$scope.addSubToLineupErrors[i] = false;
			}
		}
	};

	// Reset our inputs
	$scope.resetInputs = function(){
		$scope.selectedTeamId = null;
		$scope.selectedRoundDate = null;
		$scope.selectedAvailabilityId = null;
	};

	// Parse team related info
	$scope.parseUsersAvailability = function(){
		$scope.roundDates = [];
		$scope.teams = [];
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.roundDates.indexOf($scope.usersAvailability[i].date) === -1){
				$scope.roundDates.push($scope.usersAvailability[i].date);
			}
			if(helperService.findArrayIndex($scope.teams, 'id', $scope.usersAvailability[i].user.team_id) === false){
				$scope.teams.push({
					id: $scope.usersAvailability[i].user.team_id,
					name: $scope.usersAvailability[i].user.team_name
				});
			}
		}
	};

	// Get user availability info
	$scope.getAvailability = function(){
		$scope.getAvailabilityInProgress = true;
		eventTeamsAvailabilityService.getAvailability($rootScope.selectedEvent.id).then(function(data){
			$scope.usersAvailability = data.user_availability;
			$scope.parseUsersAvailability();
		}).finally(function(){
			$scope.getAvailabilityInProgress = false;
		});
	};
	$scope.getAvailability();

	// Get subs availability info
	$scope.getSubsAvailability = function(){
		eventSubsAvailabilityService.getSubsAvailability($rootScope.selectedEvent.id).then(function(data){
			$scope.subsAvailability = data.sub_availability;
		});
	};
	$scope.getSubsAvailability();

	// Calls to make and variable to set once update is complete
	$scope.updateCompleteRoutine = function(){
		$scope.getSubsAvailability();
		$scope.resetInputs();
		$scope.callSuccess = true;
	};

	// Adds a waitlisted participant to the selected team / group
	$scope.addSubstitute = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddSubToLineupsInputsErrors();
		if($scope.checkAddSubToLineupsInputs() === true){
			addSubToLineupModalService.addSubstitute($rootScope.selectedEvent.id, $scope.selectedTeamId, $scope.selectedAvailabilityId).then(function(){
				$scope.updateCompleteRoutine();
			}, function(){
				$window.alert('Something went wrong.  Sub was not added');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Make helper methods available in scope
	$scope.formatDate = helperService.formatDate;

});