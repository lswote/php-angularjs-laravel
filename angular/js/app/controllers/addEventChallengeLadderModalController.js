teamsRIt.controller('addEventChallengeLadderModalController', function($scope, $http, $rootScope, $location, ladderModalService, dashboardService){

    $scope.showAddEventTeamToLadderErrors={
        username1: false,
        username2: false,
        usernamesIdentical: false,
        userOnTwoTeams: false,
        createFailed: false
    };
    $scope.create_failure_reason = '';

    // in participant mode
    // items1 is a list that only contains names the participant can see.
    $scope.items1=[];
    $scope.items2=[];

    if($rootScope.selectedEvent.event_sub_type === 'singles'){
        $scope.prompt1 = 'Player #1';
        $scope.prompt2 = 'Player #2';
    }
    else{
        $scope.prompt1 = 'Team #1';
        $scope.prompt2 = 'Team #2';
    }

    $scope.name1_disabled="";
    $scope.user_name = $rootScope.user.first_name+' '+$rootScope.user.last_name;
    if($rootScope.user.privilege === 'participant'){
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            // disable the typeahead widget
            $scope.name1_disabled="1";
        }
        else {
            $scope.prompt1 = 'Team #1 you are on';
        }
    }

    setNames = function(){
        $scope.name1="";
        $scope.name2="";
        if($rootScope.user.privilege === 'participant'){
            if($rootScope.selectedEvent.event_sub_type === 'singles'){
                $scope.name1 = $scope.user_name;
            }
            else{
                if($scope.items1.length > 0){
                    $scope.name1 = $scope.items1[0].name;
                }
            }
        }
    }
    setNames();

    // Hide all add event leader errors
    $scope.resetAddEventTeamToLadderErrors=function(){
		$scope.callSuccess = false;
        for(var i in $scope.showAddEventTeamToLadderErrors){
            if($scope.showAddEventTeamToLadderErrors.hasOwnProperty(i)){
                $scope.showAddEventTeamToLadderErrors[i] = false;
            }
        }
    };

    if($rootScope.selectedEvent.event_sub_type === 'singles'){
        // Get our recipients
        $scope.getConfirmedParticipants = function(){
            ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
                $scope.recipients = angular.copy(data.confirmed_participants);
                for(var i=0; i < data.confirmed_participants.length; i++){
                    name = data.confirmed_participants[i]['first_name']+' '+data.confirmed_participants[i]['last_name'];
                    // only add the participants name
                    if(($rootScope.user.privilege !== 'participant') ||
                       (name.indexOf($scope.user_name) > -1)){
                        $scope.items1.push({'name': name,
                                            'id': data.confirmed_participants[i]['id']});
                    }
                    $scope.items2.push({'name': name,
                                        'id': data.confirmed_participants[i]['id']});
                }
            });
        }
        $scope.getConfirmedParticipants();
    }
    else{
        $scope.getPairs = function(){
            ladderModalService.getPairs($rootScope.selectedEvent.id).then(function(data){
                $scope.recipients = angular.copy(data.pairs);
                for(var i=0; i < data.pairs.length; i++){
                    name = data.pairs[i]['user_one']['first_name']+' '+data.pairs[i]['user_one']['last_name'];
                    name += '/';
                    name += data.pairs[i]['user_two']['first_name']+' '+data.pairs[i]['user_two']['last_name'];
                    // only add teams the participant is on
                    if(($rootScope.user.privilege !== 'participant') ||
                       (name.indexOf($scope.user_name) > -1)){
                        $scope.items1.push({'name': name,
                                            'id': data.pairs[i]['id']});
                    }
                    $scope.items2.push({'name': name,
                                        'id': data.pairs[i]['id']});
                }
                setNames();
            });
        }
        $scope.getPairs();
    }

    getIdFromName=function(name){
        for(var i=0; i < $scope.items2.length; i++){
            if($scope.items2[i]['name'] == name){
                return($scope.items2[i]['id']);
            }
        }
        return -1;
    }

    doubleTeaming=function(team1, team2){
        id1 = getIdFromName(team1);
        id2 = getIdFromName(team2);
        names = [];
        for(var i=0; i < $scope.recipients.length; i++){
            if(id1 === $scope.recipients[i]['id']){
                names[$scope.recipients[i]['user_one']['first_name']+' '+$scope.recipients[i]['user_one']['last_name']] = 1;
                names[$scope.recipients[i]['user_two']['first_name']+' '+$scope.recipients[i]['user_two']['last_name']] = 1;
            }
            else if(id2 === $scope.recipients[i]['id']){
                names[$scope.recipients[i]['user_one']['first_name']+' '+$scope.recipients[i]['user_one']['last_name']] = 1;
                names[$scope.recipients[i]['user_two']['first_name']+' '+$scope.recipients[i]['user_two']['last_name']] = 1;
            }
        }
        if(Object.keys(names).length < 4){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.addTeamToLadder=function(){
        $scope.resetAddEventTeamToLadderErrors();
        if($scope.name1 == ""){
            $scope.showAddEventTeamToLadderErrors.username1 = true;
        }
        if($scope.name2 == ""){
            $scope.showAddEventTeamToLadderErrors.username2 = true;
        }
        else if($scope.name1 == $scope.name2){
            $scope.showAddEventTeamToLadderErrors.usernamesIdentical = true;
            return;
        }
        else if (($rootScope.selectedEvent.event_sub_type !== 'singles') &&
                 (doubleTeaming($scope.name1, $scope.name2))){
            $scope.showAddEventTeamToLadderErrors.userOnTwoTeams = true;
            return;
        }
        var userId1 = getIdFromName($scope.name1);
        if(userId1 == -1){
            $scope.showAddEventTeamToLadderErrors.username1 = true;
        }
        var userId2 = getIdFromName($scope.name2);
        if(userId2 == -1){
            $scope.showAddEventTeamToLadderErrors.username2 = true;
        }
		$scope.callSuccess = false;
        if((userId1 != userId2) && (userId1 != -1) && (userId2 != -1)){
            ladderModalService.addChallenge($rootScope.selectedEvent.id, userId1, userId2).then(function(data){
                $scope.callSuccess = true;
                setNames();
            }, function(data){
                $scope.create_failure_reason = data.error;
                $scope.showAddEventTeamToLadderErrors.createFailed = true;
            });
        }
    }

});
