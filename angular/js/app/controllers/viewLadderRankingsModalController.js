teamsRIt.controller('viewLadderRankingsModalController', function($scope, $rootScope, ladderModalService){

    $scope.records = [];
    $scope.show_view_rankings = true;
    $scope.show_drop_options = false;
    $scope.data = [];
    $scope.drop_data = {};
    $scope.withdraw_type="dropped";
	// Get all matches for an event
	$scope.getData = function(){
		$scope.getDataInProgress = true;
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
    		ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
                $scope.data = angular.copy(data);
                $scope.records = [];
                for(i = 0; i < data.confirmed_participants.length; i++){
                        participant = data.confirmed_participants[i];
                        $scope.records.push({'id': participant.id, 
                                              'index': i,
                                             'ranking': participant.singles_ladder_ranking, 
                                              'player': participant.first_name + ' ' + participant.last_name,
                                              'record': participant.wins + '-' + participant.loses,
                                              'drop_options': participant.in_challenge === false && $rootScope.user.id === participant.id
                                             });
               }
    		}).finally(function(){
    		    $scope.getDataInProgress = false;
    		});
        }
        else{
    		ladderModalService.getActivePairs($rootScope.selectedEvent.id).then(function(data){
                $scope.data = angular.copy(data);
                $scope.records = [];
                for(i = 0; i < data.pairs.length; i++){
                        pair = data.pairs[i];
                        user_one = pair.user_one.last_name;
                        user_two = pair.user_two.last_name;
                        $scope.records.push({'id': pair.id, 
                                             'index': i,
                                             'ranking': pair.ladder_ranking, 
                                              'player': user_one+'/'+user_two,
                                              'record': pair.wins + '-' + pair.loses,
                                              'drop_options': pair.in_challenge === false && ($rootScope.user.id ==- pair.user_one.id || $rootScope.user.id === pair.user_two.id)
                                             });
                }
    		}).finally(function(){
    		    $scope.getDataInProgress = false;
    		});
        }
	};
	$scope.getData();

    $scope.showDropOptions = function(id, i){
        $scope.withdraw_type="dropped";
        $scope.drop_data_player = $scope.records[i].player;
        $scope.show_view_rankings = false;
        $scope.show_drop_options = true;
        $scope.selected_id = id;
    }

    $scope.toggleDisplays = function(){
        temp = $scope.show_view_rankings;
        $scope.show_view_rankings = $scope.show_drop_options;
        $scope.show_drop_options = temp;
    }

    $scope.withdrawTeamFromLadder = function(){
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            ladderModalService.withdrawParticipant($rootScope.selectedEvent.id, $scope.selected_id, $scope.withdraw_type).then(function(data){
	        $scope.getData();
            }, function(data){
                alert('Something went wrong. '+data.error);
            });
        }
        else{
            ladderModalService.withdrawPairs($rootScope.selectedEvent.id, [$scope.selected_id], $scope.withdraw_type).then(function(data){
	        $scope.getData();
            }, function(data){
                alert('Something went wrong. '+data.error);
            });
        }
        $scope.show_view_rankings = true;
        $scope.show_drop_options = false;
    }

});
