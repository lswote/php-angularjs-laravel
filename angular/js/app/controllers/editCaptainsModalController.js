teamsRIt.controller('editCaptainsModalController', function($scope, $rootScope, eventService, editCaptainsModalService, helperService){

	// Tells us who the current team captain user ID is given the event team ID
	$scope.findTeamCaptain = function(eventTeamId){
		for(var i = 0; i < $scope.eventTeamUsers.length; i++){
			if($scope.eventTeamUsers[i].event_team_id === eventTeamId && $scope.eventTeamUsers[i].captain === 1){
				return $scope.eventTeamUsers[i].user_id.toString();
			}
		}
		return null;
	};

	// Create our scope.eventTeams array
	$scope.parseEventTeams = function(){
		$scope.eventTeams = [];
		for(var i = 0; i < $scope.eventTeamUsers.length; i++){
			var index = helperService.findArrayIndex($scope.eventTeams, 'id', $scope.eventTeamUsers[i].event_team_id);
			if(index === false){
				var teamObject = $scope.eventTeamUsers[i].event_teams;
				teamObject['captain_user_id'] = $scope.findTeamCaptain($scope.eventTeamUsers[i].event_team_id);
				$scope.eventTeams.push(teamObject);
			}
		}
	};

	// Get our event teams
	$scope.getEventTeams = function(){
		$scope.getEventTeamsInProgress = true;
		eventService.getEventTeams($rootScope.selectedEvent.id).then(function(data){
			$scope.eventTeamUsers = data.event_team_users;
			$scope.parseEventTeams();
		}).finally(function(){
			$scope.getEventTeamsInProgress = false;
		});
	};
	$scope.getEventTeams();

	// Update our event team captains
	$scope.updateEventTeamCaptains = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		editCaptainsModalService.updateEventTeamCaptains($rootScope.selectedEvent.id, $scope.eventTeamUsers).then(function(){
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Captains not updated')
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Reset captain property for all participants who has not been selected as a captain
	$scope.resetCaptainFlag = function(){
		for(var i = 0; i < $scope.eventTeamUsers.length; i++){
			var index = helperService.findArrayIndex($scope.eventTeams, 'captain_user_id', $scope.eventTeamUsers[i].user_id);
			if(index === false){
				$scope.eventTeamUsers[i].captain = 0;
			}
			else{
				$scope.eventTeamUsers[i].captain = 1;
			}
		}
	};

	// Watch for captain changes
	$scope.$watch('eventTeams', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.resetCaptainFlag();
		}
	}, true);

	// Bring method into scope
	$scope.findArrayIndex = helperService.findArrayIndex;

});