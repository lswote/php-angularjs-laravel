describe('addSubToLineupModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addSubToLineupModalService, eventTeamsAvailabilityService, eventSubsAvailabilityService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
    	addSubToLineupModalService = {
    		addSubstitute: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
    	spyOn(addSubToLineupModalService, 'addSubstitute').and.callThrough();
    	eventTeamsAvailabilityService = {
    		getAvailability: function(){
        		deferred = q.defer();
                deferred.resolve({
					user_availability: 'cheese'
				});
                return deferred.promise;
			}
		};
    	spyOn(eventTeamsAvailabilityService, 'getAvailability').and.callThrough();
        eventSubsAvailabilityService = {
        	getSubsAvailability: function(){
                deferred = q.defer();
                deferred.resolve({
					sub_availability: 'younger'
				});
                return deferred.promise;
            }
        };
        spyOn(eventSubsAvailabilityService, 'getSubsAvailability').and.callThrough();
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
        $controller('addSubToLineupModalController', {
            $scope: scope,
			addSubToLineupModalService: addSubToLineupModalService,
			eventTeamsAvailabilityService: eventTeamsAvailabilityService,
			eventSubsAvailabilityService: eventSubsAvailabilityService,
			helperService: helperService
        });
    }));

    describe('checkAddSubToLineupsInputs Test', function(){
		it('should set scope.addSubToLineupErrors to its correct value and return false', function(){
			scope.selectedTeamId = null;
			scope.selectedRoundDate = '4/2/2018';
			scope.selectedAvailabilityId = null;
			scope.addSubToLineupErrors = {
				selectedTeamId: false,
				selectedRoundDate: false,
				selectedAvailabilityId: false
			};
			expect(scope.checkAddSubToLineupsInputs()).toBeFalsy();
			expect(scope.addSubToLineupErrors).toEqual({
				selectedTeamId: true,
				selectedRoundDate: false,
				selectedAvailabilityId: true
			});
		});
		it('should not change scope.addSubToLineupErrors and return true', function(){
			scope.selectedTeamId = 4;
			scope.selectedRoundDate = '4/2/2018';
			scope.selectedAvailabilityId = 5;
			scope.addSubToLineupErrors = {
				selectedTeamId: false,
				selectedRoundDate: false,
				selectedAvailabilityId: false
			};
			expect(scope.checkAddSubToLineupsInputs()).toBeTruthy();
			expect(scope.addSubToLineupErrors).toEqual({
				selectedTeamId: false,
				selectedRoundDate: false,
				selectedAvailabilityId: false
			});
		});
	});

    describe('resetAddSubToLineupsInputsErrors Test', function(){
    	it('should reset scope.showSubAvailabilityErrors', function(){
    		scope.addSubToLineupErrors = {
    			selectedTeamId: true,
				selectedRoundDate: true,
				selectedAvailabilityId: true
			};
			scope.resetAddSubToLineupsInputsErrors();
			expect(scope.addSubToLineupErrors).toEqual({
				selectedTeamId: false,
				selectedRoundDate: false,
				selectedAvailabilityId: false
			});
		});
	});

    describe('resetInputs Test', function(){
    	it('should set scope.selectedTeamId, scope.selectedRoundDate, and scope.selectedAvailabilityId to their correct values', function(){
    		scope.selectedTeamId = 4;
			scope.selectedRoundDate = '4/2/2018';
			scope.selectedAvailabilityId = 5;
			scope.resetInputs();
			expect(scope.selectedTeamId).toBeNull();
			expect(scope.selectedRoundDate).toBeNull();
			expect(scope.selectedAvailabilityId).toBeNull();
		});
	});

    describe('parseUsersAvailability Test', function(){
    	it('should set scope.roundDates and scope.teams to their correct values', function(){
    		scope.usersAvailability = [{
    			user: {
    				team_id: 2,
    				team_name: 'red'
				},
				date: 1
			}, {
    			user: {
    				team_id: 2,
    				team_name: 'blue'
				},
				date: 2
			}, {
    			user: {
    				team_id: 3,
    				team_name: 'yellow'
				},
				date: 2
			}];
    		scope.teams = 'come';
    		scope.roundDates = 'baby';
    		spyOn(helperService, 'findArrayIndex').and.returnValue(false);
    		scope.parseUsersAvailability();
    		expect(scope.roundDates).toEqual([1, 2]);
    		expect(scope.teams).toEqual([{
    			id: 2,
				name: 'red'
			}, {
    			id: 2,
				name: 'blue'
			}, {
    			id: 3,
				name: 'yellow'
			}]);
		});
	});

    describe('getAvailability Test', function(){
		it('should set scope.getAvailabilityInProgress to its correct value.  It should then set scope.usersAvailability to its correct value and call ' +
		   'scope.parseUsersAvailability() after eventTeamsAvailabilityService.getAvailability() returns success', function(){
			scope.getAvailabilityInProgress = false;
			scope.usersAvailability = 'veggie';
			spyOn(scope, 'parseUsersAvailability');
			scope.getAvailability();
			expect(scope.getAvailabilityInProgress).toBeTruthy();
			scope.$apply();
			expect(eventTeamsAvailabilityService.getAvailability).toHaveBeenCalledWith(5);
			expect(scope.usersAvailability).toEqual('cheese');
			expect(scope.parseUsersAvailability).toHaveBeenCalled();
			expect(scope.getAvailabilityInProgress).toBeFalsy();
		});
	});

    describe('getSubsAvailability Test', function(){
		it('should then set scope.subsAvailability to its correct value after eventSubsAvailabilityService.getSubsAvailability() returns success', function(){
			scope.subsAvailability = 'wwa222';
			scope.getSubsAvailability();
			spyOn(scope, 'parseUsersAvailability');
			scope.$apply();
			expect(eventSubsAvailabilityService.getSubsAvailability).toHaveBeenCalledWith(5);
			expect(scope.subsAvailability).toEqual('younger');
		});
	});

	describe('updateCompleteRoutine Test', function(){
		it('should set scope.callSuccess to its correct value and call scope.getSubsAvailability() and scope.resetInputs()', function(){
			scope.callSuccess = false;
			spyOn(scope, 'getSubsAvailability');
			spyOn(scope, 'resetInputs');
			scope.updateCompleteRoutine();
			expect(scope.getSubsAvailability).toHaveBeenCalled();
			expect(scope.resetInputs).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
		});
	});



    describe('addSubstitute Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddSubToLineupsInputsErrors() and ' +
		   'scope.checkAddSubToLineupsInputs().  It should then call scope.updateCompleteRoutine() after addSubToLineupModalService.addSubstitute() returns success', function(){
    		scope.selectedTeamId = 43;
    		scope.selectedAvailabilityId = 43888;
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddSubToLineupsInputsErrors');
    		spyOn(scope, 'checkAddSubToLineupsInputs').and.returnValue(true);
    		spyOn(scope, 'updateCompleteRoutine');
    		spyOn(scope, 'parseUsersAvailability');
    		scope.addSubstitute();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddSubToLineupsInputsErrors).toHaveBeenCalled();
    		expect(scope.checkAddSubToLineupsInputs).toHaveBeenCalled();
    		scope.$apply();
    		expect(addSubToLineupModalService.addSubstitute).toHaveBeenCalledWith(5, scope.selectedTeamId, scope.selectedAvailabilityId);
    		expect(scope.updateCompleteRoutine).toHaveBeenCalled();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});