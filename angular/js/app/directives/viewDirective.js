// Application header
teamsRIt.directive('appHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/header.html'
    }
});

// Universal login section
teamsRIt.directive('loginPanel', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/login.html'
    }
});

// Forgot password section
teamsRIt.directive('forgotPassword', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/forgot-password.html'
    }
});

// Reset password section
teamsRIt.directive('resetPassword', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/reset-password.html'
    }
});

// Registration section
teamsRIt.directive('registration', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/register.html'
    }
});

// RSVP section
teamsRIt.directive('rsvp', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/rsvp.html'
    }
});

// Universal navigation panel
teamsRIt.directive('navigation', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/navigation.html'
    }
});

// Event eye dropdown
teamsRIt.directive('eyeDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/eye-dropdown.html'
    }
});

// Event pencil dropdown
teamsRIt.directive('pencilDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/pencil-dropdown.html'
    }
});

// Event pencil square dropdown
teamsRIt.directive('pencilSquareDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/pencil-square-dropdown.html'
    }
});

// Event printer dropdown
teamsRIt.directive('printerDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/printer-dropdown.html'
    }
});

// Event plus sign dropdown
teamsRIt.directive('plusSignDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/plus-sign-dropdown.html'
    }
});

// Event envelope dropdown
teamsRIt.directive('envelopeDropdown', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/envelope-dropdown.html'
    }
});

// Singles line
teamsRIt.directive('singlesLine', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/singles-line.html'
    }
});

// Doubles line
teamsRIt.directive('doublesLine', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/doubles-line.html'
    }
});

// Pop-up modal
teamsRIt.directive('modal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../views/modal.html'
    }
});

// Dashboard image modal
teamsRIt.directive('dashboardImageModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/dashboard-image-modal.html'
    }
});

// Create event modal
teamsRIt.directive('createEventModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/create-event-modal.html'
    }
});

// Create event rules modal
teamsRIt.directive('createEventRulesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/create-event-rules-modal.html'
    }
});

// Create event rules modal
teamsRIt.directive('viewEventRulesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-event-rules-modal.html'
    }
});

// Create facility modal
teamsRIt.directive('createFacilityModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/create-facility-modal.html'
    }
});

// Add facility leader modal
teamsRIt.directive('addFacilityLeaderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-facility-leader-modal.html'
    }
});

// Delete facility leader modal
teamsRIt.directive('deleteFacilityLeaderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/delete-facility-leader-modal.html'
    }
});

// Add event leader modal
teamsRIt.directive('addEventLeaderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-event-leader-modal.html'
    }
});

// Add event team to ladder modal
teamsRIt.directive('addEventTeamToLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-event-team-to-ladder-modal.html'
    }
});

// Withdraw event team from ladder modal
teamsRIt.directive('withdrawEventTeamFromLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/withdraw-event-team-from-ladder-modal.html'
    }
});

// Return team to ladder modal
teamsRIt.directive('returnTeamToLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/return-team-to-ladder-modal.html'
    }
});

// Withdraw event team from ladder modal
teamsRIt.directive('withdrawEventParticipantFromLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/withdraw-event-participant-from-ladder-modal.html'
    }
});

// add event challenge ladder modal
teamsRIt.directive('addEventChallengeLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-event-challenge-ladder-modal.html'
    }
});

// reset event challenge ladder modal
teamsRIt.directive('resetEventChallengeLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/reset-event-challenge-ladder-modal.html'
    }
});

// event team challenge ladder modal
teamsRIt.directive('eventTeamChallengeLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/event-team-challenge-ladder-modal.html'
    }
});

// accept challenge ladder modal
teamsRIt.directive('acceptChallengeLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/accept-challenge-ladder-modal.html'
    }
});

// Playing surfaces modal
teamsRIt.directive('playingSurfacesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/playing-surfaces-modal.html'
    }
});

// Playing surfaces with lines modal
teamsRIt.directive('playingSurfacesWithLinesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/playing-surfaces-with-lines-modal.html'
    }
});

// Event results modal
teamsRIt.directive('eventResultsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/event-results-modal.html'
    }
});

// Event results modal
teamsRIt.directive('deleteFacilityModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/delete-facility-modal.html'
    }
});

// Event results modal
teamsRIt.directive('activityMasterRecordModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/activity-master-record-modal.html'
    }
});

// Upload event description modal
teamsRIt.directive('uploadEventDescriptionModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/upload-event-description-modal.html'
    }
});

