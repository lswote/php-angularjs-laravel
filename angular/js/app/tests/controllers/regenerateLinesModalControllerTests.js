describe('regenerateLinesModalController Test Suite', function(){

    var q, deferred, scope, rootScope, regenerateLinesModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        regenerateLinesModalService = {
            regenerateLines: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(regenerateLinesModalService, 'regenerateLines').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('regenerateLinesModalController', {
            $scope: scope,
			regenerateLinesModalService: regenerateLinesModalService
        });
    }));

	describe('regenerateLines Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call rootScope.toggleModal() after ' +
		   'regenerateLinesModalService.regenerateLines() returns success', function(){
			rootScope.selectedEvent = {
				id: 32
			};
			scope.callInProgress = false;
			scope.callSuccess = true;
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.regenerateLines();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(regenerateLinesModalService.regenerateLines).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(rootScope.toggleModal).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});