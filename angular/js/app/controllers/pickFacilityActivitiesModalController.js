teamsRIt.controller('pickFacilityActivitiesModalController', function($scope, $rootScope, $window, addFacilityLeaderModalService){

	// Get all facilities in our system
	$scope.getFacilities = function(){
		if($rootScope.user.privilege === 'admin'){
			addFacilityLeaderModalService.getFacilities().then(function(data){
				$scope.facilities = data.facilities;
			});
		}
	};
	$scope.getFacilities();

	// Forward user to appropriate page to edit facility activities
	$scope.$watch('selectedFacilityId', function(newValue, oldValue){
		if(newValue !== oldValue){
			$window.location.href = '/facility/' + newValue + '/activities';
		}
	});

});