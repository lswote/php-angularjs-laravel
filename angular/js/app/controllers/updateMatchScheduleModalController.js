teamsRIt.controller('updateMatchScheduleModalController', function($scope, $rootScope, multiModalService){

	$scope.callSuccess = false;

	// Object that determines which add event participant input error to show
	$scope.showUpdateMatchScheduleErrors = {
		bothNeedSelecting: false
	};
	$scope.round = '';

	// Hide all add event participant errors
	$scope.resetUpdateMatchScheduleErrors = function(){
		for(var i in $scope.showUpdateMatchScheduleErrors){
			if($scope.showUpdateMatchScheduleErrors.hasOwnProperty(i)){
				$scope.showUpdateMatchScheduleErrors[i] = false;
			}
		}
		$scope.callSuccess = false;
	};

	var getName = function(id){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(id === $scope.opponents[i].id){
				return $scope.opponents[i].display;
			}
		}
		return '';
	};

	var getId = function(name){
		for(var i = 0; i < $scope.opponents.length; i++){
			if(name === $scope.opponents[i].display){
				return $scope.opponents[i].id;
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

	$scope.getData = function(){
		multiModalService.getDirections($rootScope.selectedEvent.id).then(function(data){
			opponents = [];
			for(i = 0; i < data.directions.length; i++){
				opponents.push(data.directions[i]);
				// since there might be more than one location with the same
				// name, include city and state as part of displayed name
				// so that the correct location can be identified.
				opponents[i]['display'] = data.directions[i].name + ' - '+ data.directions[i].city + ', '+ data.directions[i].state;
			}
			$scope.opponents = opponents.sort(function(obj1, obj2) {
				return obj1['display'].localeCompare(obj2['display']);
			});
			multiModalService.getEventMatches($rootScope.selectedEvent.id).then(function(data){
				$scope.matches = [];
				for(i = 0; i < data.matches.length; i++){
					$scope.matches.push({
						index: i,
						id: data.matches[i].id,
						round: data.matches[i].round,
						date: data.matches[i].date,
						opponent: data.matches[i].multi_opponent_facility_id ? getName(data.matches[i].multi_opponent_facility_id) : '',
						where: data.matches[i].home_away,
						directions: data.matches[i].multi_opponent_facility_id ? getDirections(data.matches[i].multi_opponent_facility_id) : ''
					});
				}
			});
		});
	};  
	$scope.getData();

	$scope.displayDirections = function(index){
		for(var i = 0; i < $scope.opponents.length; i++){
			if($scope.opponents[i].display === $scope.matches[index].opponent){
				$scope.matches[index].directions = $scope.opponents[i].directions;
				return;
			}
		}
	};

	$scope.updateMatches = function(){
		matches = [];
		for(var i = 0; i < $scope.matches.length; i++){
			if(!((($scope.matches[i].opponent === '') && ($scope.matches[i].where === null)) ||
				 (($scope.matches[i].opponent !== '') && ($scope.matches[i].where !== null)))){
				$scope.showUpdateMatchScheduleErrors.bothNeedSelecting = true;
				$scope.round = $scope.matches[i].round;
				return;
			}
			else if(($scope.matches[i].opponent !== '') && ($scope.matches[i].where !== null)){
				matches.push({
					id: $scope.matches[i].id,
					opponent_id: getId($scope.matches[i].opponent),
					where: $scope.matches[i].where
				});
			}
		}
		if(matches.length > 0){
			multiModalService.updateMatches($rootScope.selectedEvent.id, matches).then(function(data){
				$scope.callSuccess = true;
			});
		}
	};

	$scope.updateMatchesExit = function(){
		$scope.updateMatches();
		$scope.toggleModal();
	};
	
});