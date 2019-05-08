describe('editEventModalController Test Suite', function(){

    var q, deferred, scope, rootScope, editEventModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        editEventModalService = {
        	getEvent: function(){
				deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'State Champs 2018',
						event_type: 'social',
						start_date: '1/1/2018',
						event_leaders: [{
							first_name: 'mary',
							last_name: 'smith'
						}]
					}
				});
                return deferred.promise;
			},
            edit: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        spyOn(editEventModalService, 'edit').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
			id: 11
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('editEventModalController', {
            $scope: scope,
			editEventModalService: editEventModalService
        });
    }));

    describe('getEvent Test', function(){
    	it('should set scope.event to its correct value after editEventModalService.getEvent() returns success', function(){
    		scope.event = {};
    		scope.getEvent();
    		scope.$apply();
    		expect(editEventModalService.getEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
    		expect(scope.event).toEqual({
				id: 1,
				name: 'State Champs 2018',
				eventType: 'social',
				eventLeaderName: 'mary smith',
				startDate: '1/1/2018'
			});
		});
	});

    describe('checkEditEventInput Test', function(){
		it('should set scope.showEditEventErrors to its correct value and return false', function(){
			scope.event = {
				name: null,
				eventLeaderName: null,
				startDate: null
			};
			scope.showEditEventErrors = {
				name: false
			};
			expect(scope.checkEditEventInput()).toBeFalsy();
			expect(scope.showEditEventErrors).toEqual({
				name: true
			});
		});
		it('should not change scope.showEditEventErrors and return true', function(){
			scope.event = {
				name: 'light it up',
				eventLeaderName: null,
				startDate: '2222'
			};
			scope.showEditEventErrors = {
				name: false
			};
			expect(scope.checkEditEventInput()).toBeTruthy();
			expect(scope.showEditEventErrors).toEqual({
				name: false
			});
		});
	});

    describe('editEvent Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.checkEditEventInput().  It should ' +
		   'then call rootScope.getEvents() after editEventModalService.edit() returns success', function(){
    		scope.event = {
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'checkEditEventInput').and.returnValue(true);
    		rootScope.getEvents = jasmine.createSpy('getEvents');
    		scope.editEvent();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.checkEditEventInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(editEventModalService.edit).toHaveBeenCalledWith({
				egg: 'white'
			});
    		expect(rootScope.getEvents).toHaveBeenCalled();
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});