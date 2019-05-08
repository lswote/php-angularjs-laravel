teamsRIt.controller('eventIconsController', function($scope, $rootScope, eventService){

	// Default values
	$scope.showPlusSignDropdown = null;
	$scope.showEnvelopeDropdown = null;
	$scope.showEyeDropdown = null;
	$scope.showPencilDropdown = null;
	$scope.showPencilSquareDropdown = null;
	$scope.showPrinterDropdown = null;
	$rootScope.selectedEvent = null;
	$rootScope.selectedEventStatus = null;

	// Tell us whether results for an event's matches have been entered into the system
	$scope.getEventMatchResultsEntered = function(eventId){
		eventService.getEventMatchResultsEntered(eventId).then(function(data){
			$rootScope.selectedEvent.matchResultsEntered = data.results_entered;
		});
	};

	// Set our selected event and selected event status values
	$scope.setEventValues = function(event, eventStatus){
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
	};

	// Show / hide a specific event plus sign dropdown
	$scope.togglePlusSignDropdown = function(event, eventStatus){
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showPlusSignDropdown = event.id;
	};

	// Show / hide a specific event envelope dropdown
	$scope.toggleEnvelopeDropdown = function(event, eventStatus){
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showEnvelopeDropdown = event.id;
	};

	// Show / hide a specific event eye dropdown
	$scope.toggleEyeDropdown = function(event, eventStatus){
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showEyeDropdown = event.id;
	};

	// Show / hide a specific event pencil dropdown
	$scope.togglePencilDropdown = function(event, eventStatus){
		$scope.getEventMatchResultsEntered(event.id);
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showPencilDropdown = event.id;
	};

	// Show / hide a specific event pencil square dropdown
	$scope.togglePencilSquareDropdown = function(event, eventStatus){
		$scope.getEventMatchResultsEntered(event.id);
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showPencilSquareDropdown = event.id;
	};

	// Show / hide a specific event printer dropdown
	$scope.togglePrinterDropdown = function(event, eventStatus){
		$rootScope.selectedEvent = event;
		$rootScope.selectedEventStatus = eventStatus;
		$rootScope.closeAllDropdowns();
		$scope.showPrinterDropdown = event.id;
	};

	// Tells us whether any dropdowns can be seen
	$rootScope.areDropdownsOpen = function(){
		if($scope.showPlusSignDropdown !== null || $scope.showEnvelopeDropdown !== null || $scope.showEyeDropdown !== null || $scope.showPencilDropdown !== null ||
		   $scope.showPencilSquareDropdown !== null || $scope.showPrinterDropdown !== null){
			return true;
		}
		else{
			return false;
		}
	};

	// Closes out all open dropdowns
	$rootScope.closeAllDropdowns = function(){
		$scope.showPlusSignDropdown = null;
		$scope.showEnvelopeDropdown = null;
		$scope.showEyeDropdown = null;
		$scope.showPencilDropdown = null;
		$scope.showPencilSquareDropdown = null;
		$scope.showPrinterDropdown = null;
	};

	// Tells us whether a user is a captain for an event
	$scope.isCaptain = function(event){
		if(event && event.event_team_users.length > 0){
			for(var i = 0; i < event.event_team_users.length; i++){
				if(event.event_team_users[i].user_id === $rootScope.user.id && event.event_team_users[i].captain === 1){
					return true;
				}
			}
		}
		return false;
	};

	// Tells us whether a user has access to edit an event
	$scope.canEditEvent = function(event){
		return $rootScope.user.privilege === 'facility leader' || (event && event.event_leaders.length > 0);
	};

	// Whether or not to show our e-mail captain link in the envelope dropdown
	$scope.showEmailCaptainLink = function(event, selectedEventStatus, user){
		if(event.event_type === 'multifacility' || event.event_type === 'league'){
			if(selectedEventStatus === 'upcoming' && !$scope.isCaptain(event)){
				return true;
			}
			if(selectedEventStatus === 'current' && user.privilege === 'participant' && !$scope.isCaptain(event)){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our view teams link in the eye dropdown
	$scope.showViewTeamsLink = function(event, selectedEventStatus, user){
		if(event.event_type === 'league' || event.event_type === 'round robin'){
			if(($scope.isCaptain(event) || ((event.event_type === 'league' || event.event_type === 'round robin') && user.privilege === 'participant')) &&
			   selectedEventStatus === 'current'){
				return true;
			}
			if(($scope.canEditEvent(event) || $scope.isCaptain(event)) && selectedEventStatus === 'past'){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our print to dos link in the printer dropdown
	$scope.showPrintToDosLink = function(event, selectedEventStatus){
		if(event.event_type === 'multifacility'){
			if(selectedEventStatus === 'upcoming' || (selectedEventStatus === 'current' && $scope.isCaptain(event))){
				return true;
			}
		}
		else if(event.event_type === 'league'){
			if($scope.canEditEvent(event)){
				return true;
			}
		}
		else{
			return true;
		}
		return false;
	};

	// Whether or not to show our add event leader link in the plus dropdown
	$scope.showAddEventLeaderLink = function(event, selectedEventStatus, user){
		if(event.event_type !== 'multifacility'){
			if($scope.canEditEvent(event) && selectedEventStatus !== 'past'){
				return true;
			}
		}
		else{
			if(selectedEventStatus !== 'past' && user.privilege === 'facility leader'){
				return true;
			}
			if(selectedEventStatus === 'current' && event && event.event_leaders.length > 0){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our delete recreate event link in the pencil dropdown
	$scope.showDeleteRecreateEventLink = function(event, selectedEventStatus){
		if(event.event_type !== 'multifacility'){
			if(selectedEventStatus !== 'past'){
				return true;
			}
		}
		else{
			if(selectedEventStatus === 'upcoming' && $scope.isCaptain(event)){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our start event link in the pencil dropdown
	$scope.showStartEventLink = function(event, selectedEventStatus){
		if(selectedEventStatus === 'upcoming' && event.comb_play !== null){
			if(event.event_type !== 'multifacility'){
				return true;
			}
			else{
				if($scope.canEditEvent(event) || $scope.isCaptain(event)){
					return true;
				}
			}
		}
		return false;
	};

	// Whether or not to show our edit groups link in the pencil dropdown
	$scope.showEditGroupsTeamsLink = function(event, selectedEventStatus){
		if(selectedEventStatus !== 'past'){
			if(event.event_type === 'league' || event.event_type === 'round robin'){
				if($scope.canEditEvent(event) || $scope.isCaptain(event)){
					return true;
				}
			}
			else if(event.event_type === 'multifacility'){
				if($scope.isCaptain(event)){
					return true;
				}
			}
		}
		return false;
	};

	// Whether or not to show our view participants link in the eye dropdown
	$scope.showViewParticipantsLink = function(event, selectedEventStatus, user){
		if(event.event_type !== 'multifacility'){
			if(selectedEventStatus === 'current' && user.privilege === 'participant'){
				return true;
			}
		}
		if(event.event_type !== 'multifacility' && event.event_type !== 'round robin'){
			if(user.privilege === 'participant'){
				return true;
			}
		}
		if(event.event_type === 'round robin'){
			if(selectedEventStatus === 'past'){
				return true;
			}
			else if(selectedEventStatus !== 'past'){
				if(!$scope.isCaptain(event) && user.privilege === 'participant'){
					return true;
				}
			}
		}
		return false;
	};

	// Whether or not to show our view schedule link in the eye dropdown
	$scope.showViewScheduleLink = function(event, selectedEventStatus){
		if(event.event_type === 'multifacility'){
			if(selectedEventStatus === 'past' && $scope.isCaptain(event)){
				return true;
			}
		}
		if(event.event_type === 'round robin'){
			if(selectedEventStatus === 'past'){
				return true;
			}
			else if(selectedEventStatus === 'current'){
				if(!$scope.canEditEvent(event)){
					return true;
				}
			}
		}
		return false;
	};

	// Whether or not to show our view complete event setup link in the eye dropdown
	$scope.showViewCompleteEventSetupLink = function(event, selectedEventStatus){
		if(event.event_type !== 'multifacility'){
			if($scope.canEditEvent(event) && event.comb_play !== null){
				return true;
			}
		}
		else if(event.event_type === 'multifacility'){
			if(((selectedEventStatus === 'upcoming' && $scope.canEditEvent(event)) || $scope.isCaptain(event)) && event.comb_play !== null){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our view create event link in the eye dropdown
	$scope.showViewCreateEventLink = function(event, selectedEventStatus){
		if(event.event_type !== 'multifacility'){
			if($scope.canEditEvent(event)){
				return true;
			}
		}
		else if(event.event_type === 'multifacility'){
			if((selectedEventStatus === 'upcoming' && $scope.canEditEvent(event)) || $scope.isCaptain(event)){
				return true;
			}
		}
		return false;
	};

	// Whether or not to show our view event rules link in the eye dropdown
	$scope.showViewEventRulesLink = function(event, selectedEventStatus, user){
		if(event.event_type !== 'multifacility'){
			if(!$scope.canEditEvent(event)){
				return true;
			}
		}
		else if(event.event_type === 'multifacility'){
			if(user.privilege === 'participant' && !$scope.isCaptain(event)){
				return true;
			}
		}
		return false;
	};

});