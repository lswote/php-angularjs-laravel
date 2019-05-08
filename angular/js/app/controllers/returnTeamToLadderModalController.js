teamsRIt.controller('returnTeamToLadderModalController', function($scope, $rootScope, $window, ladderModalService){

    $scope.accepted=[];
	$scope.getDataInProgress = false;
    $scope.records = [];

    getdata = function(){
        if ($rootScope.selectedEvent.event_sub_type === 'singles'){
		    $scope.getDataInProgress = true;
            ladderModalService.getWithdrawnParticipants($rootScope.selectedEvent.id, ($rootScope.user.privilege === 'participant') ? $rootScope.user.id : 0).then(function(data){
                $scope.records = [];
                for (i = 0; i < data.participants.users.length; i++){
                    name = data.participants.users[i].first_name + ' ' +
                           data.participants.users[i].last_name;
                    $scope.records.push({'player': name,
                                         'id': data.participants.users[i].id});
                }
            }, function(data){
		    }).finally(function(){
			    $scope.getDataInProgress = false;
		    });
        }   
        else{
		    $scope.getDataInProgress = true;
            ladderModalService.getWithdrawnPairs($rootScope.selectedEvent.id, ($rootScope.user.privilege === 'participant') ? $rootScope.user.id : 0).then(function(data){
                $scope.records = [];
                for (i = 0; i < data.pairs.length; i++){
                    name = data.pairs[i].user_one.last_name + '/' +
                           data.pairs[i].user_two.last_name;
                    $scope.records.push({'player': name,
                                         'id': data.pairs[i].id});
                }
            }, function(data){
                alert('Something went wrong. '+data.error);
            }).finally(function(){
			    $scope.getDataInProgress = false;
            }); 

        }
    }
    getdata();

    $scope.confirmReturnToLadder = function(i){
        if($window.confirm("Return team "+$scope.sorted_records[i].player+' to ladder '+$rootScope.selectedEvent.name+'?')){
            if ($rootScope.selectedEvent.event_sub_type === 'singles'){
                ladderModalService.returnParticipant($rootScope.selectedEvent.id, $scope.sorted_records[i].id).then(function(data){
                    getdata();
                }, function(data){
                    alert('Something went wrong. '+data.error);
                }); 
            }
            else{
                ladderModalService.returnPair($rootScope.selectedEvent.id, $scope.sorted_records[i].id).then(function(data){
                    getdata();
                }, function(data){
                    alert('Something went wrong. '+data.error);
                }); 
            }
        }
    }

});
