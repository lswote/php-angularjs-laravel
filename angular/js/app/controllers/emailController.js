teamsRIt.controller('emailController', function($scope, $rootScope, $location, $window, emailService, dashboardService, editEventModalService, helperService){

	// Default values
	$scope.foundRecipients = [];
	$scope.recipients = [];
	$scope.emailTypes = [{
		name: 'email-potential-participants',
		displayName: 'E-Mail Potential Participants'
	}, {
		name: 'email-potential-additional-participants',
		displayName: 'E-Mail Potential Additional Participants'
	}, {
		name: 'email-participants',
		displayName: 'E-Mail Participants'
	}, {
		name: 'email-participants-reminder',
		displayName: 'E-Mail Participants Reminder'
	}, {
		name: 'email-not-responded-participants',
		displayName: 'E-Mail Not Responded Participants'
	}, {
		name: 'email-waitlisted-participants',
		displayName: 'E-Mail Waitlisted Participants'
	}];
	$scope.emailTypesWithFixedRecipients = ['email-participants', 'email-participants-reminder', 'email-waitlisted-participants'];
	$scope.emailObject = {
		showRecipients: true,
		emailTop: true,
		emailBottom: true,
		subject: '',
		bodyTop: '',
		customBody: null,
		bodyBottom: ''
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($scope.urlParams.event_id).then(function(data){
			$scope.event = data.event;
			$scope.getSubjectandBody();
		});
	};

	// Return date in string format
	$scope.getDate = function(date){
		date = new Date(date + 'T24:00:00.000Z');
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Subject and body parse
	$scope.getSubjectandBody = function(){
		if($scope.urlParams.type === 'email-potential-participants' || $scope.urlParams.type === 'email-potential-additional-participants'){
			$scope.emailObject.subject = 'TeamsRIt - You Have Been Invited To ' + $scope.event.name;
			$scope.emailObject.bodyTop = '<RECEIVER-FNAME>, hope you are well!  We are working to organize a ' + $scope.event.event_type + ' ' +
										  ($scope.event.event_sub_type ? $scope.event.event_sub_type + ' ' : '') + 'event starting/on ' +
										  $scope.getDate($scope.event.start_date) + ".\n\nPlease click on this <LINK> to indicate your interest in participating.";
			$scope.emailObject.bodyBottom = "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>." +
						   					"\n\nSincerely,\n" + $rootScope.user.first_name + ' ' + $rootScope.user.last_name;
		}
		else if($scope.urlParams.type === 'email-participants'){
			$scope.emailObject.subject = 'TeamsRIt - Message About ' + $scope.event.name + ' Starting/On ' + $scope.getDate($scope.event.start_date);
			$scope.emailObject.bodyTop = '<RECEIVER-FNAME>, we wanted to provide you a quick update on the status of '+ $scope.event.name + ' starting/on ' +
										  $scope.getDate($scope.event.start_date);
			$scope.emailObject.bodyBottom = "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>." +
						   					"\n\nSincerely,\n" + $rootScope.user.first_name + ' ' + $rootScope.user.last_name;
		}
		else if($scope.urlParams.type === 'email-participants-reminder'){
			$scope.emailObject.subject = 'TeamsRIt - Reminder About ' + $scope.event.name +' On ' + $scope.getDate($scope.event.start_date);
			$scope.emailObject.bodyTop = '<RECEIVER-FNAME>, hope you are well!  We wanted to confirm your <LINE-START-TIME> start time on court <LINE-COURT>.  ' +
										 'We look forward to seeing you!';
			$scope.emailObject.bodyBottom = "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>." +
						   					"\n\nSincerely,\n" + $rootScope.user.first_name + ' ' + $rootScope.user.last_name;
		}
		else if($scope.urlParams.type === 'email-not-responded-participants'){
			$scope.emailObject.subject = 'TeamsRIt - You Have Been Invited To ' + $scope.event.name;
			$scope.emailObject.bodyTop = "<RECEIVER-FNAME>, hope you are well!  We haven't heard from you regarding your interest in participating in " + $scope.event.name +
										 ' starting/on ' + $scope.getDate($scope.event.start_date) + '.' + "\nWe are working to finalize the participants list and wanted to check " +
										 'with you again to see if you are interested in participating.' + "\n\nPlease click on this <LINK> to indicate your interest in participating.";
			$scope.emailObject.bodyBottom = "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>." +
						   					"\n\nSincerely,\n" + $rootScope.user.first_name + ' ' + $rootScope.user.last_name;
		}
		else if($scope.urlParams.type === 'email-waitlisted-participants'){
			$scope.emailObject.subject = 'TeamsRIt - Update Regarding ' + $scope.event.name +' On ' + $scope.getDate($scope.event.start_date);
			$scope.emailObject.bodyTop = "<RECEIVER-FNAME>, hope you are well!  At this point, we still have you on the waitlist for " + $scope.event.name + ' starting/on ' +
										  $scope.getDate($scope.event.start_date) + '.' + "\nWe are working to finalize the participants list and will let you know as soon as " +
										 "we can if we can get you into the event.  \nIf you have any questions or your ability to participate has changed, please let us know.";
			$scope.emailObject.bodyBottom = "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>." +
											"\n\nSincerely,\n" + $rootScope.user.first_name + ' ' + $rootScope.user.last_name;
		}
	};

	// Grab and parse our URL params
	$scope.getAndParseUrlParams = function(){
		$scope.urlParams = $location.search();
		var emailTypesIndex = helperService.findArrayIndex($scope.emailTypes, 'name', $scope.urlParams.type);
		if(emailTypesIndex !== false){
			$scope.validEmailType = true;
			$scope.emailType = $scope.emailTypes[emailTypesIndex].displayName;
		}
		else{
			$scope.validEmailType = false;
		}
		$scope.getEvent();
	};
	$scope.getAndParseUrlParams();

	// Get all users associated with a facility
	$scope.getFacilityParticipants = function(){
		dashboardService.getFacilityInfo($location.search().event_id).then(function(data){
			$scope.participants = angular.copy(data.facility.users);
		});
	};
	$scope.getFacilityParticipants();

	// Get our default recipients depending on the type of e-mail we are sending
	$scope.getRecipients = function(){
		if($scope.urlParams.type === 'email-potential-participants'){
			emailService.getPotentialParticipants($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.participants);
			});
		}
		else if($scope.urlParams.type === 'email-potential-additional-participants'){
			emailService.getPotentialAdditionalParticipants($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.participants);
			});
		}
		else if($scope.urlParams.type === 'email-participants'){
			emailService.getConfirmedParticipants($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.confirmed_participants);
			});
		}
		else if($scope.urlParams.type === 'email-participants-reminder'){
			emailService.getConfirmedParticipantsWithLines($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.confirmed_participants_with_lines);
			});
		}
		else if($scope.urlParams.type === 'email-not-responded-participants'){
			emailService.getNotRespondedParticipants($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.unconfirmed_participants);
			});
		}
		else if($scope.urlParams.type === 'email-waitlisted-participants'){
			emailService.getWaitlistedParticipants($scope.urlParams.event_id).then(function(data){
				$scope.recipients = angular.copy(data.waitlisted_participants);
			});
		}
	};
	$scope.getRecipients();

	$scope.clearFoundRecipients = function(){
		if($scope.emailTypesWithFixedRecipients.indexOf($scope.urlParams.type) === -1){
			$scope.recipients = [];
		}
	};

	// Add and remove from our selected recipients list
	$scope.toggleFoundRecipient = function(userId){
		var recipientsIndex = helperService.findArrayIndex($scope.recipients, 'id', userId);
		var foundRecipientsIndex = helperService.findArrayIndex($scope.foundRecipients, 'id', userId);
		if(recipientsIndex === false){
			$scope.recipients.push($scope.foundRecipients[foundRecipientsIndex]);
		}
		else{
			if($scope.emailTypesWithFixedRecipients.indexOf($scope.urlParams.type) === -1){
				$scope.recipients.splice(recipientsIndex, 1);
			}
		}
		$scope.searchRecipientsTerm = '';
		$scope.foundRecipients = [];
		$scope.emailObject.showRecipients = true;
	};

	// Real time participants search
	$scope.$watch('searchRecipientsTerm', function(newValue, oldValue){
		if(newValue !== oldValue && newValue.length > 0){
			newValue = newValue.toLowerCase();
			$scope.foundRecipients = [];
			for(var i = 0; i < $scope.participants.length; i++){
				if($scope.participants[i].first_name.toLowerCase().indexOf(newValue) > -1 || $scope.participants[i].last_name.toLowerCase().indexOf(newValue) > -1){
					var participant = angular.copy($scope.participants[i]);
					if(helperService.findArrayIndex($scope.recipients, 'id', participant.id) !== false){
						participant.alreadySelected = true;
					}
					$scope.foundRecipients.push(participant);
				}
			}
		}
		else if(newValue === ''){
			$scope.foundRecipients = [];
		}
	});

	// Sends out an invite e-mail for an event
	$scope.sendPotentialParticipantsEmail = function(){
		emailService.potentialParticipants($scope.urlParams.event_id, $scope.recipients, $scope.emailObject).then(function(){
			$window.alert('E-mail was successfully sent!');
			$window.location.href = '/';
		}, function(data){ 
			$window.alert(data.error.join('\n'));
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Sends out an e-mail to confirmed participants of an event
	$scope.sendParticipantsEmail = function(){
		emailService.participants($scope.urlParams.event_id, $scope.recipients, $scope.emailObject).then(function(){
			$window.alert('E-mail was successfully sent!');
			$window.location.href = '/';
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Send out an reminder e-mail to confirmed participants
	$scope.sendParticipantsReminderEmail = function(){
		emailService.participantsReminder($scope.urlParams.event_id, $scope.recipients, $scope.emailObject).then(function(){
			$window.alert('E-mail was successfully sent!');
			$window.location.href = '/';
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Sends out an invite e-mail to participants who have not RSVPed
	$scope.sendNotRespondedParticipantsEmail = function(){
		emailService.notRespondedParticipants($scope.urlParams.event_id, $scope.recipients, $scope.emailObject).then(function(){
			$window.alert('E-mail was successfully sent!');
			$window.location.href = '/';
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Sends out an e-mail to waitlisted participants
	$scope.sendWaitlistedParticipantsEmail = function(){
		emailService.waitlistedParticipants($scope.urlParams.event_id, $scope.recipients, $scope.emailObject).then(function(){
			$window.alert('E-mail was successfully sent!');
			$window.location.href = '/';
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Send our e-mail
	$scope.sendEmail = function(){
		if($scope.recipients.length === 0){
			return;
		}
		$scope.callInProgress = true;
		if($scope.emailType === 'E-Mail Potential Participants' || $scope.emailType === 'E-Mail Potential Additional Participants'){
			$scope.sendPotentialParticipantsEmail();
		}
		else if($scope.emailType === 'E-Mail Participants'){
			$scope.sendParticipantsEmail();
		}
		else if($scope.emailType === 'E-Mail Participants Reminder'){
			$scope.sendParticipantsReminderEmail();
		}
		else if($scope.emailType === 'E-Mail Not Responded Participants'){
			$scope.sendNotRespondedParticipantsEmail();
		}
		else if($scope.emailType === 'E-Mail Waitlisted Participants'){
			$scope.sendWaitlistedParticipantsEmail();
		}
	};

});