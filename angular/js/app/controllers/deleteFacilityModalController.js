teamsRIt.controller('deleteFacilityModalController', function($scope, $rootScope, deleteFacilityModalService, addFacilityLeaderModalService){

	// Object that determines which delete facility input error to show
	$scope.showDeleteFacilityErrors = {
		facilityId: false
	};

	// Our delete facility object
	$scope.deleteFacilityObject = {
		facilityId: null
	};

	// Get all facilities in our system
	$scope.getFacilities = function(){
		if($rootScope.user.privilege === 'admin'){
			addFacilityLeaderModalService.getFacilities().then(function(data){
				$scope.facilities = data.facilities;
			});
		}
	};
	$scope.getFacilities();

	// Check our inputs
	$scope.checkDeleteFacilityInput = function(){
		var noErrors = true;
		if(!$scope.deleteFacilityObject.facilityId){
			$scope.showDeleteFacilityErrors.facilityId = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all delete facility errors
	$scope.resetDeleteFacilityErrors = function(){
		for(var i in $scope.showDeleteFacilityErrors){
			if($scope.showDeleteFacilityErrors.hasOwnProperty(i)){
				$scope.showDeleteFacilityErrors[i] = false;
			}
		}
	};

	// Deletes a facility
	$scope.deleteFacility = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetDeleteFacilityErrors();
		if($scope.checkDeleteFacilityInput() === true){
			deleteFacilityModalService.delete($scope.deleteFacilityObject.facilityId).then(function(){
				$scope.getFacilities();
				$scope.deleteFacilityObject = {
					facilityId: null
				};
				$scope.callSuccess = true;
			}, function(){
				alert('Something went wrong.  Facility not deleted');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});