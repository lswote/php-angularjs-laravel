teamsRIt.controller('playingSurfacesModalController', function($scope, $rootScope, $window, playingSurfacesModalService, editEventModalService, helperService){

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.event = {
				id: data.event.id,
				maxPlayingSurfaces: data.event.max_playing_surfaces ? data.event.max_playing_surfaces : data.event.facilities.activities[0].pivot.num_of_surfaces
			};
			$scope.getSurfaces();
		});
	};
	$scope.getEvent();

	// Pick out surfaces which have been selected
	$scope.parseSelectedSurfaces = function(){
		$scope.selectedSurfaces = [];
		for(var i = 0; i < $scope.surfaces.length; i++){
			var index = helperService.findArrayIndex($scope.surfaces[i].events, 'id', $rootScope.selectedEvent.id);
			if(index !== false && $scope.surfaces[i].events[index].pivot.emergency_surface == 0){
				$scope.selectedSurfaces.push($scope.surfaces[i].events[index].pivot);
			}
		}
		$scope.allowAdditionalSurfacesToBeSelected = $scope.selectedSurfaces.length < $scope.event.maxPlayingSurfaces;
	};

	// Get all surfaces associated with our facility / event
	$scope.getSurfaces = function(){
		playingSurfacesModalService.getSurfaces($rootScope.selectedEvent.id).then(function(data){
			$scope.surfaces = data.surfaces;
			$scope.parseSelectedSurfaces();
		});
	};

	// Adds / removes items to and from our selected surfaces variable
	$scope.toggleSelectedSurface = function(facilitySurfaceId, eventId){
		var index = helperService.findArrayIndexMultipleKeys($scope.selectedSurfaces, ['facility_surface_id', 'event_id'], [facilitySurfaceId, eventId]);
		if(index === false){
			$scope.selectedSurfaces.push({
				facility_surface_id: facilitySurfaceId,
				event_id: eventId,
				event_surface_number: null,
				emergency_surface: 0
			});
		}
		else{
			$scope.selectedSurfaces.splice(index, 1);
		}
		$scope.allowAdditionalSurfacesToBeSelected = $scope.selectedSurfaces.length < $scope.event.maxPlayingSurfaces;
	};

	// Make helperService.findArrayIndexMultipleKeys available in scope
	$scope.findArrayIndexMultipleKeys = helperService.findArrayIndexMultipleKeys;

	// Make sure all event surface number values are filled out
	$scope.checkEventSurfaceNumbers = function(){
		for(var i = 0; i < $scope.selectedSurfaces.length; i++){
			if(!$scope.selectedSurfaces[i].event_surface_number && $scope.selectedSurfaces[i].event_surface_number !== 0){
				return false;
			}
		}
		return true;
	};

	// Construct our scope.surfacesNumbers array
	$scope.buildSurfaceNumbersArray = function(){
		$scope.surfaceNumbers = [];
		for(var i = 0; i < $scope.selectedSurfaces.length; i++){
			$scope.surfaceNumbers.push($scope.selectedSurfaces[i].event_surface_number);
		}
	};

	// Return the next available surface number
	$scope.findNextAvailableSurfaceNumber = function(){
		for(var i = 1; i <= $scope.surfaces.length; i++){
			if($scope.surfaceNumbers.indexOf(i) === -1){
				$scope.surfaceNumbers.push(i);
				return i;
			}
		}
		return false;
	};

	// Build an array consisting of both selected surfaces and unselected surfaces
	$scope.buildAllSurfacesArray = function(){
		$scope.buildSurfaceNumbersArray();
		$scope.unselectedSurfaces = [];
		for(var i = 0; i < $scope.surfaces.length; i++){
			var index = helperService.findArrayIndex($scope.selectedSurfaces, 'facility_surface_id', $scope.surfaces[i].id);
			if(index === false){
				$scope.unselectedSurfaces.push({
					facility_surface_id: $scope.surfaces[i].id,
					event_id: $rootScope.selectedEvent.id,
					event_surface_number: $scope.findNextAvailableSurfaceNumber(),
					emergency_surface: 1
				});
			}
		}
		$scope.allSurfaces = $scope.selectedSurfaces.concat($scope.unselectedSurfaces);
	};

	// Update our selected surfaces for the event
	$scope.updateSelectedSurfaces = function(){
		if($scope.selectedSurfaces.length !== $scope.event.maxPlayingSurfaces){
			$window.alert('Please select ' + $scope.event.maxPlayingSurfaces + ' surfaces');
			return;
		}
		if($scope.checkEventSurfaceNumbers() === false){
			$window.alert('Please make sure all standard PS values are filled out');
			return;
		}
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.buildAllSurfacesArray();
		playingSurfacesModalService.updateSelectedSurfaces($rootScope.selectedEvent.id, $scope.allSurfaces).then(function(){
			$rootScope.getEvents();
			$scope.callSuccess = true;
		}, function(){
			$window.alert('Something went wrong.  Surfaces not updated');
		}).finally(function(){
			$scope.callInProgress = false;
		});
	};

});