describe('addWaitlistedParticipantToTeamModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addWaitlistedParticipantToTeamModalService, waitlistedParticipantsModalService, eventService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        addWaitlistedParticipantToTeamModalService = {
        	getOpenSlots: function(){
                deferred = q.defer();
                deferred.resolve({
					open_slots: 'shire'
				});
                return deferred.promise;
            },
			setAsCaptain: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(addWaitlistedParticipantToTeamModalService, 'getOpenSlots').and.callThrough();
        spyOn(addWaitlistedParticipantToTeamModalService, 'setAsCaptain').and.callThrough();
        waitlistedParticipantsModalService = {
        	getWaitlistedParticipants: function(){
        		deferred = q.defer();
                deferred.resolve({
					waitlisted_participants: [{
						sex: 'male'
					}]
				});
                return deferred.promise;
			}
		};
		spyOn(waitlistedParticipantsModalService, 'getWaitlistedParticipants').and.callThrough();
		eventService = {
        	updateEventTeams: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
		spyOn(eventService, 'updateEventTeams').and.callThrough();
		helperService = {
			findArrayIndex: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
    		id: 5
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('addWaitlistedParticipantToTeamModalController', {
            $scope: scope,
			addWaitlistedParticipantToTeamModalService: addWaitlistedParticipantToTeamModalService,
			waitlistedParticipantsModalService: waitlistedParticipantsModalService,
			eventService: eventService,
			helperService: helperService
        });
    }));

    describe('checkAddWaitlistedParticipantToTeamInputs Test', function(){
		it('should set scope.addWaitlistedParticipantToTeamErrors to its correct value and return false', function(){
			scope.selectedParticipantId = null;
			scope.selectedTeamId = null;
			scope.selectedEventTeamUserId = null;
			scope.addAsCaptain = null;
			scope.addWaitlistedParticipantToTeamErrors = {
				selectedParticipantId: false,
				selectedTeamId: false,
				selectedEventTeamUserId: false,
				addAsCaptain: false
			};
			expect(scope.checkAddWaitlistedParticipantToTeamInputs()).toBeFalsy();
			scope.addWaitlistedParticipantToTeamErrors = {
				selectedParticipantId: true,
				selectedTeamId: true,
				selectedEventTeamUserId: true,
				addAsCaptain: true
			};
		});
		it('should not change scope.addWaitlistedParticipantToTeamErrors and return true', function(){
			scope.selectedParticipantId = 2;
			scope.selectedTeamId = 3;
			scope.selectedEventTeamUserId = 2212;
			scope.addAsCaptain = '1';
			scope.addWaitlistedParticipantToTeamErrors = {
				selectedParticipantId: false,
				selectedTeamId: false,
				selectedEventTeamUserId: false,
				addAsCaptain: false
			};
			expect(scope.checkAddWaitlistedParticipantToTeamInputs()).toBeTruthy();
			expect(scope.addWaitlistedParticipantToTeamErrors).toEqual({
				selectedParticipantId: false,
				selectedTeamId: false,
				selectedEventTeamUserId: false,
				addAsCaptain: false
			});
		});
	});

    describe('resetAddWaitlistedParticipantToTeamErrors Test', function(){
    	it('should reset scope.addWaitlistedParticipantToTeamErrors', function(){
    		scope.addWaitlistedParticipantToTeamErrors = {
    			selectedParticipantId: false,
				selectedTeamId: true,
				selectedEventTeamUserId: false,
				addAsCaptain: true
			};
			scope.resetAddWaitlistedParticipantToTeamErrors();
			expect(scope.addWaitlistedParticipantToTeamErrors).toEqual({
				selectedParticipantId: false,
				selectedTeamId: false,
				selectedEventTeamUserId: false,
				addAsCaptain: false
			});
		});
	});

    describe('getWaitlistedParticipants Test', function(){
    	it('should set scope.waitlistedParticipants to its correct value after waitlistedParticipantsModalService.getWaitlistedParticipants() returns success', function(){
    		scope.waitlistedParticipants = 'blue';
    		scope.getWaitlistedParticipants();
    		scope.$apply();
    		expect(waitlistedParticipantsModalService.getWaitlistedParticipants).toHaveBeenCalledWith(rootScope.selectedEvent.id);
    		expect(scope.waitlistedParticipants).toEqual([{
    			sex: 'male'
			}]);
		});
	});

	describe('$watch selectedParticipantId Test', function(){
		it('should set scope.selectedSex and scope.selectedTeamId to their correct values', function(){
			scope.waitlistedParticipants = [{
				sex: 'male'
			}];
			scope.selectedSex = 'female';
			scope.selectedTeamId = 43;
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			spyOn(scope, 'getWaitlistedParticipants');
			scope.selectedParticipantId = 4;
			scope.$apply();
			scope.selectedParticipantId = 5;
			scope.$apply();
			expect(scope.selectedSex).toEqual('male');
			expect(scope.selectedTeamId).toBeNull();
		});
	});

	describe('parseOpenSlots Test', function(){
		it('should set scope.teamsWithOpenFemaleSlots and scope.teamsWithOpenMaleSlots to their correct values', function(){
			scope.teamsWithOpenFemaleSlots = 'one';
			scope.teamsWithOpenMaleSlots = 'two';
			scope.openSlots = [{
				sex: 'female',
				event_teams: 1
			}, {
				sex: 'female',
				event_teams: 2
			}, {
				sex: 'male',
				event_teams: 3
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(false);
			scope.parseOpenSlots();
			expect(scope.teamsWithOpenFemaleSlots).toEqual([1 , 2]);
			expect(scope.teamsWithOpenMaleSlots).toEqual([3]);
		});
	});

	describe('getOpenSlots Test', function(){
		it('should set scope.openSlots to its correct value and call scope.parseOpenSlots() after addWaitlistedParticipantToTeamModalService.getOpenSlots() returns ' +
		   'success', function(){
			scope.openSlots = 'eeee';
			spyOn(scope, 'parseOpenSlots');
			scope.getOpenSlots();
			scope.$apply();
			expect(addWaitlistedParticipantToTeamModalService.getOpenSlots).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.openSlots).toEqual('shire');
			expect(scope.parseOpenSlots).toHaveBeenCalled();
		});
	});

	describe('updateGroupsWithOpenSlots Test', function(){
		it('should set scope.groupsWithOpenSlots to its correct value', function(){
			scope.selectedTeamId = 3;
			scope.openSlots = [{
				id: 1,
				event_team_id: 3,
				group_number: 1
			}, {
				id: 2,
				event_team_id: 3,
				group_number: 2
			}, {
				id: 3,
				event_team_id: 2,
				group_number: 1
			}];
			scope.groupsWithOpenSlots = 'thinking';
			spyOn(helperService, 'findArrayIndex').and.returnValue(false);
			scope.updateGroupsWithOpenSlots();
			expect(scope.groupsWithOpenSlots).toEqual([{
				event_team_user_id: 1,
				event_team_id: 3,
				group_number: 1
			}, {
				event_team_user_id: 2,
				event_team_id: 3,
				group_number: 2
			}]);
		});
	});

	describe('$watch selectedTeamId Test', function(){
		it('should set scope.selectedEventTeamUserId to its correct value and call scope.updateGroupsWithOpenSlots()', function(){
			scope.selectedEventTeamUserId = 444;
			spyOn(scope, 'updateGroupsWithOpenSlots');
			scope.selectedTeamId = 2;
			scope.$apply();
			scope.selectedTeamId = 3;
			scope.$apply();
			expect(scope.updateGroupsWithOpenSlots).toHaveBeenCalled();
			expect(scope.selectedEventTeamUserId).toBeNull();
		});
	});
	
	describe('resetInputs Test', function(){
		it('should set scope.selectedParticipantId, scope.selectedSex, scope.selectedTeamId, scope.selectedEventTeamUserId, and scope.addAsCaptain to their correct ' +
		   'values', function(){
			scope.selectedParticipantId = 33;
			scope.selectedSex = 'male';
			scope.selectedTeamId = 22;
			scope.selectedEventTeamUserId = 1;
			scope.addAsCaptain = '0';
			scope.resetInputs();
			expect(scope.selectedParticipantId).toBeNull();
			expect(scope.selectedSex).toBeNull();
			expect(scope.selectedTeamId).toBeNull();
			expect(scope.selectedParticipantId).toBeNull();
			expect(scope.addAsCaptain).toBeNull();
		});
	});

	describe('updateCompleteRoutine Test', function(){
		it('should set scope.callSuccess to its correct value and call scope.getOpenSlots(), scope.getWaitlistedParticipants(), and scope.resetInputs()', function(){
			scope.callSuccess = false;
			spyOn(scope, 'getOpenSlots');
			spyOn(scope, 'getWaitlistedParticipants');
			spyOn(scope, 'resetInputs');
			scope.updateCompleteRoutine();
			expect(scope.getOpenSlots).toHaveBeenCalled();
			expect(scope.getWaitlistedParticipants).toHaveBeenCalled();
			expect(scope.resetInputs).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
		});
	});

	describe('addWaitlistedParticipant Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddWaitlistedParticipantToTeamErrors() and ' +
		   'scope.checkAddWaitlistedParticipantToTeamInputs().  It should then call scope.updateCompleteRoutine() after eventService.updateEventTeams() and ' +
		   'addWaitlistedParticipantToTeamModalService.setAsCaptain() return success', function(){
			scope.selectedEventTeamUserId = 3332;
			scope.selectedParticipantId = 4432;
			scope.addAsCaptain = '1';
			scope.callInProgress = false;
			scope.callSuccess = true;
			spyOn(scope, 'resetAddWaitlistedParticipantToTeamErrors');
			spyOn(scope, 'checkAddWaitlistedParticipantToTeamInputs').and.returnValue(true);
			spyOn(scope, 'updateCompleteRoutine');
			scope.addWaitlistedParticipant();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.resetAddWaitlistedParticipantToTeamErrors).toHaveBeenCalled();
			expect(scope.checkAddWaitlistedParticipantToTeamInputs).toHaveBeenCalled();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(eventService.updateEventTeams).toHaveBeenCalledWith(rootScope.selectedEvent.id, [{
				id: scope.selectedEventTeamUserId,
				user_id: scope.selectedParticipantId
			}]);
			expect(addWaitlistedParticipantToTeamModalService.setAsCaptain).toHaveBeenCalledWith(rootScope.selectedEvent.id, scope.selectedEventTeamUserId);
			expect(scope.updateCompleteRoutine).toHaveBeenCalled();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});