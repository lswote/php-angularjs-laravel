teamsRIt.controller('viewTeamRosterMultiModalController', function($scope, $rootScope, multiModalService){

	$scope.male_participants=[];
	$scope.female_participants=[];

	getConfirmedParticipants = function(){
		$scope.getParticipantsInProgress = true;
		multiModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
			males = [];
			females = [];
			for(var i=0; i < data.participants.users.length; i++){
				if(data.participants.users[i].sex === 'male'){
					males.push({'name': data.participants.users[i].last_name + ', ' + data.participants.users[i].first_name,
							   'gender': data.participants.users[i].sex,
							   'username': data.participants.users[i].username,
							   'email': data.participants.users[i].email,
							   'phone': data.participants.users[i].phone});
				}
				else{
					females.push({'name': data.participants.users[i].last_name + ', ' + data.participants.users[i].first_name,
								  'gender': data.participants.users[i].sex,
								  'username': data.participants.users[i].username,
								  'email': data.participants.users[i].email,
								  'phone': data.participants.users[i].phone});
				}
			}
			$scope.male_participants = males;
			$scope.female_participants = females;
		}).finally(function(){
			$scope.getParticipantsInProgress = false;
		});
	}   
	getConfirmedParticipants();

});
