describe('closeEventModalController Test Suite', function(){

    var q, deferred, scope, rootScope, closeEventModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        closeEventModalService = {
            closeEvent: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(closeEventModalService, 'closeEvent').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('closeEventModalController', {
            $scope: scope,
			closeEventModalService: closeEventModalService
        });
    }));

	describe('closeEvent Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call rootScope.getEvents() and rootScope.toggleModal() after ' +
		   'closeEventModalService.closeEvent() returns success', function(){
			rootScope.selectedEvent = {
				id: 32
			};
			scope.callInProgress = false;
			scope.callSuccess = true;
			rootScope.getEvents = jasmine.createSpy('getEvents');
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.closeEvent();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(closeEventModalService.closeEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(rootScope.getEvents).toHaveBeenCalled();
			expect(rootScope.toggleModal).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});