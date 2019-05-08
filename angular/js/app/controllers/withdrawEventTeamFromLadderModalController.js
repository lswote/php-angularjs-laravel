teamsRIt.controller('withdrawEventTeamFromLadderModalController', function($scope, $http, $rootScope, $location, ladderModalService){

    $scope.showWithdrawEventTeamFromLadderErrors={
        noPairsSelected: false,
        noTeams: false
    };
    $scope.possible_pairs={username: '',
                             show:   false,
                             pairs:  []};
    $scope.pairs=[];
    $scope.withdraw_scope="team_only";
    $scope.withdraw_type="dropped";
    $scope.show_checkbox=true;
    $scope.show_label_team=true;
    $scope.show_label_both=false;

    // needed for typeahead widget
    $scope.items=[];
    $scope.name="";

    if($rootScope.user.privilege === 'participant'){
        $scope.show_participant = false;
        // needed for typeahead widget
        $scope.name=$rootScope.user.first_name+' '+$rootScope.user.last_name;
    }
    else{
        $scope.show_participant = true;
        // needed for typeahead widget
        $scope.name="";
    }

    $scope.itemClick = function(){
        $scope.callSuccess=false;
        $scope.clearPossiblePairs();
    }

    // Hide all add event leader errors
    $scope.resetWithdrawEventTeamFromLadderErrors = function(){
        for(var i in $scope.showWithdrawEventTeamFromLadderErrors){
            if($scope.showWithdrawEventTeamFromLadderErrors.hasOwnProperty(i)){
                $scope.showWithdrawEventTeamFromLadderErrors[i] = false;
            }
        }
    };

    getData = function(){
        ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
            items = [];
            $scope.recipients = angular.copy(data.confirmed_participants);
            for(var i=0; i < data.confirmed_participants.length; i++){
                items.push({'name': data.confirmed_participants[i].first_name+' '+data.confirmed_participants[i].last_name,
                            'id': data.confirmed_participants[i].id});
            }
            $scope.items = angular.copy(items);
        }).finally(function(){
            ladderModalService.getPairs($rootScope.selectedEvent.id).then(function(data){
                $scope.pairs = angular.copy(data.pairs);
                if($rootScope.user.privilege === 'participant'){
                    $scope.display_pairs();
                }
            });
        });
    }
    getData();

    get_possible_pairs=function(name){
        var id=getIdFromName(name);
        var pairs=[];
        for(var i = 0; i < $scope.pairs.length; i++){
            if(id == $scope.pairs[i].user_one_id){
                pairs.push({id: $scope.pairs[i].id, name: name+"/"+getNameFromId($scope.pairs[i].user_two_id)});
            } 
            else if(id == $scope.pairs[i].user_two_id){
                pairs.push({id: $scope.pairs[i].id, name: name+"/"+getNameFromId($scope.pairs[i].user_one_id)});
            }
        }
        return pairs;
    }

    $scope.display_pairs=function(){
        $scope.possible_pairs.username = $scope.name;
        var pairs=get_possible_pairs($scope.name);
        if((pairs.length > 0) || ($scope.withdraw_scope === 'both')){
            $scope.possible_pairs.pairs = pairs;
            if(pairs.length > 0){
                $scope.possible_pairs.show = true;
            }
        }
        else{
            $scope.possible_pairs.show = false;
            $scope.showWithdrawEventTeamFromLadderErrors.noTeams = true;
        }
    }

    getIdFromName=function(name){
        for(var i=0; i < $scope.items.length; i++){
            if($scope.items[i].name == name){
                return($scope.items[i].id);
            }
        }
        return -1;
    }

    getNameFromId=function(id){
        for(var i=0; i < $scope.items.length; i++){
            if($scope.items[i].id == id){
                return($scope.items[i].name);
            }
        }
        return -1;
    }

    $scope.set_withdraw_scope=function(){
        $scope.resetWithdrawEventTeamFromLadderErrors();
        if($scope.withdraw_scope === 'team_only'){
            $scope.show_checkbox = true;
            $scope.show_label_team=true;
            $scope.show_label_both=false;
        }
        else{
            $scope.show_checkbox = false;
            $scope.show_label_team=false;
            $scope.show_label_both=true;
        }
    }

    $scope.clearPossiblePairs=function(){
        $scope.resetWithdrawEventTeamFromLadderErrors();
        $scope.possible_pairs.show=false;
        $scope.possible_pairs.pairs=[];
        $scope.possible_pairs.username="";
    }

    resetValues=function(){
        $scope.clearPossiblePairs();
        $scope.name='';
        getData();
    }

    emailCancelledChallenges=function(users){
        if(users.event_sub_type === 'doubles'){
            users.challenges.forEach(function(challenge){
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
                ladderModalService.emailUpdatedChallenges($rootScope.selectedEvent.id, recipients, ' has been been cancelled because one or more participants withdrew', challenger, challengee);
            });
        }
    }

    $scope.withdrawTeamFromLadder=function(){
        withdrawnPairs = [];
        $scope.possible_pairs.pairs.forEach(function(pair){
            if(pair.selected || ($scope.withdraw_scope !== 'team_only')){
                withdrawnPairs.push(pair.id);
            }
        });
        $scope.resetWithdrawEventTeamFromLadderErrors();
        if((withdrawnPairs.length == 0) && ($scope.withdraw_scope === 'team_only')){
            $scope.showWithdrawEventTeamFromLadderErrors.noPairsSelected = true;
        }
        else{
            $scope.callSuccess=false;
            if($scope.withdraw_scope === 'team_only'){
                ladderModalService.withdrawPairs($rootScope.selectedEvent.id, withdrawnPairs, $scope.withdraw_type).then(function(data){
                    $scope.callSuccess=true;
                    emailCancelledChallenges(data.users);
                    if($rootScope.user.privilege === 'participant'){
                        $rootScope.toggleModal();
                    }
                    resetValues();
                }, function(data){
                    alert('Something went wrong. '+data.error);
                });
            }
            else{
                ladderModalService.withdrawParticipant($rootScope.selectedEvent.id, getIdFromName($scope.name), $scope.withdraw_type).then(function(data){
                    $scope.callSuccess=true;
                    emailCancelledChallenges(data.users);
                    if($rootScope.user.privilege === 'participant'){
                        $rootScope.toggleModal();
                    }
                    resetValues();
                }, function(data){
                    alert('Something went wrong. '+data.error);
                });
            }
            
        }
    }

});
