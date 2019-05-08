teamsRIt.controller('rsvpController', function($scope, $location, $window, rsvpService, helperService){

	// Grab our RSVP token
	$scope.token = $location.search().token;
	$scope.action = $location.search().action;
	$scope.actionId = $location.search().action_id;
	// Preferred start time value
	$scope.response = {
		preferredStartTime: ''
	};
	// Default value
	$scope.challengeShow = $scope.action === 'challenge';

	// E-mail challenger
	$scope.emailChallenger = function(){
		rsvpService.getRules($scope.event_id).then(function(data){
			$scope.rules = data.rules_event[0];
			// JavaScript date defaults to MM/DD/YYYY and it needs to be converted to YYYY-MM-DD
			var today = new Date;
			today.setDate(today.getDate() + $scope.rules.days_play_challenge);
			var parts = today.toLocaleDateString('en-US', {
				year: 'numeric',
				month: "2-digit",
				day: "2-digit"
			}).split('/');
			var temp = parts[2];
			parts[2] = parts[1];
			parts[1] = parts[0];
			parts[0] = temp;
			$scope.playByDate = parts.join('-');
			return parts.join('-');
		}).finally(function(){
			rsvpService.emailChallenger($scope.token, $scope.event_id, $scope.response.preferredStartTime, $scope.emails, $scope.challenger, $scope.challengee,
										$scope.playByDate, $scope.actionId);
		});
	};

	// Get event info
	$scope.getEvent = function(){
		$scope.getEventInProgress = true;
		rsvpService.getEvent($scope.token).then(function(data){
			$scope.event = data.event;
			$scope.event.activity = helperService.capitalizeWords($scope.event.activity);
			$scope.event.event_type = helperService.capitalizeWords($scope.event.event_type);
			$scope.event.start_date = helperService.formatDate($scope.event.start_date);
			$scope.event.start_time = helperService.parseTime($scope.event.start_time);
			$scope.availableStartTimes = [];
			for(var i = 0; i < data.event.available_start_times.length; i++){
				var startTimeObject = {
					start_time: data.event.available_start_times[i],
					start_time_formatted: helperService.parseTime(data.event.available_start_times[i])
				};
				$scope.availableStartTimes.push(startTimeObject);
			}
			$scope.getEventSuccess = true;
		}, function(){
			$scope.getEventSuccess = false;
		}).finally(function(){
			$scope.getEventInProgress = false;
		});
	};

	// Get challenge info
	$scope.getChallenge = function(){
		$scope.getChallengeInProgress = true;
		rsvpService.getChallenge($scope.token, $scope.actionId).then(function(data){
			$scope.event_id = data.challenge.event_id;
			if(data.challenge.event_sub_type === 'singles'){
				$scope.emails = [data.challenge.challenger];
				$scope.challenger = data.challenge.challenger.first_name + ' ' + data.challenge.challenger.last_name;
				$scope.challengee = data.challenge.challengee.first_name + ' ' + data.challenge.challengee.last_name;
			}
			else{
				$scope.emails = [data.challenge.challenger[0], data.challenge.challenger[1]];
				$scope.challenger = data.challenge.challenger[0].first_name + ' ' + data.challenge.challenger[0].last_name;
				$scope.challenger += '/';
				$scope.challenger += data.challenge.challenger[1].first_name + ' ' + data.challenge.challenger[1].last_name;
				$scope.challengee = data.challenge.challengee[0].first_name + ' ' + data.challenge.challengee[0].last_name;

				$scope.challengee += '/';
				$scope.challengee += data.challenge.challengee[1].first_name + ' ' + data.challenge.challengee[1].last_name;
			}
			if(data.challenge.responded){
				if(data.challenge.accepted_date){
					$scope.showAccepted = true;
					$scope.status = 'Accepted';
				}
				else{
					$scope.showUnaccepted = true;
					$scope.status = 'Denied';
				}
			}
			else{
				$scope.status = 'Not responded to';
			}
			$scope.playByDate = data.challenge.play_by_date;
			$scope.acceptByDate = data.challenge.accept_by_date;
			$scope.challengeDate = data.challenge.challenge_date;
			$scope.getChallengeSuccess = true;
		}, function(){
			$scope.getChallengeSuccess = false;
		}).finally(function(){
			$scope.getChallengeInProgress = false;
		});
	};

	// Determine whether this is related to a ladder challenge
	if($scope.action === 'challenge'){
		$scope.challengeShow = true;
		$scope.getChallenge();
	}
	else{
		$scope.getEvent();
	}

	// Attempts to RSVP using a token
	$scope.rsvp = function(){
		$scope.rsvpInProgress = true;
		rsvpService.rsvp($scope.token, $scope.response.preferredStartTime, $scope.action, $scope.actionId).then(function(data){
			$scope.rsvpSuccess = true;
			if($scope.action === 'challenge'){
				$scope.emailChallenger();
			}
			if(data.event.charge_cc === 1 && parseFloat(data.event.participant_charge) > 0.00 && data.event.facilities.paypal_link){
				var link = data.event.facilities.paypal_link.substr(0, 4).toLowerCase() === 'http' ? data.event.facilities.paypal_link : 'https://' + data.event.facilities.paypal_link;
				$window.open(link + '/' + data.event.participant_charge);
			}
		}, function(){
			$scope.rsvpSuccess = false;
		}).finally(function(){
			$scope.rsvpInProgress = false;
		});
	};

});