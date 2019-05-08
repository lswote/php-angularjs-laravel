teamsRIt.controller('addMatchDirectionsModalController', function($scope, $rootScope, multiModalService){

	// Default values
	$scope.matchFacility = {
		name: '',
		address: '',
		city: '',
		state: '',
		zip: '',
		directions: ''
	};
	$scope.callSuccess = false;

	// Object that determines which error to show
	$scope.showAddMatchDirectionsErrors = {
		noName: false,
		noAddress: false,
		noCity: false,
		noState: false,
		noZip: false,
		shortZip: false
	};

	// Check our inputs
	$scope.checkAddMatchDirectionsInputs = function(){
		var noErrors = true;
		if(!$scope.matchFacility.name){
			$scope.showAddMatchDirectionsErrors.noName = true;
			noErrors = true;
		}
		if(!$scope.matchFacility.address){
			$scope.showAddMatchDirectionsErrors.noAddress = true;
			noErrors = true;
		}
		if(!$scope.matchFacility.city){
			$scope.showAddMatchDirectionsErrors.noCity = true;
			noErrors = true;
		}
		if(!$scope.matchFacility.state){
			$scope.showAddMatchDirectionsErrors.noState = true;
			noErrors = true;
		}
		if(!$scope.matchFacility.zip){
			$scope.showAddMatchDirectionsErrors.noZip = true;
			noErrors = true;
		}
		else if($scope.matchFacility.zip.length < 5){
			$scope.showAddMatchDirectionsErrors.shortZip = true;
			noErrors = true;
		}
		return noErrors;
	};

	// Hide all add match directions errors
	$scope.resetAddMatchDirectionsErrors = function(){
		for(var i in $scope.showAddMatchDirectionsErrors){
			if($scope.showAddMatchDirectionsErrors.hasOwnProperty(i)){
				$scope.showAddMatchDirectionsErrors[i] = false;
			}
		}
	};

	// Add match directions
	$scope.addMatchDirections = function(){
		$scope.resetAddMatchDirectionsErrors();
		if($scope.checkAddMatchDirectionsInputs() === true){
			$scope.callSuccess = false;
			multiModalService.addDirections($rootScope.selectedEvent ? $rootScope.selectedEvent.id : null, $scope.matchFacility).then(function(){
				$scope.callSuccess = true;
				$scope.matchFacility = {
					name: '',
					address: '',
					city: '',
					state: '',
					zip: '',
					directions: ''
				};
			}, function(){
				$window.alert('Something went wrong.  Facility not added')
			});
		}
	};

	// limit zipcode to numbers
	var phoneNumberAllowedWhichActions = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
	var phoneNumberAllowedKeycodeActions = [8, 9, 13, 27, 37, 39];
	$(document).on('keypress', '.zipcode', function(event){
		if(phoneNumberAllowedKeycodeActions.indexOf(event.keyCode) === -1){
			if(phoneNumberAllowedWhichActions.indexOf(event.which) === -1){
				return false;
			}
		}
	});

});