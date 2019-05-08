teamsRIt.controller('createEventModalController', function($scope, $rootScope, $window, createEventModalService, facilityActivitiesService, editEventModalService, helperService){

	// Drop down options for standard line duration select element
    $scope.standardLineDurations = [5, 10, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    // Drop down options for number of rounds select element
    $scope.numberRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Drop down options for rounds minutes interval select element
    $scope.roundsMinutesIntervals = [5, 10, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240];
    // Drop down options for rounds days intervals select element
    $scope.roundsDaysIntervals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

    // Object that determines which create event input error to show
    $scope.showCreateEventErrors = {
        name: false,
        eventType: false,
        eventSubType: false,
        startDate: false,
        typeOfPlay: false,
        ageType: false,
        genderType: false,
        membershipType: false,
		activeStatus: false,
		participantCharge: false,
		chargeCc: false,
		roundsIntervalMetric: false,
		roundsInterval: false,
		rounds: false,
		numOfStartTimes: false,
		standardLineDuration: false,
		startTime: false
    };

	// Our create event object
    $scope.createEventObject = {
        name: null,
        activityId: '1',
        eventType: null,
        eventSubType: null,
        typeOfPlay: null,
        roundsIntervalMetric: null,
        roundsInterval: null,
        rounds: null,
        standardLineDuration: null,
        genderType: null,
        participantCharge: null,
        chargeCc: null,
        eventLeaderUsername: null,
        startDate: null,
        startTime: null,
        numOfStartTimes: null,
        ageType: null,
        membershipType: null,
        activeStatus: null
    };

    // Update rounds info on event sub type change
    $scope.updateEventSubType = function(item){
		if(item === 'single'){
			$scope.numberRounds = [1];
			if($scope.createEventObject.rounds !== 1){
				$scope.createEventObject.rounds = '';
			}
		}
		else{
			$scope.numberRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		}
	};

    // Get facility info
	$scope.getFacility = function(){
		$scope.getFacilityInProgress = true;
		facilityActivitiesService.getFacilityInfo($rootScope.user.facility_id).then(function(data){
			$scope.facilityActivities = data.facility.activities;
		}).finally(function(){
			$scope.getFacilityInProgress = false;
		});
	};
	$scope.getFacility();

	// Check our inputs
	$scope.checkCreateEventInput = function(){
		var noErrors = true;
        if(!$scope.createEventObject.name){
			$scope.showCreateEventErrors.name = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.eventType){
			$scope.showCreateEventErrors.eventType = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.eventSubType && ['league', 'round robin'].indexOf($scope.createEventObject.eventType) === -1){
			$scope.showCreateEventErrors.eventSubType = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.startDate){
			$scope.showCreateEventErrors.startDate = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.typeOfPlay){
			$scope.showCreateEventErrors.typeOfPlay = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.genderType && $scope.createEventObject.eventType !== 'multifacility'){
			$scope.showCreateEventErrors.genderType = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.ageType && $scope.createEventObject.eventType !== 'multifacility'){
			$scope.showCreateEventErrors.ageType = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.membershipType && $scope.createEventObject.eventType !== 'multifacility'){
			$scope.showCreateEventErrors.membershipType = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.activeStatus && $scope.createEventObject.eventType !== 'multifacility'){
			$scope.showCreateEventErrors.activeStatus = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.participantCharge){
			$scope.showCreateEventErrors.participantCharge = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.chargeCc){
			$scope.showCreateEventErrors.chargeCc = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.roundsIntervalMetric && $scope.createEventObject.eventType === 'social' && $scope.createEventObject.eventSubType === 'series'){
			$scope.showCreateEventErrors.roundsIntervalMetric = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.roundsInterval && $scope.createEventObject.eventType === 'social' && $scope.createEventObject.eventSubType === 'series'){
			$scope.showCreateEventErrors.roundsInterval = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.rounds && $scope.createEventObject.eventType === 'social'){
			$scope.showCreateEventErrors.rounds = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.numOfStartTimes && $scope.createEventObject.eventType === 'social'){
			$scope.showCreateEventErrors.numOfStartTimes = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.standardLineDuration && $scope.createEventObject.eventType === 'social'){
			$scope.showCreateEventErrors.standardLineDuration = true;
			noErrors = false;
		}
		if(!$scope.createEventObject.startTime && $scope.createEventObject.eventType === 'social'){
			$scope.showCreateEventErrors.startTime = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all create event errors
	$scope.resetCreateEventErrors = function(){
		for(var i in $scope.showCreateEventErrors){
			if($scope.showCreateEventErrors.hasOwnProperty(i)){
				$scope.showCreateEventErrors[i] = false;
			}
		}
	};

	// Creates a new event
	$scope.createEvent = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetCreateEventErrors();
		if($scope.checkCreateEventInput() === true){
            createEventModalService.create($scope.createEventObject).then(function(){
				$rootScope.getEvents();
				$scope.createEventObject = {
					type: 'tennis'
				};
				$scope.callSuccess = true;
				$rootScope.toggleModal();
			}, function(data){
            	if(data.error === 'Event leader not found'){
            		$scope.showCreateEventErrors.eventLeaderUsername = true;
				}
				else{
            		$window.alert('Something went wrong.  Event not created');
				}
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Get event info
	$scope.getEvent = function(){
		editEventModalService.getEvent($rootScope.selectedEvent.id).then(function(data){
			$scope.createEventObject = {
				id: data.event.id,
				name: data.event.name,
				activityId: data.event.activity_id.toString(),
				eventType: data.event.event_type,
				eventSubType: data.event.event_sub_type,
				startDate: data.event.start_date,
				eventLeaderUsername: data.event.event_leaders.length > 0 ? data.event.event_leaders[0].username : null,
				typeOfPlay: data.event.type_of_play,
				participantCharge: data.event.participant_charge,
				chargeCc: data.event.charge_cc.toString(),
				genderType: data.event.gender_type,
				ageType: data.event.for_age_type,
				membershipType: data.event.for_membership_type,
				activeStatus: data.event.for_active.toString(),
				roundsIntervalMetric: data.event.rounds_interval_metric,
				roundsInterval: data.event.rounds_interval ? data.event.rounds_interval.toString() : null,
				rounds: data.event.rounds_interval ? data.event.rounds.toString() : null,
				numOfStartTimes: data.event.num_of_start_times ? data.event.num_of_start_times.toString() : null,
				standardLineDuration: data.event.standard_line_duration ? data.event.standard_line_duration.toString() : null,
				startTime: helperService.parseTime(data.event.start_time)
			};
		});
	};
	if($rootScope.modalViewOnly.createEvent){
		$scope.getEvent();
	}

	// Number of start time choices determined by event type
	$scope.$watch('createEventObject.eventType', function(newValue, oldValue){
		if(newValue !== oldValue){
			if(newValue === 'social'){
				$scope.numOfStartTimesArray = [1, 2];
			}
			else{
				$scope.numOfStartTimesArray = [1, 2, 3, 4, 5];
			}
		}
	});

});