// Upload event process flow modal
teamsRIt.directive('uploadEventProcessFlowModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/upload-event-process-flow-modal.html'
    }
});

// Expiring contracts modal
teamsRIt.directive('expiringContractsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/expiring-contracts-modal.html'
    }
});

// Not confirmed participants modal
teamsRIt.directive('notConfirmedParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/not-confirmed-participants-modal.html'
    }
});

// Participants modal
teamsRIt.directive('viewParticipantsLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-participants-ladder-modal.html'
    }
});

// view team roster modal
teamsRIt.directive('viewTeamRosterMultiModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-team-roster-multi-modal.html'
    }
});

// edit participant contact info modal
teamsRIt.directive('editParticipantContactInfoModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-participant-contact-info-modal.html'
    }
});

// View Ladder Rankings modal
teamsRIt.directive('viewLadderRankingsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-ladder-rankings-modal.html'
    }
});

// Edit Ladder Rankings modal
teamsRIt.directive('editLadderRankingsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-ladder-rankings-modal.html'
    }
});

// Edit Ladder Results modal
teamsRIt.directive('editLadderResultsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-ladder-results-modal.html'
    }
});

// Edit Ladder Start Date modal
teamsRIt.directive('editLadderStartDateModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-ladder-start-date-modal.html'
    }
});

// Edit Ladder Settings modal
teamsRIt.directive('editLadderSettingsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-ladder-settings-modal.html'
    }
});

// View Completed Ladder Results modal
teamsRIt.directive('viewCompletedLadderResultsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-completed-ladder-results-modal.html'
    }
});

// Open challenges modal
teamsRIt.directive('viewOpenChallengesLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-open-challenges-ladder-modal.html'
    }
});

// Withdraw challenges modal
teamsRIt.directive('withdrawChallengesLadderModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/withdraw-challenges-ladder-modal.html'
    }
});

// Waitlisted participants modal
teamsRIt.directive('waitlistedParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/waitlisted-participants-modal.html'
    }
});

// Close event modal
teamsRIt.directive('closeEventModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/close-event-modal.html'
    }
});

// Do not match modal
teamsRIt.directive('doNotMatchModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/do-not-match-modal.html'
    }
});

// Add event participant modal
teamsRIt.directive('addEventParticipantModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-event-participant-modal.html'
    }
});

// Add event participant modal
teamsRIt.directive('addCaptainMultiModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-captain-multi-modal.html'
    }
});

// Add event waitlisted participant modal
teamsRIt.directive('addEventWaitlistedParticipantModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-event-waitedlisted-participant-modal.html'
    }
});

// Import participants modal
teamsRIt.directive('importParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/import-participants-modal.html'
    }
});

// Edit event modal
teamsRIt.directive('editEventModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-event-modal.html'
    }
});

// Edit facility modal
teamsRIt.directive('editFacilityModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-facility-modal.html'
    }
});

// Edit activities modal
teamsRIt.directive('editActivitiesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-activities-modal.html'
    }
});

// Start event modal
teamsRIt.directive('startEventModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/start-event-modal.html'
    }
});

// Add match directions modal
teamsRIt.directive('addMatchDirectionsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-match-directions-modal.html'
    }
});

// Edit match directions modal
teamsRIt.directive('editMatchDirectionsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-match-directions-modal.html'
    }
});

// Delete match directions modal
teamsRIt.directive('deleteMatchDirectionsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/delete-match-directions-modal.html'
    }
});

// Update match schedule modal
teamsRIt.directive('updateMatchScheduleModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/update-match-schedule-modal.html'
    }
});

// Send custom email modal
teamsRIt.directive('sendCustomEmailModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/send-custom-email-modal.html'
    }
});

// Send custom email modal
teamsRIt.directive('sendTeamMemberLineupModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/send-team-member-lineup-modal.html'
    }
});

// Send custom email modal
teamsRIt.directive('sendIndividualAvailabilityModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/send-individual-availability-modal.html'
    }
});

// View match schedule modal
teamsRIt.directive('viewMatchScheduleModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-match-schedule-modal.html'
    }
});

// Add facility participant modal
teamsRIt.directive('addFacilityParticipantModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-facility-participant-modal.html'
    }
});

// Print scorecards modal
teamsRIt.directive('printScorecardsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/print-scorecards-modal.html'
    }
});

