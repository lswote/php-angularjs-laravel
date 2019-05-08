teamsRIt.controller('perRoundLinesModalController', function($scope, $rootScope, $window, perRoundLinesModalService){

	// Get number and type of lines per match for our event
	$scope.getLinesPerMatch = function(){
		perRoundLinesModalService.getLinesPerMatch($scope.selectedEvent.id).then(function(data){
			$scope.lines = data.lines;
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
	
});