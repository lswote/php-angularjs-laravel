teamsRIt.controller('viewEventRulesModalController', function($scope, $rootScope, $window, viewEventRulesModalService){

    // Get event info
    $scope.getLadderRules = function(){
        viewEventRulesModalService.getLadderRules($rootScope.selectedEvent.id).then(function(data){
            if (data.rules_event.length) {
                $scope.rulesObject = {
                    id: data.rules_event.id,
                    eventId: data.rules_event[0].event_id,
                    numSets: data.rules_event[0].num_sets.toString(),
                    numChallenges: data.rules_event[0].num_challenges,
                    numOppChallenges: data.rules_event[0].num_opp_challenges,
                    numTeamChallenges: data.rules_event[0].num_team_challenges,
                    numSpotsUp: data.rules_event[0].num_spots_up,
                    numSpotsDown: data.rules_event[0].num_spots_down,
                    allowChallengeNext: data.rules_event[0].allow_challenge_next ? 'Yes' : 'No',
                    switchOrJump: data.rules_event[0].switch_or_jump === 's' ? 'Switch' : 'Jump',
                    denyChallengeRank: data.rules_event[0].deny_challenge_rank ? 'Yes' : 'No',
                    denyAcceptRank: data.rules_event[0].deny_accept_rank ? 'Yes' : 'No',
                    withdrawalRank: data.rules_event[0].withdrawal_rank ? 'Yes' : 'No',
                    acceptNotPlayedRank: data.rules_event[0].accept_not_played_rank ? 'Yes' : 'No',
                    daysAcceptChallenge: data.rules_event[0].days_accept_challenge,
                    daysPlayChallenge: data.rules_event[0].days_play_challenge,
                    daysAfterCompleted: data.rules_event[0].days_after_completed,
                }
            }
        });
    };

	// Get event info
	$scope.getEvent = function(){
		viewEventRulesModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
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

});
