teamsRIt.controller('printParticipantsModalController', function($scope, $rootScope, $window, eventService){

	// Default values
	$scope.rowMode = false;
	$scope.colMode = true;
	$scope.eventName = $rootScope.selectedEvent.name;

	// Get event teams
	$scope.getEventTeams = function(){
		eventService.getEventTeams($rootScope.selectedEvent.id).then(function(data){
			if(data.event_team_users){
				var teamUsers = data.event_team_users;
				var teams = {};
				for(var i = 0; i < teamUsers.length; i++){
					var teamMember = teamUsers[i];
					var teamNumber = teamMember.event_team_id;
					if(!teams[teamNumber]){
						teams[teamNumber] = {
							roster: [],
							number: teamNumber,
							color: teamMember.event_teams.name
						};
					}
					var player = teamMember.users || {
						firstName: 'Team slot not assigned',
						lastName: ''
					};
					teams[teamNumber].roster.push(player);
				}
				$scope.teams = teams;
				$scope.rowMode = $scope.teams.length >= 9;
				$scope.colMode = $scope.teams.length < 9;
			}
		});
	};
	$scope.getEventTeams();

	// Generates a scorecard
	$scope.printRoster = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
	};

	// Make available browser print call in scope
	$scope.print = function(){
		$window.print();
	};

});