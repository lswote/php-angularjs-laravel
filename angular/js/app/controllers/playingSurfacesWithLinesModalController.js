teamsRIt.controller('playingSurfacesWithLinesModalController', function($scope, $rootScope, $window, $timeout, playingSurfacesWithLinesModalService, eventService,
																		matchLineTimesModalService, helperService){

	// Default values
	$scope.filters = {
		roundDate: null,
		matchNumber: null
	};

	// Update our line type counts
	$scope.updateLineTypeCounts = function(line){
		var lineType = line.line_play_type.substring(0, 2);
		var index = helperService.findArrayIndex($scope.matches, 'id', line.match_id);
		var roundDate = $scope.matches[index] ? $scope.matches[index].date : null;
		var matchId = $scope.matches[index] ? $scope.matches[index].id : null;
		if(!$scope.lineTypeCounts[matchId]){
			$scope.lineTypeCounts[matchId] = {};
		}
		if(!$scope.lineTypeCounts[matchId][lineType]){
			$scope.lineTypeCounts[matchId][lineType] = 0;
		}
		$scope.lineTypeCounts[matchId][lineType] = $scope.lineTypeCounts[matchId][lineType] + 1;
		return roundDate;
	};

	// Get round info for a line
	$scope.getRoundInfo = function(line){
		var index = helperService.findArrayIndex($scope.matches, 'id', line.match_id);
		var roundNumber = $scope.matches[index].round;
		var roundDate = $scope.matches[index].date;
		return {
			roundNumber: roundNumber,
			roundDate: roundDate
		}
	};

	// Assign round match line number
	$scope.parseRoundMatchLineNumber = function(roundMatchNumber, result){
		if(!$scope.roundMatchLineNumber[result.roundDate]){
			$scope.roundMatchLineNumber[result.roundDate] = {};
		}
		if(!$scope.roundMatchLineNumber[result.roundDate][roundMatchNumber]){
			$scope.roundMatchLineNumber[result.roundDate][roundMatchNumber] = 1;
		}
		else{
			$scope.roundMatchLineNumber[result.roundDate][roundMatchNumber] = $scope.roundMatchLineNumber[result.roundDate][roundMatchNumber] + 1;
		}
	};

	// Tell us whether or not a line is using an emergency court
	$scope.isLineUsingEmergencySurface = function(line){
		for(var i = 0; i < $scope.emergencySurfaces.length; i++){
			if($scope.emergencySurfaces[i].pivot.event_surface_number == line.event_surface_number){
				return true;
			}
		}
		return false;
	};

	// Parse our scope.lines array
	$scope.parseLines = function(){
		$scope.roundMatchLineNumber = {};
		$scope.linesWithEmergencySurfaces = [];
		for(var i = 0; i < $scope.lines.length; i++){
			$scope.updateLineTypeCounts($scope.lines[i]);
			$scope.lines[i].start_time_formatted = helperService.parseTime($scope.lines[i].start_time);
			$scope.lines[i].event_surface_number = $scope.lines[i].event_surface_number !== null ? String($scope.lines[i].event_surface_number) : '';
			$scope.lines[i].line_type_number = $scope.lines[i].line_play_type.toUpperCase() + $scope.lineTypeCounts[$scope.lines[i].match_id][$scope.lines[i].line_play_type];
			if($rootScope.selectedEvent.event_type === 'league'){
				var result = $scope.getRoundInfo($scope.lines[i]);
				$scope.lines[i].round_number = result.roundNumber;
				$scope.lines[i].round_date = result.roundDate;
				var index = helperService.findArrayIndex($scope.matches, 'id', $scope.lines[i].match_id);
				$scope.lines[i].round_match_number = $scope.matches[index].round_match_number;
				var roundMatchNumber = $scope.matches[index].round_match_number;
				$scope.parseRoundMatchLineNumber(roundMatchNumber, result);
				$scope.lines[i].round_match_line_number = $scope.roundMatchLineNumber[result.roundDate][roundMatchNumber];
				if($scope.isLineUsingEmergencySurface($scope.lines[i]) === true){
					$scope.linesWithEmergencySurfaces.push($scope.lines[i].id);
				}
			}
		}
	};

	// Sort lines by their IDs
	$scope.sortLines = function(a, b){
		if(a.id < b.id){
			return -1;
		}
		else if(a.id > b.id){
			return 1
		}
		else{
			return 0;
		}
	};
	
	// Get all lines
	$scope.getLines = function(){
		eventService.getEventLines($rootScope.selectedEvent.id).then(function(data){
			$scope.lines = data.lines;
			$scope.lines.sort($scope.sortLines);
			$scope.lineTypeCounts = {};
			$scope.parseLines();
		});
	};

	// Parse our scope.matches array
	$scope.parseMatches = function(){
		var round = 1;
		var roundMatchNumber = 1;
		$scope.roundDates = [];
		$scope.roundMatchNumbers = [];
		for(var i = 0; i < $scope.matches.length; i++){
			if($scope.matches[i].round !== round){
				round = $scope.matches[i].round;
				roundMatchNumber = 1;
			}
			$scope.matches[i].event_surface_number = $scope.matches[i].event_surface_number !== null ? String($scope.matches[i].event_surface_number) : '';
			if(helperService.findArrayIndex($scope.roundDates, 'number', $scope.matches[i].round) === false){
				$scope.roundDates.push({
					number: $scope.matches[i].round,
					date: $scope.matches[i].date
				});
			}
			// Assign round match number
			$scope.matches[i].round_match_number = roundMatchNumber;
			if($scope.roundMatchNumbers.indexOf(roundMatchNumber) === -1){
				$scope.roundMatchNumbers.push(roundMatchNumber);
			}
			roundMatchNumber = roundMatchNumber + 1;
		}
	};

	// Get all matches
	$scope.getMatches = function(){
		matchLineTimesModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
			$scope.matches = data.matches;
			$scope.parseMatches();
			$scope.getLines();
		});
	};
	$scope.getMatches();

	// Label surfaces as assigned or emergency
	$scope.parseSurfaces = function(surfaces){
		$scope.surfaces = [];
		$scope.emergencySurfaces = [];
		for(var i = 0; i < surfaces.length; i++){
			if(surfaces[i].pivot.emergency_surface == 1){
				$scope.emergencySurfaces.push(surfaces[i]);
			}
			else{
				$scope.surfaces.push(surfaces[i]);
			}
		}
	};

	// Get available surfaces for our event
	$scope.getSurfaces = function(){
		playingSurfacesWithLinesModalService.getSurfaces($rootScope.selectedEvent.id).then(function(data){
			if($rootScope.selectedEvent.event_type !== 'league'){
				$scope.surfaces = data.surfaces;
			}
			else if($rootScope.selectedEvent.event_type === 'league'){
				$scope.parseSurfaces(data.surfaces);
			}
		});
	};
	$scope.getSurfaces();

	// Reset dropdowns for non league view
	$scope.resetNonLeagueDropdown = function(lineId, eventSurfaceNumber, startTime){
		var lines = angular.copy($scope.lines);
		var index = helperService.findArrayIndex(lines, 'id', lineId);
		lines.splice(index, 1);
		index = helperService.findArrayIndexMultipleKeys(lines, ['event_surface_number', 'start_time'], [eventSurfaceNumber, startTime]);
		if(lines[index]){
			lineId = lines[index].id;
			index = helperService.findArrayIndex($scope.lines, 'id', lineId);
			$scope.lines[index].event_surface_number = '';
		}
	};

	// Reset dropdowns for league view
	$scope.resetLeagueDropdown = function(lineId, eventSurfaceNumber, startTime, roundNumber){
		var lines = angular.copy($scope.lines);
		var index = helperService.findArrayIndex(lines, 'id', lineId);
		lines.splice(index, 1);
		index = helperService.findArrayIndexMultipleKeys(lines, ['event_surface_number', 'start_time', 'round_number'], [eventSurfaceNumber, startTime, roundNumber]);
		if(lines[index]){
			lineId = lines[index].id;
			index = helperService.findArrayIndex($scope.lines, 'id', lineId);
			$scope.lines[index].event_surface_number = '';
		}
	};

	// Reset dropdown with same event surface number
	$scope.resetDropdown = function(line){
		if($rootScope.selectedEvent.event_type !== 'league'){
			$scope.resetNonLeagueDropdown(line.id, line.event_surface_number, line.start_time);
		}
		else if($rootScope.selectedEvent.event_type === 'league'){
			$scope.resetLeagueDropdown(line.id, line.event_surface_number, line.start_time, line.round_number);
		}
	};

	// Tells us whether a line will be using an emergency surface or predefined surface
	$scope.toggleEmergencySurface = function(lineId){
		var index = $scope.linesWithEmergencySurfaces.indexOf(lineId);
		if(index === -1){
			$scope.linesWithEmergencySurfaces.push(lineId);
		}
		else{
			$scope.linesWithEmergencySurfaces.splice(index, 1);
		}
		// Reset the surface assigned to our line when we toggle between predefined and emergency surface dropdowns
		index = helperService.findArrayIndex($scope.lines, 'id', lineId);
		$scope.lines[index].event_surface_number = null;
	};

	// Updates our surfaces and lines combos
	$scope.updateSurfaceAssignments = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		playingSurfacesWithLinesModalService.updateSurfaceAssignments($rootScope.selectedEvent.id, $scope.lines).then(function(){
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Surface assignments not updated');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Tells us whether a line should be shown or not
	$scope.showLine = function(line){
		if($scope.filters.roundDate){
			if(line.round_date !== $scope.filters.roundDate){
				return false
			}
		}
		if($scope.filters.matchNumber && (line.round_match_number != $scope.filters.matchNumber)){
			return false
		}
		return true;
	};

	// Reset our match number filter if round date dropdown changes
	$scope.$watch('filters.roundDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filters.matchNumber = null;
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

	// Custom line sort by method
	$scope.orderLines = function(line){
		if(line.round_number > 0){
			return line.round_number;
		}
		else{
			return 100 + -line.round_number;
		}
	};

	// Make helper function available in scope
	$scope.formatDate = helperService.formatDate;

});