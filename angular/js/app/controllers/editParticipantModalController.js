teamsRIt.controller('editParticipantModalController', function($scope, $rootScope, $window, editParticipantModalService){

	// Default value
	$scope.searchTerm = null;
	$scope.showView = 'listing';

	// Filter participants
	$scope.filterParticipants = function(){
		$scope.foundParticipants = [];
		if($scope.searchTerm){
			for(var i = 0; i < $scope.participants.length; i++){
				var fullName = $scope.participants[i].first_name.toLowerCase() + ' ' + $scope.participants[i].last_name.toLowerCase();
				if(fullName.indexOf($scope.searchTerm.toLowerCase()) > -1 ||
					$scope.participants[i].email.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1 ||
					$scope.participants[i].username.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1){
					$scope.foundParticipants.push($scope.participants[i]);
				}
			}
		}
		else{
			$scope.foundParticipants = angular.copy($scope.participants);
		}
	};

	// Get all participants in our system
	$scope.getParticipants = function(){
		$scope.getParticipantsInProgress = true;
		editParticipantModalService.getParticipants().then(function(data){
			$scope.participants = data.participants;
			$scope.filterParticipants();
		}).finally(function(){
			$scope.getParticipantsInProgress = false;
		});
	};
	$scope.getParticipants();

	// Filter our participants results based on the search term provided
	$scope.$watch('searchTerm', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterParticipants();
		}
	});

	// Toggle between our view
	$scope.toggleView = function(participant){
		if($scope.showView === 'listing'){
			$scope.showView = 'update-form';
			$scope.selectedParticipantId = participant.id;
			$scope.selectedParticipantEmail = participant.email;
			$scope.selectedParticipant = angular.copy(participant);
		}
		else if($scope.showView === 'update-form'){
			$scope.showView = 'listing';
		}
	};

	// Makes updates to a participant
	$scope.update = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		editParticipantModalService.update($scope.selectedParticipant).then(function(){
			$scope.getParticipants();
			$scope.searchTerm = $scope.selectedParticipant.email;
			$scope.toggleView();
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Update not saved');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Allow only phone number related characters to be entered in our phone input
	$scope.initPhoneInputRestrictions = function(){
		var phoneNumberAllowedWhichActions = [32, 40, 41, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 189];
		var phoneNumberAllowedKeycodeActions = [8, 9, 13, 27, 37, 39];
		$(document).on('keypress', '.phone', function(event){
			if(phoneNumberAllowedKeycodeActions.indexOf(event.keyCode) === -1){
				if(phoneNumberAllowedWhichActions.indexOf(event.which) === -1){
					return false;
				}
				if($(this).val().replace(/[^0-9]/g, '').length >= 10 && window.getSelection().toString().length === 0){
					return false;
				}
			}
		});
	};
	$scope.initPhoneInputRestrictions();

});