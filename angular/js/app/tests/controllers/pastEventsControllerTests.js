describe('pastEventsController Test Suite', function(){

    var q, deferred, rootScope, scope, dashboardService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        dashboardService = {
            getEvents: function(){
                deferred = q.defer();
                deferred.resolve('hottub');
                return deferred.promise;
            },
			getFacilityInfo: function(){
				deferred = q.defer();
				deferred.resolve({
					success: true,
					error: null,
					facility: {
						name: 'heat'
					}
				});
				return deferred.promise;
			}
        };
        spyOn(dashboardService, 'getEvents').and.callThrough();
        spyOn(dashboardService, 'getFacilityInfo').and.callThrough();
        helperService = {
            formatDate: function(){
                return 'Mar 1, 18';
            }
        };
        spyOn(helperService, 'formatDate').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('pastEventsController', {
            $scope: scope,
			dashboardService: dashboardService,
			helperService: helperService
        });
    }));

    describe('getFacilityInfo Test', function(){
    	it('should set rootScope.facility to its correct value after dashboardService.getFacilityInfo() returns success', function(){
    		rootScope.facility = 'pig farm';
    		spyOn(scope, 'parsePastEvents');
			scope.getFacilityInfo();
			scope.$apply();
			expect(dashboardService.getFacilityInfo).toHaveBeenCalled();
			expect(rootScope.facility).toEqual({
				name: 'heat',
				image_url: '../../../images/meds.jpg'
			});
		});
	});

    describe('parsePastEvents Test', function(){
    	it('should return an array with the correct value', function(){
			var events = [{
				name: 'first',
				started: 1,
				completed: 1,
				start_date: '2018-03-01',
				event_leaders: ['egg']
			}, {
				name: 'second',
				started: 0,
				completed: 0,
				start_date: '2018-03-01',
				event_leaders: ['egg']
			}];
			expect(scope.parsePastEvents(events)).toEqual([{
				name: 'first',
				started: 1,
				completed: 1,
				start_date: '2018-03-01',
				start_date_string: 'Mar 1, 18',
				event_leaders: ['egg']
			}]);
		});
	});

    describe('getEvents Test', function(){
    	it('should set scope.getEventsInProgress and scope.getEventsFailed to their correct values.  It should set scope.pastEvents to its ' +
		   'correct value after dashboardService.getEvents() returns success', function(){
    		scope.getEventsInProgress = false;
    		scope.getEventsFailed = true;
    		scope.pastEvents = null;
    		spyOn(scope, 'parsePastEvents').and.returnValue('blue');
    		scope.getEvents();
    		expect(scope.getEventsInProgress).toBeTruthy();
    		expect(scope.getEventsFailed).toBeFalsy();
    		scope.$apply();
    		expect(dashboardService.getEvents).toHaveBeenCalled();
    		expect(scope.pastEvents).toEqual('blue');
    		expect(scope.getEventsInProgress).toBeFalsy()
		});
	});

});