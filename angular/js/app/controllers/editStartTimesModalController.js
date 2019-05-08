teamsRIt.controller('editStartTimesModalController', function($scope, $rootScope, $window, multiModalService, perRoundLinesModalService){

	$scope.resetEditStartTimesErrors = function(){
		$scope.lines.forEach(function(line){
			line.startTimeError = false;
		});
	};

	$scope.getLinesPerMatch = function(){
		perRoundLinesModalService.getLinesPerMatch($scope.selectedEvent.id).then(function(data){
			$scope.lines = angular.copy(data.lines);
			$scope.lines.forEach(function(line){
				if(line.start_time){

					line.start_time_object = new Date('1970-01-01T'+line.start_time);
				}
				else{
					line.start_time_object = $scope.startTimeObject;
				}
			});
		});
	};
	$scope.getLinesPerMatch();

	// Sort our lines by line type
	$scope.sortByLineType = function(line){
		if(line.line_play_type === 'ws'){
			return 1;
		}
		else if(line.line_play_type === 'wd'){
			return 2;
		}
		else if(line.line_play_type === 'ms'){
			return 3;
		}
		else if(line.line_play_type === 'md'){
			return 4;
		}
		else if(line.line_play_type === 'xs'){
			return 5;
		}
		else if(line.line_play_type === 'xd'){
			return 6;
		}
	};
	
	$scope.saveStartTimes = function(){
		multiModalService.updateMatchLines($scope.selectedEvent.id, $scope.lines).then(function(data){
		}).finally(function(){
			$scope.toggleModal();
		});
	};
});