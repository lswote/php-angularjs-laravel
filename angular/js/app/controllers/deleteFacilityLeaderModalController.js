teamsRIt.controller('deleteFacilityLeaderModalController', function($scope, $rootScope, deleteFacilityLeaderModalService, addFacilityLeaderModalService){

	// Object that determines which delete facility leader input error to show
	$scope.showDeleteFacilityLeaderErrors = {
		facilityId: false,
		leaderId: false
	};

	// Delete facility leader object
	$scope.deleteFacilityLeaderObject = {
		facilityId: null,
		leaderId: null
	};
	$scope.facilities = [];
	$scope.facilityLeaders = [];

	// Get all facilities in our system
	$scope.getFacilities = function(){
		if($rootScope.user.privilege === 'admin'){
			addFacilityLeaderModalService.getFacilities().then(function(data){
				$scope.facilities = data.facilities;
			});
		}
	};
	$scope.getFacilities();

	$scope.showFacilityLeaders = function(){
		$scope.deleteFacilityLeaderObject.leaderId = false;
		for(i = 0; i < $scope.facilities.length; i++){
			if($scope.deleteFacilityLeaderObject.facilityId == $scope.facilities[i].id){
				$scope.facilityLeaders = $scope.facilities[i].facility_leaders;
				return;
			}
		}
	}

	// Check our inputs
	$scope.checkDeleteFacilityLeaderInput = function(){
		var noErrors = true;
		if(!$scope.deleteFacilityLeaderObject.facilityId){
			$scope.showDeleteFacilityLeaderErrors.facilityId = true;
			noErrors = false;
		}
		if(!$scope.deleteFacilityLeaderObject.leaderId){
			$scope.showDeleteFacilityLeaderErrors.leaderId = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all delete facility leader errors
	$scope.resetDeleteFacilityLeaderErrors = function(){
		for(var i in $scope.showDeleteFacilityLeaderErrors){
			if($scope.showDeleteFacilityLeaderErrors.hasOwnProperty(i)){
				$scope.showDeleteFacilityLeaderErrors[i] = false;
			}
		}
	};

	// Deletes a new facility leader
	$scope.deleteFacilityLeader = function(){
		$scope.resetDeleteFacilityLeaderErrors();
		if($scope.checkDeleteFacilityLeaderInput() === true){
			deleteFacilityLeaderModalService.deleteFacilityLeader($scope.deleteFacilityLeaderObject.facilityId, $scope.deleteFacilityLeaderObject.leaderId).then(function(){
				$scope.deleteFacilityLeaderObject = {
					facilityId: false,
					leaderId: false
				};
			}, function(){
				alert('Something went wrong.  Facility leader not deleted');
			}).finally(function(){
				$scope.toggleModal();
			});
		}
	};

});