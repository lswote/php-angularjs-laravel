describe('exportParticipantsModalController Test Suite', function(){

    var q, deferred, scope, rootScope, exportParticipantsModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        exportParticipantsModalService = {
        	downloadEvent: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
        	downloadFacility: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(exportParticipantsModalService, 'downloadEvent').and.callThrough();
        spyOn(exportParticipantsModalService, 'downloadFacility').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	scope = $rootScope.$new();
		scope.exportObject = {
			gender: 'both',
			membership: 'both',
			age: 'both',
			status: 'both',
			affiliation: 'all',
			affiliationValue: ''
		};
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
    		id: 2234
		};
    	rootScope.facility = {
    		id: 234
		};
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('exportParticipantsModalController', {
            $scope: scope,
			exportParticipantsModalService: exportParticipantsModalService
        });
    }));

    describe('clearAffiliation Test', function(){
    	it('should set scope.exportObject.affiliation to its correct value', function(){
    		scope.exportObject = {
    			affiliation: 'aldsfja'
			};
    		scope.clearAffiliation();
    		expect(scope.exportObject.affiliation).toEqual('');
		});
	});

    describe('exportParticipants Test', function(){
		it('should should set scope.callInProgress to its correct value and call exportParticipantsModalService.downloadEvent() and rootScope.toggleModal()', function(){
			scope.exportObject = {
				name: 'aaa'
			};
			scope.callInProgress = false;
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.exportParticipants();
			expect(scope.callInProgress).toBeTruthy();
			expect(exportParticipantsModalService.downloadEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id, scope.exportObject);
			expect(rootScope.toggleModal).toHaveBeenCalled();
		});
		it('should should set scope.callInProgress to its correct value and call exportParticipantsModalService.downloadFacility() and rootScope.toggleModal()', function(){
			scope.exportObject = {
				name: 'aaa'
			};
			rootScope.exportType = 'facility';
			scope.callInProgress = false;
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			scope.exportParticipants();
			expect(scope.callInProgress).toBeTruthy();
			expect(exportParticipantsModalService.downloadFacility).toHaveBeenCalledWith(rootScope.facility.id, scope.exportObject);
			expect(rootScope.toggleModal).toHaveBeenCalled();
		});
	});

});