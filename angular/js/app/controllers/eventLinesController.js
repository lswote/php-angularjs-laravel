teamsRIt.controller('eventLinesController', function($scope, $rootScope, $routeParams, $window, eventLinesService, eventService, editEventModalService, helperService){

	// Our line types
	$scope.typeOfLines = ['wd', 'md', 'xd', 'ws', 'ms', 'xs'];
	$scope.femaleLines = ['ws', 'wd', 'xs', 'xd'];
	$scope.maleLines = ['ms', 'md'];
	// Default filter values
	$scope.typeOfLine = '';
	$scope.eventStartTime = '';
	$scope.linesWithEmptySlotsOnly = '';
	// Selected checkboxes
	$scope.selectedUsers = [];
	// Selected checkboxes detailed
	$scope.selectedUsersDetailed = [];

	// Get all events where our user is a leader
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($routeParams.id && ($rootScope.user.privilege === 'facility leader' || ($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false))){
				$scope.getEvent();
			}
			else{
				$scope.displayEventForm = false;
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Get our users' rankings for this activity at our facility
	$scope.getParticipantsRankings = function(){
		eventLinesService.getParticipantsRankings($scope.event.activity_id, $scope.event.facility_id).then(function(data){
			$scope.participantRankings = data.participants_rankings;
		});
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
			$scope.getParticipantsRankings();
			$scope.displayEventForm = true;
		}, function(){
			$scope.displayEventForm = false;
		});
	};

	// Parse our scope.eventMatches array
	$scope.parseEventMatches = function(){
		$scope.availableStartTimes = [];
		for(var i = 0; i < $scope.eventMatches.length; i++){
			$scope.eventMatches[i].start_time_formatted = helperService.parseTime($scope.eventMatches[i].start_time);
			if($scope.availableStartTimes.indexOf($scope.eventMatches[i].start_time_formatted) === -1){
				$scope.availableStartTimes.push($scope.eventMatches[i].start_time_formatted);
			}
			if($scope.femaleLines.indexOf($scope.eventMatches[i].line_play_type) > -1){
				$scope.eventMatches[i].match_line_sex = 'female';
			}
			else if($scope.maleLines.indexOf($scope.eventMatches[i].line_play_type) > -1){
				$scope.eventMatches[i].match_line_sex = 'male';
			}
		}
	};

	// Get all lines for an event
	$scope.getEventMatches = function(){
		$scope.getEventMatchesInProgress = true;
		eventService.getEventLines($routeParams.id).then(function(data){
			$scope.eventMatches = data.lines;
			$scope.parseEventMatches();
		}).finally(function(){
			$scope.getEventMatchesInProgress = false;
		});
	};
	$scope.getEventMatches();

	// Set selected user sex when working with empty slots in mixed doubles matches
	$scope.setSelectedUserSexForXdEmptySlot = function(match){
		var femalePlayers = 0;
		if(match.pair_one.user_one){
			if(match.pair_one.user_one.sex === 'female'){
				femalePlayers = femalePlayers + 1;
			}
		}
		if(match.pair_one.user_two){
			if(match.pair_one.user_two.sex === 'female'){
				femalePlayers = femalePlayers + 1;
			}
		}
		if(match.pair_two.user_one){
			if(match.pair_two.user_one.sex === 'female'){
				femalePlayers = femalePlayers + 1;
			}
		}
		if(match.pair_two.user_two){
			if(match.pair_two.user_two.sex === 'female'){
				femalePlayers = femalePlayers + 1;
			}
		}
		$scope.selectedUserSex = femalePlayers === 1 ? 'female' : 'male';
	};

	// Set selected user sex when working with empty slots
	$scope.setSelectedUserSexForEmptySlot = function(match){
		if(match.line_play_type === 'ws' || match.line_play_type === 'wd'){
			$scope.selectedUserSex = 'female';
		}
		else if(match.line_play_type === 'ms' || match.line_play_type === 'md'){
			$scope.selectedUserSex = 'male';
		}
		else if(match.line_play_type === 'xs'){
			if(match.pair_one){
				$scope.selectedUserSex = match.pair_one.sex === 'female' ? 'male' : 'female';
			}
			else if(match.pair_two){
				$scope.selectedUserSex = match.pair_two.sex === 'female' ? 'male' : 'female';
			}
		}
		else if(match.line_play_type === 'xd'){
			$scope.setSelectedUserSexForXdEmptySlot(match);
		}
	};

	// Toggle method for our checkboxes
	$scope.toggleSelectedUsers = function(userId, userSex, matchId, pairId, teamNumber, userNumber, teamId, match){
		var index = $scope.selectedUsers.indexOf(userId);
		if(index > -1){
			$scope.selectedUsers.splice(index, 1);
			var detailedIndex = helperService.findArrayIndex($scope.selectedUsersDetailed, 'user_id', userId);
			$scope.selectedUsersDetailed.splice(detailedIndex, 1);
			if($scope.selectedUsers.length === 0){
				$scope.selectedUserSex = null;
				$scope.selectedMatchId = null;
				$scope.selectedPairId = null;
				$scope.selectedTeamId = null;
			}
		}
		else{
			$scope.selectedUsers.push(userId);
			$scope.selectedUsersDetailed.push({
				user_id: userId,
				pair_id: pairId,
				match_id: matchId,
				team_number: teamNumber,
				user_number: userNumber
			});
			if($scope.selectedUsers.length === 1){
				if(!userId){
					$scope.setSelectedUserSexForEmptySlot(match);
				}
				else{
					$scope.selectedUserSex = userSex;
				}
				$scope.selectedMatchId = matchId;
				$scope.selectedPairId = pairId;
				$scope.selectedTeamId = teamId;
			}
		}
	};

	// Our custom checkbox disable filter
	$scope.disableCheckbox = function(userId, userSex, matchId, teamId){
		if($scope.selectedUsers.length >= 2 && $scope.selectedUsers.indexOf(userId) === -1){
			return true;
		}
		if($scope.selectedUserSex && $scope.selectedUserSex !== userSex && $scope.selectedUsers.indexOf(userId) === -1){
			return true;
		}
		if($scope.selectedMatchId === matchId && $scope.selectedUsers.indexOf(userId) === -1 && (teamId === $scope.selectedTeamId || $scope.selectedPairId === false)){
			return true;
		}
		return false;
	};

	// Clears our selected users arrays and variables
	$scope.clearSelectedUsers = function(){
		$scope.selectedUsers = [];
		$scope.selectedUsersDetailed = [];
		$scope.selectedUserSex = null;
		$scope.selectedMatchId = null;
	};

	// Swaps two players
	$scope.swapPlayers = function(){
		var matchOneIndex = helperService.findArrayIndex($scope.eventMatches, 'id', $scope.selectedUsersDetailed[0].match_id);
		var matchTwoIndex = helperService.findArrayIndex($scope.eventMatches, 'id', $scope.selectedUsersDetailed[1].match_id);
		var matchOneIsDoubles = $scope.selectedUsersDetailed[0].pair_id ? true : false;
		var matchTwoIsDoubles = $scope.selectedUsersDetailed[1].pair_id ? true : false;
		var userOne, userTwo;
		if(matchOneIsDoubles === true){
			userOne = $scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number][$scope.selectedUsersDetailed[0].user_number];
		}
		else{
			userOne = $scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number];
		}
		if(matchTwoIsDoubles === true){
			userTwo = $scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number][$scope.selectedUsersDetailed[1].user_number];
		}
		else{
			userTwo= $scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number];
		}
		if(matchOneIsDoubles === true){
			$scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number][$scope.selectedUsersDetailed[0].user_number] = userTwo;
			$scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number][$scope.selectedUsersDetailed[0].user_number + '_id'] = userTwo ? userTwo.id : null;
		}
		else{
			$scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number] = userTwo;
			$scope.eventMatches[matchOneIndex][$scope.selectedUsersDetailed[0].team_number + '_id'] = userTwo ? userTwo.id : null;
		}
		if(matchTwoIsDoubles === true){
			$scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number][$scope.selectedUsersDetailed[1].user_number] = userOne;
			$scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number][$scope.selectedUsersDetailed[1].user_number + '_id'] = userOne ? userOne.id : null;
		}
		else{
			$scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number] = userOne;
			$scope.eventMatches[matchTwoIndex][$scope.selectedUsersDetailed[1].team_number + '_id'] = userOne ? userOne.id : null;
		}
		$scope.clearSelectedUsers();
		$scope.playersSwapped = true;
	};

	// Updates our matches
	$scope.updateEventMatches = function(exit){
		if($scope.playersSwapped === true){
			$scope.callInProgress = true;
			eventService.updateEventMatches($scope.event.id, $scope.eventMatches).then(function(){
				$window.alert('Lines Updated!');
				if(exit === true){
					$window.location.href = '/';
				}
				else{
					$scope.callInProgress = false;
				}
			}, function(){
				$window.alert('Something went wrong.  Lines not updated');
			});
		}
		else{
			$window.alert('No changes made');
		}
	};

	// Make function available in scope
	$scope.findArrayIndex = helperService.findArrayIndex;
	$scope.parseTime = helperService.parseTime;

	// Filter for gal participants in a column when start time filter is active
	$scope.femaleColumnsFilter = function(line){
		if((line.start_time_formatted == $scope.eventStartTime || $scope.availableStartTimes.length === 1) && line.match_line_sex == 'female'){
			if($scope.typeOfLine){
				if(line.line_play_type === $scope.typeOfLine){
					return true;
				}
			}
			else{
				return true;
			}
		}
		return false;
	};

	// Filter for guy participants in a column when start time filter is active
	$scope.maleColumnsFilter = function(line){
		if((line.start_time_formatted == $scope.eventStartTime || $scope.availableStartTimes.length === 1) && line.match_line_sex == 'male'){
			if($scope.typeOfLine){
				if(line.line_play_type === $scope.typeOfLine){
					return true;
				}
			}
			else{
				return true;
			}
		}
		return false;
	};

	// Sort our matches by match line type
	$scope.sortByMatchLineType = function(match){
		if(match.line_play_type === 'ws'){
			return 1;
		}
		else if(match.line_play_type === 'wd'){
			return 2;
		}
		else if(match.line_play_type === 'ms'){
			return 3;
		}
		else if(match.line_play_type === 'md'){
			return 4;
		}
		else if(match.line_play_type === 'xs'){
			return 5;
		}
		else if(match.line_play_type === 'xd'){
			return 6;
		}
	};

	// Sort our matches by total ranking scores
	$scope.sortByRanking = function(match){
		var userOneIndex, userTwoIndex, userThreeIndex, userFourIndex;
		var userOneRanking, userTwoRanking, userThreeRanking, userFourRanking;
		if(match.line_type === 'singles'){
			userOneIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_one ? match.pair_one.id : null);
			userTwoIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_two ? match.pair_two.id : null);
			userOneRanking = userOneIndex !== false ? $scope.participantRankings[userOneIndex]['pivot']['ranking'] || 0 : 0;
			userTwoRanking = userTwoIndex !== false ? $scope.participantRankings[userTwoIndex]['pivot']['ranking'] || 0 : 0;
			return Math.round(parseFloat(userOneRanking) + parseFloat(userTwoRanking)) * -1;
		}
		else if(match.line_type === 'doubles'){
			userOneIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_one ? match.pair_one.user_one.id : null);
			userTwoIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_one ? match.pair_one.user_two.id : null);
			userThreeIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_two ? match.pair_two.user_one.id : null);
			userFourIndex = helperService.findArrayIndex($scope.participantRankings, 'id', match.pair_two ? match.pair_two.user_two.id : null);
			userOneRanking = userOneIndex !== false ? $scope.participantRankings[userOneIndex]['pivot']['ranking'] || 0 : 0;
			userTwoRanking = userTwoIndex !== false ? $scope.participantRankings[userTwoIndex]['pivot']['ranking'] || 0 : 0;
			userThreeRanking = userThreeIndex !== false ? $scope.participantRankings[userThreeIndex]['pivot']['ranking'] || 0 : 0;
			userFourRanking = userFourIndex !== false ? $scope.participantRankings[userFourIndex]['pivot']['ranking'] || 0 : 0;
			return Math.round(parseFloat(userOneRanking) + parseFloat(userTwoRanking) + parseFloat(userThreeRanking) + parseFloat(userFourRanking)) * -1;
		}
	};

});