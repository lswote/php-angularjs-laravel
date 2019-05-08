describe('eventIconsController Test Suite', function(){

    var q, deferred, rootScope, scope, eventService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake services
    beforeEach(function(){
        eventService = {
        	getEventMatchResultsEntered: function(){
                deferred = q.defer();
                deferred.resolve({
					results_entered: true
				});
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventMatchResultsEntered').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('eventIconsController', {
            $scope: scope,
			eventService: eventService
        });
    }));

    describe('getEventMatchResultsEntered Test', function(){
    	it('should set rootScope.selectedEvent to its correct value after eventService.getEventMatchResultsEntered() returns success', function(){
    		var eventId = 384283;
    		rootScope.selectedEvent = {
				matchResultsEntered: false
			};
    		rootScope.selectedEventStatus = 'seen';
    		scope.getEventMatchResultsEntered(eventId);
    		scope.$apply();
    		expect(eventService.getEventMatchResultsEntered).toHaveBeenCalledWith(eventId);
    		expect(rootScope.selectedEvent).toEqual({
				matchResultsEntered: true
			});
		});
	});

    describe('togglePlusSignDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showPlusSignDropdown to their correct values and call ' +
		   'rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showPlusSignDropdown = 1;
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.togglePlusSignDropdown(event, eventStatus);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showPlusSignDropdown).toEqual(11);
		});
	});

    describe('toggleEnvelopeDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showEnvelopeDropdown to their correct values and call ' +
		   'rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showEnvelopeDropdown = 1;
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.toggleEnvelopeDropdown(event, eventStatus);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showEnvelopeDropdown).toEqual(11);
		});
	});

    describe('toggleEyeDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showEyeDropdown to their correct values and call ' +
		   'rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showEyeDropdown = 1;
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.toggleEyeDropdown(event, eventStatus);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showEyeDropdown).toEqual(11);
		});
	});

    describe('togglePencilDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showPencilDropdown to their correct values and call ' +
		   'scope.getEventMatchResultsEntered() and rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showPencilDropdown = 1;
    		spyOn(scope, 'getEventMatchResultsEntered');
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.togglePencilDropdown(event, eventStatus);
    		expect(scope.getEventMatchResultsEntered).toHaveBeenCalledWith(event.id);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showPencilDropdown).toEqual(11);
		});
	});

    describe('togglePencilSquareDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showPencilSquareDropdown to their correct values and call ' +
		   'scope.getEventMatchResultsEntered() and rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showPencilSquareDropdown = 1;
    		spyOn(scope, 'getEventMatchResultsEntered');
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.togglePencilSquareDropdown(event, eventStatus);
    		expect(scope.getEventMatchResultsEntered).toHaveBeenCalledWith(event.id);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showPencilSquareDropdown).toEqual(11);
		});
	});

    describe('togglePencilSquareDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showPencilSquareDropdown to their correct values and call ' +
		   'scope.getEventMatchResultsEntered() and rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showPencilSquareDropdown = 1;
    		spyOn(scope, 'getEventMatchResultsEntered');
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.togglePencilSquareDropdown(event, eventStatus);
    		expect(scope.getEventMatchResultsEntered).toHaveBeenCalledWith(event.id);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showPencilSquareDropdown).toEqual(11);
		});
	});

    describe('togglePrinterDropdown Test', function(){
    	it('should set rootScope.selectedEvent, rootScope.selectedEventStatus, and scope.showPrinterDropdown to their correct values and ' +
		   'call rootScope.closeAllDropdowns()', function(){
    		var event = {
    			name: 'hustle',
				id: 11
			};
    		var eventStatus = 'current';
    		scope.event = 'life my life';
    		scope.showPrinterDropdown = 1;
    		rootScope.closeAllDropdowns = jasmine.createSpy('closeAllDropdowns');
    		scope.togglePrinterDropdown(event, eventStatus);
    		expect(rootScope.selectedEvent).toEqual(event);
    		expect(rootScope.selectedEventStatus).toEqual(eventStatus);
    		expect(rootScope.closeAllDropdowns).toHaveBeenCalled();
    		expect(scope.showPrinterDropdown).toEqual(11);
		});
	});

    describe('areDropdownsOpen Test', function(){
    	it('should return true', function(){
    		scope.showPlusSignDropdown = 45;
    		expect(rootScope.areDropdownsOpen()).toBeTruthy();
		});
    	it('should return false', function(){
    		scope.showPlusSignDropdown = null;
    		scope.showEnvelopeDropdown = null;
    		scope.showEyeDropdown = null;
    		scope.showPencilDropdown = null;
    		scope.showPencilSquareDropdown = null;
    		scope.showPrinterDropdown = null;
    		expect(rootScope.areDropdownsOpen()).toBeFalsy();
		});
	});
    
    describe('closeAllDropdowns Test', function(){
    	it('should set scope.showPlusSignDropdown, scope.showEnvelopeDropdown, scope.showEyeDropdown, scope.showPencilDropdown, scope.showPencilSquareDropdown, ' +
		   'and scope.showPrinterDropdown to null', function(){
    		scope.showPlusSignDropdown = 'eeyaa';
			scope.showEnvelopeDropdown = 'lkala';
			scope.showEyeDropdown = 'say';
			scope.showPencilDropdown = 'warm';
			scope.showPencilSquareDropdown = 'aaw2';
			scope.showPrinterDropdown = 'fire';
			rootScope.closeAllDropdowns();
			expect(scope.showPlusSignDropdown).toBeNull();
			expect(scope.showEnvelopeDropdown).toBeNull();
			expect(scope.showEyeDropdown).toBeNull();
			expect(scope.showPencilDropdown).toBeNull();
			expect(scope.showPencilSquareDropdown).toBeNull();
			expect(scope.showPrinterDropdown).toBeNull();
		});
	});

    describe('isCaptain Test', function(){
    	it('should return false', function(){
    		var event = null;
    		expect(scope.isCaptain(event)).toBeFalsy();
		});
    	it('should return false', function(){
    		var event = {
    			event_team_users: []
			};
    		expect(scope.isCaptain(event)).toBeFalsy();
		});
    	it('should return false', function(){
    		var event = {
    			event_team_users: [{
					user_id: 0
				}]
			};
    		rootScope.user = {
    			id: 23
			};
    		expect(scope.isCaptain(event)).toBeFalsy();
		});
    	it('should return true', function(){
    		var event = {
    			event_team_users: [{
					user_id: 23,
					captain: 0
				}]
			};
    		rootScope.user = {
    			id: 23
			};
    		expect(scope.isCaptain(event)).toBeFalsy();
		});
    	it('should return true', function(){
    		var event = {
    			event_team_users: [{
					user_id: 23,
					captain: 1
				}]
			};
    		rootScope.user = {
    			id: 23
			};
    		expect(scope.isCaptain(event)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_team_users: [{
					user_id: 0,
					captain: 0
				}, {
					user_id: 23,
					captain: 1
				}]
			};
    		rootScope.user = {
    			id: 23
			};
    		expect(scope.isCaptain(event)).toBeTruthy();
		});
	});

    describe('canEditEvent Test', function(){
    	it('should return true', function(){
    		var event = null;
    		rootScope.user = {
    			privilege: 'facility leader'
			};
    		expect(scope.canEditEvent(event)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_leaders: [{
					name: 'maybe',
					is_event_leader: 0
				}, {
					name: 'see',
					is_event_leader: 0
				}, {
					name: 'vanity',
					is_event_leader: 1
				}]
			};
    		rootScope.user = {
    			privilege: 'participant'
			};
    		expect(scope.canEditEvent(event)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = null;
    		rootScope.user = {
    			privilege: 'participant'
			};
    		expect(scope.canEditEvent(event)).toBeFalsy();
		});
	});

    describe('showEmailCaptainLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
			var user = {
				privilege: 'facility leader'
			};
			spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showEmailCaptainLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'current';
			var user = {
				privilege: 'participant'
			};
			spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showEmailCaptainLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'social'
			};
    		var selectedEventStatus = 'current';
			var user = {
				privilege: 'participant'
			};
			spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showEmailCaptainLink(event, selectedEventStatus, user)).toBeFalsy();
		});
	});

    describe('showViewTeamsLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'current';
			var user = {
				privilege: 'participant'
			};
			spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewTeamsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'past';
			var user = {
				privilege: 'participant'
			};
			spyOn(scope, 'canEditEvent').and.returnValue(true);
			spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewTeamsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'current';
			var user = {
				privilege: 'participant'
			};
			spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showViewTeamsLink(event, selectedEventStatus, user)).toBeFalsy();
		});
	});

    describe('showPrintToDosLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
			expect(scope.showPrintToDosLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showPrintToDosLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'social'
			};
    		var selectedEventStatus = 'upcoming';
			expect(scope.showPrintToDosLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
			expect(scope.showPrintToDosLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showAddEventLeaderLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		var user = {
    			privilege: 'participant'
			};
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showAddEventLeaderLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		var user = {
    			privilege: 'facility leader'
			};
			expect(scope.showAddEventLeaderLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility',
				event_leaders: [1, 2]
			};
    		var selectedEventStatus = 'current';
    		var user = {
    			privilege: 'event leader'
			};
			expect(scope.showAddEventLeaderLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'current';
    		var user = {
    			privilege: 'event leader'
			};
    		spyOn(scope, 'canEditEvent').and.returnValue(false);
			expect(scope.showAddEventLeaderLink(event, selectedEventStatus, user)).toBeFalsy();
		});
	});

    describe('showDeleteRecreateEventLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
			expect(scope.showDeleteRecreateEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showDeleteRecreateEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
			expect(scope.showDeleteRecreateEventLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showStartEventLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league',
				comb_play: 1
			};
    		var selectedEventStatus = 'upcoming';
			expect(scope.showStartEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility',
				comb_play: 1
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(false);
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showStartEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
			expect(scope.showStartEventLink(event, selectedEventStatus)).toBeFalsy();
		});
	});


    describe('showEditGroupsTeamsLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showEditGroupsTeamsLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showEditGroupsTeamsLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showEditGroupsTeamsLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showViewParticipantsLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'current';
    		var user = {
    			privilege: 'participant'
			};
			expect(scope.showViewParticipantsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		var user = {
    			privilege: 'participant'
			};
			expect(scope.showViewParticipantsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'round robin'
			};
    		var selectedEventStatus = 'past';
    		var user = {
    			privilege: 'facility leader'
			};
			expect(scope.showViewParticipantsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'round robin'
			};
    		var selectedEventStatus = 'current';
    		var user = {
    			privilege: 'participant'
			};
    		spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showViewParticipantsLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'round robin'
			};
    		var selectedEventStatus = 'current';
    		var user = {
    			privilege: 'facility leader'
			};
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewParticipantsLink(event, selectedEventStatus, user)).toBeFalsy();
		});
	});

    describe('showViewScheduleLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewScheduleLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'round robin'
			};
    		var selectedEventStatus = 'past';
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewScheduleLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'round robin'
			};
    		var selectedEventStatus = 'current';
    		spyOn(scope, 'canEditEvent').and.returnValue(false);
			expect(scope.showViewScheduleLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'past';
			expect(scope.showViewScheduleLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showViewCompleteEventSetupLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league',
				comb_play: 1
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showViewCompleteEventSetupLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility',
				comb_play: 1
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showViewCompleteEventSetupLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
    		spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showViewCompleteEventSetupLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showViewCreateEventLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showViewCreateEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		spyOn(scope, 'canEditEvent').and.returnValue(true);
			expect(scope.showViewCreateEventLink(event, selectedEventStatus)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
    		spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showViewCreateEventLink(event, selectedEventStatus)).toBeFalsy();
		});
	});

    describe('showViewEventRulesLink Test', function(){
    	it('should return true', function(){
    		var event = {
    			event_type: 'league'
			};
    		var selectedEventStatus = 'upcoming';
    		var user = {
    			privilege: 'facility leader'
			};
    		spyOn(scope, 'canEditEvent').and.returnValue(false);
			expect(scope.showViewEventRulesLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return true', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'upcoming';
    		var user = {
    			privilege: 'participant'
			};
    		spyOn(scope, 'isCaptain').and.returnValue(false);
			expect(scope.showViewEventRulesLink(event, selectedEventStatus, user)).toBeTruthy();
		});
    	it('should return false', function(){
    		var event = {
    			event_type: 'multifacility'
			};
    		var selectedEventStatus = 'past';
    		var user = {
    			privilege: 'facility leader'
			};
    		spyOn(scope, 'isCaptain').and.returnValue(true);
			expect(scope.showViewEventRulesLink(event, selectedEventStatus, user)).toBeFalsy();
		});
	});

});