teamsRIt.controller('dashboardController', function($scope, $rootScope, dashboardService, helperService){

	// Current page variable
	$rootScope.currentPage = 'dashboard';

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

	// Return only events currently in progress
	$scope.parseCurrentEvents = function(events){
		var currentEvents = [];
		for(var i = 0; i < events.length; i++){
			if(events[i].started === 1 && events[i].completed === 0){
				if($rootScope.user.privilege === 'facility leader' || events[i].event_leaders.length > 0 || (events[i].users[0] && events[i].users[0].pivot.confirmed === 1)){
					events[i].start_date_string = helperService.formatDate(events[i].start_date);
					events[i].has_team_assignment_occurred = $scope.hasTeamAssignmentOccurred(events[i].event_team_users);
					currentEvents.push(events[i]);
				}
			}
		}
		return currentEvents;
	};

	// Tells us whether team assignment has already occurred for an event
	$scope.hasTeamAssignmentOccurred = function(eventTeamUsers){
		var hasOccurred = false;
		for(var i = 0; i < eventTeamUsers.length; i++){
			if(eventTeamUsers[i]['user_id'] && eventTeamUsers[i]['event_team_id'] > 0){
				hasOccurred = true;
				break;
			}
		}
		return hasOccurred;
	};

	// Return only events that have not started
	$scope.parseUpcomingEvents = function(events){
		var upcomingEvents = [];
		for(var i = 0; i < events.length; i++){
			if(events[i].started === 0){
				if($rootScope.user.privilege === 'facility leader' || events[i].event_leaders.length > 0 || (events[i].users[0] && events[i].users[0].pivot.rsvped !== null)){
					events[i].start_date_string = helperService.formatDate(events[i].start_date);
					events[i].has_team_assignment_occurred = $scope.hasTeamAssignmentOccurred(events[i].event_team_users);
					upcomingEvents.push(events[i]);
				}
			}
		}
		return upcomingEvents;
	};

	// Get all events associated with a user
	$rootScope.getEvents = function(){
		$scope.getEventsInProgress = true;
		$scope.getEventsFailed = false;
		dashboardService.getEvents().then(function(data){
			$scope.currentEvents = $scope.parseCurrentEvents(data.events);
			$scope.upcomingEvents = $scope.parseUpcomingEvents(data.events);
		}, function(){
			$scope.getEventsFailed = true;
		}).finally(function(){
			$scope.getEventsInProgress = false;
		});
	};
	$rootScope.getEvents();

});