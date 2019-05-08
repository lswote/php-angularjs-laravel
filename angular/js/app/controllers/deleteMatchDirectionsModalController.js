teamsRIt.controller('deleteMatchDirectionsModalController', function($scope, $rootScope, $window, multiModalService){

	$scope.show_select_match_facility = true;
	$scope.show_edit_match_facility = false;
	$scope.items=[];
	$scope.name="";

	$scope.showDeleteMatchDirectionsErrors = {
		noFacility: false
	};

	// Hide all errors
	$scope.resetDeleteMatchDirectionsErrors = function(){
		for(var i in $scope.showDeleteMatchDirectionsErrors){
			if($scope.showDeleteMatchDirectionsErrors.hasOwnProperty(i)){
				$scope.showDeleteMatchDirectionsErrors[i] = false;
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
			$scope.showDeleteMatchDirectionsErrors.noFacility = true;
		}
		else{
        	if($window.confirm("Delete match facility "+$scope.name+'?')){
				multiModalService.deleteDirections($rootScope.selectedEvent ? $rootScope.selectedEvent.id : null, $scope.directions[$scope.facilityIndex].id).then(function(data){
				}).finally(function(data){
					$rootScope.toggleModal();
				});
			}
		}
	};

});