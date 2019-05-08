teamsRIt.controller('printMatchDirectionsModalController', function($scope, $rootScope, $window, multiModalService, matchLineTimesModalService, helperService){

	// Default values
	$scope.printMatchDirectionsObject = {
		size: 'small'
	};

	// Object that determines which input error to show
	$scope.showPrintMatchDirectionsErrors = {
		noCheckbox: false
	};

	// Hide all add event participant errors
	$scope.resetPrintMatchDirectionsErrors = function(){
		for(var i in $scope.showPrintMatchDirectionsErrors){
			if($scope.showPrintMatchDirectionsErrors.hasOwnProperty(i)){
				$scope.showPrintMatchDirectionsErrors[i] = false;
			}
		}
		$scope.callSuccess = false;
	};

	var getName = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return $scope.opponents[i].name + ' - ' +
					$scope.opponents[i].city + ', ' +
					$scope.opponents[i].state;
			}
		}
		return '';
	};

	$scope.getData = function(){
		multiModalService.getDirections($rootScope.selectedEvent.id).then(function(data){
			$scope.opponents = angular.copy(data.directions);
			multiModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
				$scope.matches = [];
				for(i = 0; i < data.matches.length; i++){
					$scope.matches.push({
						index: i,
						round: data.matches[i].round,
						date: data.matches[i].date,
						opponent: data.matches[i].multi_opponent_facility_id ? getName(data.matches[i].multi_opponent_facility_id) : '',
						where: data.matches[i].home_away,
						value: false,
						selected: false
					});
				}
			});
		});
	};  
	$scope.getData();

	// Generates match directions
	$scope.generateMatchDirections = function(){
		rounds = [];
		for(i = 0; i < $scope.matches.length; i++){
			if($scope.matches[i].selected){
				rounds.push($scope.matches[i].round);
			}
		}
		if(rounds.length === 0){
			$scope.showPrintMatchDirectionsErrors.noCheckbox = true;
			return;
		}
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		multiModalService.generateMatchDirections($rootScope.selectedEvent.id, $scope.printMatchDirectionsObject.size, rounds).then(function(data){
			var file = new Blob([data], {
				type: 'application/pdf'
			});
			var url = URL.createObjectURL(file);
			$window.open(url);
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Could not generate map directions');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

	// Make available helper function in scope
	$scope.formatDate = helperService.formatDate;

});