teamsRIt.controller('closeEventModalController', function($scope, $rootScope, closeEventModalService){

	// Ends an event
	$scope.closeEvent = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		closeEventModalService.closeEvent($rootScope.selectedEvent.id).then(function(){
			$rootScope.getEvents();
			$scope.callSuccess = true;
			$rootScope.toggleModal();
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});