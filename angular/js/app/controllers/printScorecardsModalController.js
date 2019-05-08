teamsRIt.controller('printScorecardsModalController', function($scope, $rootScope, $window, printScorecardsModalService, matchLineTimesModalService, helperService){

	// Default values
	$scope.printScorecardsObject = {
		roundDate: null,
		size: 'small'
	};

	// Parse our scope.matches array
	$scope.parseMatches = function(){
		$scope.roundDates = [];
		for(var i = 0; i < $scope.matches.length; i++){
			$scope.matches[i].event_surface_number = $scope.matches[i].event_surface_number !== null ? String($scope.matches[i].event_surface_number) : '';
			if(helperService.findArrayIndex($scope.roundDates, 'number', $scope.matches[i].round) === false){
				$scope.roundDates.push({
					number: $scope.matches[i].round,
					date: $scope.matches[i].date
				});
			}
		}
		var index = helperService.findArrayIndex($scope.roundDates, 'number', 1);
		$scope.printScorecardsObject.roundDate = $scope.roundDates[index]['date'];
	};

	// Get all matches
	$scope.getMatches = function(){
		matchLineTimesModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
			$scope.matches = data.matches;
			$scope.parseMatches();
		});
	};
	if($rootScope.selectedEvent.event_type === 'league' || $rootScope.selectedEvent.event_type === 'round robin'){
		$scope.getMatches();
	}

	// Generates a scorecard
	$scope.generateScorecard = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		printScorecardsModalService.generateScorecard($rootScope.selectedEvent.id, $scope.printScorecardsObject.size, $scope.printScorecardsObject.roundDate).then(function(data){
			var file = new Blob([data], {
				type: 'application/pdf'
			});
			var url = URL.createObjectURL(file);
			$window.open(url);
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Could not generate scorecard');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Custom round sort by method
	$scope.orderRounds = function(round){
		if(round.number > 0){
			return round.number;
		}
		else{
			return 100 + -round.number;
		}
	};

	// Make available helper function in scope
	$scope.formatDate = helperService.formatDate;

});