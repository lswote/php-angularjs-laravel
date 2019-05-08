teamsRIt.controller('eventTeamChallengeLadderModalController', function($scope, $rootScope, $window, ladderModalService){

    $scope.user_name = $rootScope.user.first_name+' '+$rootScope.user.last_name;
    $scope.user_id = $rootScope.user.id;
    $scope.show_challengers = false;
    $scope.show_challengees = false;
    $scope.challenger = null;
    $scope.show_issue_challenge = $rootScope.showModalView.eventTeamChallengeLadderViewOnly == true ? false : true;

    $scope.showEventTeamChallengeLadderErrors={
        createFailed: false
    };
    $scope.create_failure_reason = '';

    // Hide all add event leader errors
    $scope.resetEventTeamChallengeLadderErrors=function(){
        $scope.callSuccess = false;
        for(var i in $scope.showEventTeamChallengeLadderErrors){
            if($scope.showEventTeamChallengeLadderErrors.hasOwnProperty(i)){
                $scope.showEventTeamChallengeLadderErrors[i] = false;
            }
        }
    };

    $scope.initData = function(){
        ladderModalService.getRules($rootScope.selectedEvent.id).then(function(data){
            $scope.rules = data.rules_event[0];
            $scope.getData();
        });
    }
    $scope.initData();

    $scope.getData = function(){
        ladderModalService.getChallenges($rootScope.selectedEvent.id, 0).then(function(data){
            $scope.challenges = data.challenges;
            if($rootScope.selectedEvent.event_sub_type === 'singles'){
                $scope.getDataInProgress = true;
                ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
                    $scope.data = angular.copy(data.confirmed_participants);
                }).finally(function(){
                    $scope.getDataInProgress = false;
                    $scope.process_data();
                });
            }
            else{
                $scope.getDataInProgress = true;
                ladderModalService.getPairs($rootScope.selectedEvent.id).then(function(data){
                    $scope.data = angular.copy(data.pairs);
                }).finally(function(){
                    $scope.getDataInProgress = false;
                    $scope.process_data();
                });
            }
        });
    }

    $scope.process_data = function(){
        $scope.challengees = [];
        $scope.challenger_index = -1;
        $scope.show_challengees = false;
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            $scope.challengers = $scope.get_challengers();
            $scope.show_challengers = true;
            if($scope.challengers.length > 0){
                $scope.challenger = $scope.challengers[0];
                $scope.challengees = $scope.get_challengees($scope.challenger);
                $scope.show_challengees = true;
            }
        }
        else{
            $scope.challengers = $scope.get_challengers();
            $scope.show_challengers = true;
            if($scope.challengers.length === 1){
                $scope.challenger_index = 0;
                $scope.challenger = $scope.challengers[0];
                $scope.challengees = $scope.get_challengees($scope.challenger);
                $scope.show_challengees = true;
            }
        }
    }

    $scope.process_doubles_challenger = function(i){
        $scope.challenger = $scope.challengers[i];
        $scope.challengees = $scope.get_challengees($scope.challenger);
        $scope.show_challengees = true;
    }

    $scope.get_challengers = function(){
        challenges = [];
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            counter = 0;
            for(var i=0; i < $scope.data.length; i++){
                name = $scope.data[i].first_name+' '+$scope.data[i].last_name;
                if(($scope.user_id == $scope.data[i].id) &&
                   ($scope.rules.num_team_challenges - $scope.data[i].total_challenger > 0)){
                    challenges.push({'index': counter,
                                     'data_index': i,
                                     'id': $scope.data[i].id,
                                     'show_challenge': true,
                                     'rank': $scope.data[i].pivot.singles_ladder_ranking,
                                     'challenges': $scope.data[i].total_challenger,
                                     'name': name});
                    counter++;
                }
            }
        }
        else{
            counter = 0;
            for(var i=0; i < $scope.data.length; i++){
                name = $scope.data[i].user_one.first_name+' '+$scope.data[i].user_one.last_name;
                name += '/';
                name += $scope.data[i].user_two.first_name+' '+$scope.data[i].user_two.last_name;
                if((($scope.user_id == $scope.data[i].user_one.id) ||
                    ($scope.user_id == $scope.data[i].user_two.id)) &&
                   ($scope.rules.num_team_challenges - $scope.data[i].total_challenger > 0)){
                    challenges.push({'index': counter,
                                     'data_index': i,
                                     'id': $scope.data[i].id,
                                     'show_challenge': true,
                                     'rank': $scope.data[i].ladder_ranking,
                                     'challenges': $scope.data[i].total_challenger,
                                     'id1': $scope.data[i].user_one.id,
                                     'id2': $scope.data[i].user_two.id,
                                     'name': name});
                    counter++;
                }
            }
        }
        return challenges;
    }

    $scope.challenge_exists = function(id1, id2){
        for(i = 0;i < $scope.challenges.length; i++){
            if($scope.challenges[i].played_date != null){
                continue;
            }
            if((($scope.challenges[i].challenger_id == id1) &&
                ($scope.challenges[i].challengee_id == id2)) ||
               (($scope.challenges[i].challengee_id == id1) &&
                ($scope.challenges[i].challenger_id == id2))){
                return true;
            }
        }
        return false;
    }

    $scope.last_challenge_too_soon = function(id1, id2){
        dates = [];
        for(i = 0;i < $scope.challenges.length; i++){
            if($scope.challenges[i].played_date === null){
                continue;
            }
            if((($scope.challenges[i].challenger_id == id1) &&
                ($scope.challenges[i].challengee_id == id2)) ||
               (($scope.challenges[i].challengee_id == id1) &&
                ($scope.challenges[i].challenger_id == id2))){
                dates.push($scope.challenges[i].played_date);
            }
        }
        if(dates.length === 0){
            return false;
        }
        else{
            dates.sort();
            dates.reverse();
            // JavaScript date defaults to MM/DD/YYYY and it needs to be converted
            // to YYYY-MM-DD
            var today = new(Date);
            today.setDate(today.getDate() - $scope.rules.days_after_completed);
            parts = today.toLocaleDateString('en-US', {year:'numeric',month:"2-digit", day:"2-digit"}).split('/');
            temp = parts[2];
            parts[2] = parts[1];
            parts[1] = parts[0];
            parts[0] = temp;
            last_allowed_completed = parts.join('-');
            return dates[0] >= last_allowed_completed;
        }
    }

    $scope.get_challengees = function(challenger){
        challenges = [];
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            counter = 0;
            for(var i=0; i < $scope.data.length; i++){
                name = $scope.data[i].first_name+' '+$scope.data[i].last_name;
                if((challenger.id != $scope.data[i].id) &&
                   ($scope.rules.num_opp_challenges - $scope.data[i].total_challengee > 0) &&
                   (((challenger.rank < $scope.data[i].pivot.singles_ladder_ranking) &&
                     (challenger.rank + $scope.rules.num_spots_down >= $scope.data[i].pivot.singles_ladder_ranking)) ||
                    ((challenger.rank > $scope.data[i].pivot.singles_ladder_ranking) &&
                     (challenger.rank - $scope.rules.num_spots_up <= $scope.data[i].pivot.singles_ladder_ranking)))){
                    if(($scope.challenge_exists(challenger.id, $scope.data[i].id)) ||
                        $scope.last_challenge_too_soon(challenger.id, $scope.data[i].id)){
                        continue;
                    }
                    challenges.push({'index': counter,
                                     'data_index': i,
                                     'id': $scope.data[i].id,
                                     'show_challenge': true,
                                     'rank': $scope.data[i].pivot.singles_ladder_ranking,
                                     'challenges': $scope.data[i].total_challenger,
                                     'name': name});
                    counter++;
                }
            }
        }
        else{
            counter = 0;
            for(var i=0; i < $scope.data.length; i++){
                name = $scope.data[i].user_one.first_name+' '+$scope.data[i].user_one.last_name;
                name += '/';
                name += $scope.data[i].user_two.first_name+' '+$scope.data[i].user_two.last_name;
                if((challenger.id1 != $scope.data[i].user_one_id) &&
                   (challenger.id1 != $scope.data[i].user_two_id) &&
                   (challenger.id2 != $scope.data[i].user_one_id) &&
                   (challenger.id2 != $scope.data[i].user_two_id) &&
                   ($scope.rules.num_opp_challenges - $scope.data[i].total_challengee > 0) &&
                   (((challenger.rank < $scope.data[i].ladder_ranking) &&
                     (challenger.rank + $scope.rules.num_spots_down >= $scope.data[i].ladder_ranking)) ||
                    ((challenger.rank > $scope.data[i].ladder_ranking) &&
                     (challenger.rank - $scope.rules.num_spots_up <= $scope.data[i].ladder_ranking)))){
                    if(($scope.challenge_exists(challenger.id, $scope.data[i].id)) ||
                        $scope.last_challenge_too_soon(challenger.id, $scope.data[i].id)){
                        continue;
                    }
                    challenges.push({'index': counter,
                                     'data_index': i,
                                     'id': $scope.data[i].id,
                                     'show_challenge': true,
                                     'rank': $scope.data[i].ladder_ranking,
                                     'challenges': $scope.data[i].total_challenger,
                                     'name': name});
                    counter++;
                }
            }
        }
        return challenges;
    }

    $scope.issueChallenge = function(challenger, challengee){

        if($window.confirm('Issue challenge '+challenger.name+' vs '+challengee.name+'?')){
            $scope.addTeamToLadder(challenger, challengee);
        }
    }

    getNameFromId = function(id){
        for(i=0; i < $scope.challengers.length; i++){
            if($scope.challengers[i].id == id){
                return($scope.challengers[i].name);
            }
        }
        return -1;
    }

    getAcceptByDate = function(){

        // JavaScript date defaults to MM/DD/YYYY and it needs to be converted
        // to YYYY-MM-DD
        var today = new(Date);
        today.setDate(today.getDate() + $scope.rules.days_accept_challenge);
        parts = today.toLocaleDateString('en-US', {year:'numeric',month:"2-digit", day:"2-digit"}).split('/');
        temp = parts[2];
        parts[2] = parts[1];
        parts[1] = parts[0];
        parts[0] = temp;
        return parts.join('-');

    }

    getMessageDataFromId = function(challenger){
        data = $scope.data[challenger.data_index];
        messageData = {
            challenger_name: getNameFromId(challenger.id),
            accept_by_date: getAcceptByDate()
        };
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            messageData['player_email'] = data.email;
            messageData['player_name'] = data.first_name+' '+data.last_name;
        }
        else{
            messageData['player_email'] = data.user_one.email;
            messageData['player_name'] = data.user_one.first_name+' '+data.user_one.last_name;
            messageData['player_email_two'] = data.user_two.email;
            messageData['player_name_two'] = data.user_two.first_name+' '+data.user_two.last_name;
        }
        return messageData;
    }

    $scope.addTeamToLadder=function(challenger, challengee){
        $scope.resetEventTeamChallengeLadderErrors();
        $scope.callSuccess = false;
        ladderModalService.addChallenge($rootScope.selectedEvent.id, challenger.id, challengee.id).then(function(data){
            messageData = getMessageDataFromId(challenger);
            recipients=[];
            for(i=0; i < $scope.data.length; i++){
                if(challengee.id === $scope.data[i].id){
                    if($rootScope.selectedEvent.event_sub_type === 'singles'){
                        recipients.push($scope.data[i]);
                    }
                    else{
                        recipients.push($scope.data[i]['user_one']);
                        recipients.push($scope.data[i]['user_two']);
                    }
                }
            }
            ladderModalService.emailChallengers($rootScope.selectedEvent.id, recipients, messageData, data.id).then(function(){
                $scope.callSuccess = true;
                $scope.initData();
            }, function(data){
                alert('Something went wrong. '+data.error);
            }).finally(function(){
                alert('Challenge '+challenger.name+' vs '+challengee.name+' created.');
            });
        }, function(data){
            $scope.create_failure_reason = data.error;
            $scope.showEventTeamChallengeLadderErrors.createFailed = true;
        });
    }
});