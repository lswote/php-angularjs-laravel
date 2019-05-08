teamsRIt.controller('addEventTeamToLadderModalController', function($scope, $http, $rootScope, $location, ladderModalService, dashboardService){

	$scope.showAddEventTeamToLadderErrors = {
		username1: false,
		username2: false,
		usernamesIdentical: false,
		pairExists: false
	};

	// needed for typeahead widget
	$scope.items = [];
	$scope.name1 = "";
	$scope.name2 = "";

	// Hide all add event leader errors
	$scope.resetAddEventTeamToLadderErrors = function(){
		for(var i in $scope.showAddEventTeamToLadderErrors){
			if($scope.showAddEventTeamToLadderErrors.hasOwnProperty(i)){
				$scope.showAddEventTeamToLadderErrors[i] = false;
			}
		}
	};

	$scope.getRecipients = function(){
		dashboardService.getFacilityInfo($location.search().id).then(function(data){
			for(var i = 0; i < data.facility.users.length; i++){
				$scope.items.push({
					'name': data.facility.users[i]['first_name'] + ' ' + data.facility.users[i]['last_name'],
					'id': data.facility.users[i]['id']
				});
			}
		});
	};

	// Get our default recipients depending on the type of e-mail we are sending
	$scope.getConfirmedParticipants = function(){
		ladderModalService.getConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.recipients = angular.copy(data.confirmed_participants);
			for(var i = 0; i < data.confirmed_participants.length; i++){
				$scope.items.push({
					'name': data.confirmed_participants[i]['first_name'] + ' ' + data.confirmed_participants[i]['last_name'],
					'id': data.confirmed_participants[i]['id']
				});
			}
		});
	};
	$scope.getConfirmedParticipants();

	$scope.getIdFromName = function(name){
		for(var i = 0; i < $scope.items.length; i++){
			if($scope.items[i]['name'] == name){
				return ($scope.items[i]['id']);
			}
		}
		return -1;
	};

	$scope.itemClick = function(){
		$scope.callSuccess = false;
		$scope.resetAddEventTeamToLadderErrors();
	};

	$scope.addTeamToLadderExit = function(){
		$scope.addTeamToLadder(true);
	};

	$scope.addTeamToLadder = function(close){
		if(!close){
			close = false;
		}
		error = false;
		$scope.resetAddEventTeamToLadderErrors();
		if($scope.name1 == ""){
			error = $scope.showAddEventTeamToLadderErrors.username1 = true;
		}
		if($scope.name2 == ""){
			error = $scope.showAddEventTeamToLadderErrors.username2 = true;
		}
		else if($scope.name1 == $scope.name2){
			error = $scope.showAddEventTeamToLadderErrors.usernamesIdentical = true;
		}
		var userId1 = $scope.getIdFromName($scope.name1);
		if(userId1 == -1){
			error = $scope.showAddEventTeamToLadderErrors.username1 = true;
		}
		var userId2 = $scope.getIdFromName($scope.name2);
		if(userId2 == -1){
			error = $scope.showAddEventTeamToLadderErrors.username2 = true;
		}
		$scope.callSuccess = false;
		if((userId1 != userId2) && (userId1 != -1) && (userId2 != -1)){
			ladderModalService.addPair($rootScope.selectedEvent.id, userId1, userId2).then(function(){
				$scope.callSuccess = true;
				$scope.name1 = "";
				$scope.name2 = "";
			}, function(data){
				if(data.error === 'Pair exists'){
					error = $scope.showAddEventTeamToLadderErrors.pairExists = true;
				}
				else{
					alert('Something went wrong. ' + data.error);
					error = true;
				}
			}).finally(function(){
				if((error == false) && close){
					$scope.toggleModal();
				}
			});
		}
		else{
			if((error == false) && close){
				$scope.toggleModal();
			}
		}
	}

});
