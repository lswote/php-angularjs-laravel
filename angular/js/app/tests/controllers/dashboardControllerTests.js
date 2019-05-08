describe('dashboardController Test Suite', function(){

    var q, deferred, rootScope, scope, dashboardService;

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
			},
			formatDate: function(){
            	return 'Mar 1, 18';
			}
        };
        spyOn(dashboardService, 'getEvents').and.callThrough();
        spyOn(dashboardService, 'getFacilityInfo').and.callThrough();
        spyOn(dashboardService, 'formatDate').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('dashboardController', {
            $scope: scope,
			dashboardService: dashboardService
        });
    }));

    describe('getFacilityInfo Test', function(){
    	it('should set rootScope.facility to its correct value after dashboardService.getFacilityInfo() returns success', function(){
    		rootScope.facility = 'pig farm';
    		spyOn(scope, 'parseCurrentEvents');
    		spyOn(scope, 'parseUpcomingEvents');
			scope.getFacilityInfo();
			scope.$apply();
			expect(dashboardService.getFacilityInfo).toHaveBeenCalled();
			expect(rootScope.facility).toEqual({
				name: 'heat',
				image_url: '../../../images/meds.jpg'
			});
		});
	});

    describe('parseCurrentEvents Test', function(){
    	it('should return an array with the correct value', function(){
			var events = [{
				name: 'first',
				started: 1,
				completed: 0,
				start_date: '2018-03-01',
				event_leaders: ['egg']
			}, {
				name: 'second',
				started: 0,
				completed: 0,
				start_date: '2018-03-01'
			}];
			spyOn(scope, 'hasTeamAssignmentOccurred').and.returnValue('aaa');
			expect(scope.parseCurrentEvents(events)).toEqual([{
				name: 'first',
				started: 1,
				completed: 0,
				start_date: '2018-03-01',
				start_date_string: 'Mar 1, 18',
				has_team_assignment_occurred: 'aaa',
				event_leaders: ['egg']
			}]);
		});
	});

    describe('hasTeamAssignmentOccurred', function(){
    	it('should return the correct value', function(){
			var eventTeamUsers = [{
				user_id: null
			}, {
				user_id: null
			}, {
				user_id: null
			}];
			expect(scope.hasTeamAssignmentOccurred(eventTeamUsers)).toBeFalsy();
		});
    	it('should return the correct value', function(){
			var eventTeamUsers = [{
				user_id: null,
				event_team_id: null
			}, {
				user_id: 2,
				event_team_id: 3
			}, {
				user_id: 4,
				event_team_id: null
			}];
			expect(scope.hasTeamAssignmentOccurred(eventTeamUsers)).toBeTruthy();
		});
	});

    describe('parseUpcomingEvents Test', function(){
    	it('should return an array with the correct value', function(){
			var events = [{
				name: 'first',
				started: 1,
				completed: 0,
				start_date: '2018-03-01'
			}, {
				name: 'second',
				started: 0,
				completed: 0,
				start_date: '2018-03-01',
				event_leaders: [],
				users: [{
					pivot: {
						rsvped: 'more'
					}
				}]
			}];
			spyOn(scope, 'hasTeamAssignmentOccurred').and.returnValue(4);
			expect(scope.parseUpcomingEvents(events)).toEqual([{
				name: 'second',
				started: 0,
				completed: 0,
				start_date: '2018-03-01',
				start_date_string: 'Mar 1, 18',
				event_leaders: [],
				users: [{
					pivot: {
						rsvped: 'more'
					}
				}],
				has_team_assignment_occurred: 4
			}]);
		});
	});

    describe('getEvents Test', function(){
    	it('should set scope.getEventsInProgress and scope.getEventsFailed to their correct values.  It should set scope.currentEvents and scope.upcomingEvents to their ' +
		   'correct values after dashboardService.getEvents() returns success', function(){
    		scope.getEventsInProgress = false;
    		scope.getEventsFailed = true;
    		scope.currentEvents = null;
    		scope.upcomingEvents = '';
    		spyOn(scope, 'parseCurrentEvents').and.returnValue('blue');
    		spyOn(scope, 'parseUpcomingEvents').and.returnValue('purple');
    		scope.getEvents();
    		expect(scope.getEventsInProgress).toBeTruthy();
    		expect(scope.getEventsFailed).toBeFalsy();
    		scope.$apply();
    		expect(dashboardService.getEvents).toHaveBeenCalled();
    		expect(scope.currentEvents).toEqual('blue');
    		expect(scope.upcomingEvents).toEqual('purple');
    		expect(scope.getEventsInProgress).toBeFalsy()
		});
	});

});