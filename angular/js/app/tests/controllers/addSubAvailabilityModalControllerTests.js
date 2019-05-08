describe('addSubAvailabilityModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addSubAvailabilityModalService, emailService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        addSubAvailabilityModalService = {
        	getSubstitutes: function(){
                deferred = q.defer();
                deferred.resolve({
					substitutes: 'younger'
				});
                return deferred.promise;
            },
			addSubstitute: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(addSubAvailabilityModalService, 'getSubstitutes').and.callThrough();
        spyOn(addSubAvailabilityModalService, 'addSubstitute').and.callThrough();
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
        $controller('addSubAvailabilityModalController', {
            $scope: scope,
			addSubAvailabilityModalService: addSubAvailabilityModalService,
			emailService: emailService,
			helperService: helperService
        });
    }));

    describe('checkAddSubAvailabilityInput Test', function(){
		it('should set scope.showSubAvailabilityErrors to its correct value and return false', function(){
			scope.addSubAvailabilityObject = {
				username: null
			};
			scope.showSubAvailabilityErrors = {
				username: false
			};
			expect(scope.checkAddSubAvailabilityInput()).toBeFalsy();
			expect(scope.showSubAvailabilityErrors).toEqual({
				username: true
			});
		});
		it('should not change scope.showSubAvailabilityErrors and return true', function(){
			scope.addSubAvailabilityObject = {
				username: 'adf@adsg.com'
			};
			scope.showSubAvailabilityErrors = {
				username: false
			};
			expect(scope.checkAddSubAvailabilityInput()).toBeTruthy();
			expect(scope.showSubAvailabilityErrors).toEqual({
				username: false
			});
		});
	});

    describe('resetAddSubAvailabilityErrors Test', function(){
    	it('should reset scope.showSubAvailabilityErrors', function(){
    		scope.showSubAvailabilityErrors = {
				username: true
			};
			scope.resetAddSubAvailabilityErrors();
			expect(scope.showSubAvailabilityErrors).toEqual({
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
	});

    describe('getEventSubstitutes Test', function(){
    	it('should set scope.eventSubstitutes to its correct value after addSubAvailabilityModalService.getSubstitutes() returns success', function(){
    		scope.eventSubstitutes = 'kill';
			scope.getEventSubstitutes();
			scope.$apply();
			expect(addSubAvailabilityModalService.getSubstitutes).toHaveBeenCalledWith(5);
			expect(scope.eventSubstitutes).toEqual('younger');
		});
	});

    describe('initUsernameWatch Test', function(){
    	it('should initiate a watcher on scope.addSubAvailabilityObject.username.  The watcher should then set scope.foundParticipants to its correct value', function(){
    		scope.initUsernameWatch();
    		scope.addSubAvailabilityObject = {
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
    		scope.addSubAvailabilityObject = {
    			username: 'soldier'
			};
    		scope.foundParticipants = 'heyo';
    		spyOn(helperService, 'findArrayIndex').and.returnValues(4, 4);
			scope.$apply();
    		expect(scope.foundParticipants).toEqual([{
    			first_name: 'won',
				last_name: 'thing',
				username: 'soldier',
				currentSubstitute: true
			}]);
		});
	});

    describe('selectFoundParticipant Test', function(){
    	it('should set scope.addSubAvailabilityObject and scope.foundParticipants to their correct values and call scope.clearUsernameWatch() and ' +
		   'scope.initUsernameWatch()', function(){
    		scope.addSubAvailabilityObject = {
    			username: 'sam'
			};
			scope.foundParticipants = [1, 2];
			spyOn(scope, 'clearUsernameWatch');
			spyOn(scope, 'initUsernameWatch');
			scope.selectFoundParticipant('samantha');
			expect(scope.clearUsernameWatch).toHaveBeenCalled();
			expect(scope.addSubAvailabilityObject.username).toEqual('samantha');
			expect(scope.initUsernameWatch).toHaveBeenCalled();
			expect(scope.foundParticipants).toEqual([]);
		});
	});

    describe('addSubstitute Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddSubAvailabilityErrors() and scope.checkAddSubAvailabilityInput().  ' +
		   'It should then set scope.addSubAvailabilityObject to its correct values and call scope.getEventSubstitutes() after addSubAvailabilityModalService.addSubstitute() ' +
		   'returns success', function(){
    		rootScope.selectedEvent = {
    			id: 4
			};
    		scope.addSubAvailabilityObject = {
    			username: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddSubAvailabilityErrors');
    		spyOn(scope, 'checkAddSubAvailabilityInput').and.returnValue(true);
    		spyOn(scope, 'getEventSubstitutes');
    		scope.addSubstitute();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddSubAvailabilityErrors).toHaveBeenCalled();
    		expect(scope.checkAddSubAvailabilityInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(addSubAvailabilityModalService.addSubstitute).toHaveBeenCalledWith(rootScope.selectedEvent.id, 'white');
    		expect(scope.getEventSubstitutes).toHaveBeenCalled();
    		expect(scope.addSubAvailabilityObject).toEqual({
				username: null
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});