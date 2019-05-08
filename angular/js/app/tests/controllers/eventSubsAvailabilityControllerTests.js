describe('eventSubsAvailabilityController Test Suite', function(){

    var q, deferred, rootScope, scope, window, eventSubsAvailabilityService, eventTeamsAvailabilityService, eventService, editEventModalService, dashboardService, helperService;

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
    	eventSubsAvailabilityService = {
    		getSubsAvailability: function(){
    			deferred = q.defer();
                deferred.resolve({
					sub_availability: 'something'
                });
                return deferred.promise;
			}
		};
    	spyOn(eventTeamsAvailabilityService, 'getSubsAvailability').and.callThrough();
    	eventTeamsAvailabilityService = {
			updateAvailabilities: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
    	spyOn(eventTeamsAvailabilityService, 'updateAvailabilities').and.callThrough();
    	eventService = {
        	getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'sam',
						activity_id: 4,
						facility_id: 5,
						users: 'love'
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
						name: 'ripped',
						activity_id: 2,
						facility_id: 75
					}]
                });
                return deferred.promise;
			}
		};
        spyOn(dashboardService, 'getEvents').and.callThrough();
        helperService = {
            findArrayIndex: function(){},
			getTodaysDate: function(){}
        };
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $window, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {
			privilege: 'facility leader'
		};
    	scope = $rootScope.$new();
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('eventSubsAvailabilityController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventSubsAvailabilityService: eventSubsAvailabilityService,
			eventTeamsAvailabilityService: eventTeamsAvailabilityService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			dashboardService: dashboardService,
			helperService: helperService
        });
    }));

    /*describe('getEventsAsLeader Test', function(){
		it('should set scope.isEventLeader to its correct value and call scope.getEvent() after eventService.getEventsAsLeader() returns success', function(){
			scope.isEventLeader = false;
			spyOn(scope, 'getEvent');
			spyOn(scope, 'parseUsersAvailability');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.isEventLeader).toBeTruthy();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('getEvent Test', function(){
		it('should set scope.event, scope.eventUsers, and scope.displayEventForm to their correct values after editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.eventUsers = 'so';
			scope.displayEventForm = false;
			spyOn(scope, 'parseUsersAvailability');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				activity_id: 4,
				facility_id: 5
			});
			expect(scope.eventUsers).toEqual('love');
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

	describe('setStartDateFilter Test', function(){
		it('should set scope.filters.startDate to its correct value', function(){
			scope.roundDates = ['2018-09-18', '2018-09-25', '2018-10-02', '2018-10-09'];
			scope.filters = {
				startDate: '2018-09-18',
				endDate: '2018-10-09'
			};
			spyOn(helperService, 'getTodaysDate').and.returnValue('2018-09-25');
			scope.setStartDateFilter();
			expect(scope.filters.startDate).toEqual('2018-10-02');
		});
		it('should set scope.filters.startDate to its correct value', function(){
			scope.roundDates = ['2018-09-11', '2018-09-18', '2018-09-25'];
			scope.filters = {
				startDate: '2018-09-11',
				endDate: '2018-09-25'
			};
			spyOn(helperService, 'getTodaysDate').and.returnValue('2018-09-25');
			scope.setStartDateFilter();
			expect(scope.filters.startDate).toEqual('2018-09-25');
		});
		it('should set scope.filters.startDate to its correct value', function(){
			scope.roundDates = ['2017-09-18', '2017-09-25', '2017-10-02', '2017-10-09'];
			scope.filters = {
				startDate: '2017-09-18',
				endDate: '2017-10-09'
			};
			spyOn(helperService, 'getTodaysDate').and.returnValue('2018-09-25');
			scope.setStartDateFilter();
			expect(scope.filters.startDate).toEqual('2017-09-18');
		});
		it('should set scope.filters.startDate to its correct value', function(){
			scope.roundDates = ['2019-09-18', '2019-09-25', '2019-10-02', '2019-10-09'];
			scope.filters = {
				startDate: '2019-09-18',
				endDate: '2019-10-09'
			};
			spyOn(helperService, 'getTodaysDate').and.returnValue('2018-09-25');
			scope.setStartDateFilter();
			expect(scope.filters.startDate).toEqual('2019-09-18');
		});
	});

    describe('parseSubsAvailability Test', function(){
    	it('should set scope.users, scope.roundDates, and scope.filters to their correct values and call scope.setStartDateFilter()', function(){
    		scope.subsAvailability = [{
    			user: {
    				team_name: 'red'
				},
				date: 1
			}, {
    			user: {
    				team_name: 'blue'
				},
				date: 2
			}, {
    			user: {
    				team_name: 'yellow'
				},
				date: 2
			}];
    		scope.users = 'come';
    		scope.roundDates = 'baby';
    		scope.filters = {};
    		spyOn(scope, 'setStartDateFilter');
    		spyOn(helperService, 'findArrayIndex').and.returnValue(false);
    		scope.parseSubsAvailability();
    		expect(scope.users).toEqual([{
    			team_name: 'red'
			}, {
    			team_name: 'blue'
			}, {
    			team_name: 'yellow'
			}]);
    		expect(scope.roundDates).toEqual([1, 2]);
    		expect(scope.filters).toEqual({
				startDate: 1,
				endDate: 2
			});
			expect(scope.setStartDateFilter).toHaveBeenCalled();
		});
	});

	describe('filterUsersByName Test', function(){
		it('should return the correct value', function(){
			var users = [{
				first_name: 'sam',
				last_name: 'smith'
			}, {
				first_name: 'laura',
				last_name: 'smith'
			}, {
				first_name: 'wayne',
				last_name: 'bogon'
			},{
				first_name: 'lauren',
				last_name: 'nickholson'
			}];
			scope.filters = {
				name: 'Smith'
			};
			expect(scope.filterUsersByName(users)).toEqual([{
				first_name: 'sam',
				last_name: 'smith'
			}, {
				first_name: 'laura',
				last_name: 'smith'
			}]);
		});
	});

	describe('filterUsersByGender Test', function(){
		it('should return the correct value', function(){
			var users = [{
				first_name: 'sam',
				last_name: 'smith',
				sex: 'male'
			}, {
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female'
			}, {
				first_name: 'wayne',
				last_name: 'bogon',
				sex: 'male'
			},{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female'
			}];
			scope.filters = {
				gender: 'female'
			};
			expect(scope.filterUsersByGender(users)).toEqual([{
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female'
			}, {
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female'
			}]);
		});
	});

	describe('filterUsers Test', function(){
		it('should call scope.filterUsersByName() and scope.filterUsersByGender() and set scope.foundUsers to its correct value', function(){
			scope.filters = {
				name: 'something',
				gender: 'female',
				team: null
			};
			scope.foundUsers = 'tomatoes';
			scope.users = 'white';
			spyOn(scope, 'filterUsersByName').and.returnValue('yellow');
			spyOn(scope, 'filterUsersByGender').and.returnValue('eggs');
			scope.filterUsers();
			expect(scope.filterUsersByName).toHaveBeenCalledWith('white');
			expect(scope.filterUsersByGender).toHaveBeenCalledWith('yellow');
			expect(scope.foundUsers).toEqual('eggs');
		});
	});

	describe('filterRounds Test', function(){
		it('should set scope.shownRoundDates to its correct value', function(){
			scope.roundDates = [1, 2, 3, 4, 5, 6, 7, 8];
			scope.filters = {
				startDate: 3,
				endDate: 6
			};
			scope.shownRoundDates = 'chicken';
			scope.filterRounds();
			expect(scope.shownRoundDates).toEqual([3, 4, 5, 6]);
		});
	});

	describe('$watch filters.startDate Test', function(){
		it('should set scope.filters.endDate to its correct value', function(){
			scope.filters = {
				startDate: 2,
				endDate: 3
			};
			spyOn(scope, 'parseUsersAvailability');
			spyOn(scope, 'filterRounds');
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
			spyOn(scope, 'parseUsersAvailability');
			spyOn(scope, 'filterRounds');
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

	describe('$watch filters Test', function(){
		it('should call scope.filterUsers() and scope.filterRounds()', function(){
			scope.filters = {
				startDate: 5,
				endDate: 3
			};
			spyOn(scope, 'filterUsers');
			spyOn(scope, 'filterRounds');
			spyOn(scope, 'parseUsersAvailability');
			scope.$apply();
			scope.filters = {
				startDate: 5,
				endDate: 2
			};
			scope.$apply();
			expect(scope.filterUsers).toHaveBeenCalled();
			expect(scope.filterRounds).toHaveBeenCalled();
		});
	});

	describe('getAvailability Test', function(){
		it('should set scope.subsAvailability to its correct value and call scope.parseSubsAvailability() after eventSubsAvailabilityService.getSubsAvailability() returns ' +
		   'success', function(){
			scope.subsAvailability = 'veggie';
			spyOn(scope, 'parseSubsAvailability');
			scope.getAvailability();
			scope.$apply();
			expect(eventSubsAvailabilityService.getSubsAvailability).toHaveBeenCalledWith(4);
			expect(scope.subsAvailability).toEqual('something');
			expect(scope.parseSubsAvailability).toHaveBeenCalled();
		});
	});

	describe('updateAvailability Test', function(){
		it('should set scope.callInProgress to its correct value.  It should then set window.location to its correct value and call window.alert() after ' +
		   'eventTeamsAvailabilityService.updateAvailabilities() returns success', function(){
			scope.isEventLeader = true;
			scope.subsAvailability = 'grass';
			scope.callInProgress = false;
			spyOn(window, 'alert');
			spyOn(scope, 'parseUsersAvailability');
			scope.updateAvailability(true);
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventTeamsAvailabilityService.updateAvailabilities).toHaveBeenCalledWith(4, 'grass');
			expect(window.alert).toHaveBeenCalledWith('Availabilites Updated!');
			expect(window.location.href).toEqual('/');
		});
	});

	describe('findEventTeamUserAvailabilityId Test', function(){
		it('should return the correct value', function(){
			var userId = 3;
			var date = 33;
			scope.subsAvailability = [{
				user: {
					id: 2
				},
				date: 33
			}, {
				user: {
					id: 3
				},
				date: 33
			}, {
				user: {
					id: 1
				},
				date: 22
			}];
			expect(scope.findEventTeamUserAvailabilityId(userId, date)).toEqual(1);
		});
		it('should return the correct value', function(){
			var userId = 344;
			var date = 3553;
			scope.subsAvailability = [{
				user: {
					id: 2
				},
				date: 33
			}, {
				user: {
					id: 3
				},
				date: 33
			}, {
				user: {
					id: 1
				},
				date: 22
			}];
			expect(scope.findEventTeamUserAvailabilityId(userId, date)).toBeFalsy();
		});
	});*/

});