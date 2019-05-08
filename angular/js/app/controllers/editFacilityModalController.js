teamsRIt.controller('editFacilityModalController', function($scope, $rootScope, addFacilityLeaderModalService, editFacilityModalService, $window){

	// Default value
	$scope.searchTerm = null;
	$scope.showView = 'listing';
	$scope.facilities = [];
	$scope.parentName = '';
	// Array of US states abbreviations
	$scope.states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD',
					 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
					 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];


	// Filter facilities
	$scope.filterFacilities = function(){
		$scope.foundFacilities = [];
		if($scope.searchTerm){
			for(var i = 0; i < $scope.facilities.length; i++){
				if($scope.facilities[i].name.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1){
					$scope.foundFacilities.push($scope.facilities[i]);
				}
			}
		}
		else{
			$scope.foundFacilities = angular.copy($scope.facilities);
		}
	};

	// Get all facilities in our system
	$scope.getFacilities = function(){
		$scope.getFacilitiesInProgress = true;
		if($rootScope.user.privilege === 'admin'){
			addFacilityLeaderModalService.getFacilities().then(function(data){
				$scope.facilities = data.facilities;
				$scope.filterFacilities();
			}).finally(function(){
				$scope.getFacilitiesInProgress = false;
			});
		}
	};
	$scope.getFacilities();

	// Filter our facilities results based on the search term provided
	$scope.$watch('searchTerm', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterFacilities();
		}
	});

	// Toggle between listing and update views
	$scope.toggleView = function(facility){
		if($scope.showView === 'listing'){
			$scope.showView = 'update-form';
			$scope.selectedFacility = angular.copy(facility);
			for(i = 0; i < $scope.facilities.length; i++){
				if($scope.facilities[i].id == $scope.selectedFacility.parent_id){
					$scope.parentName = $scope.facilities[i].name;
					break;
				}
			}
			$scope.contractExpirationDateDisplay = $scope.selectedFacility.contract_expiration_date + 'T24:00:00.000Z';
		}
		else if($scope.showView === 'update-form'){
			$scope.showView = 'listing';
		}
	};

	// Update facility info
	$scope.update = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		for(i = 0; i < $scope.facilities.length; i++){
			if($scope.facilities[i].name == $scope.parentName){
				$scope.selectedFacility.parent_id = $scope.facilities[i].id;
				break;
			}
		}
		editFacilityModalService.update($scope.selectedFacility).then(function(){
			$scope.getFacilities();
			$scope.searchTerm = null;
			$scope.toggleView();
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Update not saved');
		}).finally(function(){
			$scope.callInProgress = false;
		});
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