teamsRIt.controller('eventPlayoffController', function($scope, $rootScope, $routeParams, $window, eventPlayoffService, eventService, editEventModalService, helperService){

	// Current page variable
	$rootScope.currentPage = 'eventPlayoff';

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($routeParams.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				name: data.event.name,
				ranked: data.event.ranked,
				activityId: data.event.activity_id,
				facilityId: data.event.facility_id
			};
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
				$scope.displayEventForm = false;
			}
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEventsAsLeader();

	// Parse our scope.playoffMatches array
	$scope.parsePlayoffMatches = function(){
		$scope.rounds = [];
		var index = 0;
		for(var i = 0; i < $scope.playoffMatches.length; i++){
			if(!$scope.playoffMatches[i].team_one && $scope.playoffMatches[i].round === -1){
				$scope.playoffMatches[i].team_one = {
					id: $scope.teamScores[index].id,
					name: $scope.teamScores[index].name
				};
				$scope.playoffMatches[i].team_two = {
					id: $scope.teamScores[$scope.teamScores.length - index - 1].id,
					name: $scope.teamScores[$scope.teamScores.length - index - 1].name
				};
				index = index + 1;
			}
			if($scope.playoffMatches[i].winning_team_id){
				index = helperService.findArrayIndex($scope.teamScores, 'id', $scope.playoffMatches[i].winning_team_id);
				$scope.playoffMatches[i].winning_team_name = $scope.teamScores[index].name;
			}
			else{
				$scope.playoffMatches[i].winning_team_name = null;
			}
			if($scope.rounds.indexOf($scope.playoffMatches[i].round) === -1){
				$scope.rounds.push($scope.playoffMatches[i].round);
			}
		}
		$scope.roundWidth = 100 / ($scope.rounds.length + 1);
	};

	// Get our playoff matches
	$scope.getPlayoffMatches = function(){
		eventPlayoffService.getPlayoffMatches($routeParams.id).then(function(data){
			$scope.playoffMatches = data.playoff_matches;
			$scope.getTeamScores();
		});
	};
	$scope.getPlayoffMatches();

	// Seed / sort teams by their number of wins / losses
	$scope.sortByScore = function(a, b){
		var result = b.score - a.score;
		if(result !== 0){
			return result;
		}
		else{
			result = a.sets_lost - b.sets_lost;
			if(result !== 0){
				return result;
			}
			else{
				return a.games_lost - b.games_lost;
			}
		}
	};

	// Get team scores for event
	$scope.getTeamScores = function(){
		eventPlayoffService.getTeamScores($routeParams.id).then(function(data){
			$scope.teamScores = data.team_scores.sort($scope.sortByScore);
			$scope.parsePlayoffMatches();
		});
	};

	// Select the winning team for a match
	$scope.selectWinningTeam = function(matchId, winningTeamId, winningTeamName){
		var index = helperService.findArrayIndex($scope.playoffMatches, 'id', matchId);
		$scope.playoffMatches[index].winning_team_id = winningTeamId;
		$scope.playoffMatches[index].winning_team_name = winningTeamName;
	};

	// Return the name of the championship team
	$scope.returnChampionshipTeam = function(){
		if($scope.playoffMatches){
			var index = helperService.findArrayIndex($scope.playoffMatches, 'round', Math.min.apply(Math, $scope.rounds));
			if(index !== false && $scope.playoffMatches[index].winning_team_name){
				return $scope.playoffMatches[index].winning_team_name;
			}
		}
		return 'Winner';
	};

	// Make sure every scope.playoffMatches object has team IDs set.  If not, set the team IDs if the accompanying names are set
	$scope.checkAndAddTeamId = function(){
		for(var i = 0; i < $scope.playoffMatches.length; i++){
			var index;
			if($scope.playoffMatches[i].winning_team_name){
				index = helperService.findArrayIndex($scope.teamScores, 'name', $scope.playoffMatches[i].winning_team_name);
				$scope.playoffMatches[i].winning_team_id = $scope.teamScores[index].id;
			}
			if($scope.playoffMatches[i].team_one && $scope.playoffMatches[i].team_one.name){
				index = helperService.findArrayIndex($scope.teamScores, 'name', $scope.playoffMatches[i].team_one.name);
				$scope.playoffMatches[i].team_one.id = $scope.teamScores[index].id;
			}
			if($scope.playoffMatches[i].team_two && $scope.playoffMatches[i].team_two.name){
				index = helperService.findArrayIndex($scope.teamScores, 'name', $scope.playoffMatches[i].team_two.name);
				$scope.playoffMatches[i].team_two.id = $scope.teamScores[index].id;
			}
		}
	};

	// Tells us whether to show a team in a dropdown
	$scope.showTeam = function(round, selectedTeamName){
		var selectedTeams = [];
		var indices = helperService.findArrayIndices($scope.playoffMatches, 'round', round);
		for(var i = 0; i < indices.length; i++){
			selectedTeams.push({
				matchId: $scope.playoffMatches[indices[i]].id,
				name: $scope.playoffMatches[indices[i]].team_one ? $scope.playoffMatches[indices[i]].team_one.name : null
			}, {
				matchId: $scope.playoffMatches[indices[i]].id,
				name: $scope.playoffMatches[indices[i]].team_two ? $scope.playoffMatches[indices[i]].team_two.name : null
			});
		}
		var index = helperService.findArrayIndex(selectedTeams, 'name', selectedTeamName);
		return index === false;
	};

	// Update playoff seeding
	$scope.updatePlayoffMatches = function(){
		$scope.callInProgress = true;
		$scope.checkAndAddTeamId();
		eventPlayoffService.updatePlayoffMatches($routeParams.id, $scope.playoffMatches).then(function(){
			$window.alert('Results Updated!');
		}, function(){
			$window.alert('Something went wrong.  Results not updated');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});