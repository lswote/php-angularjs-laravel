describe('startEventModalController Test Suite', function(){

    var q, deferred, scope, rootScope, startEventModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        startEventModalService = {
            startEvent: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(startEventModalService, 'startEvent').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('startEventModalController', {
            $scope: scope,
			startEventModalService: startEventModalService
        });
    }));

	describe('startEvent Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call rootScope.getEvents() and rootScope.toggleModal() ' +
		   'after startEventModalService.startEvent() returns success', function(){
			rootScope.selectedEvent = {
				id: 32
			};
			scope.callInProgress = false;
			scope.callSuccess = true;
			rootScope.getEvents = jasmine.createSpy('getEvents');
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.startEvent();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(startEventModalService.startEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(rootScope.getEvents).toHaveBeenCalled();
			expect(rootScope.toggleModal).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});