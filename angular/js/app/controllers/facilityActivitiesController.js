teamsRIt.controller('facilityActivitiesController', function($scope, $rootScope, $routeParams, $window, facilityActivitiesService, activityMasterRecordModalService,
														     helperService){

	// Activity to view
	$scope.selectedActivityId = null;
	// Whether to show or hide our non facility activities
	$scope.showNonFacilityActivities = false;

	// Parse our selected activities array
	$scope.parseSelectedActivities = function(){
		for(var i = 0; i < $scope.selectedActivities.length; i++){
			$scope.selectedActivities[i].pivot.competition_scoring_format = $scope.selectedActivities[i].pivot.competition_scoring_format.toString();
		}
	};

	// Get facility info
	$scope.getFacility = function(){
		facilityActivitiesService.getFacilityInfo($routeParams.id).then(function(data){
			$scope.facility = data.facility;
			$scope.facilityActivities = data.facility.activities;
			$scope.getNonFacilityActivities();
			$scope.selectedActivities = angular.copy($scope.facilityActivities);
			$scope.parseSelectedActivities();
			$scope.displayFacilityForm = true;
		}, function(){
			$scope.displayFacilityForm = false;
		});
	};
	$scope.getFacility();

	// Get a list of non facility activities
	$scope.getNonFacilityActivities = function(){
		activityMasterRecordModalService.getActivities().then(function(data){
			$scope.nonFacilityActivities = [];
			var allActivities = data.activities;
			for(var i = 0; i < allActivities.length; i++){
				if(helperService.findArrayIndex($scope.facilityActivities, 'id', allActivities[i].id) === false){
					$scope.nonFacilityActivities.push(allActivities[i]);
				}
			}
		});
	};

	// Update scope.selectedActivities when scope.selectedActivityId changes
	$scope.$watch('selectedActivityId', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue){
				var index = helperService.findArrayIndex($scope.facilityActivities, 'id', newValue);
				$scope.selectedActivities = angular.copy([$scope.facilityActivities[index]]);
				$scope.parseSelectedActivities();
			}
			else{
				$scope.selectedActivities = angular.copy($scope.facilityActivities);
			}
		}
	});

	// Keep scope.selectedActivities property values in-sync with scope.facilityActivities property values
	$scope.$watch('selectedActivities', function(newValue, oldValue){
		if(newValue !== oldValue){
			for(var i = 0; i < newValue.length; i++){
				var index = helperService.findArrayIndex($scope.facilityActivities, 'id', newValue[i].id);
				$scope.facilityActivities[index] = angular.copy($scope.selectedActivities[i]);
			}
		}
	}, true);

	// Show / hide our non facility activities
	$scope.toggleNonFacilityActivities = function(){
		$scope.showNonFacilityActivities = !$scope.showNonFacilityActivities;
	};

	// Bind click event so that we close our add activity dropdown with any outside click when it's open
    $(document).on('click touchstart', function(event){
		if(!$(event.target).is('.add-activity button') && $('.non-facility-activities').is(':visible')){
			$scope.toggleNonFacilityActivities();
			$scope.$apply();
		}
	});

	// Adds a new activity to our facility
	$scope.addActivity = function(activityId){
		var index = helperService.findArrayIndex($scope.nonFacilityActivities, 'id', activityId);
		var activityObject = angular.copy($scope.nonFacilityActivities[index]);
		activityObject.pivot = angular.copy($scope.nonFacilityActivities[index]);
		activityObject.pivot.facility_id = $routeParams.id;
		activityObject.pivot.activity_id = activityObject.pivot.id;
		activityObject.pivot.num_of_surfaces = null;
		activityObject.pivot.next_event_date = null;
		activityObject.pivot.next_event_type = null;
		delete activityObject.pivot.id;
		delete activityObject.pivot.name;
		$scope.facilityActivities.push(activityObject);
		$scope.selectedActivities.push(activityObject);
		$scope.nonFacilityActivities.splice(index, 1);
		$scope.parseSelectedActivities();
	};

	// Removes an activity from our facility
	$scope.removeActivity = function(activityId){
		var index = helperService.findArrayIndex($scope.facilityActivities, 'id', activityId);
		$scope.nonFacilityActivities.push($scope.facilityActivities[index]);
		$scope.facilityActivities.splice(index, 1);
		$scope.selectedActivities = angular.copy($scope.facilityActivities);
		$scope.parseSelectedActivities();
		if(activityId == $scope.selectedActivityId){
			$scope.selectedActivityId = '';
		}
	};

	// Builds our update array
	$scope.buildFacilityActivitiesUpdateObject = function(){
		$scope.facilityActivitiesUpdateObject = {};
		for(var i = 0; i < $scope.facilityActivities.length; i++){
			var id = $scope.facilityActivities[i].id;
			var nextEventDateObject = new Date($scope.facilityActivities[i].pivot.next_event_date);
			var nextEventDate = nextEventDateObject.getFullYear() + '-' + ('0' + (nextEventDateObject.getMonth() + 1)).slice(-2) + '-' +
								('0' + nextEventDateObject.getDate()).slice(-2);
			$scope.facilityActivitiesUpdateObject[id] = {
				two_teams_per_line: $scope.facilityActivities[i].pivot.two_teams_per_line,
				three_teams_per_line: $scope.facilityActivities[i].pivot.three_teams_per_line,
				four_teams_per_line: $scope.facilityActivities[i].pivot.four_teams_per_line,
				five_teams_per_line: $scope.facilityActivities[i].pivot.five_teams_per_line,
				doubles: $scope.facilityActivities[i].pivot.doubles,
				competition_scoring_format: $scope.facilityActivities[i].pivot.competition_scoring_format,
				line_scoring_format: $scope.facilityActivities[i].pivot.line_scoring_format,
				point: $scope.facilityActivities[i].pivot.point,
				surface_type: $scope.facilityActivities[i].pivot.surface_type,
				line_type: $scope.facilityActivities[i].pivot.line_type,
				num_of_surfaces: $scope.facilityActivities[i].pivot.num_of_surfaces,
				next_event_date: nextEventDate,
				next_event_type: $scope.facilityActivities[i].pivot.next_event_type
			}
		}
	};

	// Update activities associated with our facility
	$scope.updateFacilityActivities = function(){
		$scope.callInProgress = true;
		$scope.buildFacilityActivitiesUpdateObject();
		facilityActivitiesService.update($routeParams.id, $scope.facilityActivitiesUpdateObject).then(function(){
			$window.alert('Facility Activities Updated!');
			if($rootScope.user.privilege === 'admin'){
				$window.location.href = '/dashboard';
			}
			else if($rootScope.user.privilege === 'facility leader'){
				$window.location.href = '/admin';
			}
		}, function(){
			$window.alert('Something went wrong.  Facility activities not updated');
		});
	}

});