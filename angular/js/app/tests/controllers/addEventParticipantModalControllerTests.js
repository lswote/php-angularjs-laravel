describe('addEventParticipantModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addEventParticipantModalService, emailService, dashboardService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        addEventParticipantModalService = {
        	addEventParticipant: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			getEventParticipants: function(){
        		deferred = q.defer();
                deferred.resolve({
					participants: 'bag'
				});
                return deferred.promise;
			}
        };
        spyOn(addEventParticipantModalService, 'addEventParticipant').and.callThrough();
        spyOn(addEventParticipantModalService, 'getEventParticipants').and.callThrough();
        emailService = {
        	getPotentialParticipants: function(){
        		deferred = q.defer();
                deferred.resolve({
					participants: 'criminal'
				});
                return deferred.promise;
			}
		};
		spyOn(emailService, 'getPotentialParticipants').and.callThrough();
		dashboardService = {
        	getFacilityInfo: function(){
        		deferred = q.defer();
                deferred.resolve({
					facility: {
						users: ['a', 'b', 'c']
					}
				});
                return deferred.promise;
			}
		};
		spyOn(dashboardService, 'getFacilityInfo').and.callThrough();
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
        $controller('addEventParticipantModalController', {
            $scope: scope,
			addEventParticipantModalService: addEventParticipantModalService,
			emailService: emailService,
			dashboardService: dashboardService,
			helperService: helperService
        });
    }));

    describe('checkAddEventParticipantInput Test', function(){
		it('should set scope.showAddEventParticipantErrors to its correct value and return false', function(){
			scope.addEventParticipantObject = {
				username: null
			};
			scope.showAddEventParticipantErrors = {
				username: false
			};
			expect(scope.checkAddEventParticipantInput()).toBeFalsy();
			expect(scope.showAddEventParticipantErrors).toEqual({
				username: true
			});
		});
		it('should not change scope.showAddEventParticipantErrors and return true', function(){
			scope.addEventParticipantObject = {
				username: 'adf@adsg.com'
			};
			scope.showAddEventParticipantErrors = {
				username: false
			};
			expect(scope.checkAddEventParticipantInput()).toBeTruthy();
			expect(scope.showAddEventParticipantErrors).toEqual({
				username: false
			});
		});
	});

    describe('resetAddEventParticipantErrors Test', function(){
    	it('should reset scope.showAddEventParticipantErrors', function(){
    		scope.showAddEventParticipantErrors = {
				username: true
			};
			scope.resetAddEventParticipantErrors();
			expect(scope.showAddEventParticipantErrors).toEqual({
				username: false
			});
		});
	});

    describe('getPotentialParticipants Test', function(){
    	it('should set scope.potentialParticipants to its correct value after emailService.getPotentialParticipants() returns success', function(){
    		scope.potentialParticipants = 'beautiful';
			scope.getPotentialParticipants();
			scope.$apply();
			expect(emailService.getPotentialParticipants).toHaveBeenCalledWith(5);
			expect(scope.potentialParticipants).toEqual('criminal');
		});
    	it('should set scope.potentialParticipants to its correct value after dashboardService.getFacilityInfo() returns success', function(){
    		rootScope.selectedEvent = {
    			event_type: 'multifacility'
			};
    		scope.potentialParticipants = 'beautiful';
			scope.getPotentialParticipants();
			scope.$apply();
			expect(dashboardService.getFacilityInfo).toHaveBeenCalledWith();
			expect(scope.potentialParticipants).toEqual(['a', 'b', 'c']);
		});
	});

    describe('getEventParticipants Test', function(){
    	it('should set scope.eventParticipants to its correct value after addEventParticipantModalService.getEventParticipants() returns success', function(){
    		scope.eventParticipants = 'kill';
			scope.getEventParticipants();
			scope.$apply();
			expect(addEventParticipantModalService.getEventParticipants).toHaveBeenCalledWith(5);
			expect(scope.eventParticipants).toEqual('bag');
		});
	});

    describe('initUsernameWatch Test', function(){
    	it('should initiate a watcher on scope.addEventParticipantObject.username.  The watcher should then set scope.foundParticipants to its correct value', function(){
    		scope.initUsernameWatch();
    		scope.addEventParticipantObject = {
    			username: 'cheese'
			};
    		scope.$apply();
    		scope.potentialParticipants = [{
    			first_name: 'back',
				last_name: 'burner',
				username: 'down'
			}, {
    			first_name: 'bring',
				last_name: 'yourself',
				username: 'lights'
			}, {
    			first_name: 'won',
				last_name: 'thing',
				username: 'soldier'
			}];
    		scope.addEventParticipantObject = {
    			username: 'soldier'
			};
    		scope.foundParticipants = 'heyo';
    		spyOn(helperService, 'findArrayIndex').and.returnValues(4, 4);
			scope.$apply();
    		expect(scope.foundParticipants).toEqual([{
    			first_name: 'won',
				last_name: 'thing',
				username: 'soldier',
				alreadySelected: true
			}]);
		});
	});

    describe('selectFoundParticipant Test', function(){
    	it('should set scope.addEventParticipantObject and scope.foundParticipants to their correct values and call scope.clearUsernameWatch() and ' +
		   'scope.initUsernameWatch()', function(){
    		scope.addEventParticipantObject = {
    			username: 'sam'
			};
			scope.foundParticipants = [1, 2];
			spyOn(scope, 'clearUsernameWatch');
			spyOn(scope, 'initUsernameWatch');
			scope.selectFoundParticipant('samantha');
			expect(scope.clearUsernameWatch).toHaveBeenCalled();
			expect(scope.addEventParticipantObject.username).toEqual('samantha');
			expect(scope.initUsernameWatch).toHaveBeenCalled();
			expect(scope.foundParticipants).toEqual([]);
		});
	});

    describe('toggleCaptainDesignation Test', function(){
    	it('should set scope.participantType to its correct value', function(){
    		scope.participantType = 'participant';
    		scope.toggleCaptainDesignation();
    		expect(scope.participantType).toEqual('captain');
    		scope.toggleCaptainDesignation();
    		expect(scope.participantType).toEqual('participant');
		});
	});

    describe('addEventParticipant Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddEventParticipantErrors() and scope.checkAddEventParticipantInput().  ' +
		   'It should then set scope.addEventParticipantObject and scope.participantType to their correct values and call scope.getEventParticipants() after ' +
		   'addEventParticipantModalService.addEventParticipant() returns success', function(){
    		rootScope.selectedEvent = {
    			id: 4
			};
    		scope.addEventParticipantObject = {
    			username: 'white'
			};
			scope.participantType = 'omelet';
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddEventParticipantErrors');
    		spyOn(scope, 'checkAddEventParticipantInput').and.returnValue(true);
    		spyOn(scope, 'getEventParticipants');
    		scope.addEventParticipant();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddEventParticipantErrors).toHaveBeenCalled();
    		expect(scope.checkAddEventParticipantInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(addEventParticipantModalService.addEventParticipant).toHaveBeenCalledWith(rootScope.selectedEvent.id, 'white', 'omelet');
    		expect(scope.getEventParticipants).toHaveBeenCalled();
    		expect(scope.addEventParticipantObject).toEqual({
				username: null
			});
    		expect(scope.participantType).toEqual('participant');
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});