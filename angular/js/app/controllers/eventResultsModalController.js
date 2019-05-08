teamsRIt.controller('eventResultsModalController', function($scope, $rootScope, eventService, matchLineTimesModalService, editEventModalService, helperService){

	// Default values
	$scope.filters = {
		roundDate: null,
		matchId: null
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.getMatches();
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				eventType: data.event.event_type
			};
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEvent();

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

	// Assign round match line number to a specific line
	$scope.assignRoundMatchLineNumber = function(index, i){
		var result = $scope.getRoundInfo($scope.eventLines[i]);
		var roundMatchNumber = $scope.matches[index].round_match_number;
		$scope.eventLines[i].round_match_number = roundMatchNumber;
		$scope.parseRoundMatchLineNumber(roundMatchNumber, result);
		$scope.eventLines[i].round_match_line_number = $scope.roundMatchLineNumber[result.roundDate][roundMatchNumber];
	};

	// Parse our scope.eventLines array
	$scope.parseEventLines = function(){
		$scope.roundMatchLineNumber = {};
		var doublesCount = 1;
		var singlesCount = 1;
		// Get the current doubles / singles line count
		for(var i = 0; i < $scope.eventLines.length; i++){
			$scope.eventLines[i].start_time_formatted = $scope.eventLines[i].start_time ? helperService.parseTime($scope.eventLines[i].start_time) : null;
			if($scope.eventLines[i].line_type === 'doubles'){
				$scope.eventLines[i].doubles_line_number = doublesCount;
				doublesCount = doublesCount + 1;
			}
			else{
				$scope.eventLines[i].singles_line_number = singlesCount;
				singlesCount = singlesCount + 1;
			}
			var index = helperService.findArrayIndex($scope.matches, 'id', $scope.eventLines[i].match_id);
			$scope.eventLines[i].date = $scope.matches[index] ? $scope.matches[index].date : null;
			if($scope.event.eventType === 'league'){
				$scope.assignRoundMatchLineNumber(index, i);
			}
		}
		if($rootScope.eventResultsMode === 'add'){
			for(var y = ($scope.eventLines.length - 1); y >= 0; y--){
				if($scope.eventLines[y].winning_pair_id){
					$scope.eventLines.splice(y, 1);
				}
			}
		}
	};

	// Get all lines for an event
	$scope.getEventLines = function(){
		$scope.getEventLinesInProgress = true;
		eventService.getEventLines($rootScope.selectedEvent.id).then(function(data){
			$scope.eventLines = data.lines;
			$scope.numOfLinesBeforeParse = data.lines.length;
			$scope.parseEventLines();
		}).finally(function(){
			$scope.getEventLinesInProgress = false;
		});
	};

	// Sort array by object date
	$scope.sortByDate = function(a, b){
		if(a.date > b.date){
			return 1;
		}
		else if(a.date < b.date){
			return -1;
		}
		else{
			return 0;
		}
	};

	// Set round date filter if event is in progress
	$scope.setRoundDateFilter = function(){
		var roundDates = angular.copy($scope.roundDates);
		roundDates.sort($scope.sortByDate);
		var todaysDate = helperService.getTodaysDate();
		if(todaysDate > roundDates[0].date && todaysDate <= roundDates[roundDates.length - 1].date){
			for(var i = 1; i < roundDates.length; i++){
				if(todaysDate >= roundDates[i].date){
					$scope.filters.roundDate = roundDates[i].date;
				}
			}
		}
	};

	// Parse our scope.matches array
	$scope.parseMatches = function(){
		var round = 1;
		var roundMatchNumber = 1;
		$scope.roundDates = [];
		if($scope.matches.length > 0){
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
				roundMatchNumber = roundMatchNumber + 1;
			}
			var index = helperService.findArrayIndex($scope.roundDates, 'number', 1);
			$scope.filters.roundDate = $scope.roundDates[index]['date'];
		}
		$scope.setRoundDateFilter();
	};

	// Get all matches
	$scope.getMatches = function(){
		matchLineTimesModalService.getEventMatches($scope.selectedEvent.id).then(function(data){
			$scope.matches = data.matches;
			$scope.parseMatches();
			$scope.getEventLines();
		});
	};

	// Build our lines results array
	$scope.buildLineResultsArray = function(){
		$scope.lineResults = [];
		for(var i = 0; i < $scope.eventLines.length; i++){
			var result = {
				line_id: $scope.eventLines[i].id,
				winning_pair_id: $scope.eventLines[i].winning_pair_id
			};
			result.sets = [];
			for(var y = 0; y < $scope.eventLines[i].line_scores.length; y++){
				var set = {
					line_score_id: $scope.eventLines[i].line_scores[y].id,
					pair_one_score: $scope.eventLines[i].line_scores[y].pair_one_score,
					pair_two_score: $scope.eventLines[i].line_scores[y].pair_two_score
				};
				result.sets.push(set);
			}
			$scope.lineResults.push(result);
		}
	};

	// Update our lines results
	$scope.updateLineScores = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.buildLineResultsArray();
		eventService.updateEventLinesScores($scope.lineResults).then(function(){
			$scope.callSuccess = true;
			if($rootScope.currentPage === 'eventStandings'){
				$scope.getStandings();
			}
		}, function(){
			alert('Something went wrong.  Results not updated');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};
	
	// Tells us whether a line should be shown or not
	$scope.showLine = function(line){
		if($scope.selectedEvent.event_type === 'league'){
			if(line.date === $scope.filters.roundDate){
				if($scope.filters.matchId){
					if(line.match_id == $scope.filters.matchId){
						if($scope.filters.lineId){
							return line.id == $scope.filters.lineId;
						}
					}
					else{
						return false;
					}
				}
			}
			else{
				return false;
			}
		}
		return true;
	};

	// Reset our match and line filters if round date dropdown changes
	$scope.$watch('filters.roundDate', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filters.matchId = null;
			$scope.filters.lineId = null;
		}
	});

	// Reset our line filter if match dropdown changes
	$scope.$watch('filters.matchId', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filters.lineId = null;
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
	$scope.parseTime = helperService.parseTime;
	$scope.formatDate = helperService.formatDate;
	$scope.capitalizeWords = helperService.capitalizeWords;

	// Only allow 0 to 6 integer values on score inputs
	$(document).on('keydown', '.left-score, .right-score', function(event){
		if(!(event.which >= 48 && event.which <= 57) && !(event.which >= 96 && event.which <= 105) && event.which !== 8 && event.which !== 9 && event.which !== 46){
			event.preventDefault();
		}
	});

});