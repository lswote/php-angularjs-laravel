teamsRIt.controller('pastEventsController', function($scope, $rootScope, dashboardService, helperService){

	// Current page variable
	$rootScope.currentPage = 'pastEvents';

	// Gets info about our facility
	$scope.getFacilityInfo = function(){
		dashboardService.getFacilityInfo().then(function(data){
			$rootScope.facility = data.facility;
			if(!data.facility.image_url || $rootScope.user.privilege === 'admin'){
				$rootScope.facility.image_url = '../../../images/meds.jpg';
			}
		});
	};
	$scope.getFacilityInfo();

	// Return only events that have been completed
	$scope.parsePastEvents = function(events){
		var pastEvents = [];
		for(var i = 0; i < events.length; i++){
			if(events[i].started === 1 && events[i].completed === 1){
				if($rootScope.user.privilege === 'facility leader' || events[i].event_leaders.length > 0 || (events[i].users[0] && events[i].users[0].pivot.confirmed === 1)){
					events[i].start_date_string = helperService.formatDate(events[i].start_date);
					pastEvents.push(events[i]);
				}
			}
		}
		return pastEvents;
	};

	// Get all events associated with a user
	$rootScope.getEvents = function(){
		$scope.getEventsInProgress = true;
		$scope.getEventsFailed = false;
		dashboardService.getEvents().then(function(data){
			$scope.pastEvents = $scope.parsePastEvents(data.events);
		}, function(){
			$scope.getEventsFailed = true;
		}).finally(function(){
			$scope.getEventsInProgress = false;
		});
	};
	$rootScope.getEvents();

});