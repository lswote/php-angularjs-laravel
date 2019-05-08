teamsRIt.controller('waitlistedParticipantsModalController', function($scope, $rootScope, waitlistedParticipantsModalService, eventLinesService, helperService){

	// Get our users' rankings for this activity at our facility
	$scope.getParticipantsRankings = function(){
		eventLinesService.getParticipantsRankings($scope.selectedEvent.activity_id, $scope.selectedEvent.facility_id).then(function(data){
			$scope.participantRankings = data.participants_rankings;
		});
	};
	$scope.getParticipantsRankings();

	// Get all waitlisted participants
	$scope.getWaitlistedParticipants = function(){
		$scope.getWaitlistedParticipantsInProgress = true;
		waitlistedParticipantsModalService.getWaitlistedParticipants($rootScope.selectedEvent.id).then(function(data){
			$scope.waitlistedParticipants = data.waitlisted_participants;
		}).finally(function(){
			$scope.getWaitlistedParticipantsInProgress = false;
		});
	};
	$scope.getWaitlistedParticipants();

	// Bring method into scope
	$scope.findArrayIndex = helperService.findArrayIndex;

});