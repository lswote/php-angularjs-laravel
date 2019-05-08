teamsRIt.controller('viewMatchScheduleModalController', function($scope, $rootScope, multiModalService){

	var getName = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return $scope.opponents[i].name + '\n' +
					$scope.opponents[i].address + '\n' +
					$scope.opponents[i].city + ', ' +
					$scope.opponents[i].state + ' ' +
					$scope.opponents[i].zip;
			}
		}
		return '';
	};

	var getDirections = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return $scope.opponents[i].directions;
			}
		}
		return '';
	};

	var getUrl = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return encodeURI('https://www.google.com/maps/search/?api=1&query='+$scope.opponents[i].address+' '+$scope.opponents[i].city+' '+$scope.opponents[i].state+' '+$scope.opponents[i].state+' '+$scope.opponents[i].zip).replace(/%20/g,'+');
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
						directions: data.matches[i].multi_opponent_facility_id ? getDirections(data.matches[i].multi_opponent_facility_id) : '',
						url: getUrl(data.matches[i].multi_opponent_facility_id)
					});
				}
			});
		});
	};  
	$scope.getData();

});