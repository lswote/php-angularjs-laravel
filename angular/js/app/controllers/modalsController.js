teamsRIt.controller('modalsController', function($scope, $rootScope){

	// Show / hide our change image modal
	$scope.toggleChangeImageModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.changeImage = true;
	};

	// Show / hide our create event modal
	$scope.toggleCreateEventModal = function(viewOnly){
		$rootScope.toggleModal();
		$rootScope.showModalView.createEvent = true;
		$rootScope.modalViewOnly.createEvent = viewOnly;
	};

    // Show / hide our create event rules modal
    $scope.toggleCreateEventRulesModal = function(){
        $rootScope.toggleModal();
        $rootScope.showModalView.createEventRules = true;
    };

    // Show / hide our view event rules modal
    $scope.toggleViewEventRulesModal = function(){
        $rootScope.toggleModal();
        $rootScope.showModalView.viewEventRules = true;
    };

	// Show / hide our create facility modal
	$scope.toggleCreateFacilityModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.createFacility = true;
	};

	// Show / hide our add facility leader modal
	$scope.toggleAddFacilityLeaderModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addFacilityLeader = true;
	};

	// Show / hide our delete facility leader modal
	$scope.toggleDeleteFacilityLeaderModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.deleteFacilityLeader = true;
	};

	// Show / hide our add event leader modal
	$scope.toggleAddEventLeaderModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addEventLeader = true;
	};

    // Show / hide our add event team to ladder modal
    $scope.toggleAddEventTeamToLadderModal = function(){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.addEventTeamToLadder = true;
    };

    // Show / hide our withdraw event team from ladder modal
    $scope.toggleWithdrawEventTeamFromLadderModal = function(){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.withdrawEventTeamFromLadder = true;
    };

    // Show / hide our return team to ladder modal
    $scope.toggleReturnTeamToLadderModal = function(){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.returnTeamToLadder = true;
    };

    // Show / hide our add event challenge ladder modal
    $scope.toggleAddEventChallengeLadderModal = function(){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.addEventChallengeLadder = true;
    };

    // Show / hide our reset event challenge ladder modal
    $scope.toggleResetEventChallengeLadderModal = function(){
	   	$rootScope.toggleModal(true);
		$rootScope.showModalView.resetEventChallengeLadder = true;
    };

    // Show / hide our event team challenge ladder modal
    $scope.toggleEventTeamChallengeLadderModal = function(flag){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.eventTeamChallengeLadder = true;
		$rootScope.showModalView.eventTeamChallengeLadderViewOnly = flag;
    };

    // Show / hide our accept challenge ladder modal
    $scope.toggleAcceptChallengeLadderModal = function(flag){
	   	$rootScope.toggleModal(true);
		$rootScope.showModalView.acceptChallengeLadder = true;
    };

    // Show / hide our withdraw event participant from ladder modal
    $scope.toggleWithdrawEventParticipantFromLadderModal = function(){
	   	$rootScope.toggleModal();
		$rootScope.showModalView.withdrawEventParticipantFromLadder = true;
    };

	// Show / hide our playing surfaces modal
	$scope.togglePlayingSurfacesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.playingSurfaces = true;
	};

	// Show / hide our playing surfaces with lines modal
	$scope.togglePlayingSurfacesWithLinesModal = function(){
		$rootScope.selectedEvent.event_type === 'league' ? $rootScope.toggleModal(true) : $rootScope.toggleModal();
		$rootScope.showModalView.playingSurfacesWithLines = true;
	};

	// Show / hide our results modal
	$scope.toggleEventResultsModal = function(addOrEdit, event){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.eventResults = true;
		$rootScope.eventResultsMode = addOrEdit;
		if(event){
			$rootScope.selectedEvent = event;
		}
	};

	// Show / hide our delete facility modal
	$scope.toggleDeleteFacilityModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.deleteFacility = true;
	};

	// Show / hide our activity master record modal
	$scope.toggleActivityMasterRecordModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.activityMasterRecord = true;
	};

	// Show / hide our upload event description modal
	$scope.toggleUploadEventDescriptionModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.uploadEventDescription = true;
	};

	// Show / hide our upload event process flow modal
	$scope.toggleUploadEventProcessFlowModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.uploadEventProcessFlow = true;
	};

	// Show / hide our expiring contracts modal
	$scope.toggleExpiringContractsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.expiringContracts = true;
	};

	// Show / hide our not confirmed participants modal
	$scope.toggleNotConfirmedParticipantsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.notConfirmedParticipants = true;
	};

	// Show / hide our participants modal
	$scope.toggleViewParticipantsLadderModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewParticipantsLadder = true;
	};

	// Show / hide our view team roster modal
	$scope.toggleViewTeamRosterMultiModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewTeamRosterMulti = true;
	};

	// Show / hide our edit participant contact info modal
	$scope.toggleEditParticipantContactInfoModal = function(flag){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.editParticipantContactInfo = true;
		$rootScope.showModalView.editParticipantContactInfoFlag = flag;
	};

	// Show / hide our view ladder rankings modal
	$scope.toggleViewLadderRankingsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.viewLadderRankings = true;
	};

	// Show / hide our edit ladder rankings modal
	$scope.toggleEditLadderRankingsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.editLadderRankings = true;
	};

	// Show / hide our edit ladder results modal
	$scope.toggleEditLadderResultsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.editLadderResults = true;
	};

	// Show / hide our edit ladder start date modal
	$scope.toggleEditLadderStartDateModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editLadderStartDate = true;
	};

	// Show / hide our edit ladder start date modal
	$scope.toggleEditLadderSettingsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editLadderSettings = true;
	};

	// Show / hide our view completed ladder results modal
	$scope.toggleViewCompletedLadderResultsModal = function(flag){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewCompletedLadderResults = true;
		$rootScope.showModalView.viewCompletedLadderResultsFlag = flag;
	};

	// Show / hide our open challenges modal
	$scope.toggleViewOpenChallengesLadderModal = function(flag){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewOpenChallengesLadderReports = flag;
		$rootScope.showModalView.viewOpenChallengesLadder = true;
	};

	// Show / hide our withdraw challenges modal
	$scope.toggleWithdrawChallengesLadderModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.withdrawChallengesLadder = true;
	};

	// Show / hide our waitlisted participants modal
	$scope.toggleWaitlistedParticipantsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.waitlistedParticipants = true;
	};

	// Show / hide our close event modal
	$scope.toggleCloseEventModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.closeEvent = true;
	};

	// Show / hide our do not match modal
	$scope.toggleDoNotMatchModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.doNotMatch = true;
	};

	// Show / hide our add event participant modal
	$scope.toggleAddEventParticipantModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addEventParticipant = true;
	};

	// Show / hide our add captain modal
	$scope.toggleAddCaptainMultiModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addCaptainMulti = true;
	};

	// Show / hide our add event waitlisted participant modal
	$scope.toggleAddEventWaitlistedParticipantModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addEventWaitlistedParticipant = true;
	};

	// Show / hide our import participants modal
	$scope.toggleImportParticipantsModal = function(importType){
		$rootScope.toggleModal();
		$rootScope.showModalView.importParticipants = true;
		$rootScope.importType = importType;
	};

	// Show / hide our edit event modal
	$scope.toggleEditEventModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editEvent = true;
	};

	// Show / hide our edit facility modal
	$scope.toggleEditFacilityModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editFacility = true;
	};

	// Show / hide our edit activities modal
	$scope.toggleEditActivitiesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editActivities = true;
	};

	// Show / hide our start event modal
	$scope.toggleStartEventModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.startEvent = true;
	};

	// Show / hide our add match directions modal
	$scope.toggleAddMatchDirectionsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.addMatchDirections = true;
	};

	// Show / hide our edit match directions modal
	$scope.toggleEditMatchDirectionsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.editMatchDirections = true;
	};

	// Show / hide our delete match directions modal
	$scope.toggleDeleteMatchDirectionsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.deleteMatchDirections = true;
	};

	// Show / hide our update match schedule modal
	$scope.toggleUpdateMatchScheduleModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.updateMatchSchedule = true;
	};

	// Show / hide our send custom email modal
	$scope.toggleSendCustomEmailModal = function(flag){
		$rootScope.toggleModal();
		$rootScope.showModalView.sendCustomEmail = true;
		$rootScope.showModalView.sendCustomEmailFlag = flag;
	};

	// Show / hide our send team member lineup modal
	$scope.toggleSendTeamMemberLineupModal = function(flag){
		$rootScope.toggleModal();
		$rootScope.showModalView.sendTeamMemberLineup = true;
	};

	// Show / hide our send individual availability modal
	$scope.toggleSendIndividualAvailabilityModal = function(flag){
		$rootScope.toggleModal();
		$rootScope.showModalView.sendIndividualAvailability = true;
	};

	// Show / hide our view match schedule modal
	$scope.toggleViewMatchScheduleModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewMatchSchedule = true;
	};

	// Show / hide our add facility participant modal
	$scope.toggleAddFacilityParticipantModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.addFacilityParticipant = true;
	};

	// Show / hide our print scorecards modal
	$scope.togglePrintScorecardsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.printScorecards = true;
	};

	// Show / hide our print to dos modal
	$scope.togglePrintToDosModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.printToDos = true;
	};

	// Show / hide our print multi scorecards modal
	$scope.togglePrintMultiScorecardsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.printMultiScorecards = true;
	};

	// Show / hide our print match directions modal
	$scope.togglePrintMatchDirectionsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.printMatchDirections = true;
	};

	// Show / hide our print participants modal
	$scope.togglePrintParticipantsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.printParticipants = true;
	};

	// Show / hide our view teams by group number modal
	$scope.toggleViewTeamsByGroupNumber = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.viewTeamsByGroupNumber = true;
	};

	// Show / hide our edit participant modal
	$scope.toggleEditParticipantModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editParticipant = true;
	};

	// Show / hide our edit start times modal
	$scope.toggleEditStartTimesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editStartTimes = true;
	};

	// Show / hide our regenerate lines modal
	$scope.toggleRegenerateLinesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.regenerateLines = true;
	};

	// Show / hide our pick facility activities modal
	$scope.togglePickFacilityActivitiesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.pickFacilityActivities = true;
	};

	// Show / hide our download participants activities modal
	$scope.toggleDownloadParticipantsActivitiesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.downloadParticipantsActivities = true;
	};

	// Show / hide our import participants activities modal
	$scope.toggleImportParticipantsActivitiesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.importParticipantsActivities = true;
	};

	// Show / hide our export participants activities modal
	$scope.toggleExportParticipantsActivitiesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.exportParticipantsActivities = true;
	};

	// Show / hide our open time slots modal
	$scope.toggleOpenTimeSlotsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.openTimeSlots = true;
	};

	// Show / hide our download participants import modal
	$scope.toggleDownloadParticipantsImportModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.downloadParticipantsImport = true;
	};

	// Show / hide our team draw modal
	$scope.toggleTeamDrawModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.teamDraw = true;
	};

	// Show / hide our import team participants modal
	$scope.toggleImportTeamParticipantsModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.importTeamParticipants = true;
	};

	// Show / hide our export participants modal
	$scope.toggleExportParticipantsModal = function(exportType){
		$rootScope.toggleModal();
		$rootScope.showModalView.exportParticipants = true;
		$rootScope.exportType = exportType;
	};

	// Show / hide our per round lines modal
	$scope.togglePerRoundLinesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.perRoundLines = true;
	};

	// Show / hide our match line times modal
	$scope.toggleMatchLineTimesModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.matchLineTimes = true;
	};

	// Show / hide our match line times modal
	$scope.toggleTeamRoundLineupModal = function(selectedRoundDate, selectedTeam){
		$rootScope.toggleModal();
		$rootScope.showModalView.teamRoundLineup = true;
		$rootScope.selectedRoundDate = selectedRoundDate;
		$rootScope.selectedTeam = selectedTeam;
	};

	// Show / hide our match line times modal
	$scope.toggleEditRoundDatesModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.editRoundDates = true;
	};

	// Show / hide our edit captains modal
	$scope.toggleEditCaptainsModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.editCaptains = true;
	};

	// Show / hide our edit captains modal
	$scope.toggleAddWaitlistedParticipantToTeamModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addWaitlistedParticipantToTeam = true;
	};

	// Show / hide our add sub availability modal
	$scope.toggleAddSubAvailabilityModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addSubAvailability = true;
	};

	// Show / hide our add sub to lineup modal
	$scope.toggleAddSubToLineupModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.addSubToLineup = true;
	};

	// Show / hide our tiebreak modal
	$scope.toggleTiebreakModal = function(){
		$rootScope.toggleModal(true);
		$rootScope.showModalView.tiebreak = true;
	};

	// Show / hide our change password modal
	$scope.toggleChangePasswordModal = function(){
		$rootScope.toggleModal();
		$rootScope.showModalView.changePassword = true;
	};

});