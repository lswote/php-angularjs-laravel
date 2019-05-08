teamsRIt.controller('addFacilityLeaderModalController', function($scope, $rootScope, addFacilityLeaderModalService){

	// Object that determines which add facility leader input error to show
	$scope.showAddFacilityLeaderErrors = {
		facilityId: false,
		firstName: false,
		lastName: false,
		email: false,
		username: false,
		password: false,
		confirmPassword: false
	};

	// Our add facility leader object
	$scope.addFacilityLeaderObject = {
		facilityId: null,
		firstName: null,
		lastName: null,
		email: null,
		username: null,
		password: null,
		confirmPassword: null
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
	$scope.checkAddFacilityLeaderInput = function(){
		var noErrors = true;
		if(!$scope.addFacilityLeaderObject.facilityId && $rootScope.user.privilege === 'admin'){
			$scope.showAddFacilityLeaderErrors.facilityId = true;
			noErrors = false;
		}
		if(!$scope.addFacilityLeaderObject.firstName){
			$scope.showAddFacilityLeaderErrors.firstName = true;
			noErrors = false;
		}
		if(!$scope.addFacilityLeaderObject.lastName){
			$scope.showAddFacilityLeaderErrors.lastName = true;
			noErrors = false;
		}
		if(!$scope.addFacilityLeaderObject.email){
			$scope.showAddFacilityLeaderErrors.email = true;
			noErrors = false;
		}
		if(!$scope.addFacilityLeaderObject.username){
			$scope.showAddFacilityLeaderErrors.username = true;
			noErrors = false;
		}
		if(!$scope.addFacilityLeaderObject.password){
			$scope.showAddFacilityLeaderErrors.password = true;
			noErrors = false;
		}
		if($scope.addFacilityLeaderObject.password !== $scope.addFacilityLeaderObject.confirmPassword){
			$scope.showAddFacilityLeaderErrors.confirmPassword = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all add facility leader errors
	$scope.resetAddFacilityLeaderErrors = function(){
		for(var i in $scope.showAddFacilityLeaderErrors){
			if($scope.showAddFacilityLeaderErrors.hasOwnProperty(i)){
				$scope.showAddFacilityLeaderErrors[i] = false;
			}
		}
	};

	// Adds a new facility leader
	$scope.addFacilityLeader = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddFacilityLeaderErrors();
		if($scope.checkAddFacilityLeaderInput() === true){
			$scope.addFacilityLeaderObject.facilityId = $rootScope.user.privilege === 'admin' ?  $scope.addFacilityLeaderObject.facilityId : $rootScope.user.facility_id;
			addFacilityLeaderModalService.addFacilityLeader($scope.addFacilityLeaderObject).then(function(){
				$scope.addFacilityLeaderObject = {
					firstName: null,
					lastName: null,
					email: null,
					username: null,
					password: null,
					confirmPassword: null
				};
				$scope.callSuccess = true;
			}, function(){
				alert('Something went wrong.  Facility leader not added');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});