teamsRIt.controller('createFacilityModalController', function($scope, $rootScope, $window, createFacilityModalService, addFacilityLeaderModalService){

	// Array of US states abbreviations
	$scope.states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD',
					 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
					 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
	// Object that determines which create event input error to show
	$scope.showCreateFacilityErrors = {
		name: false
	};

	// Returns today's date in string format
	$scope.getDate = function(){
		// JavaScript date defaults to MM/DD/YYYY and it needs to be converted to YYYY-MM-DD
		var today = new Date();
		var parts = today.toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).split('/');
		var temp = parts[2];
		parts[2] = parts[1];
		parts[1] = parts[0];
		parts[0] = temp;
		return parts.join('-');
	};

	// Our create event object
	$scope.createFacilityObject = {
		name: null,
		address: null,
		city: null,
		state: 'GA',
		zip: null,
		parentId: null,
		contractExpirationDate: $scope.getDate(),
		contractExpirationDateDisplay: $scope.getDate() + 'T24:00:00.000Z'
	};

	// Check our inputs
	$scope.checkCreateFacilityInput = function(){
		var noErrors = true;
		if(!$scope.createFacilityObject.name){
			$scope.showCreateFacilityErrors.name = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all create event errors
	$scope.resetCreateFacilityErrors = function(){
		for(var i in $scope.showCreateFacilityErrors){
			if($scope.showCreateFacilityErrors.hasOwnProperty(i)){
				$scope.showCreateFacilityErrors[i] = false;
			}
		}
	};

	// Get all facilities in our system
	$scope.getFacilities = function(){
		$scope.getFacilitiesInProgress = true;
		addFacilityLeaderModalService.getFacilities().then(function(data){
			$scope.facilities = data.facilities;
		}).finally(function(){
			$scope.getFacilitiesInProgress = false;
		});
	};
	$scope.getFacilities();

	// Filter our facilities results based on the search term provided
	// Creates a new event
	$scope.createFacility = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetCreateFacilityErrors();
		if($scope.checkCreateFacilityInput() === true){
			createFacilityModalService.create($scope.createFacilityObject).then(function(){
				$scope.createFacilityObject = {
					name: null,
					address: null,
					city: null,
					state: 'GA',
					zip: null,
					parentId: null,
					contractExpirationDate: $scope.getDate(),
					contractExpirationDateDisplay: $scope.getDate() + 'T24:00:00.000Z',
					paypalLink: null
				};
				$scope.callSuccess = true;
			}, function(){
				$window.alert('Something went wrong.  Facility not created');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Limit zipcode to numbers
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