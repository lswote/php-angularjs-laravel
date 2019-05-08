teamsRIt.controller('openTimeSlotsModalController', function($scope, $rootScope, openTimeSlotsModalService){

	// Default values
	$scope.femaleLineTypes = ['ws', 'wd'];
	$scope.maleLineTypes = ['ms', 'md'];
	$scope.comboLineTypes = ['xs', 'xd'];

	// Parse our participants info
	$scope.parseParticipantsInfo = function(){
		$scope.rsvpedParticipants = 0;
		$scope.femaleRsvpedParticipants = 0;
		$scope.maleRsvpedParticipants = 0;
		$scope.waitlistedParticipants = 0;
		$scope.femaleWaitlistedParticipants = 0;
		$scope.maleWaitlistedParticipants = 0;
		for(var i = 0; i < $scope.openTimeSlotsInfo.users.length; i++){
			if($scope.openTimeSlotsInfo.users[i].pivot.rsvped){
				$scope.rsvpedParticipants = $scope.rsvpedParticipants + 1;
				if($scope.openTimeSlotsInfo.users[i].sex === 'female'){
					$scope.femaleRsvpedParticipants = $scope.femaleRsvpedParticipants + 1;
					if($scope.openTimeSlotsInfo.users[i].pivot.waitlisted === 1){
						$scope.waitlistedParticipants = $scope.waitlistedParticipants + 1;
						$scope.femaleWaitlistedParticipants = $scope.femaleWaitlistedParticipants + 1;
					}
				}
				else if($scope.openTimeSlotsInfo.users[i].sex === 'male'){
					$scope.maleRsvpedParticipants = $scope.maleRsvpedParticipants + 1;
					if($scope.openTimeSlotsInfo.users[i].pivot.waitlisted === 1){
						$scope.waitlistedParticipants = $scope.waitlistedParticipants + 1;
						$scope.maleWaitlistedParticipants = $scope.maleWaitlistedParticipants + 1;
					}
				}
			}
		}
	};

	// Parse our event courts info
	$scope.parseCourtsInfo = function(){
		$scope.maxNumOfMatches = $scope.openTimeSlotsInfo.max_playing_surfaces * $scope.openTimeSlotsInfo.num_of_start_times;
		$scope.assignedMatches = $scope.openTimeSlotsInfo.lines.length;
		$scope.openCourtsWithNoAssignments = $scope.maxNumOfMatches - $scope.assignedMatches;
	};

	// Increment our open slots variables
	$scope.adjustOpenSlotsCounts = function(match){
		$scope.openSlots = $scope.openSlots + 1;
		if($scope.femaleLineTypes.indexOf(match.line_play_type) > -1){
			$scope.femaleOpenSlots = $scope.femaleOpenSlots + 1;
		}
		else if($scope.maleLineTypes.indexOf(match.line_play_type) > -1){
			$scope.maleOpenSlots = $scope.maleOpenSlots + 1;
		}
		else if($scope.comboLineTypes.indexOf(match.line_play_type) > -1){
			$scope.comboOpenSlots = $scope.comboOpenSlots + 1;
		}
	};

	// Parse our event matches open slots info
	$scope.parseOpenSlotsInfo = function(){
		$scope.openSlots = 0;
		$scope.femaleOpenSlots = 0;
		$scope.maleOpenSlots = 0;
		$scope.comboOpenSlots = 0;
		for(var i = 0; i < $scope.openTimeSlotsInfo.lines.length; i++){
			if($scope.openTimeSlotsInfo.lines[i].line_type === 'singles'){
				if(!$scope.openTimeSlotsInfo.lines[i].pair_one_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
				if(!$scope.openTimeSlotsInfo.lines[i].pair_two_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
			}
			else if($scope.openTimeSlotsInfo.lines[i].line_type === 'doubles'){
				if(!$scope.openTimeSlotsInfo.lines[i].pair_one.user_one_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
				if(!$scope.openTimeSlotsInfo.lines[i].pair_one.user_two_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
				if(!$scope.openTimeSlotsInfo.lines[i].pair_two.user_one_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
				if(!$scope.openTimeSlotsInfo.lines[i].pair_two.user_two_id){
					$scope.adjustOpenSlotsCounts($scope.openTimeSlotsInfo.lines[i]);
				}
			}
		}
	};

	// Update our expiring contracts list based on selected date
	$scope.getOpenTimeSlotsInfo = function(){
		openTimeSlotsModalService.getOpenTimeSlotsInfo($rootScope.selectedEvent.id).then(function(data){
			$scope.openTimeSlotsInfo = data.open_time_slots_info;
			$scope.parseParticipantsInfo();
			$scope.parseCourtsInfo();
			$scope.parseOpenSlotsInfo();
		});
	};
	$scope.getOpenTimeSlotsInfo();

});