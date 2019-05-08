teamsRIt.controller('withdrawChallengesLadderModalController', function($scope, $rootScope, $window, ladderModalService){

    $scope.accepted=[];
	$scope.getChallengesInProgress = false;

    getChallenges = function(){
		$scope.getChallengesInProgress = true;
        ladderModalService.getChallenges($rootScope.selectedEvent.id, ($rootScope.user.privilege === 'participant') ? $rootScope.user.id : 0).then(function(data){
            for(var i=0; i < data.challenges.length; i++){
                if(data.challenges[i].played_date != null){
                    continue;
                }
                if($rootScope.selectedEvent.event_sub_type === 'singles'){
                    $scope.accepted.push({'challenger': data.challenges[i].challenger.first_name + " " +
                                                        data.challenges[i].challenger.last_name,
                                          'challengee': data.challenges[i].challengee.first_name + " " +
                                                        data.challenges[i].challengee.last_name,
                                          'id': data.challenges[i].id,
                                          'show_accept_by': data.challenges[i].accepted_date == null ? true : false,
                                          'accept_by_date': data.challenges[i].accept_by_date,
                                          'show_play_by': data.challenges[i].accepted_date == null ? false : true,
                                          'play_by_date': data.challenges[i].play_by_date,
                                          'show': true});
                }
                else{
                    $scope.accepted.push({'challenger': data.challenges[i].challenger[0].first_name + " " +
                                                        data.challenges[i].challenger[0].last_name + "/" +
                                                        data.challenges[i].challenger[1].first_name + " " +
                                                        data.challenges[i].challenger[1].last_name,
                                          'challengee': data.challenges[i].challengee[0].first_name + " " +
                                                        data.challenges[i].challengee[0].last_name + "/" +
                                                        data.challenges[i].challengee[1].first_name + " " +
                                                        data.challenges[i].challengee[1].last_name,
                                          'id': data.challenges[i].id,
                                          'show_accept_by': data.challenges[i].play_by_date == null ? true : false,
                                          'accepted_by_date': data.challenges[i].accept_by_date,
                                          'show_play_by': data.challenges[i].play_by_date == null ? false : true,
                                          'play_by_date': data.challenges[i].play_by_date,
                                          'show': true});
                }
            }
		}).finally(function(){
			$scope.getChallengesInProgress = false;
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

    $scope.confirmAcceptedDelete = function(i){
        if($window.confirm("Delete challenge: "+$scope.sorted_accepted[i].challenger+" vs "+
                                                $scope.sorted_accepted[i].challengee+"?")){
            $scope.sorted_accepted[i].show = false;
            ladderModalService.deleteChallenge($rootScope.selectedEvent.id, $scope.sorted_accepted[i].id).then(function(data){
                emailCancelledChallenges(data.users);
            });

        }
    }

});
