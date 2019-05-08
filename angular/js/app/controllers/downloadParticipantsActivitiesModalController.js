teamsRIt.controller('downloadParticipantsActivitiesModalController', function($scope, $rootScope, $window){

	// Download our template file
	$scope.downloadParticipantsActivities = function(){
		$scope.callInProgress = true;
		$window.open('https://s3.amazonaws.com/teams-r-it-templates/import-participant-activities.csv');
		$rootScope.toggleModal();
	};

});