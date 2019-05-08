teamsRIt.controller('editRoundDatesModalController', function($scope, $rootScope, $window, editRoundDatesModalService, matchLineTimesModalService, helperService){

	// Parse our scope.matches array
	$scope.parseMatches = function(){
		$scope.rounds = [];
		for(var i = 0; i < $scope.matches.length; i++){
			$scope.matches[i].event_surface_number = $scope.matches[i].event_surface_number !== null ? String($scope.matches[i].event_surface_number) : '';
			if(helperService.findArrayIndex($scope.rounds, 'number', $scope.matches[i].round) === false){
				$scope.rounds.push({
					number: $scope.matches[i].round,
					date: $scope.matches[i].date,
					dateObject: $scope.matches[i].date + 'T12:00:00Z'
				});
			}
		}
	};

	// Get all matches
	$scope.getMatches = function(){
		matchLineTimesModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
			$scope.matches = data.matches;
			$scope.parseMatches();
		});
	};
	$scope.getMatches();

	// Custom round sort by method
	$scope.orderRounds = function(round){
		if(round.number > 0){
			return round.number;
		}
		else{
			return 100 + -round.number;
		}
	};

	// Update the dates associated with each round in our event
	$scope.updateRoundDates = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		editRoundDatesModalService.updateRoundDates($rootScope.selectedEvent.id, $scope.rounds).then(function(){
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Round updates not applied');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});