teamsRIt.controller('addSubAvailabilityModalController', function($scope, $rootScope, $window, addSubAvailabilityModalService, emailService, helperService){

	// Default values
	$scope.foundParticipants = [];
	$scope.potentialParticipants = [];

	// Object that determines which add sub availability input error to show
	$scope.showSubAvailabilityErrors = {
		username: false,
		usernameNotFound: false
	};

	// Our add sub availability object
	$scope.addSubAvailabilityObject = {
		username: null
	};

	// Check our inputs
	$scope.checkAddSubAvailabilityInput = function(){
		var noErrors = true;
		if(!$scope.addSubAvailabilityObject.username){
			$scope.showSubAvailabilityErrors.username = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all add sub availability errors
	$scope.resetAddSubAvailabilityErrors = function(){
		for(var i in $scope.showSubAvailabilityErrors){
			if($scope.showSubAvailabilityErrors.hasOwnProperty(i)){
				$scope.showSubAvailabilityErrors[i] = false;
			}
		}
	};

	// Get potential users
	$scope.getPotentialParticipants = function(){
		emailService.getPotentialParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.potentialParticipants = data.participants;
		});
	};
	$scope.getPotentialParticipants();

	// Get current list of subs
	$scope.getEventSubstitutes = function(){
		addSubAvailabilityModalService.getSubstitutes($rootScope.selectedEvent.id).then(function(data){
			$scope.eventSubstitutes = data.substitutes;
		});
	};
	$scope.getEventSubstitutes();

	// Real time users search
	$scope.initUsernameWatch = function(){
		$scope.clearUsernameWatch = $scope.$watch('addSubAvailabilityObject.username', function(newValue, oldValue){
			if(newValue !== oldValue && newValue && newValue.length > 0){
				newValue = newValue.toLowerCase();
				$scope.foundParticipants = [];
				for(var i = 0; i < $scope.potentialParticipants.length; i++){
					if($scope.potentialParticipants[i].first_name.toLowerCase().indexOf(newValue) > -1 || $scope.potentialParticipants[i].last_name.toLowerCase().indexOf(newValue) > -1 ||
					   $scope.potentialParticipants[i].username.toLowerCase().indexOf(newValue) > -1){
						var participant = angular.copy($scope.potentialParticipants[i]);
						if(helperService.findArrayIndex($scope.eventSubstitutes, 'id', participant.id) !== false){
							participant.currentSubstitute = true;
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
		$scope.addSubAvailabilityObject.username = username;
		$scope.initUsernameWatch();
		$scope.foundParticipants = [];
	};

	// Adds a new sub
	$scope.addSubstitute = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddSubAvailabilityErrors();
		if($scope.checkAddSubAvailabilityInput() === true){
			addSubAvailabilityModalService.addSubstitute($rootScope.selectedEvent.id, $scope.addSubAvailabilityObject.username).then(function(){
				$scope.getEventSubstitutes();
				$scope.addSubAvailabilityObject = {
					username: null
				};
				$scope.callSuccess = true;
			}, function(data){
				if(data.error === 'User with username not found'){
					$scope.showSubAvailabilityErrors.usernameNotFound = true;
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