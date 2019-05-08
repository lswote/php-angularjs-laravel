teamsRIt.controller('startEventModalController', function($scope, $rootScope, $window, startEventModalService){

	// Starts an event
	$scope.startEvent = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		startEventModalService.startEvent($rootScope.selectedEvent.id).then(function(){
			$rootScope.getEvents();
			$scope.callSuccess = true;
			$rootScope.toggleModal();
		}, function(data){
			$window.alert(data.error);
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});