teamsRIt.controller('sendCustomEmailModalController', function($scope, $rootScope, $window, multiModalService, helperService, eventService){

	// Default values
	$scope.participants = [];
	$scope.foundParticipants = [];
	$scope.selectedParticipants = [];
	$scope.selectedParticipantIds = [];

	// Get the participants based on email flag
	if($rootScope.showModalView.sendCustomEmailFlag === 'event'){
		$scope.mail_target = 'Event Leader';
		multiModalService.getEventLeader($rootScope.selectedEvent.id).then(function(data){
			$scope.participants = data.event_leaders;
		}).finally(function(){
			if($scope.participants.length === 0){
				multiModalService.getFacilityInfo($rootScope.selectedEvent.id).then(function(data){
					$scope.participants = data.facility.facility_leaders;
				});
			}
		});
	}
	else if($rootScope.showModalView.sendCustomEmailFlag === 'captain'){
		$scope.mail_target = 'Captain';
		multiModalService.getCaptain($rootScope.selectedEvent.id).then(function(data){
			$scope.participants = data.captain;
		});
	}
	else if($rootScope.showModalView.sendCustomEmailFlag === 'captains'){
		$scope.mail_target = 'Captains';
		eventService.getEventTeams($rootScope.selectedEvent.id).then(function(data){
			$scope.participants = [];
			data.event_team_users.forEach(function(participant){
				if(participant.captain === 1){
					$scope.participants.push(participant.users);
				}
			});
		});
	}
	else if($rootScope.showModalView.sendCustomEmailFlag === 'members'){
		$scope.mail_target = 'Team Members';
		multiModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.participants = data.participants.users;
		});
	}

	// Object that determines which input error to show
	$scope.showSendCustomEmailErrors = {
		username: false,
		noSubject: false,
		noBody: false,
		noRecipients: false
	};

	// send mail object
	$scope.sendCustomEmailObject = {
		member_type: 'all',
		username: null,
		subject: null,
		body: null,
		email_flag: $rootScope.showModalView.sendCustomEmailFlag
	};

	// Hide all add event participant errors
	$scope.resetSendCustomEmailErrors = function(){
		for(var i in $scope.showSendCustomEmailErrors){
			if($scope.showSendCustomEmailErrors.hasOwnProperty(i)){
				$scope.showSendCustomEmailErrors[i] = false;
			}
		}
	};

	// Dynamic participant selection
	$scope.initUsernameWatch = function(){
		$scope.clearUsernameWatch = $scope.$watch('sendCustomEmailObject.username', function(newValue, oldValue){
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

	// Either adds or deletes a participant from the selected participant list
	$scope.toggleFoundParticipant = function(participant){
		$scope.clearUsernameWatch();
        $scope.items=[];
		var index = $scope.selectedParticipantIds.indexOf(participant.id);
		// if the participant is not selected, add them
		if(index === -1){
			$scope.selectedParticipants.push(participant);
		}
		// if the participant is selected, delete them
		else{
			$scope.selectedParticipants.splice(index, 1);
		}
        $scope.selectedParticipantIds = [];
		var value = 'id';
        angular.forEach($scope.selectedParticipants, function(value, key) {
            $scope.selectedParticipantIds.push($scope.selectedParticipants[key].id);
        });
		$scope.sendCustomEmailObject.username = '';
		$scope.initUsernameWatch();
		$scope.foundParticipants = [];
	};

	$scope.sendCustomEmail = function(){
		var error = false;
		if($scope.sendCustomEmailObject.subject === null){
			$scope.showSendCustomEmailErrors.noSubject = true;
			error = true;
		}
		if($scope.sendCustomEmailObject.body === null){
			$scope.showSendCustomEmailErrors.noBody = true;
			error = true;
		}
		$scope.recipients = [];
		if($rootScope.showModalView.sendCustomEmailFlag === 'event'){
			$scope.participants.forEach(function(participant){
				$scope.recipients.push(participant.id);
			});
		}
		else if($rootScope.showModalView.sendCustomEmailFlag === 'captain'){
			$scope.recipients.push($scope.participants.id);
		}
		else if($rootScope.showModalView.sendCustomEmailFlag === 'captains'){
			$scope.participants.forEach(function(participant){
				$scope.recipients.push(participant.id);
			});
		}
		else if($rootScope.showModalView.sendCustomEmailFlag === 'members'){
			if($scope.sendCustomEmailObject.member_type === 'all'){
				$scope.participants.forEach(function(participant){
					$scope.recipients.push(participant.id);
				});
			}
			else{
				$scope.selectedParticipants.forEach(function(participant){
					$scope.recipients.push(participant.id);
				});
			}
		}
		if($scope.recipients.length === 0){
			$scope.showSendCustomEmailErrors.noRecipients = true;
			error = true;
		}

		if(error === false){
			$scope.sendCustomEmailInProgress = true;
			multiModalService.sendCustomEmail($rootScope.selectedEvent.id, $scope.recipients, $scope.sendCustomEmailObject).then(function(){
			}).finally(function(){
				$scope.sendCustomEmailInProgress = false;
				$scope.toggleModal();
			});
		}
	};

});