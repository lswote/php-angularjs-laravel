teamsRIt.controller('addEventLeaderModalController', function($scope, $rootScope, $window, addEventLeaderModalService){

	// Object that determines which add event leader input error to show
	$scope.showAddEventLeaderErrors = {
		username: false,
		usernameNotFound: false
	};

	// Our add event leader object
	$scope.addEventLeaderObject = {
		username: null
	};

	// Check our inputs
	$scope.checkAddEventLeaderInput = function(){
		var noErrors = true;
		if(!$scope.addEventLeaderObject.username){
			$scope.showAddEventLeaderErrors.username = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all add event leader errors
	$scope.resetAddEventLeaderErrors = function(){
		for(var i in $scope.showAddEventLeaderErrors){
			if($scope.showAddEventLeaderErrors.hasOwnProperty(i)){
				$scope.showAddEventLeaderErrors[i] = false;
			}
		}
	};

	// Adds a new event leader
	$scope.addEventLeader = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetAddEventLeaderErrors();
		if($scope.checkAddEventLeaderInput() === true){
			addEventLeaderModalService.addEventLeader($rootScope.selectedEvent.id, $scope.addEventLeaderObject).then(function(){
				if($rootScope.currentPage === 'editEventLeaders'){
					$rootScope.getEventLeaders();
				}
				$scope.addEventLeaderObject = {
					username: null
				};
				$scope.callSuccess = true;
			}, function(data){
				if(data.error === 'User with username not found'){
					$scope.showAddEventLeaderErrors.usernameNotFound = true;
				}
				else{
					$window.alert('Something went wrong.  Event leader not added');
				}
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});