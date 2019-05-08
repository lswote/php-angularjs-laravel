teamsRIt.controller('viewOpenChallengesLadderModalController', function($scope, $rootScope, $window, ladderModalService, ladderHelperService){

    $scope.ladderObject={
        src: '',
        edit: false,
        errors: {
            played_date: false,
            winner: false,
            winner_too_few: false,
            match_status: false
        }
    };

    $scope.accepted=[];
    $scope.unaccepted=[];
    $scope.getAcceptedChallengesInProgress = false;
    $scope.getUnacceptedChallengesInProgress = false;
    $scope.show_challenges = true;
    $scope.show_edit_challenge_score = false;
    $scope.showReportButton =  $rootScope.showModalView.viewOpenChallengesLadderReports & 1 ? true : false;
    $scope.showWithdrawButton =  $rootScope.showModalView.viewOpenChallengesLadderReports & 2 ? true : false;
    $scope.showResetButton =  $rootScope.showModalView.viewOpenChallengesLadderReports & 4 ? true : false;
    if(($rootScope.user.privilege == 'participant') &&
       ($rootScope.showModalView.viewOpenChallengesLadderReports & 1)){
        $scope.access_id = $rootScope.user.id;
    }
    else{
        $scope.access_id = 0;
    }
	// if a participant and reporting challenge results then show narrow version
	// because it is probably a user on a phone entering challenge results.
	// later this should trigger by detecting browser size
	if($rootScope.user.privilege === 'participant' && $rootScope.showModalView.viewOpenChallengesLadderReports & 1){
		$scope.challenges_file = 'views/view-open-challenges-ladder-narrow.html';
	}
	// otherwise show desktop version
	else{
		$scope.challenges_file = 'views/view-open-challenges-ladder-wide.html';
	}

    // Hide all add event leader errors
    $scope.resetLadderErrors=function(){
        for(var i in $scope.ladderObject.errors){
            if($scope.ladderObject.errors.hasOwnProperty(i)){
                $scope.ladderObject.errors[i] = false;
            }
        }
    };

    getChallenges = function(){
        $scope.accepted=[];
        $scope.unaccepted=[];
        $scope.getAcceptedChallengesInProgress = true;
        ladderModalService.getUnplayedChallenges($rootScope.selectedEvent.id, $scope.access_id).then(function(data){
            $scope.unplayed_challenge_data = angular.copy(data.challenges);
            data.challenges.some(function(challenge){
                matches = [];
                for(i = 0; i < challenge.num_sets; i++){
                    if(i < challenge.matches.length){
                        match = challenge.matches[i];
                        matches.push({'one': match.pair_one_score ? parseInt(match.pair_one_score) : 0,
                                      'two': match.pair_two_score ? parseInt(match.pair_two_score) : 0
                                     });
                    }
                    else {
                        matches.push([0,0]);
                    }
                }
                if ($rootScope.selectedEvent.event_sub_type === 'singles'){
                    $scope.accepted.push({'challenger': challenge.challenger.first_name + " " +
                                                        challenge.challenger.last_name,
                                          'challengee': challenge.challengee.first_name + " " +
                                                        challenge.challengee.last_name,
                                          'id': challenge.id,
                                          'challenger_ranking': challenge.challenger_ranking,
                                          'challengee_ranking': challenge.challengee_ranking,
                                          'accepted_date': challenge.accepted_date,
                                          'play_by_date': challenge.play_by_date,
                                          'matches': matches,
                                          'show': true});
                }
                else{
                    $scope.accepted.push({'challenger': challenge.challenger[0].last_name + "/" +
                                                        challenge.challenger[1].last_name,
                                          'challengee': challenge.challengee[0].last_name + "/" +
                                                        challenge.challengee[1].last_name,
                                          'id': challenge.id,
                                          'challenger_ranking': challenge.challenger_ranking,
                                          'challengee_ranking': challenge.challengee_ranking,
                                          'accepted_date': challenge.accepted_date,
                                          'play_by_date': challenge.play_by_date,
                                          'matches': matches,
                                          'show': true});
                }
            });
        }).finally(function(){
            $scope.getAcceptedChallengesInProgress = false;
        });
        $scope.getUnacceptedChallengesInProgress = true;
        ladderModalService.getUnacceptedChallenges($rootScope.selectedEvent.id, $scope.access_id).then(function(data){
            $scope.unaccepted_challenge_data = angular.copy(data.challenges);
            for(var i=0; i < data.challenges.length; i++){
                if ($rootScope.selectedEvent.event_sub_type === 'singles'){
                    $scope.unaccepted.push({'challenger': data.challenges[i].challenger.first_name + " " +
                                                          data.challenges[i].challenger.last_name,
                                            'challengee': data.challenges[i].challengee.first_name + " " +
                                                          data.challenges[i].challengee.last_name,
                                            'id': data.challenges[i].id,
                                            'challenger_ranking': data.challenges[i].challenger_ranking,
                                            'challengee_ranking': data.challenges[i].challengee_ranking,
                                            'challenge_date': data.challenges[i].challenge_date,
                                            'accept_by_date': data.challenges[i].accept_by_date,
                                            'show': true});
                }
                else{
                    $scope.unaccepted.push({'challenger': data.challenges[i].challenger[0].last_name + "/" +
                                                          data.challenges[i].challenger[1].last_name,
                                            'challengee': data.challenges[i].challengee[0].last_name + "/" +
                                                          data.challenges[i].challengee[1].last_name,
                                            'id': data.challenges[i].id,
                                            'challenger_ranking': data.challenges[i].challenger_ranking,
                                            'challengee_ranking': data.challenges[i].challengee_ranking,
                                            'challenge_date': data.challenges[i].challenge_date,
                                            'accept_by_date': data.challenges[i].accept_by_date,
                                            'show': true});
                }
            }
        }).finally(function(){
            $scope.getUnacceptedChallengesInProgress = false;
        });
    }   
    getChallenges();

    emailCancelledChallenges=function(users){
        if(users.length === 0){
            return;
        }
        challenge = users.challenge;
        if(users.event_sub_type === 'singles'){
            challenge = users.challenge;
            recipients = [challenge.challenger.id, challenge.challengee.id];
            challenger =  challenge.challenger.first_name+' '+challenge.challenger.last_name;
            challengee =  challenge.challengee.first_name+' '+challenge.challengee.last_name;
        }
        else{
            recipients = [challenge.challenger.users[0].id,
                          challenge.challenger.users[1].id,
                          challenge.challengee.users[0].id,
                          challenge.challengee.users[1].id];
            challenger =  challenge.challenger.users[0].first_name+' '+challenge.challenger.users[0].last_name
            challenger +='/';
            challenger += challenge.challenger.users[1].first_name+' '+challenge.challenger.users[1].last_name;
            challengee =  challenge.challengee.users[0].first_name+' '+challenge.challengee.users[0].last_name;
            challengee += '/';
            challengee += challenge.challengee.users[1].first_name+' '+challenge.challengee.users[1].last_name;
        }
        ladderModalService.emailUpdatedChallenges($rootScope.selectedEvent.id, recipients, ' has been been cancelled because one or more participants withdrew', challenger, challengee);
    }

    $scope.revertDisplay = function(id){
        $scope.show_challenges = true
        $scope.show_edit_challenge_score = false;
        $scope.resetLadderErrors();
    }

    $scope.toggleReportChallengeScore = function(challenge_data, id){
        $scope.resetLadderErrors();
        $scope.show_challenges = false
        $scope.show_edit_challenge_score = true;
        ladderHelperService.reportChallengeScore(challenge_data, id, $scope.ladderObject, $rootScope.selectedEvent.event_sub_type);
    };

    $scope.saveChallengeScore = function(){
        if(ladderHelperService.saveChallengeScore($scope.ladderObject)){
            $scope.show_challenges = true
            $scope.show_edit_challenge_score = false;
            $scope.writeMatch($scope.ladderObject.match);
        }
    };

	getIndexFromId = function(id, list){
		for(i = 0; i < list.length; i++){
			if(list[i].id === id){
				return i;
			}
		}
		return -1;
	};

    $scope.confirmAcceptedDelete = function(id, challenger, challengee){
		i = getIndexFromId(id, $scope.accepted);
        if($window.confirm("Delete challenge: "+challenger+" vs "+
                                                challengee+"?")){
			i = getIndexFromId(id, $scope.accepted);
            $scope.accepted[i].show = false;
            ladderModalService.deleteChallenge($rootScope.selectedEvent.id, id).then(function(data){
                emailCancelledChallenges(data.users);
            });
        }
    }

    $scope.confirmUnacceptedDelete = function(id, challenger, challengee){
        if($window.confirm("Delete challenge: "+challenger+" vs "+
                                                challengee+"?")){
			i = getIndexFromId(id, $scope.unaccepted);
            $scope.unaccepted[i].show = false;
            ladderModalService.deleteChallenge($rootScope.selectedEvent.id, id).then(function(data){
                emailCancelledChallenges(data.users);
            });
        }
    }

    $scope.writeMatch = function(match){
        $scope.updateChallengeInProgress = true;
        ladderModalService.updateChallenge($rootScope.selectedEvent.id, match).then(function(data){
            getChallenges();
        }, function(data){
            alert('Something went wrong. '+data.error);
        }).finally(function(){
            $scope.updateChallengeInProgress = false;
        });
    }

    $scope.resetChallenge = function(id, challenger, challengee){
        if($window.confirm("Reset challenge "+challenger+' vs '+challengee+'?')){
            $scope.updateChallengeInProgress = true;
            ladderModalService.resetChallenge($rootScope.selectedEvent.id, id).then(function(data){
                getChallenges();
            }, function(data){
                alert('Something went wrong. '+data.error);
            }).finally(function(){
                $scope.updateChallengeInProgress = false;
            });
        }
    }
});
