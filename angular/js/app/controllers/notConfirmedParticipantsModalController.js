teamsRIt.controller('notConfirmedParticipantsModalController', function($scope, $rootScope, notConfirmedParticipantsModalService){

	// Get all non-confirmed participants
	$scope.getNotConfirmedParticipants = function(){
		$scope.getNotConfirmedParticipantsInProgress = true;
		notConfirmedParticipantsModalService.getNotConfirmedParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.notConfirmedParticipants = data.unconfirmed_participants;
		}).finally(function(){
			$scope.getNotConfirmedParticipantsInProgress = false;
		});
	};
	$scope.getNotConfirmedParticipants();

});