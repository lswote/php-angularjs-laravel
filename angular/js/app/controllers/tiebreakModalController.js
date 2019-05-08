teamsRIt.controller('tiebreakModalController', function($scope, $rootScope, tiebreakModalService){

	// Get teams with loss stats
	$scope.getTeamsWithStats = function(){
		$scope.getTeamsInProgress = true;
		tiebreakModalService.getTeamsWithStats($rootScope.selectedEvent.id).then(function(data){
			$scope.teams = data.teams;
		}).finally(function(){
			$scope.getTeamsInProgress= false;
		});
	};
	$scope.getTeamsWithStats();

});