teamsRIt.controller('eventController', function($scope, $rootScope, $routeParams, $window, eventService, editEventModalService, socialEventLinesService, leagueEventLinesService,
												roundRobinEventLinesService, ladderEventLinesService, helperService){

	// Current page variable
	$rootScope.currentPage = 'event';
	// Drop down options for standard line duration select element
    $scope.standardLineDurations = [5, 10, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    // Drop down options for number of rounds select element
    $scope.numberRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Drop down options for number of start times for an event
    $scope.numberStartTimes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Drop down options for number of playoff rounds select element
    $scope.numberPlayoffRounds = [0, 1, 2, 3, 4, 5];
    // Drop down options for rounds minutes interval select element
    $scope.roundsMinutesIntervals = [5, 10, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240];
    // Drop down options for rounds days intervals select element
    $scope.roundsDaysIntervals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
    // Whether scope.eventConfig has been changed from its initial value
	$scope.eventConfigChanged = false;
	// Standard team counts
	$scope.teamCounts = [1, 2, 4, 6, 8, 9, 16, 25];
	$scope.socialTeamCounts = [1];
	$scope.standardLeagueTeamCounts = [2, 4, 6, 8, 16];
	$scope.irregularLeagueTeamCounts = [9, 25];
	// Default net lines values
	$scope.netWomenLines = '-';
	$scope.netMenLines = '-';
	$scope.netTotalLines = '-';
	// Variable that tells us what the team count selected is
	$scope.selectedTeamCount = null;
	// Default # of participants to remove values
	$scope.numOfFemalesToRemove = 0;
	$scope.numOfMalesToRemove = 0;

	// Default values
	$scope.eventConfig = {
		teamsPerLine: '2',
		combPlay: null,
		maxSurfaces: null,
		singlesOnly: '0',
		singleWomenLines: null,
		singleMenLines: null,
		doubleWomenLines: null,
		doubleMenLines: null,
		doubleComboLines: null,
		singleComboLines: null,
		ranked: '0',
		sets: null,
		rotateStartTime: null,
		hasPlayoff: null,
		womenSittingPerRound: null,
		menSittingPerRound: null,
		teamAssignmentMethod: null
	};
	
	// Object that determines which event config input error to show
	$scope.showEventConfigErrors = {
		combPlay: false,
		maxSurfaces: false,
		singleWomenLines: false,
		singleMenLines: false,
		doubleWomenLines: false,
		doubleMenLines: false,
		doubleComboLines: false,
		singleComboLines: false,
		sets: false,
		rotateStartTime: false,
		hasPlayoff: false,
		womenSittingPerRound: false,
		menSittingPerRound: false,
		startDate: false,
		startTime: false,
		teamAssignmentMethod: false,
		numOfStartTimes: false
	};
	
	// Check our inputs
	$scope.checkEventConfigInputs = function(){
		var noErrors = true;
		if(!$scope.eventConfig.combPlay && $scope.event.eventType !== 'multifacility'){
			$scope.showEventConfigErrors.combPlay = true;
			noErrors = false;
		}
		if((!$scope.eventConfig.maxSurfaces || $scope.eventConfig.maxSurfaces > $scope.event.numOfFacilitySurfaces) && $scope.event.eventType !== 'multifacility'){
			$scope.showEventConfigErrors.maxSurfaces = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.singleWomenLines && $scope.eventConfig.singleWomenLines !== 0){
			$scope.showEventConfigErrors.singleWomenLines = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.singleMenLines && $scope.eventConfig.singleMenLines !== 0){
			$scope.showEventConfigErrors.singleMenLines= true;
			noErrors = false;
		}
		if(!$scope.eventConfig.doubleWomenLines && $scope.eventConfig.doubleWomenLines !== 0 && $scope.event.eventType === 'multifacility'){
			$scope.showEventConfigErrors.doubleWomenLines = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.doubleMenLines && $scope.eventConfig.doubleMenLines !== 0 && $scope.event.eventType === 'multifacility'){
			$scope.showEventConfigErrors.doubleMenLines = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.doubleComboLines && $scope.eventConfig.doubleComboLines !== 0 && $scope.event.eventType === 'multifacility'){
			$scope.showEventConfigErrors.doubleComboLines = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.singleComboLines && $scope.eventConfig.singleComboLines !== 0 && $scope.event.eventType === 'multifacility'){
			$scope.showEventConfigErrors.singleComboLines = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.sets){
			$scope.showEventConfigErrors.sets = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.rotateStartTime && $scope.event.eventType !== 'social' && $scope.event.eventType !== 'multifacility'){
			$scope.showEventConfigErrors.rotateStartTime = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.hasPlayoff && $scope.eventConfig.hasPlayoff !== 0 && $scope.event.eventType !== 'social' && $scope.event.eventType !== 'round robin'){
			$scope.showEventConfigErrors.hasPlayoff = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.womenSittingPerRound && $scope.eventConfig.womenSittingPerRound !== 0 && $scope.event.eventType === 'league'){
			$scope.showEventConfigErrors.womenSittingPerRound = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.menSittingPerRound && $scope.eventConfig.menSittingPerRound !== 0 && $scope.event.eventType === 'league'){
			$scope.showEventConfigErrors.menSittingPerRound = true;
			noErrors = false;
		}
		if((!$scope.event.numOfStartTimes || !$scope.selectedTeamCount) && ($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin')){
			$window.alert('You need to select a start time / team count combo');
			noErrors = false;
		}
		if(!$scope.event.numOfStartTimes && $scope.event.eventType === 'multifacility'){
			$scope.showEventConfigErrors.numOfStartTimes = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.startDate){
			$scope.showEventConfigErrors.startDate = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.startTime){
			$scope.showEventConfigErrors.startTime = true;
			noErrors = false;
		}
		if(!$scope.eventConfig.teamAssignmentMethod && ($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin') && $scope.eventConfig.ranked === '1'){
			$scope.showEventConfigErrors.teamAssignmentMethod = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all event config errors
	$scope.resetEventConfigErrors = function(){
		for(var i in $scope.showEventConfigErrors){
			if($scope.showEventConfigErrors.hasOwnProperty(i)){
				$scope.showEventConfigErrors[i] = false;
			}
		}
	};

	// Get all events where our user is a leader
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false)){
				$scope.getEvent();
			}
			else{
				eventService.getEventsAsCaptain().then(function(data){
					if($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false){
						$scope.getEvent();
					}
					else{
						$scope.displayEventForm = false;
					}
				}, function(){
					$scope.displayEventForm = false;
				});
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get total counts of female / male participants
	$scope.parseParticipantSexCounts = function(){
		$scope.femaleCount = 0;
		$scope.maleCount = 0;
		for(var i = 0 ; i < $scope.participants.length; i++){
			if($scope.participants[i].sex){
				if($scope.participants[i].sex.toLowerCase() === 'female'){
					$scope.femaleCount = $scope.femaleCount + 1;
				}
				else if($scope.participants[i].sex.toLowerCase() === 'male'){
					$scope.maleCount = $scope.maleCount + 1;
				}
			}
		}
	};

	// Set max number of surfaces for facility / activity combo
	$scope.setNumOfFacilitySurfaces = function(event){
		var activityId = event.activity_id;
		var facilityActivities = event.facilities.activities;
		var index;
		for(var i = 0; i < facilityActivities.length; i++){
			if(facilityActivities[i].pivot.activity_id === activityId){
				$scope.event.numOfFacilitySurfaces = facilityActivities[i].pivot.num_of_surfaces;
				break;
			}
		}
	};

	// Sets the default competition scoring format / # of sets for a match based on the activity / facility config
	$scope.setFacilityActivityDefaults = function(event){
		var facilityActitvites = event.facilities.activities;
		var facilityActitvitesConfig = [];
		for(var i = 0; i < facilityActitvites.length; i++){
			facilityActitvitesConfig.push(facilityActitvites[i].pivot);
		}
		var index = helperService.findArrayIndex(facilityActitvitesConfig, 'activity_id', event.activity_id);
		$scope.eventConfig.sets = facilityActitvitesConfig[index].competition_scoring_format.toString();
		$scope.eventConfig.lineScoringFormat = facilityActitvitesConfig[index].line_scoring_format;
	};

	// Get teams per line options based on the event activity
	$scope.getTeamsPerLineOptions = function(activityId, facilityActivities){
		$scope.teamsPerLineOptions = [];
		var activityIndex = helperService.findArrayIndex(facilityActivities, 'id', activityId);
		for(var i in facilityActivities[activityIndex]){
			if(facilityActivities[activityIndex].hasOwnProperty(i)){
				if(i === 'two_teams_per_line' && facilityActivities[activityIndex][i] === 1){
					$scope.teamsPerLineOptions.push(2);
				}
				if(i === 'three_teams_per_line' && facilityActivities[activityIndex][i] === 1){
					$scope.teamsPerLineOptions.push(3);
				}
				if(i === 'four_teams_per_line' && facilityActivities[activityIndex][i] === 1){
					$scope.teamsPerLineOptions.push(4);
				}
				if(i === 'five_teams_per_line' && facilityActivities[activityIndex][i] === 1){
					$scope.teamsPerLineOptions.push(5);
				}
			}
		}
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			if(data.event.id){
				$scope.event = {
					id: data.event.id,
					name: data.event.name,
					eventType: data.event.event_type,
					eventSubType: data.event.event_sub_type,
					typeOfPlay: data.event.type_of_play,
					eventLeaderName: data.event.event_leaders.length > 0 ? data.event.event_leaders[0].first_name + ' ' + data.event.event_leaders[0].last_name : null,
					startDate: data.event.start_date,
					numOfStartTimes: data.event.num_of_start_times
				};
				$scope.getTeamsPerLineOptions(data.event.activity_id, data.event.facilities.activities);
				$scope.setNumOfFacilitySurfaces(data.event);
				$scope.setFacilityActivityDefaults(data.event);
				if($scope.event.typeOfPlay === 'mixed' && data.event.comb_play === null){
					$scope.eventConfig.combPlay = '0';
				}
				$scope.eventConfig.typeOfPlay = $scope.event.typeOfPlay;
				$scope.eventConfig.roundsIntervalMetric = data.event.rounds_interval_metric;
				$scope.eventConfig.roundsInterval = data.event.rounds_interval ? data.event.rounds_interval.toString() : null;
				$scope.eventConfig.numOfRounds = data.event.rounds ? data.event.rounds.toString() : null;
				$scope.eventConfig.standardLineDuration = data.event.standard_line_duration !== null ? data.event.standard_line_duration.toString() : null;
				$scope.startDateObject = data.event.start_date + 'T12:00:00Z';
				$scope.eventConfig.startDate = data.event.start_date;
				$scope.eventConfig.startTime = helperService.parseTime(data.event.start_time);
				if(data.event.comb_play !== null){
					$scope.viewOnly = true;
					$scope.eventConfig.combPlay = data.event.comb_play !== null ? data.event.comb_play.toString() : null;
					$scope.eventConfig.maxSurfaces = data.event.max_playing_surfaces;
					$scope.eventConfig.singleWomenLines = data.event.single_women_lines;
					$scope.eventConfig.singleMenLines = data.event.single_men_lines;
					$scope.eventConfig.ranked = data.event.ranked !== null ? data.event.ranked.toString() : null;
					$scope.eventConfig.sets = data.event.sets ? data.event.sets.toString() : null;
					$scope.eventConfig.hasPlayoff = data.event.num_of_playoff_rounds > 0 ? '1' : '0';
					$scope.eventConfig.womenSittingPerRound = data.event.women_sitting_per_round;
					$scope.eventConfig.menSittingPerRound = data.event.men_sitting_per_round;
					$scope.eventConfig.teamAssignmentMethod = data.event.team_assignment_method;
					$scope.eventConfig.lineScoringFormat = data.event.line_scoring_format;
					$scope.selectedTeamCount = data.event.num_of_teams;
					if($scope.event.eventType === 'multifacility'){
						$scope.event.numOfStartTimes = $scope.event.numOfStartTimes ? $scope.event.numOfStartTimes.toString() : null;
						$scope.eventConfig.doubleWomenLines = data.event.line_play_types.wd;
						$scope.eventConfig.doubleMenLines = data.event.line_play_types.md;
						$scope.eventConfig.doubleComboLines = data.event.line_play_types.xd;
						$scope.eventConfig.singleComboLines = data.event.line_play_types.xs;
					}
				}
				$scope.participants = data.event.users;
				$scope.parseParticipantSexCounts();
				if($scope.event.eventType !== 'multifacility'){
					$scope.calculateLines();
					$scope.calculateStartTimesAndSurfacesCombo();
				}
				$scope.displayEventForm = true;
			}
			else{
				$scope.displayEventForm = false;
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Build our scope.linesAggregateArray for non-multifacility events
	$scope.buildNonMultiFacilityLinesAggregateArray = function(){
		$scope.linesAggregateArray = [];
		var index = helperService.findArrayIndex($scope.perTeamLinesNet, 'totalTeams', $scope.selectedTeamCount);
		for(var i in $scope.perTeamLinesNet[index]){
			if($scope.perTeamLinesNet[index].hasOwnProperty(i)){
				var matchLineType = null;
				if(i === 'womenDoubles'){
					matchLineType = 'wd';
				}
				else if(i === 'menDoubles'){
					matchLineType = 'md'
				}
				else if(i === 'womenSingles'){
					matchLineType = 'ws';
				}
				else if(i === 'menSingles'){
					matchLineType = 'ms'
				}
				else if(i === 'mixedDoubles'){
					matchLineType = 'xd'
				}
				else if(i === 'mixedSingles'){
					matchLineType = 'xs'
				}
				if(matchLineType !== null){
					$scope.linesAggregateArray.push({
						line_play_type: matchLineType,
						count: $scope.perTeamLinesNet[index][i]
					});
				}
			}
		}
	};

	// Update our female and male removal counts
	$scope.updateNumOfRemovals = function(matchLineType){
		if(matchLineType === 'ws'){
			$scope.numOfFemalesToRemove = $scope.numOfFemalesToRemove + 1;
		}
		else if(matchLineType === 'ms'){
			$scope.numOfMalesToRemove = $scope.numOfMalesToRemove + 1;
		}
		else if(matchLineType === 'wd'){
			$scope.numOfFemalesToRemove = $scope.numOfFemalesToRemove + 2;
		}
		else if(matchLineType === 'md'){
			$scope.numOfMalesToRemove = $scope.numOfMalesToRemove + 2;
		}
		else if(matchLineType === 'xd'){
			$scope.numOfFemalesToRemove = $scope.numOfFemalesToRemove + 1;
			$scope.numOfMalesToRemove = $scope.numOfMalesToRemove + 1;
		}
		$scope.netMaleCount = $scope.maleCount - $scope.numOfMalesToRemove;
		$scope.netFemaleCount = $scope.femaleCount - $scope.numOfFemalesToRemove;
	};

	// Remove lines if we don't have enough surfaces / start times
	$scope.removeOverflowLines = function(){
		$scope.numOfFemalesToRemove = 0;
		$scope.numOfMalesToRemove = 0;
		var totalLinesForEvent = $scope.eventConfig.teamsPerLine === '2' ? $scope.netTotalLines * $scope.selectedTeamCount / 2 : $scope.netTotalLines * $scope.selectedTeamCount / $scope.eventConfig.teamsPerLine;
		if(totalLinesForEvent > ($scope.event.numOfStartTimes * $scope.eventConfig.maxSurfaces)){
			var femaleMatchLineTypeRemoveOrder = $scope.event.eventType !== 'round robin' ? ['ws', 'wd', 'ms', 'md', 'xd'] : ['wd', 'md', 'ws', 'ms', 'xd'];
			var maleMatchLineTypeRemoveOrder = $scope.event.eventType !== 'round robin' ? ['ms', 'md', 'ws', 'wd', 'xd'] : ['md', 'wd', 'ms', 'ws', 'xd'];
			var mixedMatchLineTypeRemoveOrder = ['xd'];
			var totalLinesToRemove = -(($scope.event.numOfStartTimes * $scope.eventConfig.maxSurfaces) - ($scope.netTotalLines * $scope.selectedTeamCount / 2));
			var linesToRemovePerTeam = Math.ceil(totalLinesToRemove / ($scope.selectedTeamCount / 2));
			for(var i = 1; i <= linesToRemovePerTeam; i++){
				var matchLineTypeRemoveOrder;
				if($scope.eventConfig.typeOfPlay === 'gender'){
					matchLineTypeRemoveOrder = $scope.netMaleCount > $scope.netFemaleCount ? maleMatchLineTypeRemoveOrder : femaleMatchLineTypeRemoveOrder;
				}
				else if($scope.eventConfig.typeOfPlay === 'mixed'){
					matchLineTypeRemoveOrder = mixedMatchLineTypeRemoveOrder;
				}
				for(var x = 0; x < matchLineTypeRemoveOrder.length; x++){
					var index = helperService.findArrayIndex($scope.linesAggregateArray, 'line_play_type', matchLineTypeRemoveOrder[x]);
					if($scope.linesAggregateArray[index].count > 0){
						$scope.linesAggregateArray[index].count = $scope.linesAggregateArray[index].count - 1;
						$scope.updateNumOfRemovals($scope.linesAggregateArray[index].line_play_type);
						break;
					}
				}
			}
		}
		$scope.numOfFemalesToRemove = $scope.numOfFemalesToRemove * $scope.selectedTeamCount;
		$scope.numOfMalesToRemove = $scope.numOfMalesToRemove * $scope.selectedTeamCount;
		if($scope.eventConfig.teamsPerLine !== '2'){
			$scope.numOfFemalesToRemove = $scope.numOfFemalesToRemove / $scope.eventConfig.teamsPerLine * 2;
			$scope.numOfMalesToRemove = $scope.numOfMalesToRemove / $scope.eventConfig.teamsPerLine * 2;
		}
	};

	// Build our scope.linesAggregateArray for multifacility events
	$scope.buildMultiFacilityLinesAggregateArray = function(){
		$scope.linesAggregateArray = [{
			line_play_type: 'wd',
			count: $scope.eventConfig.doubleWomenLines
		}, {
			line_play_type: 'ws',
			count: $scope.eventConfig.singleWomenLines
		}, {
			line_play_type: 'md',
			count: $scope.eventConfig.doubleMenLines
		}, {
			line_play_type: 'ms',
			count: $scope.eventConfig.singleMenLines
		}, {
			line_play_type: 'xd',
			count: $scope.eventConfig.doubleComboLines
		}, {
			line_play_type: 'xs',
			count: $scope.eventConfig.singleComboLines
		}];
	};

	// Builds our matches aggregate array
	$scope.buildLinesAggregateArray = function(){
		if($scope.event && $scope.event.eventType !== 'multifacility'){
			$scope.buildNonMultiFacilityLinesAggregateArray();
			if($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin'){
				$scope.removeOverflowLines();
			}
		}
		else{
			$scope.buildMultiFacilityLinesAggregateArray();
		}
	};

	// Set our net lines variables if it's a league event
	$scope.setNetLines = function(eventTypeLinesService, method){
		if(($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin') && $scope.selectedTeamCount){
			var netTeamLines = eventTypeLinesService[method + 'PerTeam']($scope.eventConfig, $scope.femaleCount, $scope.maleCount, $scope.selectedTeamCount,
																		 $scope.eventConfig.womenSittingPerRound, $scope.eventConfig.menSittingPerRound);
			$scope.netWomenLines = netTeamLines['womenLines'];
			$scope.netMenLines = netTeamLines['menLines'];
			$scope.netTotalLines = netTeamLines['totalLines'];
		}
	};

	// Select our start times / team count combo
	$scope.selectStartTimesTeamCountCombo = function(numOfStartTimes, teamCount){
		$scope.event.numOfStartTimes = numOfStartTimes;
		$scope.selectedTeamCount = teamCount;
	};

	// Calculate lines depending on event config
	$scope.calculateLinesBasedOnConfig = function(eventTypeLinesService){
		var linesObject;
		if($scope.eventConfig.typeOfPlay === 'gender'){
			if($scope.eventConfig.singlesOnly === '0'){
				$scope.perTeamLines = eventTypeLinesService.calculateLinesGender($scope.eventConfig, $scope.femaleCount, $scope.maleCount);
				$scope.perTeamLinesNet = eventTypeLinesService.calculateLinesGender($scope.eventConfig, $scope.femaleCount, $scope.maleCount,
																					$scope.eventConfig.womenSittingPerRound, $scope.eventConfig.menSittingPerRound);
				$scope.setNetLines(eventTypeLinesService, 'calculateLinesGender');
			}
			else{
				$scope.perTeamLines = eventTypeLinesService.calculateLinesGenderSinglesOnly($scope.eventConfig, $scope.femaleCount, $scope.maleCount);
				$scope.perTeamLinesNet = eventTypeLinesService.calculateLinesGenderSinglesOnly($scope.eventConfig, $scope.femaleCount, $scope.maleCount,
																							   $scope.eventConfig.womenSittingPerRound, $scope.eventConfig.menSittingPerRound);
				$scope.setNetLines(eventTypeLinesService, 'calculateLinesGenderSinglesOnly');
			}
		}
		else if($scope.eventConfig.typeOfPlay === 'mixed'){
			$scope.eventConfig.combPlay = '0';
			if($scope.eventConfig.singlesOnly === '0'){
				$scope.perTeamLines = eventTypeLinesService.calculateLinesMixed($scope.eventConfig, $scope.femaleCount, $scope.maleCount);
				$scope.perTeamLinesNet = eventTypeLinesService.calculateLinesMixed($scope.eventConfig, $scope.femaleCount, $scope.maleCount,
																				   $scope.eventConfig.womenSittingPerRound, $scope.eventConfig.menSittingPerRound);
				$scope.setNetLines(eventTypeLinesService, 'calculateLinesMixed');
			}
			else{
				$scope.perTeamLines = eventTypeLinesService.calculateLinesMixedSinglesOnly($scope.eventConfig, $scope.femaleCount, $scope.maleCount);
				$scope.perTeamLinesNet = eventTypeLinesService.calculateLinesMixedSinglesOnly($scope.eventConfig, $scope.femaleCount, $scope.maleCount,
																							  $scope.eventConfig.womenSittingPerRound, $scope.eventConfig.menSittingPerRound);
				$scope.setNetLines(eventTypeLinesService, 'calculateLinesMixedSinglesOnly');
			}
		}
	};

	// Calculate our scope.numberRounds array values
	$scope.calculateNumberRoundsArray = function(){
		if($scope.selectedTeamCount){
			$scope.numberRounds = [];
			var numOfOpposingTeams = $scope.selectedTeamCount - 1;
			for(var i = 1; i <= 5; i++){
				var currentNumberRounds = $scope.eventConfig.teamsPerLine === '2' ? numOfOpposingTeams * i : (numOfOpposingTeams / ($scope.eventConfig.teamsPerLine - 1)) * i;
				$scope.numberRounds.push(currentNumberRounds);
			}
		}
		else{
			$scope.eventConfig.numOfRounds = '';
			$scope.numberRounds = [];
		}
	};

	// Calculate number and type of lines for our event
	$scope.calculateLines = function(){
		var eventTypeLinesService;
		if($scope.event.eventType === 'social'){
			$scope.selectedTeamCount = 1;
			eventTypeLinesService = socialEventLinesService;
		}
		else if($scope.event.eventType === 'league'){
			$scope.calculateNumberRoundsArray();
			eventTypeLinesService = leagueEventLinesService;
		}
		else if($scope.event.eventType === 'round robin'){
			$scope.calculateNumberRoundsArray();
			eventTypeLinesService = roundRobinEventLinesService;
		}
		else if($scope.event.eventType === 'ladder'){
			eventTypeLinesService = ladderEventLinesService;
		}
		$scope.calculateLinesBasedOnConfig(eventTypeLinesService);
		$scope.womenLines = $scope.event.eventType === 'social' ? $scope.perTeamLines[0].womenLines : '-';
		$scope.menLines = $scope.event.eventType === 'social' ? $scope.perTeamLines[0].menLines : '-';
		$scope.totalLines = $scope.event.eventType === 'social' ? $scope.perTeamLines[0].totalLines : '-';
	};

	// Return the needed team count based on event config
	$scope.calculateNeededTeamCounts = function(){
		if($scope.event.eventType === 'social'){
			return $scope.socialTeamCounts;
		}
		else{
			if($scope.eventConfig.teamsPerLine === '2'){
				return $scope.standardLeagueTeamCounts;
			}
			else{
				return [$scope.eventConfig.teamsPerLine * $scope.eventConfig.teamsPerLine];
			}
		}
	};

	// Calculate event total lines
	$scope.calculateTotalLines = function(perTeamLines, i){
		if($scope.eventConfig.teamsPerLine === '2'){
			if($scope.event.eventType === 'social'){
				return perTeamLines[i].totalLines;
			}
			else if($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin'){
				return (perTeamLines[i].totalTeams * perTeamLines[i].totalLines) / 2;
			}
		}
		else{
			return (perTeamLines[i].totalTeams * perTeamLines[i].totalLines) / $scope.eventConfig.teamsPerLine;
		}
	};

	// Calculate number of surfaces needed depending on number of start times
	$scope.calculateStartTimesAndSurfacesCombo = function(){
		var neededTeamCounts = $scope.calculateNeededTeamCounts();
		$scope.perTeamSurfaces = [];
		var perTeamLines = $scope.eventConfig.womenSittingPerRound || $scope.eventConfig.menSittingPerRound ? $scope.perTeamLinesNet : $scope.perTeamLines;
		for(var i = 0; i < perTeamLines.length; i++){
			if(neededTeamCounts.indexOf(perTeamLines[i].totalTeams) > -1){
				var totalLines, oneStartTime, twoStartTime, threeStartTime, fourStartTime, fiveStartTime;
				if($scope.eventConfig.combPlay !== null && $scope.eventConfig.maxSurfaces && ((($scope.eventConfig.singleWomenLines || $scope.eventConfig.singleWomenLines === 0) &&
				   ($scope.eventConfig.singleMenLines || $scope.eventConfig.singleMenLines === 0)) || $scope.eventConfig.singlesOnly === '1' || $scope.eventConfig.typeOfPlay === 'mixed')){
					totalLines = $scope.calculateTotalLines(perTeamLines, i);
					oneStartTime = totalLines;
					twoStartTime = Math.ceil(totalLines / 2);
					threeStartTime = Math.ceil(totalLines / 3);
					fourStartTime = Math.ceil(totalLines / 4);
					fiveStartTime = Math.ceil(totalLines / 5);
				}
				else{
					oneStartTime = '-';
					twoStartTime = '-';
					threeStartTime = '-';
					fourStartTime = '-';
					fiveStartTime = '-';
				}
			}
			else{
				oneStartTime = null;
				twoStartTime = null;
				threeStartTime = null;
				fourStartTime = null;
				fiveStartTime = null;
			}
			$scope.perTeamSurfaces.push({
				totalTeams: perTeamLines[i].totalTeams,
				oneStartTime: oneStartTime,
				twoStartTime: twoStartTime,
				threeStartTime: threeStartTime,
				fourStartTime: fourStartTime,
				fiveStartTime: fiveStartTime
			});
		}
	};

	// Build the object we send to update our event
	$scope.buildEditObject = function(){
		var numOfTeams;
		if($scope.event.eventType === 'multifacility'){
			numOfTeams = 1;
		}
		else if($scope.event.eventType !== 'social'){
			numOfTeams = $scope.selectedTeamCount;
		}
		else{
			numOfTeams = null;
		}
		var editObject = {
			id: $routeParams.id,
			type_of_play: $scope.eventConfig.typeOfPlay,
			comb_play: $scope.eventConfig.combPlay,
			teams_per_line: $scope.eventConfig.teamsPerLine,
			max_playing_surfaces: $scope.eventConfig.maxSurfaces,
			singles_only: $scope.eventConfig.singlesOnly,
			single_women_lines: $scope.eventConfig.singleWomenLines,
			single_men_lines: $scope.eventConfig.singleMenLines,
			ranked: $scope.event.eventType !== 'multifacility' ? $scope.eventConfig.ranked : 1,
			sets: $scope.eventConfig.sets,
			line_scoring_format: $scope.eventConfig.lineScoringFormat,
			rounds: $scope.eventConfig.numOfRounds,
			has_playoff: $scope.event.eventType === 'round robin' ? 0 : $scope.eventConfig.hasPlayoff,
			rounds_interval_metric: $scope.eventConfig.roundsIntervalMetric,
			rounds_interval: $scope.eventConfig.roundsInterval,
			women_sitting_per_round: $scope.eventConfig.womenSittingPerRound,
			men_sitting_per_round: $scope.eventConfig.menSittingPerRound,
			start_date: $scope.eventConfig.startDate,
			start_time: helperService.reverseParseTime($scope.eventConfig.startTime),
			standard_line_duration: $scope.eventConfig.standardLineDuration,
			num_of_start_times: $scope.event.numOfStartTimes,
			num_of_teams: numOfTeams
		};
		if($scope.eventConfig.teamAssignmentMethod){
			editObject['team_assignment_method'] = $scope.eventConfig.teamAssignmentMethod;
		}
		return editObject;
	};

	// Return the minimum # of women we need
	$scope.calculateMinFemalesNeeded = function(){
		var forWomenDoubles = $scope.eventConfig.doubleWomenLines * 2;
		var forWomenSingles = $scope.eventConfig.singleWomenLines;
		var forComboDoubles = $scope.eventConfig.doubleComboLines;
		return forWomenDoubles + forWomenSingles + forComboDoubles;
	};

	// Return the minimum # of men we need
	$scope.calculateMinMalesNeeded = function(){
		var forMenDoubles = $scope.eventConfig.doubleMenLines * 2;
		var forMenSingles = $scope.eventConfig.singleMenLines;
		var forComboDoubles = $scope.eventConfig.doubleComboLines;
		return forMenDoubles + forMenSingles + forComboDoubles;
	};
	
	// Make sure we have at least the minimum # of users
	$scope.minParticipantsMet = function(){
		if($scope.femaleCount < $scope.calculateMinFemalesNeeded()){
			$window.alert('Not enough female participants to complete event setup');
			return false;
		}
		if($scope.maleCount < $scope.calculateMinMalesNeeded()){
			$window.alert('Not enough male participants to complete event setup');
			return false;
		}
		return true;
	};

	// Updates event and creates matches / lines
	$scope.completeEventSetup = function(){
		//$scope.callInProgress = true;
		$scope.resetEventConfigErrors();
		if($scope.checkEventConfigInputs() === true){
			if($scope.event.eventType === 'multifacility' && $scope.minParticipantsMet() === false){
				$scope.callInProgress = false;
				return false;
			}
			$scope.buildLinesAggregateArray();
			var editObject = $scope.buildEditObject();
			editEventModalService.edit(editObject).then(function(){
				if($scope.event.eventType === 'social'){
					return eventService.createEventLines($routeParams.id, $scope.eventConfig.sets, $scope.linesAggregateArray);
				}
				else if($scope.event.eventType === 'league' || $scope.event.eventType === 'round robin'){
					return eventService.createEventTeams($routeParams.id, $scope.linesAggregateArray, $scope.numOfFemalesToRemove, $scope.numOfMalesToRemove);
				}
				else if($scope.event.eventType === 'multifacility'){
					return eventService.createEventTeam($routeParams.id, $scope.linesAggregateArray);
				}
			}).then(function(){
				$window.alert('Event Setup Complete!');
				$window.location.href = '/';
			}, function(){
				$window.alert('Something went wrong.  Event setup not complete')
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// For events with more than two teams per line, only single lines are allowed
	$scope.$watch('eventConfig.teamsPerLine', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue > 2){
				$scope.eventConfig.singlesOnly = '1';
			}
		}
	});

	// Recalculate our lines every time our event config changes
	$scope.$watch('[eventConfig, selectedTeamCount]', function(newValue, oldValue){
		if(newValue !== oldValue){
			if($scope.eventConfigChanged === true && $scope.event && ($scope.event.eventType !== 'multifacility')){
				$scope.calculateLines();
				$scope.calculateStartTimesAndSurfacesCombo();
			}
			else{
				$scope.eventConfigChanged = true;
			}
		}
	}, true);

	// Set women and men singles inputs to 0 if it's a singles only event
	$scope.$watch('eventConfig.singlesOnly', function(newValue, oldValue){
		if(newValue !== oldValue && newValue === '1'){
			$scope.eventConfig.singleWomenLines = 0;
			$scope.eventConfig.singleMenLines = 0;
		}
	});

	// Reset round interval dropdown when round interval metric dropdown changes
	$scope.$watch('eventConfig.roundsIntervalMetric', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.eventConfig.roundsInterval = null;
		}
	});

});