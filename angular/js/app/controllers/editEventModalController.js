teamsRIt.controller('editEventModalController', function($scope, $rootScope, $window, editEventModalService){

	// Object that determines which edit event input error to show
	$scope.showEditEventErrors = {
		name: false
	};

	// Our edit event object
	$scope.event = {
		name: null,
		eventLeaderName: null,
		startDate: null
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				eventType: data.event.event_type,
				eventLeaderName: data.event.event_leaders.length > 0 ? data.event.event_leaders[0].first_name + ' ' + data.event.event_leaders[0].last_name : null,
				startDate: data.event.start_date
			};
		});
	};
	$scope.getEvent();

	// Check our inputs
	$scope.checkEditEventInput = function(){
		var noErrors = true;
		if(!$scope.event.name){
			$scope.showEditEventErrors.name = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Make edits to an event
	$scope.editEvent = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		if($scope.checkEditEventInput() === true){
			editEventModalService.edit($scope.event).then(function(){
				$rootScope.getEvents();
				$scope.callSuccess = true;
			}, function(){
				$window.alert('Something went wrong.  Event not modified');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});