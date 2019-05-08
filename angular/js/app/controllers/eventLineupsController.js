teamsRIt.controller('eventLineupsController', function($scope, $rootScope, $routeParams, $window, eventLineupsService, eventService, editEventModalService,
													   eventTeamsAvailabilityService, perRoundLinesModalService, eventLinesService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventLineups';
	// Our search filters
	$scope.filters = {
		gender: null,
		team: null,
		startDate: null,
		endDate: null
	};
	// Line types arrays
	$scope.femaleLineTypes = ['wd', 'ws'];
	$scope.maleLineTypes = ['md', 'ms'];
	$scope.comboLineTypes = ['xd', 'xs'];
	$scope.doubleLineTypes = ['wd', 'md', 'xd'];
	$scope.singleLineTypes = ['ws', 'ms', 'xs'];

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				eventType: data.event.event_type,
				eventSubType: data.event.event_sub_type,
				startDate: data.event.start_date,
				ranked: data.event.ranked,
				activityId: data.event.activity_id,
				facilityId: data.event.facility_id
			};
			$scope.getUsersRankings();
			$scope.getLinesPerMatch();
			$scope.displayEventForm = true;
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

	// Get our users' rankings for this activity at our facility
	$scope.getUsersRankings = function(){
		eventLinesService.getParticipantsRankings($scope.event.activityId, $scope.event.facilityId).then(function(data){
			for(var i = 0; i < data.participants_rankings.length; i++){
				var indices = helperService.findArrayIndices($scope.users, 'id', data.participants_rankings[i].id);
				if(indices.length > 0){
					for(var x = 0; x < indices.length; x++){
						$scope.users[indices[x]].ranking = data.participants_rankings[i].pivot.ranking ? data.participants_rankings[i].pivot.ranking : '0.00';
					}
				}
			}
			$scope.filterUsers();
		});
	};
	
	// Filter participants by gender
	$scope.filterUsersByGender = function(users){
		var filteredUsers = [];
		for(var i = 0; i < users.length; i++){
			if(users[i].sex.toLowerCase() === $scope.filters.gender){
				filteredUsers.push(users[i]);
			}
		}
		return filteredUsers;
	};

	// Filter participants by team
	$scope.filterUsersByTeam = function(users){
		var filteredUsers = [];
		for(var i = 0; i < users.length; i++){
			if(users[i].team_name && users[i].team_name.toLowerCase() === $scope.filters.team){
				filteredUsers.push(users[i]);
			}
		}
		return filteredUsers;
	};

	// Filter shown users based on filters set
	$scope.filterUsers = function(){
		$scope.foundUsers = angular.copy($scope.users);
		for(var i in $scope.filters){
			if($scope.filters.hasOwnProperty(i)){
				if(i === 'gender' && $scope.filters[i]){
					$scope.foundUsers = $scope.filterUsersByGender($scope.foundUsers);
				}
				if(i === 'team' && $scope.filters[i]){
					$scope.foundUsers = $scope.filterUsersByTeam($scope.foundUsers);
				}
			}
		}
	};

	// Filter rounds shown
	$scope.filterRounds = function(){
		$scope.shownRoundDates = [];
		for(var i = 0; i < $scope.roundDates.length; i++){
			if($scope.roundDates[i] >= $scope.filters.startDate && $scope.roundDates[i] <= $scope.filters.endDate){
				$scope.shownRoundDates.push($scope.roundDates[i]);
			}
		}
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

	// Update visible users based on filters selected
	$scope.$watch('filters', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.filterUsers();
			$scope.filterRounds();
		}
	}, true);

	// Set start date filter if event is in progress
	$scope.setStartDateFilter = function(){
		var todaysDate = helperService.getTodaysDate();
		if(todaysDate > $scope.filters.startDate && todaysDate <= $scope.filters.endDate){
			for(var i = 1; i < $scope.roundDates.length; i++){
				if(todaysDate >= $scope.roundDates[i - 1]){
					$scope.filters.startDate = $scope.roundDates[i];
				}
			}
		}
	};

	// Parse team related info
	$scope.parseUsersAvailability = function(){
		$scope.users = [];
		$scope.roundDates = [];
		$scope.teams = [];
		$scope.roundTeamUsersAvailable = {};
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if(!$scope.usersAvailability[i].status){
				$scope.usersAvailability[i].status = 'unavailable';
			}
			if(helperService.findArrayIndexMultipleKeys($scope.users, ['id', 'team_id'], [$scope.usersAvailability[i].user.id, $scope.usersAvailability[i].user.team_id]) === false){
				$scope.users.push($scope.usersAvailability[i].user);
			}
			if($scope.roundDates.indexOf($scope.usersAvailability[i].date) === -1){
				$scope.roundDates.push($scope.usersAvailability[i].date);
			}
			if($scope.usersAvailability[i].user.team_name && $scope.teams.indexOf($scope.usersAvailability[i].user.team_name) === -1){
				$scope.teams.push($scope.usersAvailability[i].user.team_name);
			}
			if(!$scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date]){
				$scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date] = {};
			}
			if(!$scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date][$scope.usersAvailability[i].user.team_name]){
				$scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date][$scope.usersAvailability[i].user.team_name] = 0;
			}
			if($scope.usersAvailability[i].status !== 'unavailable'){
				$scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date][$scope.usersAvailability[i].user.team_name] = $scope.roundTeamUsersAvailable[$scope.usersAvailability[i].date][$scope.usersAvailability[i].user.team_name] + 1;
			}
			if($scope.usersAvailability[i].line_id){
				$scope.usersAvailability[i].status = $scope.usersAvailability[i].lines.line_play_type.toUpperCase() + $scope.usersAvailability[i].lines.line_play_type_number;
			}
			$scope.usersAvailability[i].tooFar = false;
		}
		$scope.filters.team = $scope.teams[0];
		$scope.filters.startDate = $scope.roundDates[0];
		$scope.filters.endDate = $scope.roundDates[$scope.roundDates.length - 1];
		$scope.setStartDateFilter();
	};

	// Get user availability info
	$scope.getAvailability = function(){
		eventTeamsAvailabilityService.getAvailability($routeParams.id).then(function(data){
			$scope.usersAvailability = data.user_availability;
			$scope.parseUsersAvailability();
		});
	};
	$scope.getAvailability();

	// Get number and type of lines per match for our event
	$scope.getLinesPerMatch = function(){
		perRoundLinesModalService.getLinesPerMatch($routeParams.id).then(function(data){
			$scope.femaleLines = [];
			$scope.maleLines = [];
			var femaleDoublesIndex = 1;
			var femaleSinglesIndex = 1;
			var maleDoublesIndex = 1;
			var maleSinglesIndex = 1;
			var comboDoublesIndex = 1;
			var comboSinglesIndex = 1;
			for(var i = 0; i < data.lines.length; i++){
				if($scope.femaleLineTypes.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.femaleLines.push('WD' + femaleDoublesIndex);
						femaleDoublesIndex = femaleDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.femaleLines.push('WS' + femaleSinglesIndex);
						femaleSinglesIndex = femaleSinglesIndex + 1;
					}
				}
				else if($scope.maleLineTypes.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.maleLines.push('MD' + maleDoublesIndex);
						maleDoublesIndex = maleDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.maleLines.push('MS' + maleSinglesIndex);
						maleSinglesIndex = maleSinglesIndex + 1;
					}
				}
				else if($scope.comboLineTypes.indexOf(data.lines[i].line_play_type) > -1){
					if(data.lines[i].line_type === 'doubles'){
						$scope.femaleLines.push('XD' + comboDoublesIndex);
						$scope.maleLines.push('XD' + comboDoublesIndex);
						comboDoublesIndex = comboDoublesIndex + 1;
					}
					else if(data.lines[i].line_type === 'singles'){
						$scope.femaleLines.push('XS' + comboSinglesIndex);
						$scope.maleLines.push('XS' + comboSinglesIndex);
						comboSinglesIndex = comboSinglesIndex + 1;
					}
				}
			}
		});
	};

	// Sort our users array by group number
	$scope.groupSort = function(a, b){
		if(a.user.group_number < b.user.group_number){
			return -1;
		}
		if(a.user.group_number > b.user.group_number){
			return 1;
		}
		return 0;
	};

	// Randomly sort our users
	$scope.randomSort = function(){
		return (Math.round(Math.random()) - 0.5);
	};

	// Female lines array sort
	$scope.femaleLinesSort = function(a, b){
		var customSort = {
			XD: 1,
			WS: 2,
			WD: 3
		};
		var result = customSort[a.substring(0, 2)] - customSort[b.substring(0, 2)];
		if(result !== 0){
			return result;
		}
		else{
			return a.substring(2) - b.substring(2);
		}
	};

	// Assign default female spots
	$scope.assignDefaultFemaleSpots = function(femaleUsers){
		var femaleIndex = 0;
		var indexOne, indexTwo;
		var femaleLines = angular.copy($scope.femaleLines);
		femaleLines.sort($scope.femaleLinesSort);
		for(var x = 0; x < femaleLines.length; x++){
			if(femaleLines[x].substring(0, 2).toLowerCase() === 'ws' || femaleLines[x].substring(0, 2).toLowerCase() === 'xd'){
				indexOne = helperService.findArrayIndex($scope.usersAvailability, 'id', femaleUsers[femaleIndex].id);
				$scope.usersAvailability[indexOne].status = femaleLines[x];
				femaleIndex = femaleIndex + 1;
			}
			else if(femaleLines[x].substring(0, 2).toLowerCase() === 'wd'){
				indexOne = helperService.findArrayIndex($scope.usersAvailability, 'id', femaleUsers[femaleIndex].id);
				$scope.usersAvailability[indexOne].status = femaleLines[x];
				if(femaleUsers[femaleIndex + 1]){
					indexTwo = helperService.findArrayIndex($scope.usersAvailability, 'id', femaleUsers[femaleIndex + 1].id);
					$scope.usersAvailability[indexTwo].status = femaleLines[x];
				}
				femaleIndex = femaleIndex + 2;
			}
		}
	};

	// Male lines array sort
	$scope.maleLinesSort = function(a, b){
		var customSort = {
			XD: 1,
			MS: 2,
			MD: 3
		};
		var result = customSort[a.substring(0, 2)] - customSort[b.substring(0, 2)];
		if(result !== 0){
			return result;
		}
		else{
			return a.substring(2) - b.substring(2);
		}
	};

	// Assign default male spots
	$scope.assignDefaultMaleSpots = function(maleUsers){
		var maleIndex = 0;
		var indexOne, indexTwo;
		var maleLines = angular.copy($scope.maleLines);
		maleLines.sort($scope.maleLinesSort);
		for(var y = 0; y < maleLines.length; y++){
			if(maleLines[y].substring(0, 2).toLowerCase() === 'ms' || maleLines[y].substring(0, 2).toLowerCase() === 'xd'){
				indexOne = helperService.findArrayIndex($scope.usersAvailability, 'id', maleUsers[maleIndex].id);
				$scope.usersAvailability[indexOne].status = maleLines[y];
				maleIndex = maleIndex + 1;
			}
			else if(maleLines[y].substring(0, 2).toLowerCase() === 'md'){
				indexOne = helperService.findArrayIndex($scope.usersAvailability, 'id', maleUsers[maleIndex].id);
				$scope.usersAvailability[indexOne].status = maleLines[y];
				if(maleUsers[maleIndex + 1]){
					indexTwo = helperService.findArrayIndex($scope.usersAvailability, 'id', maleUsers[maleIndex + 1].id);
					$scope.usersAvailability[indexTwo].status = maleLines[y];
				}
				maleIndex = maleIndex + 2;
			}
		}
	};

	// Default spot assignments for a round / team
	$scope.assignDefaultSpots = function(roundDate){
		var femaleUsers = [];
		var maleUsers = [];
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.usersAvailability[i].date === roundDate && $scope.usersAvailability[i].user.team_name === $scope.filters.team){
				if($scope.usersAvailability[i].status !== 'unavailable'){
					// Reset our status before assignments
					$scope.usersAvailability[i].status = 'available';
					if($scope.usersAvailability[i].user.sex === 'female'){
						femaleUsers.push($scope.usersAvailability[i]);
					}
					else if($scope.usersAvailability[i].user.sex === 'male'){
						maleUsers.push($scope.usersAvailability[i]);
					}
				}
			}
		}
		var sortFunction = $scope.event.ranked == 1 || $scope.event.eventType === 'multifacility' ? $scope.groupSort : $scope.randomSort;
		femaleUsers.sort(sortFunction);
		maleUsers.sort(sortFunction);
		$scope.assignDefaultFemaleSpots(femaleUsers);
		$scope.assignDefaultMaleSpots(maleUsers);
	};

	// Sync lineups for all rounds
	$scope.syncRoundLineups = function(){
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.usersAvailability[i].round === 1){
				var indices = helperService.findArrayIndices($scope.usersAvailability, 'event_team_user_id', $scope.usersAvailability[i].event_team_user_id);
				for(var x = 0; x < indices.length; x++){
					if($scope.usersAvailability[indices[x]].id !== $scope.usersAvailability[i].id){
						$scope.usersAvailability[indices[x]].status = $scope.usersAvailability[i].status;
					}
				}
			}
		}
	};

	// ALTA line movement restrictions between rounds
	$scope.validLineMovements = function(){
		var players = {};
		var dateTeams = {};
		// Build lists of concurrent player lines and team lines.  The availability data is ordered by lines so the resulting lists can be assumed to be ordered as well
		$scope.usersAvailability.forEach(function(availability){
			if(availability.status != 'available' && availability.status != 'unavailable'){
				var player = availability.user.id;
				var date = availability.date;
				var line = availability.status.substring(2, availability.status.length);
				if(player in players){
					players[player].push([line, availability]);
				}
				else{
					players[player] = [[line, availability]];
				}
				// The dateTeams array is an intermediate step to allow the data to be processed sequentially later. use a mixture of the date and the name as a key.
				var key = date + ' ' + line;
				if(key in dateTeams){
					dateTeams[key].push([player, availability]);
				}
				else{
					dateTeams[key] = [[player, availability]];
				}
			}
		});
		var teams = {};
		// Use dateTeams array to build a list of concurrent lines for teams.
		Object.keys(dateTeams).sort().forEach(function(date_team){
			if(dateTeams[date_team].length > 1){
				var date_team_parts = date_team.split(' ');
				var line = parseInt(date_team_parts[1]);
				var player1 = dateTeams[date_team][0][0];
				var player2 = dateTeams[date_team][1][0];
				var teamsKey = player1 < player2 ? player1 + ' ' + player2 : player2 + ' ' + player1;
				if(teamsKey in teams){
					teams[teamsKey].push([line, dateTeams[date_team][0][1], dateTeams[date_team][1][1]]);
				}
				else{
					teams[teamsKey] = [[line, dateTeams[date_team][0][1], dateTeams[date_team][1][1]]];
				}
			}
		});
		var valid = true;
		// If any players are changed to a line more than 2 lines away from previous line, show error and set valid to false
		Object.keys(players).sort().forEach(function(player){
			if(players[player].length > 1){
				var previous = players[player][0][0];
				for(var i = 1; i < players[player].length; i++){
					var current = players[player][i][0];
					if(Math.abs(current - previous) > 2){
						players[player][i][1]['tooFar'] = true;
						valid = false;
					}
					previous = current;
				}
			}
		});
		// If any team has changed to a line more than 1 line away from previous line, show error and set valid to false
		Object.keys(teams).sort().forEach(function(team){
			if(teams[team].length > 1){
				previous = teams[team][0][0];
				for(var i = 1; i < teams[team].length; i++){
					var current = teams[team][i][0]
					if(Math.abs(current - previous) > 1){
						teams[team][i][1]['tooFar'] = true;
						teams[team][i][2]['tooFar'] = true;
						valid = false;
					}
					var previous = current;
				}
			}
		});
		return valid;
	};

	// Update lineups
	$scope.updateLineups = function(exit){
		$scope.callInProgress = true;
		if($scope.event.eventType === 'round robin'){
			$scope.syncRoundLineups();
		}
		if($scope.event.eventType === 'multifacility' && $scope.event.eventSubType === 'alta'){
			if(!$scope.validLineMovements()){
				$scope.callInProgress = false;
				return;
			}
			for(var i = 0; i < $scope.usersAvailability.length; i++){
				$scope.usersAvailability[i].tooFar = false;
			}
		}
		eventLineupsService.updateLineups($routeParams.id, $scope.usersAvailability).then(function(){
			$window.alert('Lineups Updated!');
			if(exit === true){
				$window.location.href = '/';
			}
			else{
				$scope.callInProgress = false;
			}
		}, function(){
			$window.alert('Something went wrong.  Lineups not updated');
		});
	};

	// Return the corresponding record ID given the user ID and date
	$scope.findEventTeamUserAvailabilityId = function(userId, teamId, date){
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.usersAvailability[i].user.id === userId && $scope.usersAvailability[i].user.team_id === teamId && $scope.usersAvailability[i].date === date){
				return i;
			}
		}
		return false;
	};

	// Tells us whether to display a dropdown option
	$scope.displayOption = function(line, roundDate, index){
		var occuranceIndices = [];
		for(var i = 0; i < $scope.usersAvailability.length; i++){
			if($scope.usersAvailability[i].date === roundDate && $scope.usersAvailability[i].user.team_name === $scope.filters.team){
				if($scope.usersAvailability[i].status === line){
					occuranceIndices.push(i);
				}
			}
		}
		if($scope.doubleLineTypes.indexOf(line.substring(0, 2).toLowerCase()) > -1){
			return !(occuranceIndices.length >= 2 && occuranceIndices.indexOf(index) === -1);
		}
		else if($scope.singleLineTypes.indexOf(line.substring(0, 2).toLowerCase()) > -1){
			return !(occuranceIndices.length >= 1 && occuranceIndices.indexOf(index) === -1);
		}
	};

	// Make helper functions available in scope
	$scope.formatDate = helperService.formatDate;
	$scope.findArrayIndex = helperService.findArrayIndex;

});