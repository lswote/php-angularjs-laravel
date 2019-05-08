teamsRIt.controller('addEventParticipantModalController', function($scope, $rootScope, $window, addEventParticipantModalService, emailService, dashboardService, helperService){

	// Default values
	$scope.foundParticipants = [];
	$scope.potentialParticipants = [];
	$scope.showParticipantCaptainOption = $rootScope.selectedEvent.event_type === 'multifacility';
	$scope.participantType = 'participant';

	// Object that determines which add event participant input error to show
	$scope.showAddEventParticipantErrors = {
		username: false,
		usernameNotFound: false,
		wrongGender: false
	};

	// Our add event participant object
	$scope.addEventParticipantObject = {
		username: null
	};

	// Check our inputs
	$scope.checkAddEventParticipantInput = function(){
		var noErrors = true;
		if(!$scope.addEventParticipantObject.username){
			$scope.showAddEventParticipantErrors.username = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all add event participant errors
	$scope.resetAddEventParticipantErrors = function(){
		for(var i in $scope.showAddEventParticipantErrors){
			if($scope.showAddEventParticipantErrors.hasOwnProperty(i)){
				$scope.showAddEventParticipantErrors[i] = false;
			}
		}
	};

	// Get potential users
	$scope.getPotentialParticipants = function(){
		if($rootScope.selectedEvent.event_type === 'multifacility'){
			dashboardService.getFacilityInfo().then(function(data){
				$scope.potentialParticipants = data.facility.users;
			});
		}
		else{
			emailService.getPotentialParticipants($rootScope.selectedEvent.id).then(function(data){
				$scope.potentialParticipants = data.participants;
			});
		}
	};
	$scope.getPotentialParticipants();

	// Get participants already invited to event
	$scope.getEventParticipants = function(){
		addEventParticipantModalService.getEventParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.eventParticipants = data.participants;
		})
	};
	$scope.getEventParticipants();

	// Real time users search
	$scope.initUsernameWatch = function(){
		$scope.clearUsernameWatch = $scope.$watch('addEventParticipantObject.username', function(newValue, oldValue){
			if(newValue !== oldValue && newValue && newValue.length > 0){
				newValue = newValue.toLowerCase();
				$scope.foundParticipants = [];
				for(var i = 0; i < $scope.potentialParticipants.length; i++){
					if($scope.potentialParticipants[i].first_name.toLowerCase().indexOf(newValue) > -1 || $scope.potentialParticipants[i].last_name.toLowerCase().indexOf(newValue) > -1 ||
					   $scope.potentialParticipants[i].username.toLowerCase().indexOf(newValue) > -1){
						var participant = angular.copy($scope.potentialParticipants[i]);
						if(helperService.findArrayIndex($scope.eventParticipants, 'id', participant.id) !== false){
							participant.alreadySelected = true;
						}
						$scope.foundParticipants.push(participant);
					}
				}
			}
			else if(newValue === ''){
				$scope.foundParticipants = [];
			}
		});
	};
	$scope.initUsernameWatch();

	// Replace the current username input value with the selected username and clears out our scope.foundParticipants array
	$scope.selectFoundParticipant = function(username){
		$scope.clearUsernameWatch();
		$scope.addEventParticipantObject.username = username;
		$scope.initUsernameWatch();
		$scope.foundParticipants = [];
	};

	// Tell us whether the participant will be labelled as a captain or not
	$scope.toggleCaptainDesignation = function(){
		$scope.participantType = $scope.participantType === 'participant' ? 'captain' : 'participant';
	};

	// Adds a new event participant
	$scope.addEventParticipant = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddEventParticipantErrors();
		if($scope.checkAddEventParticipantInput() === true){
			addEventParticipantModalService.addEventParticipant($rootScope.selectedEvent.id, $scope.addEventParticipantObject.username, $scope.participantType).then(function(){
				$scope.getEventParticipants();
				$scope.addEventParticipantObject = {
					username: null
				};
				$scope.participantType = 'participant';
				$scope.callSuccess = true;
			}, function(data){
				if(data.error === 'User with username not found'){
					$scope.showAddEventParticipantErrors.usernameNotFound = true;
				}
				else if(data.error === 'User gender differs from event gender'){
					$scope.showAddEventParticipantErrors.wrongGender = true;
				}
				else{
					$window.alert('Something went wrong.  Event participant not added');
				}
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});