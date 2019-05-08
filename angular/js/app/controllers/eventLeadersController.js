teamsRIt.controller('eventLeadersController', function($scope, $rootScope, $routeParams, eventService, editEventModalService, helperService){

	// Current page variable
	$rootScope.currentPage = 'editEventLeaders';

	// Check whether user can access this page
	$scope.checkPermissions = function(){
		if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || helperService.findArrayIndex($scope.eventLeaders, 'id', $rootScope.user.id))){
			editEventModalService.getEvent($routeParams.id).then(function(data){
				$scope.displayEventForm = true;
				$rootScope.selectedEvent = {
					id: data.event.id,
					name: data.event.name
				}
			}, function(){
				$scope.displayEventForm = false;
			});
		}
		else{
			$scope.displayEventForm = false;
		}
	};

	// Get event leaders for an event
	$rootScope.getEventLeaders = function(){
		$scope.getEventLeadersInProgress = true;
		eventService.getEventLeaders($routeParams.id).then(function(data){
			$scope.eventLeaders = data.event_leaders;
			$scope.checkPermissions();
		}).finally(function(){
			$scope.getEventLeadersInProgress = false;
		});
	};
	$rootScope.getEventLeaders();

	// Deletes an event leader
	$scope.deleteEventLeader = function(userId){
		eventService.deleteEventLeader($rootScope.selectedEvent.id, userId).then(function(){
			$scope.getEventLeaders();
		});
	}

});