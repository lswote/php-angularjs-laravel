describe('modalsController Test Suite', function(){

    var rootScope, scope;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.modalViewOnly = {};
    	scope = $rootScope.$new();
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('modalsController', {
            $scope: scope
        });
    }));

    describe('toggleChangeImageModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.changeImage to true', function(){
    		rootScope.showModalView = {
    			changeImage: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleChangeImageModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.changeImage).toBeTruthy();
		});
	});

    describe('toggleCreateEventModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.createEvent and rootScope.modalViewOnly.createEvent to true', function(){
    		rootScope.showModalView = {
    			createEvent: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleCreateEventModal(true);
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.createEvent).toBeTruthy();
    		expect(rootScope.modalViewOnly.createEvent).toBeTruthy();
		});
	});

    describe('toggleCreateEventRulesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.createEventRules to true', function(){
    		rootScope.showModalView = {
    			createEventRules: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleCreateEventRulesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.createEventRules).toBeTruthy();
		});
	});

    describe('toggleViewEventRulesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewEventRules to true', function(){
    		rootScope.showModalView = {
    			viewEventRules: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewEventRulesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.viewEventRules).toBeTruthy();
		});
	});

    describe('toggleCreateFacilityModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.createFacility to true', function(){
    		rootScope.showModalView = {
    			createFacility: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleCreateFacilityModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.createFacility).toBeTruthy();
		});
	});

    describe('toggleAddFacilityLeaderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addFacilityLeader to true', function(){
    		rootScope.showModalView = {
    			addFacilityLeader: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddFacilityLeaderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addFacilityLeader).toBeTruthy();
		});
	});

    describe('toggleDeleteFacilityLeaderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.deleteFacilityLeader to true', function(){
    		rootScope.showModalView = {
    			deleteFacilityLeader: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleDeleteFacilityLeaderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.deleteFacilityLeader).toBeTruthy();
		});
	});

    describe('toggleAddEventLeaderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addEventLeader to true', function(){
    		rootScope.showModalView = {
    			addEventLeader: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddEventLeaderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addEventLeader).toBeTruthy();
		});
	});


    describe('toggleAddEventTeamToLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addEventTeamToLadder to true', function(){
    		rootScope.showModalView = {
    			addEventTeamToLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddEventTeamToLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addEventTeamToLadder).toBeTruthy();
		});
	});

    describe('toggleWithdrawEventTeamFromLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.withdrawEventTeamFromLadder to true', function(){
    		rootScope.showModalView = {
    			withdrawEventTeamFromLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleWithdrawEventTeamFromLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.withdrawEventTeamFromLadder).toBeTruthy();
		});
	});

    describe('toggleReturnTeamToLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.returnTeamToLadder to true', function(){
    		rootScope.showModalView = {
    			returnTeamToLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleReturnTeamToLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.returnTeamToLadder).toBeTruthy();
		});
	});

    describe('toggleAddEventChallengeLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addEventChallengeLadder to true', function(){
    		rootScope.showModalView = {
    			addEventChallengeLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddEventChallengeLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addEventChallengeLadder).toBeTruthy();
		});
	});

    describe('toggleResetEventChallengeLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.resetEventChallengeLadder to true', function(){
    		rootScope.showModalView = {
    			resetEventChallengeLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleResetEventChallengeLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.resetEventChallengeLadder).toBeTruthy();
		});
	});

    describe('toggleEventTeamChallengeLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.eventTeamChallengeLadder to true', function(){
    		var flag = 'purple';
    		rootScope.showModalView = {
    			eventTeamChallengeLadder: false,
				eventTeamChallengeLadderViewOnly: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEventTeamChallengeLadderModal(flag);
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.eventTeamChallengeLadder).toBeTruthy();
    		expect(rootScope.showModalView.eventTeamChallengeLadderViewOnly).toEqual('purple');
		});
	});

    describe('toggleAcceptChallengeLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.acceptChallengeLadder to true', function(){
    		rootScope.showModalView = {
    			acceptChallengeLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAcceptChallengeLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.acceptChallengeLadder).toBeTruthy();
		});
	});

    describe('toggleWithdrawEventParticipantFromLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.withdrawEventParticipantFromLadder to true', function(){
    		rootScope.showModalView = {
    			withdrawEventParticipantFromLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleWithdrawEventParticipantFromLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.withdrawEventParticipantFromLadder).toBeTruthy();
		});
	});

    describe('togglePlayingSurfacesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.playingSurfaces to true', function(){
    		rootScope.showModalView = {
    			playingSurfaces: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePlayingSurfacesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.playingSurfaces).toBeTruthy();
		});
	});

    describe('togglePlayingSurfacesWithLinesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.playingSurfacesWithLines to true', function(){
    		rootScope.selectedEvent = {
    			event_type: 'league'
			};
    		rootScope.showModalView = {
    			playingSurfacesWithLines: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePlayingSurfacesWithLinesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.playingSurfacesWithLines).toBeTruthy();
		});
	});

    describe('toggleEventResultsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.eventResults to true and rootScope.eventResultsMode to its correct value', function(){
    		rootScope.showModalView = {
    			eventResults: false
			};
    		rootScope.eventResultsMode = 'add';
    		rootScope.selectedEvent = 'you';
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEventResultsModal('edit');
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.eventResults).toBeTruthy();
    		expect(rootScope.eventResultsMode).toEqual('edit');
    		expect(rootScope.selectedEvent).toEqual('you');
		});
	});

    describe('toggleDeleteFacilityModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.deleteFacility to true', function(){
    		rootScope.showModalView = {
    			deleteFacility: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleDeleteFacilityModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.deleteFacility).toBeTruthy();
		});
	});

    describe('toggleActivityMasterRecordModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.activityMasterRecord to true', function(){
    		rootScope.showModalView = {
    			activityMasterRecord: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleActivityMasterRecordModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.activityMasterRecord).toBeTruthy();
		});
	});

    describe('toggleUploadEventDescriptionModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.uploadEventDescription to true', function(){
    		rootScope.showModalView = {
    			uploadEventDescription: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleUploadEventDescriptionModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.uploadEventDescription).toBeTruthy();
		});
	});

    describe('toggleUploadEventProcessFlowModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.uploadEventProcessFlow to true', function(){
    		rootScope.showModalView = {
    			uploadEventProcessFlow: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleUploadEventProcessFlowModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.uploadEventProcessFlow).toBeTruthy();
		});
	});

    describe('toggleExpiringContractsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.expiringContracts to true', function(){
    		rootScope.showModalView = {
    			expiringContracts: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleExpiringContractsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.expiringContracts).toBeTruthy();
		});
	});

    describe('toggleNotConfirmedParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.notConfirmedParticipants to true', function(){
    		rootScope.showModalView = {
    			notConfirmedParticipants: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleNotConfirmedParticipantsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.notConfirmedParticipants).toBeTruthy();
		});
	});

    describe('toggleViewParticipantsLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewParticipantsLadder to true', function(){
    		rootScope.showModalView = {
    			viewParticipantsLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewParticipantsLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewParticipantsLadder).toBeTruthy();
		});
	});

    describe('toggleViewTeamRosterMultiModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewTeamRosterMulti to true', function(){
    		rootScope.showModalView = {
    			viewTeamRosterMulti: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewTeamRosterMultiModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewTeamRosterMulti).toBeTruthy();
		});
	});

    describe('toggleEditParticipantContactInfoModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editParticipantContactInfo to true', function(){
    		rootScope.showModalView = {
    			editParticipantContactInfo: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditParticipantContactInfoModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.editParticipantContactInfo).toBeTruthy();
		});
	});

    describe('toggleAddMatchDirectionsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addMatchDirections to true', function(){
    		rootScope.showModalView = {
    			addMatchDirections: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddMatchDirectionsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.addMatchDirections).toBeTruthy();
		});
	});

    describe('toggleUpdateMatchScheduleModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.updateMatchSchedule to true', function(){
    		rootScope.showModalView = {
    			updateMatchSchedule: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleUpdateMatchScheduleModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.updateMatchSchedule).toBeTruthy();
		});
	});

    describe('toggleSendCustomEmailModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.sendCustomEmail to true', function(){
			var flag = 'opie';
    		rootScope.showModalView = {
    			sendCustomEmail: false,
    			sendCustomEmailFlag: 'andy'
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleSendCustomEmailModal(flag);
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.sendCustomEmail).toBeTruthy();
    		expect(rootScope.showModalView.sendCustomEmailFlag).toEqual(flag);
		});
	});

    describe('toggleSendTeamMemberLineupModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.sendTeamMemberLineup to true', function(){
    		rootScope.showModalView = {
    			sendTeamMemberLineup: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleSendTeamMemberLineupModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.sendTeamMemberLineup).toBeTruthy();
		});
	});

    describe('toggleSendIndividualAvailabilityModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.sendIndividualAvailability to true', function(){
    		rootScope.showModalView = {
    			sendIndividualAvailability: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleSendIndividualAvailabilityModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.sendIndividualAvailability).toBeTruthy();
		});
	});

    describe('toggleViewMatchScheduleModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewMatchSchedule to true', function(){
    		rootScope.showModalView = {
    			viewMatchSchedule: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewMatchScheduleModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewMatchSchedule).toBeTruthy();
		});
	});

    describe('toggleViewLadderRankingsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewLadderRankings to true', function(){
    		rootScope.showModalView = {
    			viewLadderRankings: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewLadderRankingsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.viewLadderRankings).toBeTruthy();
		});
	});

    describe('toggleEditLadderRankingsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editLadderRankings to true', function(){
    		rootScope.showModalView = {
    			editLadderRankings: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditLadderRankingsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.editLadderRankings).toBeTruthy();
		});
	});

    describe('toggleEditLadderResultsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editLadderResults to true', function(){
    		rootScope.showModalView = {
    			editLadderResults: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditLadderResultsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.editLadderResults).toBeTruthy();
		});
	});

    describe('toggleEditLadderStartDateModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editLadderStartDate to true', function(){
    		rootScope.showModalView = {
    			editLadderStartDate: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditLadderStartDateModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.editLadderStartDate).toBeTruthy();
		});
	});

    describe('toggleEditLadderSettingsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editLadderSettings to true', function(){
    		rootScope.showModalView = {
    			editLadderSettings: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditLadderSettingsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.editLadderSettings).toBeTruthy();
		});
	});

    describe('toggleViewCompletedLadderResultsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView to its correct value', function(){
    		var flag = 'ooo';
    		rootScope.showModalView = {
    			viewCompletedLadderResults: false,
				viewCompletedLadderResultsFlag: 'hey'
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewCompletedLadderResultsModal(flag);
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewCompletedLadderResults).toBeTruthy();
    		expect(rootScope.showModalView.viewCompletedLadderResultsFlag).toEqual(flag);
		});
	});

    describe('toggleViewOpenChallengesLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewOpenChallengesLadder to true', function(){
    		rootScope.showModalView = {
    			viewOpenChallengesLadderReports: false,
    			viewOpenChallengesLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewOpenChallengesLadderModal(true);
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewOpenChallengesLadder).toBeTruthy();
    		expect(rootScope.showModalView.viewOpenChallengesLadder).toBeTruthy();
		});
	});

    describe('toggleWithdrawChallengesLadderModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.withdrawChallengesLadder to true', function(){
    		rootScope.showModalView = {
    			withdrawChallengesLadder: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleWithdrawChallengesLadderModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.withdrawChallengesLadder).toBeTruthy();
		});
	});

    describe('toggleWaitlistedParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.waitlistedParticipants to true', function(){
    		rootScope.showModalView = {
    			waitlistedParticipants: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleWaitlistedParticipantsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.waitlistedParticipants).toBeTruthy();
		});
	});

    describe('toggleCloseEventModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.closeEvent to true', function(){
    		rootScope.showModalView = {
    			closeEvent: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleCloseEventModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.closeEvent).toBeTruthy();
		});
	});

    describe('toggleDoNotMatchModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.doNotMatch to true', function(){
    		rootScope.showModalView = {
    			doNotMatch: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleDoNotMatchModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.doNotMatch).toBeTruthy();
		});
	});

    describe('toggleAddEventParticipantModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addEventParticipant to true', function(){
    		rootScope.showModalView = {
    			addEventParticipant: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddEventParticipantModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addEventParticipant).toBeTruthy();
		});
	});

    describe('toggleAddCaptainMultiModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addCaptainMulti to true', function(){
    		rootScope.showModalView = {
    			addCaptainMulti: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddCaptainMultiModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addCaptainMulti).toBeTruthy();
		});
	});

    describe('toggleAddEventWaitlistedParticipantModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addEventWaitlistedParticipant to true', function(){
    		rootScope.showModalView = {
    			addEventWaitlistedParticipant: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddEventWaitlistedParticipantModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.addEventWaitlistedParticipant).toBeTruthy();
		});
	});

    describe('toggleImportParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.importParticipants and rootScope.importType to their correct values', function(){
    		var importType = 'events';
    		rootScope.showModalView = {
    			importParticipants: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleImportParticipantsModal(importType);
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.importParticipants).toBeTruthy();
    		expect(rootScope.importType).toEqual(importType);
		});
	});

    describe('toggleEditEventModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editEvent to true', function(){
    		rootScope.showModalView = {
    			editEvent: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditEventModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.editEvent).toBeTruthy();
		});
	});

    describe('toggleEditFacilityModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editFacility to true', function(){
    		rootScope.showModalView = {
    			editFacility: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditFacilityModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.editFacility).toBeTruthy();
		});
	});

    describe('toggleEditActivitiesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editActivities to true', function(){
    		rootScope.showModalView = {
    			editActivities: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditActivitiesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.editActivities).toBeTruthy();
		});
	});

    describe('toggleStartEventModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.startEvent to true', function(){
    		rootScope.showModalView = {
    			startEvent: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleStartEventModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.startEvent).toBeTruthy();
		});
	});

    describe('toggleAddMatchDirectionsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addMatchDirections to true', function(){
    		rootScope.showModalView = {
    			addMatchDirections: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddMatchDirectionsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.addMatchDirections).toBeTruthy();
		});
	});

    describe('toggleAddFacilityParticipantModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addFacilityParticipant to true', function(){
    		rootScope.showModalView = {
    			addFacilityParticipant: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddFacilityParticipantModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.addFacilityParticipant).toBeTruthy();
		});
	});

    describe('togglePrintScorecardsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.printScorecards to true', function(){
    		rootScope.showModalView = {
    			printScorecards: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePrintScorecardsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.printScorecards).toBeTruthy();
		});
	});

    describe('togglePrintToDosModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.printToDos to true', function(){
    		rootScope.showModalView = {
    			printToDos: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePrintToDosModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.printToDos).toBeTruthy();
		});
	});

    describe('togglePrintMultiScorecardsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.printMultiScorecards to true', function(){
    		rootScope.showModalView = {
    			printMultiScorecards: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePrintMultiScorecardsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.printMultiScorecards).toBeTruthy();
		});
	});

    describe('togglePrintMatchDirectionsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.printMatchDirections to true', function(){
    		rootScope.showModalView = {
    			printMatchDirections: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePrintMatchDirectionsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.printMatchDirections).toBeTruthy();
		});
	});

    describe('togglePrintParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.printParticipants to true', function(){
    		rootScope.showModalView = {
    			printParticipants: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePrintParticipantsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.printParticipants).toBeTruthy();
		});
	});

    describe('toggleViewTeamsByGroupNumber Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.viewTeamsByGroupNumber to true', function(){
    		rootScope.showModalView = {
    			viewTeamsByGroupNumber: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleViewTeamsByGroupNumber();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.viewTeamsByGroupNumber).toBeTruthy();
		});
	});

    describe('toggleEditParticipantModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editParticipant to true', function(){
    		rootScope.showModalView = {
    			editParticipant: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditParticipantModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.editParticipant).toBeTruthy();
		});
	});

    describe('toggleEditStartTimesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editStartTimes to true', function(){
    		rootScope.showModalView = {
    			editStartTimes: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditStartTimesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.editStartTimes).toBeTruthy();
		});
	});

    describe('toggleRegenerateLinesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.regenerateLines to true', function(){
    		rootScope.showModalView = {
    			regenerateLines: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleRegenerateLinesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.regenerateLines).toBeTruthy();
		});
	});

    describe('togglePickFacilityActivitiesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.pickFacilityActivities to true', function(){
    		rootScope.showModalView = {
    			pickFacilityActivities: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePickFacilityActivitiesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.pickFacilityActivities).toBeTruthy();
		});
	});

    describe('toggleDownloadParticipantsActivitiesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.downloadParticipantsActivities to true', function(){
    		rootScope.showModalView = {
    			downloadParticipantsActivities: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleDownloadParticipantsActivitiesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.downloadParticipantsActivities).toBeTruthy();
		});
	});

    describe('toggleImportParticipantsActivitiesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.importParticipantsActivities to true', function(){
    		rootScope.showModalView = {
    			importParticipantsActivities: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleImportParticipantsActivitiesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.importParticipantsActivities).toBeTruthy();
		});
	});

    describe('toggleExportParticipantsActivitiesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.exportParticipantsActivities to true', function(){
    		rootScope.showModalView = {
    			exportParticipantsActivities: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleExportParticipantsActivitiesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.exportParticipantsActivities).toBeTruthy();
		});
	});

    describe('toggleOpenTimeSlotsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.openTimeSlots to true', function(){
    		rootScope.showModalView = {
    			openTimeSlots: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleOpenTimeSlotsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.openTimeSlots).toBeTruthy();
		});
	});

    describe('toggleDownloadParticipantsImportModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.downloadParticipantsImport to true', function(){
    		rootScope.showModalView = {
    			downloadParticipantsImport: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleDownloadParticipantsImportModal();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(rootScope.showModalView.downloadParticipantsImport).toBeTruthy();
		});
	});

    describe('toggleTeamDrawModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.teamDraw to true', function(){
    		rootScope.showModalView = {
    			teamDraw: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleTeamDrawModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.teamDraw).toBeTruthy();
		});
	});

    describe('toggleImportTeamParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.importTeamParticipants to true', function(){
    		rootScope.showModalView = {
    			importTeamParticipants: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleImportTeamParticipantsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.importTeamParticipants).toBeTruthy();
		});
	});

    describe('toggleExportParticipantsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.exportParticipants and rootScope.exportType to their correct values', function(){
			var exportType = 'facility';
    		rootScope.showModalView = {
    			exportParticipants: false
			};
			rootScope.exportType = 'event';
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleExportParticipantsModal(exportType);
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.exportType).toEqual('facility');
    		expect(rootScope.showModalView.exportParticipants).toBeTruthy();
		});
	});

    describe('togglePerRoundLinesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.perRoundLines to true', function(){
    		rootScope.showModalView = {
    			perRoundLines: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.togglePerRoundLinesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.perRoundLines).toBeTruthy();
		});
	});

    describe('toggleMatchLineTimesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.matchLineTimes to true', function(){
    		rootScope.showModalView = {
    			matchLineTimes: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleMatchLineTimesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.matchLineTimes).toBeTruthy();
		});
	});

    describe('toggleTeamRoundLineupModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.teamRoundLineup, rootScope.selectedRoundDate, and rootScope.selectedTeam to their correct ' +
		   'values', function(){
    		var selectedRoundDate = 1;
    		var selectedTeam = 'blue';
    		rootScope.showModalView = {
    			teamRoundLineup: false
			};
    		rootScope.selectedRoundDate = 2;
    		rootScope.selectedTeam = 'red';
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleTeamRoundLineupModal(selectedRoundDate, selectedTeam);
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.teamRoundLineup).toBeTruthy();
    		expect(rootScope.selectedRoundDate).toEqual(1);
    		expect(rootScope.selectedTeam).toEqual('blue');
		});
	});

    describe('toggleEditRoundDatesModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editRoundDates to true', function(){
    		rootScope.showModalView = {
    			editRoundDates: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditRoundDatesModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.editRoundDates).toBeTruthy();
		});
	});

    describe('toggleEditCaptainsModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.editCaptains to true', function(){
    		rootScope.showModalView = {
    			editCaptains: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleEditCaptainsModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.editCaptains).toBeTruthy();
		});
	});

    describe('toggleAddWaitlistedParticipantToTeamModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addWaitlistedParticipantToTeam to true', function(){
    		rootScope.showModalView = {
    			addWaitlistedParticipantToTeam: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddWaitlistedParticipantToTeamModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.addWaitlistedParticipantToTeam).toBeTruthy();
		});
	});

    describe('toggleAddSubAvailabilityModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addSubAvailability to true', function(){
    		rootScope.showModalView = {
    			addSubAvailability: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddSubAvailabilityModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.addSubAvailability).toBeTruthy();
		});
	});

    describe('toggleAddSubToLineupModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.addSubToLineup to true', function(){
    		rootScope.showModalView = {
    			addSubToLineup: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleAddSubToLineupModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.addSubToLineup).toBeTruthy();
		});
	});

    describe('toggleTiebreakModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.tiebreak to true', function(){
    		rootScope.showModalView = {
    			tiebreak: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleTiebreakModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith(true);
    		expect(rootScope.showModalView.tiebreak).toBeTruthy();
		});
	});

    describe('toggleChangePasswordModal Test', function(){
    	it('should call rootScope.toggleModal() and set rootScope.showModalView.changePassword to true', function(){
    		rootScope.showModalView = {
    			changePassword: false
			};
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.toggleChangePasswordModal();
    		expect(rootScope.toggleModal).toHaveBeenCalledWith();
    		expect(rootScope.showModalView.changePassword).toBeTruthy();
		});
	});

});