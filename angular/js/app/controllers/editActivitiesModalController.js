teamsRIt.controller('editActivitiesModalController', function($scope, $rootScope, $window, editActivitiesModalService, dashboardService, helperService){

	// Default value
	$scope.searchTerm = null;
	$scope.showListActivities = true;
	if($rootScope.user.privilege === 'facility leader'){
		$scope.showSearchSection = true;
		$scope.showInputSection = false;
		$scope.participantId = null;
	}
	else{
		$scope.showSearchSection = false;
		$scope.showInputSection = true;
		$scope.participantId = $rootScope.user.id;
	}


	$scope.items=[];
	$scope.name="";
	$scope.participantActivities=[];
	$scope.allActivities=[];
	$scope.possibleActivities=[];
	$scope.Math = window.Math;
	$scope.searchActivitiesTerm = '';

	// look for any typing
	$scope.$watch('name', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.showInputSection = false;
			for(var i=0; i < $scope.items.length; i++){
				if($scope.items[i].name.toLowerCase() === newValue.toLowerCase()){
					$scope.participantId = $scope.items[i].id;
					$scope.participantActivities = $scope.items[i].activities;
					$scope.showInputSection = true;
					break;
				}
			}
		}
	});

	// Get all participants
	$scope.getData = function(){
		items =[];
		dashboardService.getFacilityInfo().then(function(data){
			data.facility.users.forEach(function(participant){
				if($rootScope.user.privilege === 'facility leader'){
					items.push({'name': participant.first_name+' '+participant.last_name,
								'activities': participant.activities,
								'id': participant.id});
				}
				if(participant.id === $scope.participantId){
					$scope.participantActivities = participant.activities;
				}
			});
			$scope.items = angular.copy(items);
			$scope.allActivities = angular.copy(data.facility.activities);
		});
	}
	$scope.getData();

	$scope.addActivity = function(){
		$scope.showListActivities = false;
		$scope.showAddActivities = true;
		$scope.addedActivities = [];
		$scope.participantActivities.forEach(function(activity){
			$scope.addedActivities.push({'name': activity.name,
										 'skill_level': activity.pivot.skill_level,
										 'ranking': activity.pivot.ranking ? parseFloat(activity.pivot.ranking) : 0,
										 'id': activity.id});
		});
	}

	$scope.revertDisplay = function(){
		$scope.showListActivities = true;
		$scope.showAddActivities = false;
	}

	$scope.toggleAddedActivity = function(activityId){
		var activitiesIndex = helperService.findArrayIndex($scope.addedActivities, 'id', activityId);
		var possibleActivitiesIndex = helperService.findArrayIndex($scope.possibleActivities, 'id', activityId);
		if(activitiesIndex === false){
			$scope.addedActivities.push($scope.possibleActivities[possibleActivitiesIndex]);
		}
		else{
			$scope.addedActivities.splice(activitiesIndex, 1);
		}
		$scope.searchActivitiesTerm = '';
		$scope.possibleActivities = [];
	};

	$scope.$watch('searchActivitiesTerm', function(newValue, oldValue){
		if(newValue !== oldValue && newValue.length > 0){
			newValue = newValue.toLowerCase();
			$scope.possibleActivities = [];
			for(var i = 0; i < $scope.allActivities.length; i++){
				if($scope.allActivities[i].name.toLowerCase().indexOf(newValue) > -1){
					var activity = angular.copy($scope.allActivities[i]);
					if(helperService.findArrayIndex($scope.addedActivities, 'id', activity.id) !== false){
						activity.alreadySelected = true;
					}
					else{
						activity.ranking = 0;
					}
					$scope.possibleActivities.push(activity);
				}
			}
		}
		else if(newValue === ''){
			$scope.possibleActivities = [];
		}
	});

	$scope.update_activities = function(){
		editActivitiesModalService.addParticipantsActivities($scope.participantId, $scope.addedActivities).then(function(data){
		}).finally(function(){
			$scope.getData();
			$scope.revertDisplay();
		});
	};

	$scope.delete_activity = function(name, facility_id, activity_id, user_id){
		if($window.confirm("Delete "+name+'?')){
			editActivitiesModalService.deleteActivity(facility_id, activity_id, user_id).then(function(data){
			}).finally(function(){
				$scope.getData();
			});
		}
	};

});