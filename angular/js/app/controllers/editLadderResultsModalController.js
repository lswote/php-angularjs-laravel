teamsRIt.controller('editLadderResultsModalController', function($scope, $rootScope, ladderModalService, ladderHelperService){

    $scope.show_edit_results=true;
    $scope.show_edit_challenge_score=false;
    $scope.time_frame = "30";
    $scope.clicked = false;
    $scope.selected_id = -1;
    $scope.saved_search = "";

    $scope.getDate = function(delta){
        if(delta === 'all'){
            return('0000-00-00');
        }

        // JavaScript date defaults to MM/DD/YYYY and it needs to be converted
        // to YYYY-MM-DD
        var today = new Date();
        today.setDate(today.getDate() - parseInt(delta));
        parts = today.toLocaleDateString('en-US', {year:'numeric',month:"2-digit", day:"2-digit"}).split('/');
        temp = parts[2];
        parts[2] = parts[1];
        parts[1] = parts[0];
        parts[0] = temp;
        return parts.join('-');
    };

    // needed for typeahead widget
    $scope.items=[];
    $scope.name="";

    $scope.ladderObject={
        src: '',
        edit: true,
        errors: {
            noChecked: false,
            played_date: false,
            winner: false,
            winner_too_few: false,
            match_status: false
        }
    };

    $scope.resetLadderErrors=function(){
        for(i in $scope.ladderObject.errors){
            if($scope.ladderObject.errors.hasOwnProperty(i)){
                $scope.ladderObject.errors[i] = false;
            }
        }
    };

    $scope.$watch('name', function(newValue, oldValue){
        if(newValue !== oldValue){
            $scope.getChallenges(newValue);
        }
    });

    $scope.revertDisplay = function(){
        $scope.show_edit_results = true;
        $scope.show_edit_challenge_score = false;
        $scope.resetLadderErrors();
    }

    $scope.editMatch = function(){
        if ($scope.selected_id == -1){
            $scope.ladderObject.errors.noChecked = true;
            return;
        }
        $scope.resetLadderErrors();
        $scope.show_edit_results = false;
        $scope.show_edit_challenge_score = true;
        ladderHelperService.reportChallengeScore($scope.challenge_data, $scope.selected_id, $scope.ladderObject, $rootScope.selectedEvent.event_sub_type);
    }

    $scope.saveChallengeScore = function(){
        if(ladderHelperService.saveChallengeScore($scope.ladderObject)){
            $scope.show_edit_results = true;
            $scope.show_edit_challenge_score = false;
            $scope.writeMatch($scope.ladderObject.match);
        }
    }

    isMatch = function(challenge, value){
        if(value === ''){
            return true;
        }
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            challenger = challenge.challenger.first_name + ' ' +  challenge.challenger.last_name;
            challengee = challenge.challengee.first_name + ' ' +  challenge.challengee.last_name;
            if(challenger.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
               challengee.toLowerCase().indexOf(value.toLowerCase()) > -1){
                return true;
            }
        }
        else{
            challenger = challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name;
            challengee = challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name;
            if(challenger.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
               challengee.toLowerCase().indexOf(value.toLowerCase()) > -1){
                return true;
            }
        }
        return false;
    }

    $scope.getChallenges = function(search){
        if(typeof(search) === "undefined"){
            search = $scope.saved_search;
        }
        $scope.saved_search = search;
        $scope.clicked = false;
        $scope.selected_id = -1;
        $scope.resetLadderErrors();
        $scope.challenges=[];
        min_played_date = $scope.getDate($scope.time_frame);
        $scope.challenge_data.forEach(function(challenge){
            if(!isMatch(challenge, search)){
                return;
            }

            // limit by a minimum date
            if(challenge.played_date < min_played_date){
                return;
            }

            results=[];
            if(challenge.result_status === "completed"){
                challenge.matches.forEach(function(match){
                    // don't display nulls
                    pair_one_score = match.pair_one_score ? match.pair_one_score : 0;
                    pair_two_score = match.pair_two_score ? match.pair_two_score : 0;
                    // skip any 0-0 score as they are filler
                    if((pair_one_score == 0) && (pair_two_score == 0)){
                        return;
                    }
                    if(challenge.winner === challenge.challenger_id){
                        results.push(pair_one_score+'-'+pair_two_score);
                    }
                    else{
                        results.push(pair_two_score+'-'+pair_one_score);
                    }
                });
            }
            else{
                if(challenge.result_status === "injury_forfeit"){
                    results.push('Injury/Forfeit');
                }
            }
            matchname='';
            if($rootScope.selectedEvent.event_sub_type === 'singles'){
                if(challenge.winner === challenge.challenger_id){
                    matchname = challenge.challenger.first_name+' '+challenge.challenger.last_name + ' def. ' +
                                challenge.challengee.first_name+' '+challenge.challengee.last_name;
                }
                else{
                    matchname = challenge.challengee.first_name+' '+challenge.challengee.last_name + ' def. ' +
                                challenge.challenger.first_name+' '+challenge.challenger.last_name;
                }
            }
            else{
                if(challenge.winner === challenge.challenger_id){
                    matchname = challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name + ' def. ' +
                                challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name;
                }
                else{
                    matchname = challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name + ' def. ' +
                                challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name;
                }
            }
            $scope.challenges.push({
                id: challenge.id,
                date: challenge.played_date,
                name: matchname,
                results: results.join(', '),
                edit: false,
                disabled: false
            });
        });
    }

    $scope.toggleDisableClick = function(id){
        $scope.clicked = $scope.clicked == false;
        $scope.challenges.forEach(function(challenge){
            if(challenge.id != id){
                if($scope.clicked){
                    challenge.disabled = true;
                }
                else{
                    challenge.disabled = false;
                }
            }
        });
        if($scope.clicked){
            $scope.selected_id = id;
        }
        else{
            $scope.selected_id = -1;
        }
        $scope.resetLadderErrors();
    }

    $scope.getData = function(){
        $scope.getChallengesInProgress = true;
        ladderModalService.getPlayedChallenges($rootScope.selectedEvent.id, ($rootScope.user.privilege === 'participant') ? $rootScope.user.id : 0).then(function(data){
            $scope.challenge_data = angular.copy(data.challenges);
            $scope.getChallenges("");
        }, function(data){
            alert('Something went wrong. '+data.error);
        }).finally(function(){
            $scope.getChallengesInProgress = false;
        });
    }   
    $scope.getData();

    $scope.writeMatch = function(match){
        $scope.updateChallengeInProgress = true;
        ladderModalService.updateChallenge($rootScope.selectedEvent.id, match).then(function(data){
            $scope.getData();
        }, function(data){
            alert('Something went wrong. '+data.error);
        }).finally(function(){
            $scope.updateChallengeInProgress = false;
        });
    }

});
