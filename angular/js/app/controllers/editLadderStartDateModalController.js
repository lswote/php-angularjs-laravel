teamsRIt.controller('editLadderStartDateModalController', function($scope, $http, $rootScope, $location, ladderModalService){

	$scope.showEditLadderStartDateErrors={
		start_date: false
	};
	$scope.show_editable = true;
	$scope.show_noneditable = false;

	$scope.resetEditLadderStartDateErrors=function(){
		for(var i in $scope.showEditLadderStartDateErrors){
			if($scope.showEditLadderStartDateErrors.hasOwnProperty(i)){
				$scope.showEditLadderStartDateErrors[i] = false;
			}
		}
	};

	// Get event data
	$scope.getEvent = function(){
		ladderModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.event = angular.copy(data.event);
			$scope.event.display_start_date = $scope.event.start_date+'T24:00:00.000Z';
			}).finally(function(){
				ladderModalService.getChallenges($rootScope.selectedEvent.id, 0).then(function(data){
					// if there are any active challenges make the start date
					// uneditable
					for(i = 0; i < data.challenges.length; i++){
						if(data.challenges[i].played_date === null){
							$scope.show_editable = false;
							$scope.show_noneditable = true;
							break;
						}
					}
				});
		});
	}
	$scope.getEvent();

	$scope.saveStartDate=function(){
		error = false;
		if(typeof $scope.event.start_date == 'undefined'){
			error = $scope.showEditLadderStartDateErrors.start_date = true;
		}
		if($scope.event.start_date){
			ladderModalService.updateStartDate($rootScope.selectedEvent.id, $scope.event.start_date).then(function(){
			}, function(data){
				alert('Something went wrong. '+data.error);
				error = true;
			}).finally(function(){
				$scope.toggleModal();
			});
		}
		else{
			if(error == false){
				$scope.toggleModal();
			}
		}
	}

});
