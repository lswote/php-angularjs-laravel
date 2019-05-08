teamsRIt.controller('eventStandingsController', function($scope, $rootScope, $routeParams, $window, eventStandingsService, editEventModalService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventStandings';
	// Our visibility filters
	$scope.filters = {
		startDate: null,
		endDate: null
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				event_type: data.event.event_type,
				activity_id: data.event.activity_id,
				facility_id: data.event.facility_id,
				event_leaders: data.event.event_leaders,
				started: data.event.started
			};
			$scope.eventUsers = data.event.users;
			$scope.displayEventForm = true;
			$scope.getStandings();
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEvent();

	// Parse our team standings
	$scope.parseStandings = function(){
		$scope.roundDates = [];
		var lastRegularSeasonRound = 0;
		for(var i = 0; i < $scope.teams.length; i++){
			var totalScore = 0;
			for(var x = 0; x < $scope.teams[i].matches.length; x++){
				if(helperService.findArrayIndex($scope.roundDates, 'date', $scope.teams[i].matches[x].date) === false){
					$scope.roundDates.push({
						number: $scope.teams[i].matches[x].round,
						date: $scope.teams[i].matches[x].date
					});
				}
				totalScore = totalScore + ($scope.teams[i].matches[x].score || 0);
				if(lastRegularSeasonRound < $scope.teams[i].matches[x].round){
					lastRegularSeasonRound = $scope.teams[i].matches[x].round;
				}
			}
			$scope.teams[i].totalScore = totalScore;
		}
		var index = helperService.findArrayIndex($scope.roundDates, 'number', 1);
		$scope.filters.startDate = $scope.roundDates[index]['date'];
		index = helperService.findArrayIndex($scope.roundDates, 'number', lastRegularSeasonRound);
		$scope.filters.endDate = $scope.roundDates[index]['date'];
	};

	// Get event standings
	$rootScope.getStandings = function(){
		eventStandingsService.getStandings($routeParams.id).then(function(data){
			$scope.teams = data.teams;
			$scope.parseStandings();
		});
	};

	// Make sure end date is the same or after the start date
	$scope.$watch('filters.startDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.filters.endDate < newValue){
				$scope.filters.endDate = newValue;
			}
		}
	});

	// Make sure start date is the same or before the end date
	$scope.$watch('filters.endDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.filters.startDate > newValue){
				$scope.filters.startDate = newValue;
			}
		}
	});

	// Custom round sort by method
	$scope.orderRounds = function(round){
		if(round.number > 0){
			return round.number;
		}
		else{
			return 100 + -round.number;
		}
	};

	// Bring helper functions into scope
	$scope.formatDate = helperService.formatDate;
	$scope.findArrayIndex = helperService.findArrayIndex;

});