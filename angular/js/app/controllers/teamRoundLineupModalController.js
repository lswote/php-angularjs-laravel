teamsRIt.controller('teamRoundLineupModalController', function($scope, $rootScope, $routeParams, eventService, matchLineTimesModalService, eventLinesService, helperService){

	// Build our match lines start time array
	$scope.parseMatchLineStartTimesArray = function(line){
		$scope.matchLineStartTimes[line.id] = line.line_play_type.toUpperCase() + $scope.lineTypeCounts[line.match_id][line.line_play_type];
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
		var teamOneName = $scope.matches[index].team_one ? $scope.matches[index].team_one.name : null;
		var teamTwoName = $scope.matches[index].team_two ? $scope.matches[index].team_two.name : null;
		var selectedTeam;
		if($scope.matches[index].team_one){
			selectedTeam = $rootScope.selectedTeam === $scope.matches[index].team_one.name ? line.pair_one : line.pair_two;
		}
		else{
			selectedTeam = null;
		}
		return {
			roundDate: roundDate,
			matchTeams: [teamOneName, teamTwoName],
			selectedTeam: selectedTeam
		}
	};

	// Parse our scope.lines array
	$scope.parseLines = function(){
		$scope.lineTypeCounts = {};
		$scope.matchLineStartTimes = {};
		for(var i = 0; i < $scope.lines.length; i++){
			var result = $scope.updateLineTypeCounts($scope.lines[i]);
			$scope.lines[i].round_date = result.roundDate;
			$scope.lines[i].match_teams = result.matchTeams;
			$scope.lines[i].selected_team = result.selectedTeam;
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
		$scope.playoffTeams = {};
		for(var i = 0; i < $scope.matches.length; i++){
			$scope.matches[i].event_surface_number = $scope.matches[i].event_surface_number !== null ? String($scope.matches[i].event_surface_number) : '';
			if(helperService.findArrayIndex($scope.roundDates, 'number', $scope.matches[i].round) === false){
				$scope.roundDates.push({
					number: $scope.matches[i].round,
					date: $scope.matches[i].date
				});
			}
			if($scope.matches[i].round < 0){
				if(!$scope.playoffTeams[$scope.matches[i].round]){
					$scope.playoffTeams[$scope.matches[i].round] = [];
				}
				if($scope.matches[i].team_one){
					if($scope.playoffTeams[$scope.matches[i].round].indexOf($scope.matches[i].team_one.name) === -1){
						$scope.playoffTeams[$scope.matches[i].round].push($scope.matches[i].team_one.name);
					}

				}
				if($scope.matches[i].team_two){
					if($scope.playoffTeams[$scope.matches[i].round].indexOf($scope.matches[i].team_two.name) === -1){
						$scope.playoffTeams[$scope.matches[i].round].push($scope.matches[i].team_two.name);
					}
				}
			}
		}
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

	// Custom round sort by method
	$scope.orderRounds = function(round){
		if(round.number > 0){
			return round.number;
		}
		else{
			return 100 + -round.number;
		}
	};

	// Bring into scope helper functions
	$scope.formatDate = helperService.formatDate;
	$scope.findArrayIndex = helperService.findArrayIndex;

});