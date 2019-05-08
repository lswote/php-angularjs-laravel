teamsRIt.controller('downloadParticipantsImportModalController', function($scope, $rootScope, $window){

	// Download our template file
	$scope.downloadParticipantsImport = function(){
		$scope.callInProgress = true;
		$window.open('https://s3.amazonaws.com/teams-r-it-templates/import-event-participants.csv');
		$rootScope.toggleModal();
	};

});