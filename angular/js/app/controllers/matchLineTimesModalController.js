teamsRIt.controller('matchLineTimesModalController', function($scope, $routeParams, matchLineTimesModalService, editEventModalService,
															  playingSurfacesWithLinesModalService, eventService, helperService){

	// Our visibility filter
	$scope.filters = {
		roundDate: null
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				activity_id: data.event.activity_id,
				facility_id: data.event.facility_id
			};
			$scope.eventUsers = data.event.users;
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEvent();

	// Build our courts assignments string
	$scope.parseCourtsString = function(line){
		var index = helperService.findArrayIndex($scope.matches, 'id', line.match_id);
		if(line.event_surface_number){
			if(!$scope.matches[index].courts_string){
				$scope.matches[index].courts_string = line.event_surface_number.toString();
				$scope.matches[index].courts_array = [line.event_surface_number]
			}
			else{
				if($scope.matches[index].courts_array.indexOf(line.event_surface_number) === -1){
					$scope.matches[index].courts_string = $scope.matches[index].courts_string + ', ' + line.event_surface_number.toString();
					$scope.matches[index].courts_array.push(line.event_surface_number);
				}
			}
		}
	};

	// Build our start times array
	$scope.parseStartTimesArray = function(line){
		if($scope.startTimes.indexOf(line.start_time) === -1){
			$scope.startTimes.push(line.start_time);
		}
	};
	
	// Build our match lines start time array
	$scope.parseMatchLineStartTimesArray = function(line){
		var index = helperService.findArrayIndex($scope.matches, 'id', line.match_id);
		if(!$scope.matchLineStartTimes[$scope.matches[index].date]){
			$scope.matchLineStartTimes[$scope.matches[index].date] = {};
		}
		if(!$scope.matchLineStartTimes[$scope.matches[index].date][line.match_id]){
			$scope.matchLineStartTimes[$scope.matches[index].date][line.match_id] = {};
		}
		var lineTypeCount = line.line_play_type.toUpperCase() + $scope.lineTypeCounts[line.match_id][line.line_play_type];
		if(!$scope.matchLineStartTimes[$scope.matches[index].date][line.match_id][line.start_time]){
			$scope.matchLineStartTimes[$scope.matches[index].date][line.match_id][line.start_time] = lineTypeCount;
		}
		else{
			$scope.matchLineStartTimes[$scope.matches[index].date][line.match_id][line.start_time] = $scope.matchLineStartTimes[$scope.matches[index].date][line.match_id][line.start_time] + ', ' + lineTypeCount;
		}
	};

	// Update our line type counts
	$scope.updateLineTypeCounts = function(line){
		var lineType = line.line_play_type;
		var index = helperService.findArrayIndex($scope.matches, 'id', line.match_id);
		var roundDate = $scope.matches[index].date;
		var matchId = $scope.matches[index].id;
		if(!$scope.lineTypeCounts[matchId]){
			$scope.lineTypeCounts[matchId] = {};
		}
		if(!$scope.lineTypeCounts[matchId][lineType]){
			$scope.lineTypeCounts[matchId][lineType] = 0;
		}
		$scope.lineTypeCounts[matchId][lineType] = $scope.lineTypeCounts[matchId][lineType] + 1;
		return roundDate;
	};
	
	// Parse our scope.lines array
	$scope.parseLines = function(){
		$scope.startTimes = [];
		$scope.matchLineStartTimes = [];
		$scope.lineTypeCounts = {};
		for(var i = 0; i < $scope.lines.length; i++){
			$scope.lines[i].round_date = $scope.updateLineTypeCounts($scope.lines[i]);
			$scope.parseCourtsString($scope.lines[i]);
			$scope.parseStartTimesArray($scope.lines[i]);
			$scope.parseMatchLineStartTimesArray($scope.lines[i]);
		}
	};

	// Get all lines
	$scope.getLines = function(){
		eventService.getEventLines($routeParams.id).then(function(data){
			$scope.lines = data.lines;
			// Sort lines by their IDs
			$scope.lines.sort(function(a, b){
				if(a.id < b.id){
					return -1;
				}
				if(a.id > b.id){
					return 1;
				}
				return 0;
			});
			$scope.parseLines();
		});
	};

	// Parse our scope.matches array
	$scope.parseMatches = function(){
		$scope.roundDates = [];
		for(var i = 0; i < $scope.matches.length; i++){
			$scope.matches[i].event_surface_number = $scope.matches[i].event_surface_number !== null ? String($scope.matches[i].event_surface_number) : '';
			if(helperService.findArrayIndex($scope.roundDates, 'number', $scope.matches[i].round) === false){
				$scope.roundDates.push({
					number: $scope.matches[i].round,
					date: $scope.matches[i].date
				});
			}
		}
		var index = helperService.findArrayIndex($scope.roundDates, 'number', 1);
		$scope.selectedRoundDate = $scope.roundDates[index]['date'];
	};

	// Get all matches
	$scope.getMatches = function(){
		matchLineTimesModalService.getEventMatches($routeParams.id).then(function(data){
			$scope.matches = data.matches;
			$scope.parseMatches();
			$scope.getLines();
		});
	};
	$scope.getMatches();

	// Get available surfaces for our event
	$scope.getSurfaces = function(){
		playingSurfacesWithLinesModalService.getSurfaces($routeParams.id).then(function(data){
			$scope.surfaces = data.surfaces;
		});
	};
	$scope.getSurfaces();

	// Custom round sort by method
	$scope.orderRounds = function(round){
		if(round.number > 0){
			return round.number;
		}
		else{
			return 100 + -round.number;
		}
	};

	// Make available helper functions in scope
	$scope.formatDate = helperService.formatDate;
	$scope.parseTime = helperService.parseTime;

});