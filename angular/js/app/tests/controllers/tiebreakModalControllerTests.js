describe('tiebreakModalController Test Suite', function(){

    var q, deferred, scope, rootScope, tiebreakModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        tiebreakModalService = {
        	getTeamsWithStats: function(){
                deferred = q.defer();
                deferred.resolve({
					teams: 'mirrors'
				});
                return deferred.promise;
            }
        };
        spyOn(tiebreakModalService, 'getTeamsWithStats').and.callThrough();
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
        $controller('tiebreakModalController', {
            $scope: scope,
			$rootScope: rootScope,
			tiebreakModalService: tiebreakModalService
        });
    }));

    describe('getTeamsWithStats Test', function(){
    	it('should set scope.getTeamsInProgress to its correct value.  It should then set scope.teams to its correct value after eventLinesService.getParticipantsRankings() ' +
		   'returns success', function(){
    		scope.getTeamsInProgress = false;
    		scope.teams = 'fall';
    		scope.getTeamsWithStats();
    		expect(scope.getTeamsInProgress).toBeTruthy();
    		scope.$apply();
    		expect(tiebreakModalService.getTeamsWithStats).toHaveBeenCalledWith(rootScope.selectedEvent.id);
    		expect(scope.teams).toEqual('mirrors');
    		expect(scope.getTeamsInProgress).toBeFalsy();
		});
	});

});