describe('eventStandingsController Test Suite', function(){

    var q, deferred, scope, rootScope, window, eventStandingsService, eventService, editEventModalService, dashboardService, eventLinesService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
        module(function($provide){
        	$provide.value('$window', {
        		alert: function(){},
                location: {
                	href: ''
                }
            });
		});
    });

    // Mock out fake service
    beforeEach(function(){
    	eventStandingsService = {
    		getStandings: function(){
    			deferred = q.defer();
                deferred.resolve({
					teams: 'beans'
				});
                return deferred.promise;
			}
		};
    	spyOn(eventStandingsService, 'getStandings').and.callThrough();
        eventService = {
        	getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve({
					events: 'haunt'
				});
                return deferred.promise;
            },
			getEventMatches: function(){
        		deferred = q.defer();
                deferred.resolve({
					matches: 'strawberry'
				});
                return deferred.promise;
			}
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        spyOn(eventService, 'getEventMatches').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
        		deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'sam',
						event_type: 'social',
						type_of_play: 'mixed',
						event_leaders: 'peaceful',
						start_date: '4-6-17',
						start_time: '1:00',
						num_of_start_times: 4,
						standard_line_duration: 50,
						users: 'hoo',
						activity_id: 4,
						facility_id: 5,
						started: 0,
					}
                });
                return deferred.promise;
			}
		};
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        dashboardService = {
        	getEvents: function(){
        		deferred = q.defer();
                deferred.resolve({
					events: [{
						id: 44,
						start_time: '17:00:00',
						num_of_start_times: 2,
						standard_line_duration: 75,
						users: [{
							sex: 'female',
							pivot: 'darkness'
						}]
					}]
                });
                return deferred.promise;
			}
		};
        spyOn(dashboardService, 'getEvents').and.callThrough();
        eventLinesService = {
    		getParticipantsRankings: function(){
    			deferred = q.defer();
                deferred.resolve({
					participants_rankings: [{
						id: 1,
						pivot: {
							ranking: 34.29
						}
					}, {
						id: 2,
						pivot: {
							ranking: 54.29
						}
					}]
                });
                return deferred.promise;
			}
		};
    	spyOn(eventLinesService, 'getParticipantsRankings').and.callThrough();
        helperService = {
        	findArrayIndex: function(){},
			formatDate: function(){},
			formatTime: function(){},
        	parseTime: function(){},
			convertMilitaryTimeToMinutes: function(){},
			convertMinutesToMilitaryTime: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $window, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
    		id: 1,
			first_name: 'smile',
			last_name: 'strapon',
			privilege: 'facility leader'
		};
    	rootScope.selectedEvent = {
    		id: 1,
			name: 'home'
		};
    	scope = $rootScope.$new();
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('eventStandingsController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventStandingsService: eventStandingsService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			dashboardService: dashboardService,
			eventLinesService: eventLinesService,
			helperService: helperService
        });
    }));

	describe('getEvent Test', function(){
		it('should set scope.event, scope.eventUsers, and scope.displayEventForm to their correct values and call scope.getStandings() after ' +
		   'editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.eventUsers = 'so';
			scope.displayEventForm = false;
			spyOn(scope, 'getStandings');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				event_type: 'social',
				activity_id: 4,
				facility_id: 5,
				event_leaders: 'peaceful',
				started: 0
			});
			expect(scope.eventUsers).toEqual('hoo');
			expect(scope.displayEventForm).toBeTruthy();
			expect(scope.getStandings).toHaveBeenCalled();
		});
	});

	describe('parseStandings Test', function(){
    	it('should set scope.roundDates, scope.teams, and scope.filters to their correct values', function(){
    		scope.teams = [{
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}]
			}, {
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}, {
    				date: 2,
					score: 5,
					round: -1
				}]
			}, {
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}, {
    				date: 2,
					score: 6,
					round: -1
				}, {
    				date: 3,
					score: 0,
					round: -1
				}]
			}];
    		scope.roundDates = 'baby';
    		scope.filters = {};
    		spyOn(helperService, 'findArrayIndex').and.returnValues(1, 2, 3, false, false, false, 0, 2);
    		scope.parseStandings();
    		expect(scope.roundDates).toEqual([{
    			number: -1,
				date: 1
			}, {
    			number: -1,
				date: 2
			}, {
    			number: -1,
				date: 3
			}]);
    		expect(scope.teams).toEqual([{
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}],
				totalScore: 4
			}, {
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}, {
    				date: 2,
					score: 5,
					round: -1
				}],
				totalScore: 9
			}, {
    			matches: [{
    				date: 1,
					score: 4,
					round: -1
				}, {
    				date: 2,
					score: 6,
					round: -1
				}, {
    				date: 3,
					score: 0,
					round: -1
				}],
				totalScore: 10
			}]);
    		expect(scope.filters).toEqual({
				startDate: 1,
				endDate: 3
			});
		});
	});

	describe('getStandings Test', function(){
		it('should set scope.teams to its correct value and call scope.parseStandings() after eventStandingsService.getStandings() returns success', function(){
			scope.teams = 'hello';
			spyOn(scope, 'parseStandings');
			rootScope.getStandings();
			scope.$apply();
			expect(eventStandingsService.getStandings).toHaveBeenCalledWith(4);
			expect(scope.teams).toEqual('beans');
			expect(scope.parseStandings).toHaveBeenCalled();
		});
	});

	describe('$watch filters.startDate Test', function(){
		it('should set scope.filters.endDate to its correct value', function(){
			scope.filters = {
				startDate: 2,
				endDate: 3
			};
			spyOn(scope, 'parseStandings');
			scope.$apply();
			scope.filters = {
				startDate: 5,
				endDate: 3
			};
			scope.$apply();
			expect(scope.filters).toEqual({
				startDate: 5,
				endDate: 5
			});
		});
	});

	describe('$watch filters.endDate Test', function(){
		it('should set scope.filters.startDate to its correct value', function(){
			scope.filters = {
				startDate: 5,
				endDate: 3
			};
			spyOn(scope, 'parseStandings');
			scope.$apply();
			scope.filters = {
				startDate: 5,
				endDate: 2
			};
			scope.$apply();
			expect(scope.filters).toEqual({
				startDate: 2,
				endDate: 2
			});
		});
	});

	describe('orderRounds Test', function(){
		it('should return the correct value', function(){
			var round = {
				number: 4
			};
			expect(scope.orderRounds(round)).toEqual(4);
		});
		it('should return the correct value', function(){
			var round = {
				number: -2
			};
			expect(scope.orderRounds(round)).toEqual(102);
		});
	});

});