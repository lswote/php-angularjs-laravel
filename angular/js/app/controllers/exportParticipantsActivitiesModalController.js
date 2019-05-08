teamsRIt.controller('exportParticipantsActivitiesModalController', function($scope, $rootScope, exportParticipantsActivitiesModalService){

	// Download our exported participants activities file
	$scope.exportParticipantsActivities = function(){
		$scope.callInProgress = true;
		exportParticipantsActivitiesModalService.download();
		$rootScope.toggleModal();
	};

});