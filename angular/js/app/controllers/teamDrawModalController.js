teamsRIt.controller('teamDrawModalController', function($scope, $rootScope, teamDrawModalService, editEventModalService, eventLinesService, eventService, helperService){

	// Tell us how many open spots are available by sex
	$scope.parseParticipantSpotsBySex = function(){
		$scope.femaleSpots = 0;
		$scope.maleSpots = 0;
		for(var i = 0 ; i < $scope.event.event_team_users.length; i++){
			if($scope.event.event_team_users[i].sex){
				if($scope.event.event_team_users[i].sex.toLowerCase() === 'female'){
					$scope.femaleSpots = $scope.femaleSpots + 1;
				}
				else if($scope.event.event_team_users[i].sex.toLowerCase() === 'male'){
					$scope.maleSpots = $scope.maleSpots + 1;
				}
			}
		}
	};

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

	// Get our users' rankings for this activity at our facility
	$scope.getParticipantsRankings = function(){
		eventLinesService.getParticipantsRankings($scope.event.activity_id, $scope.event.facility_id).then(function(data){
			for(var i = 0; i < data.participants_rankings.length; i++){
				var index = helperService.findArrayIndex($scope.participants, 'id', data.participants_rankings[i].id);
				if(index !== false){
					$scope.participants[index].ranking = data.participants_rankings[i].pivot.ranking ? data.participants_rankings[i].pivot.ranking : '0.00';
				}
			}
			$scope.sortParticipantsBySexAndRanking();
			$scope.getNextUnassignedGroup();
		});
	};

	// Sort participants by when they rsvped
	$scope.rsvpedSort = function(a, b){
		if(a.events[0].pivot.rsvped > b.events[0].pivot.rsvped){
			return -1;
		}
		else if(a.events[0].pivot.rsvped < b.events[0].pivot.rsvped){
			return 1;
		}
		else{
			return 0;
		}
	};

	// Sort participants arrays by ranking
	$scope.rankingSort = function(a ,b){
		if(parseFloat(a.ranking) < parseFloat(b.ranking)){
			return 1;
		}
		else if(parseFloat(a.ranking) > parseFloat(b.ranking)){
			return -1;
		}
		else{
			return 0;
		}
	};

	// Sort our participants by ranking in female and male arrays
	$scope.sortParticipantsBySexAndRanking = function(){
		$scope.femaleParticipants = [];
		$scope.maleParticipants = [];
		for(var i = 0 ; i < $scope.participants.length; i++){
			if($scope.participants[i].sex){
				if($scope.participants[i].sex.toLowerCase() === 'female'){
					$scope.femaleParticipants.push($scope.participants[i]);
				}
				else if($scope.participants[i].sex.toLowerCase() === 'male'){
					$scope.maleParticipants.push($scope.participants[i]);
				}
			}
		}
		$scope.femaleParticipants.sort($scope.rsvpedSort);
		$scope.maleParticipants.sort($scope.rsvpedSort);
		$scope.femaleParticipants = $scope.femaleParticipants.slice(0, $scope.femaleSpots);
		$scope.maleParticipants = $scope.maleParticipants.slice(0, $scope.maleSpots);
		$scope.femaleParticipants.sort($scope.rankingSort);
		$scope.maleParticipants.sort($scope.rankingSort);
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.event = data.event;
			$scope.participants = data.event.users;
			$scope.parseParticipantSpotsBySex();
			$scope.parseParticipantSexCounts();
			$scope.getParticipantsRankings();
		}, function(){
			$scope.displayEventForm = false;
		});
	};
	$scope.getEvent();

	// Select participants being assigned to teams
	$scope.selectCurrentGroupParticipants = function(){
		var startIndex = $scope.currentGroupNumber === 1 ? 0 : (($scope.currentGroupNumber - 1) * $scope.currentGroupSpots.length);
		var endIndex = startIndex + $scope.currentGroupSpots.length;
		if($scope.currentGroupSex === 'female'){
			$scope.currentGroupParticipants = $scope.femaleParticipants.slice(startIndex, endIndex);
		}
		else if($scope.currentGroupSex === 'male'){
			$scope.currentGroupParticipants = $scope.maleParticipants.slice(startIndex, endIndex);
		}
	};

	// Get the next group of either women / men we need to assign teams for
	$scope.getNextUnassignedGroup = function(){
		teamDrawModalService.getNextUnassignedGroup($rootScope.selectedEvent.id).then(function(data){
			if(data.next_group !== 'No unassigned groups found'){
				$scope.currentGroupSex = data.next_group.sex;
				$scope.currentGroupNumber = data.next_group.group_number;
				$scope.currentGroupSpots = data.next_group.spots;
				$scope.spotButtonWidthString = (100 / $scope.currentGroupSpots.length) + '%';
				$scope.selectCurrentGroupParticipants();
				$scope.currentGroupAssignmentComplete = false;
			}
			else{
				$scope.allGroupAssignmentsComplete = true;
			}
			$scope.callInProgress = false;
		});
	};

	// Assign participants to teams
	$scope.assignToTeams = function(){
		var shuffledParticipants = helperService.shuffleArray(angular.copy($scope.currentGroupParticipants));
		for(var i = 0; i < $scope.currentGroupSpots.length; i++){
			$scope.currentGroupSpots[i].user_id = shuffledParticipants[i].id;
			$scope.currentGroupSpots[i].user = {
				first_name: shuffledParticipants[i].first_name,
				last_name: shuffledParticipants[i].last_name
			};
		}
		$scope.currentGroupParticipants = [];
		$scope.currentGroupAssignmentComplete = true;
	};

	// Updates our teams / groups info
	$scope.updateEventTeams = function(){
		$scope.callInProgress = true;
		eventService.updateEventTeams($rootScope.selectedEvent.id, $scope.currentGroupSpots).then(function(){
			$scope.getNextUnassignedGroup();
		});
	};

	// Tells the system our team draw process is complete
	$scope.updateEventTeamsComplete = function(){
		$scope.callInProgress = true;
		eventService.updateEventTeamsComplete($rootScope.selectedEvent.id).then(function(){
			$scope.getEvents();
			$rootScope.toggleModal();
		});
	};

	// Make available helper method in scope
	$scope.capitalizeWords = helperService.capitalizeWords;

});