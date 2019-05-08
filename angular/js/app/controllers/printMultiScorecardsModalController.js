teamsRIt.controller('printMultiScorecardsModalController', function($scope, $rootScope, $window, multiModalService, helperService){

	// Default values
	$scope.printMultiScorecardsObject = {
		round: null,
		size: 'small'
	};

	getName = function(id){
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
				for(var i = 0; i < data.matches.length; i++){
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
				if($scope.matches.length > 0){
					$scope.printMultiScorecardsObject.round = $scope.matches[0].round;
				}
			});
		});
	};  
	$scope.getData();

	getDate = function(round){
		for(var i = 0; i < $scope.matches.length; i++){
			if($scope.matches[i].round === parseInt(round)){
				return $scope.matches[i].date;
			}
		}
		return null;
	};

	$scope.generateScorecard = function(){
		$scope.callInProgress = true;
		multiModalService.generateScorecard($rootScope.selectedEvent.id, $scope.printMultiScorecardsObject.size, $scope.printMultiScorecardsObject.round, getDate($scope.printMultiScorecardsObject.round)).then(function(data){
			var blob = new Blob([data], {
				type: 'application/pdf'
			});
			if(navigator.vendor.indexOf("Apple Computer, Inc.") != -1){
				var reader = new FileReader();
				reader.onload = function(e){
					$window.location.href = reader.result;
				}
				reader.readAsDataURL(blob)
			}
			else{
				var url = URL.createObjectURL(blob);
				$window.open(url);
			}
		}, function(){
			$window.alert('Something went wrong.  Could not generate scorecard');
		}).finally(function(){
			$scope.toggleModal();
			$scope.callInProgress = false;
		});
	};

	// Make available helper function in scope
	$scope.formatDate = helperService.formatDate;

});