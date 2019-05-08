describe('notConfirmedParticipantsModalController Test Suite', function(){

    var q, deferred, scope, rootScope, notConfirmedParticipantsModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        notConfirmedParticipantsModalService = {
        	getNotConfirmedParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					unconfirmed_participants: 'mirrors'
				});
                return deferred.promise;
            }
        };
        spyOn(notConfirmedParticipantsModalService, 'getNotConfirmedParticipants').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	scope = $rootScope.$new();
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
			id: 11
		};
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('notConfirmedParticipantsModalController', {
            $scope: scope,
			$rootScope: rootScope,
			notConfirmedParticipantsModalService: notConfirmedParticipantsModalService
        });
    }));

	describe('getNotConfirmedParticipants Test', function(){
		it('should set scope.getNotConfirmedParticipantsInProgress to its correct value.  It should then set scope.notConfirmedParticipants to its correct value after ' +
		   'notConfirmedParticipantsModalService.getNotConfirmedParticipants() returns success', function(){
			scope.getNotConfirmedParticipantsInProgress = false;
			scope.notConfirmedParticipants = 'sexy';
			scope.getNotConfirmedParticipants();
			expect(scope.getNotConfirmedParticipantsInProgress).toBeTruthy();
			scope.$apply();
			expect(notConfirmedParticipantsModalService.getNotConfirmedParticipants).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.notConfirmedParticipants).toEqual('mirrors');
			expect(scope.getNotConfirmedParticipantsInProgress).toBeFalsy();
		});
	});

});