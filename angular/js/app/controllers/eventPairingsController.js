teamsRIt.controller('eventPairingsController', function($scope, $rootScope, $routeParams, $window, eventService, editEventModalService, perRoundLinesModalService,
														dashboardService, helperService){

	// Our line types
	$scope.typeOfFemaleLines = ['ws', 'wd'];
	$scope.typeOfMaleLines = ['ms', 'md'];
	$scope.typeOfComboLineTypes = ['xs', 'xd'];
	// Our search filters
	$scope.filters = {
		startLine: null,
		endLine: null,
		lineType: null,
		startLineNumber: null,
		endLineNumber: null
	};

	// Get all events where our user is a participant
	$scope.getEventsAsParticipant = function(){
		dashboardService.getEvents().then(function(data){
			$scope.participantEvents = data.events;
			var index = helperService.findArrayIndex($scope.participantEvents, 'id', $routeParams.id);
			if(index !== false){
				$scope.event = {
					id: $scope.participantEvents[index].id,
					name: $scope.participantEvents[index].name
				};
				$scope.displayEventForm = true;
			}
			else{
				$scope.displayEventForm = false;
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Get all events where our user is a leader
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || ($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false))){
				$scope.getEvent();
			}
			else{
				$scope.getEventsAsParticipant();
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name
			};
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Parse our scope.eventLines array
	$scope.parseEventLines = function(){
		$scope.teams = [];
		for(var i = 0; i < $scope.eventLines.length; i++){
			if($scope.eventLines[i].matches.team_one){
				if(helperService.findArrayIndex($scope.teams, 'name', $scope.eventLines[i].matches.team_one.name) === false){
					$scope.teams.push({
						name: $scope.eventLines[i].matches.team_one.name,
						lines: []
					});
				}
				var index = helperService.findArrayIndex($scope.teams, 'name', $scope.eventLines[i].matches.team_one.name);
				if($scope.eventLines[i].matches.round === 1){
					var lineObject = angular.copy($scope.eventLines[i]);
					lineObject.current_team_lineup = lineObject.pair_one;
					lineObject.current_team_lineup.pair = 'pair_one';
					$scope.teams[index].lines.push(lineObject)
				}
			}
			if($scope.eventLines[i].matches.team_two){
				if(helperService.findArrayIndex($scope.teams, 'name', $scope.eventLines[i].matches.team_two.name) === false){
					$scope.teams.push({
						name: $scope.eventLines[i].matches.team_two.name,
						lines: []
					});
				}
				index = helperService.findArrayIndex($scope.teams, 'name', $scope.eventLines[i].matches.team_two.name);
				if($scope.eventLines[i].matches.round === 1){
					lineObject = angular.copy($scope.eventLines[i]);
					lineObject.current_team_lineup = lineObject.pair_two;
					lineObject.current_team_lineup.pair = 'pair_two';
					$scope.teams[index].lines.push(lineObject)
				}
			}
			if($scope.typeOfFemaleLines.indexOf($scope.eventLines[i].line_play_type) > -1){
				$scope.eventLines[i].line_sex = 'female';
			}
			else if($scope.typeOfMaleLines.indexOf($scope.eventLines[i].line_play_type) > -1){
				$scope.eventLines[i].line_sex = 'male';
			}
		}
	};

	// Get all lines for an event
	$scope.getEventLines = function(){
		$scope.getEventLinesInProgress = true;
		eventService.getEventLines($routeParams.id).then(function(data){
			$scope.eventLines = data.lines;
			$scope.parseEventLines();
		}).finally(function(){
			$scope.getEventLinesInProgress = false;
		});
	};
	$scope.getEventLines();

	// Get number and type of lines per match for our event
	$scope.getLinesPerMatch = function(){
		perRoundLinesModalService.getLinesPerMatch($routeParams.id).then(function(data){
			$scope.allLines = data.lines;
			$scope.femaleLines = [];
			$scope.maleLines = [];
			$scope.comboLines = [];
			var femaleDoublesIndex = 1;
			var femaleSinglesIndex = 1;
			var maleDoublesIndex = 1;
			var maleSinglesIndex = 1;
			var comboDoublesIndex = 1;
			var comboSinglesIndex = 1;
			for(var i = 0; i < data.lines.length; i++){
				if($scope.typeOfFemaleLines.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.femaleLines.push('WD' + femaleDoublesIndex);
						femaleDoublesIndex = femaleDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.femaleLines.push('WS' + femaleSinglesIndex);
						femaleSinglesIndex = femaleSinglesIndex + 1;
					}
				}
				else if($scope.typeOfMaleLines.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.maleLines.push('MD' + maleDoublesIndex);
						maleDoublesIndex = maleDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.maleLines.push('MS' + maleSinglesIndex);
						maleSinglesIndex = maleSinglesIndex + 1;
					}
				}
				else if($scope.typeOfComboLineTypes.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.comboLines.push('XD' + comboDoublesIndex);
						comboDoublesIndex = comboDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.comboLines.push('XS' + comboSinglesIndex);
						comboSinglesIndex = comboSinglesIndex + 1;
					}
				}
			}
		});
	};
	$scope.getLinesPerMatch();

	// Get all group / team info for an event
	$scope.getEventTeams = function(){
		eventService.getEventTeams($routeParams.id).then(function(data){
			$scope.eventTeamUsers = data.event_team_users;
		});
	};
	$scope.getEventTeams();

	// Tells us when to hide a line
	$scope.hideLine = function(line){
		if($scope.filters.lineType && $scope.filters.lineType !== line.substr(0, 2).toLowerCase()){
			return true;
		}
		if($scope.filters.lineType && (line.substr(2) < $scope.filters.startLineNumber || line.substr(2) > $scope.filters.endLineNumber)){
			return true;
		}
		return false;
	};

	// Set our filters based on what filter dropdowns are selected
	$scope.$watch('[filters.startLine, filters.endLine]', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.filters.startLine && $scope.filters.endLine){
				$scope.filters.lineType = $scope.filters.startLine.substr(0, 2).toLowerCase();
				$scope.filters.startLineNumber = $scope.filters.startLine.substr(2);
				$scope.filters.endLineNumber = $scope.filters.endLine.substr(2);
			}
			else{
				$scope.filters.lineType = null;
				$scope.filters.startLineNumber = null;
				$scope.filters.endLineNumber = null;
			}
		}
	});

	// Make sure end line filter syncs line type with start line filter
	$scope.$watch('filters.startLine', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue && $scope.filters.endLine && newValue.substr(0, 2) !== $scope.filters.endLine.substr(0, 2)){
				$scope.filters.endLine = newValue;
			}
			if(newValue && $scope.filters.endLine && newValue.substr(0, 2) === $scope.filters.endLine.substr(0, 2) && newValue.substr(2) > $scope.filters.endLine.substr(2)){
				$scope.filters.endLine = newValue;
			}
			if(!newValue){
				$scope.filters.endLine = '';
			}
		}
	});

	// Make sure start line filter syncs with end line filter's number
	$scope.$watch('filters.endLine', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue && $scope.filters.startLine && newValue.substr(0, 2) !== $scope.filters.startLine.substr(0, 2)){
				$scope.filters.startLine = newValue;
			}
			if(newValue && $scope.filters.startLine && newValue.substr(0, 2) === $scope.filters.startLine.substr(0, 2) && newValue.substr(2) < $scope.filters.startLine.substr(2)){
				$scope.filters.startLine = newValue;
			}
			if(!newValue){
				$scope.filters.startLine = '';
			}
		}
	});

	// Make helper functions available in scope
	$scope.findArrayIndexMultipleKeys = helperService.findArrayIndexMultipleKeys;

});