// Print To Dos modal
teamsRIt.directive('printToDosModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/print-to-dos-modal.html'
    }
});

// Print multi scorecards modal
teamsRIt.directive('printMultiScorecardsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/print-multi-scorecards-modal.html'
    }
});

// Print match directions modal
teamsRIt.directive('printMatchDirectionsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/print-match-directions-modal.html'
    }
});

// Print participants modal
teamsRIt.directive('printParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/print-participants-modal.html'
    }
});

// View participants by group number modal
teamsRIt.directive('viewTeamsByGroupNumber', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/view-teams-by-group-number.html'
    }
});



// Edit participant modal
teamsRIt.directive('editParticipantModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-participant-modal.html'
    }
});

// Edit start times modal
teamsRIt.directive('editStartTimesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-start-times-modal.html'
    }
});

// Regenerate lines modal
teamsRIt.directive('regenerateLinesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/regenerate-lines-modal.html'
    }
});

// Pick facility activities modal
teamsRIt.directive('pickFacilityActivitiesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/pick-facility-activities-modal.html'
    }
});

// Download participant activities modal
teamsRIt.directive('downloadParticipantsActivitiesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/download-participants-activities-modal.html'
    }
});

// Import participants activities modal
teamsRIt.directive('importParticipantsActivitiesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/import-participants-activities-modal.html'
    }
});

// Export participant activities modal
teamsRIt.directive('exportParticipantsActivitiesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/export-participants-activities-modal.html'
    }
});

// Open time slots modal
teamsRIt.directive('openTimeSlotsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/open-time-slots-modal.html'
    }
});

// Download participants import modal
teamsRIt.directive('downloadParticipantsImportModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/download-participants-import-modal.html'
    }
});

// Team draw modal
teamsRIt.directive('teamDrawModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/team-draw-modal.html'
    }
});

// Import team participants modal
teamsRIt.directive('importTeamParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/import-team-participants-modal.html'
    }
});

// Export participants modal
teamsRIt.directive('exportParticipantsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/export-participants-modal.html'
    }
});

// Per round lines modal
teamsRIt.directive('perRoundLinesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/per-round-lines-modal.html'
    }
});

// Match line times modal
teamsRIt.directive('matchLineTimesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/match-line-times-modal.html'
    }
});

// Team round lineup modal
teamsRIt.directive('teamRoundLineupModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/team-round-lineup-modal.html'
    }
});

// Edit round dates modal
teamsRIt.directive('editRoundDatesModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-round-dates-modal.html'
    }
});

// Edit captains modal
teamsRIt.directive('editCaptainsModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/edit-captains-modal.html'
    }
});

// Add waitlisted participant to team modal
teamsRIt.directive('addWaitlistedParticipantToTeamModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-waitlisted-participant-to-team-modal.html'
    }
});

// Add sub availability modal
teamsRIt.directive('addSubAvailabilityModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-sub-availability-modal.html'
    }
});

// Add sub to lineup modal
teamsRIt.directive('addSubToLineupModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/add-sub-to-lineup-modal.html'
    }
});

// Tiebreak modal
teamsRIt.directive('tiebreakModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/tiebreak-modal.html'
    }
});

// Change password modal
teamsRIt.directive('changePasswordModal', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '../../modals/change-password-modal.html'
    }
});

// Team pairing line
teamsRIt.directive('teamPairingLine', function(){
    return {
        restrict: 'E',
		scope: {
        	toggleSelectedUsers: '=',
        	disableCheckbox: '=',
        	line: '='
		},
        replace: true,
        templateUrl: '../../views/team-pairing-line.html'
    }
});


teamsRIt.directive('typeahead', function($timeout){
	return {
		restrict: 'AEC',
		scope: {
			items: '=',
			inputclass: '@',
			divclass: '@',
			label: '@',
			required: '@',
			disabledflag: '@',
			prompt: '@',
			title: '@',
			model: '=',
			onSelect: '&'
		},
		link: function(scope){
			scope.handleSelection = function(selectedItem){
				scope.model = selectedItem;
				scope.current = 0;
				scope.selected = true;
				$timeout(function(){
					scope.onSelect();
				}, 200);
			};
			scope.current = 0;
			scope.selected = true;
			scope.isCurrent = function(index){
				return scope.current == index;
			};
			scope.setCurrent = function(index){
				scope.current = index;
			};
		},
		templateUrl: '../../pages/typeahead.html'
	}
});