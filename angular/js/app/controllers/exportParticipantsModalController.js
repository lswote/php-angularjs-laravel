teamsRIt.controller('exportParticipantsModalController', function($scope, $rootScope, exportParticipantsModalService){

	// Download our exported participants file
	$scope.exportObject = {
		gender: 'both',
		membership: 'both',
		age: 'both',
		status: 'both',
		affiliation: 'all',
		affiliationValue: ''
	};

	// Reset affiliation choice
	$scope.clearAffiliation  = function(){
		$scope.exportObject.affiliation = '';
	};

	// Export participants
	$scope.exportParticipants = function(){
		$scope.callInProgress = true;
		if($rootScope.exportType === 'facility'){
			exportParticipantsModalService.downloadFacility($rootScope.facility.id, $scope.exportObject);
		}
		else{
			exportParticipantsModalService.downloadEvent($rootScope.selectedEvent.id, $scope.exportObject);
		}
		$rootScope.toggleModal();
	}

});