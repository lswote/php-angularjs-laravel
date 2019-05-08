teamsRIt.controller('regenerateLinesModalController', function($scope, $rootScope, regenerateLinesModalService){

	// Regenerates lines for an event
	$scope.regenerateLines = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		regenerateLinesModalService.regenerateLines($rootScope.selectedEvent.id).then(function(){
			$scope.callSuccess = true;
			$rootScope.toggleModal();
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});