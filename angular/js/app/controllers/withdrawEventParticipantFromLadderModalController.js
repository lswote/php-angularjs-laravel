teamsRIt.controller('withdrawEventParticipantFromLadderModalController', function($scope, $http, $rootScope, $location, ladderModalService){

    $scope.showWithdrawEventParticipantFromLadderErrors={
        noParticipant: false
    };
    $scope.withdraw_type="dropped";
    if($rootScope.user.privilege === 'participant'){
        $scope.show_participant = false;
        // needed for typeahead widget
        // preload values for participant
        $scope.items=[{'name': $rootScope.user.first_name+' '+$rootScope.user.last_name,
                       'id': $rootScope.user.id}];
        $scope.name=$scope.items[0].name;
    }
    else{
        $scope.show_participant = true;
        // needed for typeahead widget
        $scope.items=[];
        $scope.name="";
    }


    // Hide all add event errors
    $scope.resetWithdrawEventParticipantFromLadderErrors = function(){
        $scope.callSuccess = false;
        for(var i in $scope.showWithdrawEventParticipantFromLadderErrors){
            if($scope.showWithdrawEventParticipantFromLadderErrors.hasOwnProperty(i)){
                $scope.showWithdrawEventParticipantFromLadderErrors[i] = false;
            }
        }
    };

    // Get default recipients
    getData=function(){
        items =[];
        ladderModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
            for(var i=0; i < data.participants.users.length; i++){
                items.push({'name': data.participants.users[i].first_name+' '+data.participants.users[i].last_name,
                            'id': data.participants.users[i].id});
            }
            $scope.items = $scope.items = angular.copy(items);
       });
    }
    getData();

    emailCancelledChallenges=function(users){
        if(users.event_sub_type === 'singles'){
            users.challenges.forEach(function(challenge){
                recipients = [challenge.challenger.id,
                              challenge.challengee.id];
                challenger =  challenge.challenger.first_name+' '+challenge.challenger.last_name;
                challengee =  challenge.challengee.first_name+' '+challenge.challengee.last_name;
                ladderModalService.emailUpdatedChallenges($rootScope.selectedEvent.id, recipients, ' has been been cancelled because one or more participants withdrew', challenger, challengee);
            });
        }
    }

    $scope.withdrawParticipantFromLadder=function(participants){
        participant_id = 0;
        for(var i=0; i < $scope.items.length; i++){
            if($scope.items[i].name === $scope.name){
                participant_id = $scope.items[i].id;
                break;
            }
        }
        $scope.resetWithdrawEventParticipantFromLadderErrors();
        if(participant_id == 0){
            $scope.showWithdrawEventParticipantFromLadderErrors.noParticipant = true;
        }
        else{
            $scope.callSuccess = false;
            ladderModalService.withdrawParticipant($rootScope.selectedEvent.id, participant_id, $scope.withdraw_type).then(function(data){
                $scope.callSuccess = true;
                $scope.name="";
                getData();
                emailCancelledChallenges(data.users);
                if($rootScope.user.privilege === 'participant'){
                    $rootScope.toggleModal();
                }
            }, function(data){
                alert('Something went wrong. '+data.error);
            });
        }
    }

});
