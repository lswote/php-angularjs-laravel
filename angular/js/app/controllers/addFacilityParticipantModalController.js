teamsRIt.controller('addFacilityParticipantModalController', function($scope, $rootScope, $window, addFacilityParticipantModalService){

	// Object that determines which add facility participant input error to show
	$scope.addFacilityParitcipantErrors = {
		firstName: false,
		lastName: false,
		email: false,
		username: false,
		usernameTaken: false,
		password: false
	};

	// Our add facility participant object
	$scope.addFacilityParticipantObject = {
		firstName: null,
		lastName: null,
		gender: 'male',
		email: null,
		username: null,
		phone: null,
		room: null,
		password: null,
		membershipType: 'member',
		active: '1',
		ageType: 'adult'
	};

	// Check our inputs
	$scope.checkAddFacilityParticipantInput = function(){
		var noErrors = true;
		if(!$scope.addFacilityParticipantObject.firstName){
			$scope.addFacilityParitcipantErrors.firstName = true;
			noErrors = false;
		}
		if(!$scope.addFacilityParticipantObject.lastName){
			$scope.addFacilityParitcipantErrors.lastName = true;
			noErrors = false;
		}
		if(!$scope.addFacilityParticipantObject.email){
			$scope.addFacilityParitcipantErrors.email = true;
			noErrors = false;
		}
		if(!$scope.addFacilityParticipantObject.username){
			$scope.addFacilityParitcipantErrors.username = true;
			noErrors = false;
		}
		if(!$scope.addFacilityParticipantObject.password){
			$scope.addFacilityParitcipantErrors.password = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all add facility participant errors
	$scope.resetAddFacilityParticipantErrors = function(){
		for(var i in $scope.addFacilityParitcipantErrors){
			if($scope.addFacilityParitcipantErrors.hasOwnProperty(i)){
				$scope.addFacilityParitcipantErrors[i] = false;
			}
		}
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

	// Adds a new facility participant
	$scope.addFacilityParticipant = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddFacilityParticipantErrors();
		if($scope.checkAddFacilityParticipantInput() === true){
			addFacilityParticipantModalService.addFacilityParticipant($scope.addFacilityParticipantObject).then(function(){
				$scope.addFacilityParticipantObject = {
					firstName: null,
					lastName: null,
					gender: 'male',
					email: null,
					username: null,
					phone: null,
					room: null,
					password: null,
					membershipType: 'member',
					active: '1',
					ageType: 'adult'
				};
				$scope.callSuccess = true;
			}, function(data){
				if(data.error === 'Username taken'){
					$scope.addFacilityParitcipantErrors.usernameTaken = true;
				}
				else{
					$window.alert('Something went wrong.  Facility participant not added');
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