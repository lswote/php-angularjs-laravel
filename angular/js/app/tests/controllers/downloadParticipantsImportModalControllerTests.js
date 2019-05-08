describe('downloadParticipantsImportModalController Test Suite', function(){

    var scope, rootScope, deferred, q, window;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $window, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('downloadParticipantsImportModalController', {
            $scope: scope
        });
    }));

    describe('downloadParticipantsImport Test', function(){
		it('should set scope.callInProgress to its correct value and call window.open() and rootScope.toggleModal()', function(){
			scope.callInProgress = false;
			spyOn(window, 'open');
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.downloadParticipantsImport();
			expect(scope.callInProgress).toBeTruthy();
			expect(window.open).toHaveBeenCalled();
			expect(rootScope.toggleModal).toHaveBeenCalled();
		});
	});

});