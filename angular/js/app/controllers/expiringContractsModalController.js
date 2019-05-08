teamsRIt.controller('expiringContractsModalController', function($scope, addFacilityLeaderModalService, helperService){

	// Default value
	$scope.beforeDate = null;

	// Update our expiring contracts list based on selected date
	$scope.getExpiringContracts = function(){
		$scope.getExpiringContractsInProgress = true;
		addFacilityLeaderModalService.getFacilities().then(function(data){
			$scope.expiringContracts = data.facilities;
			$scope.filterExpiringContracts();
		}).finally(function(){
			$scope.getExpiringContractsInProgress = false;
		});
	};
	$scope.getExpiringContracts();

	// Updates the contracts to show based on the calendar date chosen
	$scope.filterExpiringContracts = function(){
		$scope.expiringContractsToShow = [];
		if(!$scope.beforeDate){
			$scope.expiringContractsToShow = angular.copy($scope.expiringContracts);
		}
		else{
			for(var i = 0; i < $scope.expiringContracts.length; i++){
				if(new Date($scope.expiringContracts[i].contract_expiration_date) <= new Date($scope.beforeDate)){
					$scope.expiringContractsToShow.push($scope.expiringContracts[i]);
				}
			}
		}
	};

	// Make a call to update our expiring contracts listing when calendar value is changed
	$scope.$watch('beforeDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterExpiringContracts();
		}
	});

	// Bring formatDate() function into scope
	$scope.formatDate = helperService.formatDate;

});