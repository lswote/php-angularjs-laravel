teamsRIt.controller('editMatchDirectionsModalController', function($scope, $rootScope, multiModalService){

	$scope.show_select_match_facility = true;
	$scope.show_edit_match_facility = false;
	$scope.items=[];
	$scope.name="";

	$scope.showEditMatchDirectionsErrors = {
		noFacility: false,
		noName: false,
		noAddress: false,
		noCity: false,
		noState: false,
		noZip: false,
		shortZip: false
	};

	// Hide all errors
	$scope.resetEditMatchDirectionsErrors = function(){
		for(var i in $scope.showEditMatchDirectionsErrors){
			if($scope.showEditMatchDirectionsErrors.hasOwnProperty(i)){
				$scope.showEditMatchDirectionsErrors[i] = false;
			}
		}
	};

	var getIndex = function(name){
		for(var i = 0; i < $scope.directions.length; i++){
			if(name === $scope.directions[i].name){
				return i;
			}
		}
		return -1;
	};

	$scope.getData = function(){
		multiModalService.getDirections($rootScope.selectedEvent ? $rootScope.selectedEvent.id : null).then(function(data){
			$scope.directions = angular.copy(data.directions);
			items = [];
			for(i = 0; i < data.directions.length; i++){
				items.push({
					name: data.directions[i].name,
					id: data.directions[i].id
				});
			}
			$scope.items = items.sort(function(obj1, obj2) {
				return obj1.name.localeCompare(obj2.name);
			});
		});
	};  
	$scope.getData();

	$scope.selectFacility = function(){
		$scope.facilityIndex = getIndex($scope.name);
		if($scope.facilityIndex < 0){
			$scope.showEditMatchDirectionsErrors.noFacility = true;
		}
		else{
			$scope.matchFacility = {
				name: $scope.directions[$scope.facilityIndex].name,
				address: $scope.directions[$scope.facilityIndex].address,
				city: $scope.directions[$scope.facilityIndex].city,
				state: $scope.directions[$scope.facilityIndex].state,
				zip: $scope.directions[$scope.facilityIndex].zip.toString(),
				directions: $scope.directions[$scope.facilityIndex].directions
			};
			$scope.show_select_match_facility = false;
			$scope.show_edit_match_facility = true;
		}
	};

	$scope.editMatchDirections = function(){
		error = false;
		if($scope.matchFacility.name === ''){
			$scope.showEditMatchDirectionsErrors.noName = true;
			error = true;
		}
		if($scope.matchFacility.address === ''){
			$scope.showEditMatchDirectionsErrors.noAddress = true;
			error = true;
		}
		if($scope.matchFacility.city === ''){
			$scope.showEditMatchDirectionsErrors.noCity = true;
			error = true;
		}
		if($scope.matchFacility.state === ''){
			$scope.showEditMatchDirectionsErrors.noState = true;
			error = true;
		}
		if($scope.matchFacility.zip === ''){
			$scope.showEditMatchDirectionsErrors.noZip = true;
			error = true;
		}
		else if($scope.matchFacility.zip.length < 5){
			$scope.showEditMatchDirectionsErrors.shortZip = true;
			error = true;
		}
		if(error === false){
			multiModalService.editDirections($rootScope.selectedEvent ? $rootScope.selectedEvent.id : null, $scope.directions[$scope.facilityIndex].id, $scope.matchFacility).then(function(data){
				$rootScope.toggleModal();
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