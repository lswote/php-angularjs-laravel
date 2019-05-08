teamsRIt.controller('sendTeamMemberLineupModalController', function($scope, $rootScope, $window, multiModalService, helperService){

	// Default values
	$scope.participants = [];
	$scope.foundParticipants = [];
	$scope.selectedParticipants = [];
	$scope.selectedParticipantIds = [];
	$scope.sendTeamMemberLineupObject = {
		member_type: 'all',
		message: '',
		username: null,
		round: null,
		directions: 0
	};

	var getName = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return $scope.opponents[i].name + ' - ' +
					$scope.opponents[i].city + ', ' +
					$scope.opponents[i].state;
			}
		}
		return '';
	};

	$scope.getData = function(){
		multiModalService.getDirections($rootScope.selectedEvent.id).then(function(data){
			$scope.opponents = angular.copy(data.directions);
			multiModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
				$scope.matches = [];
				for(var i = 0; i < data.matches.length; i++){
					$scope.matches.push({
						index: i,
						round: data.matches[i].round,
						date: data.matches[i].date,
						opponent: data.matches[i].multi_opponent_facility_id ? getName(data.matches[i].multi_opponent_facility_id) : '',
						where: data.matches[i].home_away,
						value: false,
						selected: false
					});
				}
				if($scope.matches.length > 0){
					$scope.sendTeamMemberLineupObject.round = $scope.matches[0].round;
				}
				multiModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
					$scope.participants = data.participants.users;
				})
			});
		});
	};  
	$scope.getData();

	// Object that determines which input error to show
	$scope.showSendTeamMemberLineupErrors = {
		username: false,
		noRecipients: false
	};

	// Hide all add event participant errors
	$scope.resetSendTeamMemberLineupErrors = function(){
		for(var i in $scope.showSendTeamMemberLineupErrors){
			if($scope.showSendTeamMemberLineupErrors.hasOwnProperty(i)){
				$scope.showSendTeamMemberLineupErrors[i] = false;
			}
		}
	};

	// Dynamic participant selection
	$scope.initUsernameWatch = function(){
		$scope.clearUsernameWatch = $scope.$watch('sendTeamMemberLineupObject.username', function(newValue, oldValue){
			if(newValue !== oldValue && newValue && newValue.length > 0){
				newValue = newValue.toLowerCase();
				$scope.foundParticipants = [];
				for(var i = 0; i < $scope.participants.length; i++){
					if($scope.participants[i].first_name.toLowerCase().indexOf(newValue) > -1 || 
					   $scope.participants[i].last_name.toLowerCase().indexOf(newValue) > -1 ||
					   $scope.participants[i].username.toLowerCase().indexOf(newValue) > -1){
						var participant = angular.copy($scope.participants[i]);
						if($scope.selectedParticipantIds.indexOf(participant.id) !== -1){
							participant.alreadySelected = true;
						}
						$scope.foundParticipants.push(participant);
					}
				}
			}
			else if(newValue === ''){
				$scope.foundParticipants = [];
			}
		});
	};
	$scope.initUsernameWatch();

	// Either adds or deletes a participant from the selected
	// participant list
	$scope.toggleFoundParticipant = function(participant){
		$scope.clearUsernameWatch();
		index = $scope.selectedParticipantIds.indexOf(participant.id);
		// if the participant is not selected, add them
		if(index === -1){
			$scope.selectedParticipants.push(participant);
		}
		// if the participant is selected, delete them
		else{
			$scope.selectedParticipants.splice(index, 1);
		}
        $scope.selectedParticipantIds = [];
		value = 'id';
        angular.forEach($scope.selectedParticipants, function(value, key) {
            $scope.selectedParticipantIds.push($scope.selectedParticipants[key].id);
        });
		$scope.sendTeamMemberLineupObject.username = '';
		$scope.initUsernameWatch();
		$scope.foundParticipants = [];
	};

	var getDate = function(round){
		for(var i = 0; i < $scope.matches.length; i++){
			if($scope.matches[i].round === parseInt(round)){
				return $scope.matches[i].date;
			}
		}
		return null;
	};

	$scope.sendTeamMemberLineup = function(){
		var error = false;
		$scope.recipients = [];
		if($scope.sendTeamMemberLineupObject.member_type === 'all'){
			$scope.participants.forEach(function(participant){
				$scope.recipients.push(participant.id);
			});
		}
		else{
			$scope.selectedParticipants.forEach(function(participant){
				$scope.recipients.push(participant.id);
			});
		}
		if($scope.recipients.length === 0){
			$scope.showSendTeamMemberLineupErrors.noRecipients = true;
			error = true;
		}

		if(error === false){
			$scope.sendTeamMemberLineupInProgress = true;
			multiModalService.sendTeamMemberLineup($rootScope.selectedEvent.id, $scope.recipients, $scope.sendTeamMemberLineupObject.message, getDate($scope.sendTeamMemberLineupObject.round), parseInt($scope.sendTeamMemberLineupObject.directions)).then(function(){
			}).finally(function(){
				$scope.sendTeamMemberLineupInProgress = false;
				$scope.toggleModal();
			});
		}
	};

});