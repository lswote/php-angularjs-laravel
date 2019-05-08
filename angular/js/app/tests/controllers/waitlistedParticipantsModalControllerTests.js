describe('waitlistedParticipantsModalController Test Suite', function(){

    var q, deferred, scope, rootScope, waitlistedParticipantsModalService, eventLinesService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        waitlistedParticipantsModalService = {
        	getWaitlistedParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					waitlisted_participants: 'mirrors'
				});
                return deferred.promise;
            }
        };
        spyOn(waitlistedParticipantsModalService, 'getWaitlistedParticipants').and.callThrough();
        eventLinesService = {
    		getParticipantsRankings: function(){
    			deferred = q.defer();
                deferred.resolve({
					participants_rankings: 'everything'
                });
                return deferred.promise;
			}
		};
    	spyOn(eventLinesService, 'getParticipantsRankings').and.callThrough();
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
        $controller('waitlistedParticipantsModalController', {
            $scope: scope,
			$rootScope: rootScope,
			waitlistedParticipantsModalService: waitlistedParticipantsModalService,
			eventLinesService: eventLinesService
        });
    }));

    describe('getParticipantsRankings Test', function(){
    	it('should set scope.participantRankings to its correct value after eventLinesService.getParticipantsRankings() returns success', function(){
    		scope.selectedEvent = {
    			activity_id: 4,
				facility_id: 5
			};
    		scope.participantRankings = 'fall';
    		scope.getParticipantsRankings();
    		scope.$apply();
    		expect(eventLinesService.getParticipantsRankings).toHaveBeenCalledWith(scope.selectedEvent.activity_id, scope.selectedEvent.facility_id);
    		expect(scope.participantRankings).toEqual('everything');
		});
	});

	describe('getWaitlistedParticipants Test', function(){
		it('should set scope.getWaitlistedParticipantsInProgress to its correct value.  It should then set scope.waitlistedParticipants to its correct value after ' +
		   'waitlistedParticipantsModalService.getWaitlistedParticipants() returns success', function(){
			scope.getWaitlistedParticipantsInProgress = false;
			scope.waitlistedParticipants = 'sexy';
			scope.getWaitlistedParticipants();
			expect(scope.getWaitlistedParticipantsInProgress).toBeTruthy();
			scope.$apply();
			expect(waitlistedParticipantsModalService.getWaitlistedParticipants).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.waitlistedParticipants).toEqual('mirrors');
			expect(scope.getWaitlistedParticipantsInProgress).toBeFalsy();
		});
	});

});