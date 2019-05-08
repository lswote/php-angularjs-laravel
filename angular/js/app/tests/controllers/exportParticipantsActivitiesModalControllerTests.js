describe('exportParticipantsActivitiesModalController Test Suite', function(){

    var q, deferred, scope, rootScope, exportParticipantsActivitiesModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        exportParticipantsActivitiesModalService = {
        	download: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(exportParticipantsActivitiesModalService, 'download').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	scope = $rootScope.$new();
    	rootScope = $rootScope;
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('exportParticipantsActivitiesModalController', {
            $scope: scope,
			exportParticipantsActivitiesModalService: exportParticipantsActivitiesModalService
        });
    }));

    describe('exportParticipantsActivities Test', function(){
		it('should should set scope.callInProgress to its correct value and call exportParticipantsActivitiesModalService.download() and rootScope.toggleModal()', function(){
			scope.callInProgress = false;
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.exportParticipantsActivities();
			expect(scope.callInProgress).toBeTruthy();
			expect(exportParticipantsActivitiesModalService.download).toHaveBeenCalled();
			expect(rootScope.toggleModal).toHaveBeenCalled();
		});
	});

});