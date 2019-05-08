describe('eventLeadersController Test Suite', function(){

    var q, deferred, rootScope, scope, eventService, editEventModalService;

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
						name: 'san'
					}
				});
                return deferred.promise;
            }
        };
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        eventService = {
        	getEventLeaders: function(){
        		deferred = q.defer();
                deferred.resolve({
					event_leaders: 'fat'
				});
                return deferred.promise;
			},
			deleteEventLeader: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
        spyOn(eventService, 'getEventLeaders').and.callThrough();
        spyOn(eventService, 'deleteEventLeader').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.selectedEvent = {
        	id: 5,
			name: 'event'
		};
        rootScope.user = {
        	privilege: 'facility leader'
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('eventLeadersController', {
            $scope: scope,
			$routeParams: {
            	id: 15
			},
			eventService: eventService,
			editEventModalService: editEventModalService
        });
    }));

    describe('checkPermissions Test', function(){
    	it('should set scope.displayEventForm and rootScope.selectedEvent to their correct values after editEventModalService.getEvent() returns success', function(){
    		scope.displayEventForm = false;
    		rootScope.selectedEvent = {};
    		scope.checkPermissions();
    		scope.$apply();
    		expect(editEventModalService.getEvent).toHaveBeenCalledWith(15);
    		expect(scope.displayEventForm).toBeTruthy();
    		expect(rootScope.selectedEvent).toEqual({
				id: 1,
				name: 'san'
			});
		});
	});

    describe('getEventLeaders Test', function(){
    	it('should set scope.getEventLeadersInProgress to its correct value.  It should then set scope.eventLeaders to its correct value and call scope.checkPermissions() ' +
		   'after eventService.getEventLeaders() returns success', function(){
    		scope.getEventLeadersInProgress = false;
    		spyOn(scope, 'checkPermissions');
    		scope.getEventLeaders();
    		expect(scope.getEventLeadersInProgress).toBeTruthy();
			scope.$apply();
    		expect(eventService.getEventLeaders).toHaveBeenCalledWith(15);
    		expect(scope.eventLeaders).toEqual('fat');
    		expect(scope.checkPermissions).toHaveBeenCalled();
    		expect(scope.getEventLeadersInProgress).toBeFalsy();
		});
	});

    describe('deleteEventLeader Test', function(){
    	it('should call scope.getEventLeaders() after eventService.deleteEventLeader() returns success', function(){
    		var userId = 45;
    		spyOn(scope, 'getEventLeaders');
    		scope.deleteEventLeader(userId);
    		scope.$apply();
    		expect(eventService.deleteEventLeader).toHaveBeenCalledWith(5, userId);
    		expect(scope.getEventLeaders).toHaveBeenCalled();
		})
	})

});