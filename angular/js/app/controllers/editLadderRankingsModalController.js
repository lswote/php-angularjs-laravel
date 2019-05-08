teamsRIt.controller('editLadderRankingsModalController', function($scope, $rootScope, ladderModalService){

    $scope.showEditLadderRankingsErrors={
        username1: false,
        username2: false,
        usernamesIdentical: false,
        pairExists: false,
        valueOutOfRange: false
    };

    $scope.records = [];
    $scope.show_edit_ladder_rankings = true;
    $scope.show_drop_options = false;
    $scope.show_add_new = false;
    $scope.show_edit_rank = false;
    $scope.drop_data = {};
    $scope.withdraw_type="dropped";
    $scope.items=[];
    $scope.name1='';
    $scope.name2='';

    // Hide all add event leader errors
    $scope.resetEditLadderRankingsErrors=function(){
        for(var i in $scope.showEditLadderRankingsErrors){
            if($scope.showEditLadderRankingsErrors.hasOwnProperty(i)){
                $scope.showEditLadderRankingsErrors[i] = false;
            }
        }
    };

	// Get all matches for an event
	$scope.getData = function(){
		$scope.getDataInProgress = true;
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
    		ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
        		confirmed_participants = data.confirmed_participants.sort(function(obj1, obj2) {
            		return obj1.singles_ladder_ranking - obj2.singles_ladder_ranking;
        		});
                $scope.records = [];
                for(i = 0; i < confirmed_participants.length; i++){
                        participant = confirmed_participants[i];
                        $scope.records.push({'id': participant.id, 
                                              'index': i,
                                             'ladder_ranking': participant.singles_ladder_ranking, 
                                              'player': participant.first_name + ' ' + participant.last_name,
                                              'record': participant.wins + '-' + participant.loses,
                                              'drop_options': participant.in_challenge === false
                                             });
                }
    		}).finally(function(){
    		    $scope.getDataInProgress = false;
    		});
        }
        else{
    		ladderModalService.getActivePairs($rootScope.selectedEvent.id).then(function(data){
        		pairs = data.pairs.sort(function(obj1, obj2) {
            		return obj1.ladder_ranking - obj2.ladder_ranking;
        		});
                $scope.records = [];
                for(i = 0; i < pairs.length; i++){
                        pair = pairs[i];
                        user_one = pair.user_one.last_name;
                        user_two = pair.user_two.last_name;
                        $scope.records.push({'id': pair.id, 
                                             'index': i,
                                             'ladder_ranking': pair.ladder_ranking, 
                                              'player': user_one+'/'+user_two,
                                              'record': pair.wins + '-' + pair.loses,
                                              'drop_options': pair.in_challenge === false
                                             });
                }
    		}).finally(function(){
    		    $scope.getDataInProgress = false;
    		});
        }
	};
	$scope.getData();

    $scope.getIdFromName = function(name){
        for(var i=0; i < $scope.items.length; i++){
            if($scope.items[i]['name'] == name){
                return($scope.items[i]['id']);
            }
        }
        return -1;
    }

    $scope.showDropOptions = function(id, i){
        $scope.withdraw_type="dropped";
        $scope.drop_data_player = $scope.records[i].player;
        $scope.show_edit_ladder_rankings = false;
        $scope.show_drop_options = true;
        $scope.selected_id = id;
    }

    $scope.revertDisplay = function(){
        $scope.show_edit_ladder_rankings = true;
        $scope.show_drop_options = false;
        $scope.show_add_new = false;
        $scope.show_edit_rank = false;
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
        $scope.show_edit_ladder_rankings = true;
        $scope.show_drop_options = false;
    }

    $scope.addNewTeamMember = function(){
        $scope.show_edit_ladder_rankings = false;
        $scope.show_add_new = true;
        $scope.resetEditLadderRankingsErrors();

        $scope.getConfirmedParticipants = function(){
            ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
                for(var i=0; i < data.confirmed_participants.length; i++){
                    $scope.items.push({'name': data.confirmed_participants[i]['first_name']+' '+data.confirmed_participants[i]['last_name'],
                                       'id': data.confirmed_participants[i]['id']});
                }
            });
        }
        $scope.getConfirmedParticipants();
    }

    $scope.editRank = function(index){
        possible_ladder_rankings = [];
        for (i = 0; i < $scope.records.length; i++){
            possible_ladder_rankings.push($scope.records[i].ladder_ranking.toString());
        }
        $scope.ladder_rankings = {
            player: $scope.records[index].player,
            ladder_ranking: $scope.records[index].ladder_ranking.toString(),
            old_rank: $scope.records[index].ladder_ranking.toString(),
            min_rank: $scope.records[0].ladder_ranking,
            max_rank: $scope.records[$scope.records.length-1].ladder_ranking,
            possible_ladder_rankings: possible_ladder_rankings
        }
        $scope.show_edit_ladder_rankings = false;
        $scope.show_edit_rank = true;
    }

    $scope.saveModifiedData = function(){
        data = [];
        for(i = 0; i < $scope.records.length; i++){
            data.push({'id': $scope.records[i].id,
                       'ladder_ranking': $scope.records[i].ladder_ranking});
        }
        if($rootScope.selectedEvent.event_sub_type === 'singles'){
            ladderModalService.updateParticipants($rootScope.selectedEvent.id, data).then(function(data){
            }, function(data){
                alert('Something went wrong. '+data.error); 
            });  
        }
        else{
            ladderModalService.updatePairs($rootScope.selectedEvent.id, data).then(function(data){ 
            }, function(data){
                alert('Something went wrong. '+data.error); 
            }); 
        }
    }

    $scope.changeRankings = function(old_ladder_ranking){
        new_ladder_ranking = parseInt($scope.ladder_rankings.ladder_ranking);
        if (old_ladder_ranking == new_ladder_ranking){
            $scope.revertDisplay();
            return;
        }
        first_record = 0;
        last_ladder_ranking = 0;
        last_index = 0;
        if(old_ladder_ranking < new_ladder_ranking){
            // sort from top down
            for (i = 0; i < $scope.records.length; i++){
                record = $scope.records[i];
                if(old_ladder_ranking == record.ladder_ranking){
                    last_ladder_ranking = record.ladder_ranking;
                    last_index = record.index;
                    first_record = record;
                }
                else if((old_ladder_ranking < record.ladder_ranking) && (new_ladder_ranking >= record.ladder_ranking)){
                    temp = record.ladder_ranking;
                    record.ladder_ranking = last_ladder_ranking;
                    last_ladder_ranking = temp;
                    temp = record.index;
                    record.index = last_index;
                    last_index = temp
                }
            }
            first_record.ladder_ranking = last_ladder_ranking;
            first_record.index = last_index;
        }
        else{ //(old_ladder_ranking > new_ladder_ranking)
            // sort from bottom up
            for (i = $scope.records.length-1; i >= 0; i--){
                record = $scope.records[i];
                if(record.ladder_ranking == old_ladder_ranking){
                    last_ladder_ranking = record.ladder_ranking;
                    last_index = record.index;
                    first_record = record;
                }
                else if((record.ladder_ranking < old_ladder_ranking) && (record.ladder_ranking >= new_ladder_ranking)){
                    temp = record.ladder_ranking;
                    record.ladder_ranking = last_ladder_ranking;
                    last_ladder_ranking = temp;
                    temp = record.index;
                    record.index = last_index;
                    last_index = temp
                }
            }
            first_record.ladder_ranking = last_ladder_ranking;
            first_record.index = last_index;
        }
        new_records = $scope.records.sort(function(obj1, obj2) {
            return obj1.ladder_ranking - obj2.ladder_ranking;
        });
		$scope.records = new_records;
        $scope.revertDisplay();
		$scope.saveModifiedData();
    }

    $scope.addNewTeamToLadder = function(){

        $scope.resetEditLadderRankingsErrors();
        if($scope.name1 == ""){
            $scope.showEditLadderRankingsErrors.username1 = true;
        }
        if($scope.name2 == ""){
            $scope.showEditLadderRankingsErrors.username2 = true;
        }
        else if($scope.name1 == $scope.name2){
            $scope.showEditLadderRankingsErrors.usernamesIdentical = true;
        }
        var userId1 = $scope.getIdFromName($scope.name1);
        if(userId1 == -1){
            $scope.showEditLadderRankingsErrors.username1 = true;
        }
        var userId2 = $scope.getIdFromName($scope.name2);
        if(userId2 == -1){
            $scope.showEditLadderRankingsErrors.username2 = true;
        }
		$scope.callSuccess = false;
        if((userId1 != userId2) && (userId1 != -1) && (userId2 != -1)){
            ladderModalService.addPair($rootScope.selectedEvent.id, userId1, userId2).then(function(data){
                $scope.callSuccess = true;
                $scope.name1="";
                $scope.name2="";
	            $scope.getData();
            }, function(data){
                if(data.error === 'Pair exists'){
                    $scope.showEditLadderRankingsErrors.pairExists = true;
                }
                else{
                    alert('Something went wrong. '+data.error);
                }
            });
        }
    }

});
