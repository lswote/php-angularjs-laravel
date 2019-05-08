teamsRIt.controller('createEventRulesModalController', function($scope, $rootScope, $window, createEventRulesModalService){

	// Object that determines which create event rules input error to show
	$scope.showLadderRulesErrors = {
		numSets: false,
		numChallenges: false,
		numOppChallenges: false,
		numTeamChallenges: false,
		numSpotsUp: false,
		numSpotsDown: false,
		allowChallengeNext: false,
		switchOrJump: false,
		denyChallengeRank: false,
		denyAcceptRank: false,
		withdrawalRank: false,
		acceptNotPlayedRank: false,
		daysAcceptChallenge: false,
		daysPlayChallenge: false,
		daysAfterCompleted: false
	};

	// Object that determines which create event rules input error to show
	$scope.showEventRulesErrors = {
		rounds: false,
		sets: false,
		standardLineDuration: false,
		lineScoringFormat: false
	};

	$scope.numberRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	$scope.standardLineDurations = [5, 10, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

	$scope.showLadderRules = false;
	$scope.showEventRules = false;

	$scope.ladderRulesObject = {
		eventId: $rootScope.selectedEvent.id,
		numSets: null,
		numChallenges: 0, // dropped as a used field
		numOppChallenges: null,
		numTeamChallenges: null,
		numSpotsUp: null,
		numSpotsDown: null,
		allowChallengeNext: null,
		switchOrJump: null,
		denyChallengeRank: null,
		denyAcceptRank: null,
		withdrawalRank: null,
		acceptNotPlayedRank: null,
		daysAcceptChallenge: null,
		daysPlayChallenge: null,
		daysAfterCompleted: null
	};

	$scope.eventObject = {
		rounds: null,
		sets: null,
		standardLineDuration: null,
		lineScoringFormat: null,
		notes: ''
	};

	// Check our ladder inputs
	$scope.checkLadderRulesInput = function(){
		var noErrors = true;
		if(!$scope.ladderRulesObject.numSets){
			$scope.showLadderRulesErrors.numSets = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.numOppChallenges){
			$scope.showLadderRulesErrors.numOppChallenges = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.numTeamChallenges){
			$scope.showLadderRulesErrors.numTeamChallenges = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.numSpotsUp){
			$scope.showLadderRulesErrors.numSpotsUp = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.numSpotsDown){
			$scope.showLadderRulesErrors.numSpotsDown = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.allowChallengeNext){
			$scope.showLadderRulesErrors.allowChallengeNext = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.switchOrJump){
			$scope.showLadderRulesErrors.switchOrJump = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.denyChallengeRank){
			$scope.showLadderRulesErrors.denyChallengeRank = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.denyAcceptRank){
			$scope.showLadderRulesErrors.denyAcceptRank = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.withdrawalRank){
			$scope.showLadderRulesErrors.withdrawalRank = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.acceptNotPlayedRank){
			$scope.showLadderRulesErrors.acceptNotPlayedRank = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.daysAcceptChallenge){
			$scope.showLadderRulesErrors.daysAcceptChallenge = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.daysPlayChallenge){
			$scope.showLadderRulesErrors.daysPlayChallenge = true;
			noErrors = false;
		}
		if(!$scope.ladderRulesObject.daysAfterCompleted){
			$scope.showLadderRulesErrors.daysAfterCompleted = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all create ladder rules errors
	$scope.resetLadderRulesErrors = function(){
		for(var i in $scope.showLadderRulesErrors){
			if($scope.showLadderRulesErrors.hasOwnProperty(i)){
				$scope.showLadderRulesErrors[i] = false;
			}
		}
	};

	// Check our event inputs
	$scope.checkEventRulesInput = function(){
		var noErrors = true;
		if($rootScope.selectedEvent.event_type !== 'social' && $rootScope.selectedEvent.event_type !== 'multifacility' && !$scope.eventObject.rounds){
			$scope.showEventRulesErrors.rounds = true;
			noErrors = false;
		}
		if($rootScope.selectedEvent.event_type !== 'multifacility' && !$scope.eventObject.sets){
			$scope.showEventRulesErrors.sets = true;
			noErrors = false;
		}
		if($rootScope.selectedEvent.event_type !== 'multifacility' && !$scope.eventObject.standard_line_duration){
			$scope.showEventRulesErrors.standardLineDuration = true;
			noErrors = false;
		}
		if($rootScope.selectedEvent.event_type !== 'social' && $rootScope.selectedEvent.event_type !== 'multifacility' && !$scope.eventObject.line_scoring_format){
			$scope.showEventRulesErrors.lineScoringFormat = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all create event rules errors
	$scope.resetEventRulesErrors = function(){
		for(var i in $scope.showEventRulesErrors){
			if($scope.showEventRulesErrors.hasOwnProperty(i)){
				$scope.showEventRulesErrors[i] = false;
			}
		}
	};

	// Get event info
	$scope.getLadderRules = function(){
		createEventRulesModalService.getLadderRules($rootScope.selectedEvent.id).then(function(data){
			if (data.rules_event.length) {
				$scope.ladderRulesObject = {
						id: data.rules_event.id,
						eventId: data.rules_event[0].event_id,
						numSets: data.rules_event[0].num_sets.toString(),
						numChallenges: data.rules_event[0].num_challenges,
						numOppChallenges: data.rules_event[0].num_opp_challenges,
						numTeamChallenges: data.rules_event[0].num_team_challenges,
						numSpotsUp: data.rules_event[0].num_spots_up,
						numSpotsDown: data.rules_event[0].num_spots_down,
						allowChallengeNext: data.rules_event[0].allow_challenge_next.toString(),
						switchOrJump: data.rules_event[0].switch_or_jump.toString(),
						denyChallengeRank: data.rules_event[0].deny_challenge_rank.toString(),
						denyAcceptRank: data.rules_event[0].deny_accept_rank.toString(),
						withdrawalRank: data.rules_event[0].withdrawal_rank.toString(),
						acceptNotPlayedRank: data.rules_event[0].accept_not_played_rank.toString(),
						daysAcceptChallenge: data.rules_event[0].days_accept_challenge,
						daysPlayChallenge: data.rules_event[0].days_play_challenge,
						daysAfterCompleted: data.rules_event[0].days_after_completed,
				};
			};
		});
	};

	// Get event info
	$scope.getEvent = function(){
		createEventRulesModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.eventObject = {
				rounds: data.event.rounds,
				sets: data.event.sets,
				standardLineDuration: data.event.standard_line_duration ? data.event.standard_line_duration : null,
				lineScoringFormat: data.event.line_scoring_format ? data.event.line_scoring_format : null,
				notes: data.event.notes
			};
		});
	}

	if($rootScope.selectedEvent.event_type === 'ladder'){
		$scope.getLadderRules();
		$scope.showLadderRules = true;
	}
	else{
		$scope.getEvent();
		$scope.showEventRules = true;
	}

	// Creates a new set of event rules
	$scope.createEventRules = function(){
		if($rootScope.selectedEvent.event_type === 'ladder'){
			$scope.callInProgress = true;
			$scope.callSuccess = false;
			$scope.resetLadderRulesErrors();
			if($scope.checkLadderRulesInput() === true){
				createEventRulesModalService.createLadderRules($rootScope.selectedEvent.id, $scope.ladderRulesObject).then(function(){
					$scope.callSuccess = true;
					$rootScope.toggleModal();
				}, function(){
					$window.alert('Something went wrong.  Event Rules not created');
				}).finally(function(){
					$scope.callInProgress = false;
				});
			}
			else{
				$scope.callInProgress = false;
			}
		}
		else{
			$scope.callInProgress = true;
			$scope.callSuccess = false;
			$scope.resetEventRulesErrors();
			if($scope.checkEventRulesInput() === true){
				createEventRulesModalService.updateEvent($rootScope.selectedEvent.id, $scope.eventObject).then(function(){
					$scope.callSuccess = true;
					$rootScope.toggleModal();
				}, function(){
					$window.alert('Something went wrong.  Event Rules not created');
				}).finally(function(){
					$scope.callInProgress = false;
				});
			}
			else{
				$scope.callInProgress = false;
			}
		}
	};

});
