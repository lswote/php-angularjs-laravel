describe('eventTeamsAvailabilityController Test Suite', function(){

    var q, deferred, rootScope, scope, window, eventTeamsAvailabilityService, eventService, editEventModalService, dashboardService, helperService;

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
    	eventTeamsAvailabilityService = {
    		getAvailability: function(){
    			deferred = q.defer();
                deferred.resolve({
					user_availability: 'something'
                });
                return deferred.promise;
			},
			updateAvailabilities: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
			updateAvailability: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
    	spyOn(eventTeamsAvailabilityService, 'getAvailability').and.callThrough();
    	spyOn(eventTeamsAvailabilityService, 'updateAvailabilities').and.callThrough();
    	spyOn(eventTeamsAvailabilityService, 'updateAvailability').and.callThrough();
    	eventService = {
        	getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			getEventTeams: function(){
        		deferred = q.defer();
                deferred.resolve({
					event_team_users: 'hello'
				});
                return deferred.promise;
			},
			updateEventTeams: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        spyOn(eventService, 'getEventTeams').and.callThrough();
        spyOn(eventService, 'updateEventTeams').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'sam',
						activity_id: 4,
						facility_id: 5,
						event_type: 'league',
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
						facility_id: 75,
						event_type: 'league'
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
        $controller('eventTeamsAvailabilityController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventTeamsAvailabilityService: eventTeamsAvailabilityService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			dashboardService: dashboardService,
			helperService: helperService
        });
    }));

    describe('getEventsAsParticipant Test', function(){
    	it('should set scope.participantEvents, scope.displayEventForm, scope.isEventLeader, and scope.event to their correct values after dashboardService.getEvents() ' +
		   'returns success', function(){
    		scope.participantEvents = 'aaa';
    		scope.displayEventForm = false;
    		scope.isEventLeader = true;
    		scope.event = 'cccc';
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		spyOn(scope, 'parseUsersAvailability');
    		spyOn(scope, 'getEvent');
    		scope.getEventsAsParticipant();
    		scope.$apply();
    		expect(dashboardService.getEvents).toHaveBeenCalled();
    		expect(scope.participantEvents).toEqual([{
    			id: 44,
				name: 'ripped',
				activity_id: 2,
				facility_id: 75,
				event_type: 'league'
			}]);
    		expect(scope.displayEventForm).toBeTruthy();
    		expect(scope.isEventLeader).toBeFalsy();
    		expect(scope.event).toEqual({
				id: 44,
				name: 'ripped',
				activity_id: 2,
				facility_id: 75,
				event_type: 'league'
			});
		});
	});

    describe('getEventsAsLeader Test', function(){
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
				facility_id: 5,
				event_type: 'league'
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

    describe('parseUsersAvailability Test', function(){
    	it('should set scope.users, scope.roundDates, scope.teams, and scope.filters to their correct values and call scope.setStartDateFilter()', function(){
    		scope.usersAvailability = [{
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
    		scope.teams = 'eeee';
    		scope.filters = {};
    		spyOn(scope, 'setStartDateFilter');
    		spyOn(helperService, 'findArrayIndex').and.returnValue(false);
    		scope.parseUsersAvailability();
    		expect(scope.users).toEqual([{
    			team_name: 'red'
			}, {
    			team_name: 'blue'
			}, {
    			team_name: 'yellow'
			}]);
    		expect(scope.roundDates).toEqual([1, 2]);
    		expect(scope.teams).toEqual(['red', 'blue', 'yellow']);
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

	describe('filterUsersByTeam Test', function(){
		it('should return the correct value', function(){
			var users = [{
				first_name: 'sam',
				last_name: 'smith',
				sex: 'male',
				team_name: 'red'
			}, {
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female',
				team_name: 'red'
			}, {
				first_name: 'wayne',
				last_name: 'bogon',
				sex: 'male',
				team_name: 'red'
			},{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female',
				team_name: 'blue'
			}];
			scope.filters = {
				team: 'blue'
			};
			expect(scope.filterUsersByTeam(users)).toEqual([{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female',
				team_name: 'blue'
			}]);
		});
	});

	describe('filterUsers Test', function(){
		it('should call scope.filterUsersByName(), scope.filterUsersByGender() and scope.filterUsersByTeam() and set scope.foundUsers to its correct value', function(){
			scope.filters = {
				name: 'something',
				gender: 'female',
				team: null
			};
			scope.foundUsers = 'tomatoes';
			scope.users = 'white';
			spyOn(scope, 'filterUsersByName').and.returnValue('yellow');
			spyOn(scope, 'filterUsersByGender').and.returnValue('eggs');
			spyOn(scope, 'filterUsersByTeam');
			scope.filterUsers();
			expect(scope.filterUsersByName).toHaveBeenCalledWith('white');
			expect(scope.filterUsersByGender).toHaveBeenCalledWith('yellow');
			expect(scope.filterUsersByTeam).not.toHaveBeenCalled();
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
		it('should set scope.usersAvailability to its correct value and call scope.parseUsersAvailability() after eventTeamsAvailabilityService.getAvailability() returns ' +
		   'success', function(){
			scope.usersAvailability = 'veggie';
			spyOn(scope, 'parseUsersAvailability');
			scope.getAvailability();
			scope.$apply();
			expect(eventTeamsAvailabilityService.getAvailability).toHaveBeenCalledWith(4);
			expect(scope.usersAvailability).toEqual('something');
			expect(scope.parseUsersAvailability).toHaveBeenCalled();
		});
	});

	describe('updateAvailability Test', function(){
		it('should set scope.callInProgress to its correct value.  It should then set window.location to its correct value and call window.alert() after ' +
		   'eventTeamsAvailabilityService.updateAvailabilities() returns success', function(){
			scope.isEventLeader = true;
			scope.usersAvailability = 'grass';
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
		it('should set scope.callInProgress to its correct value.  It should then call window.alert() after eventTeamsAvailabilityService.updateAvailability() returns ' +
		   'success', function(){
			scope.event = {
				event_type: 'league'
			};
			scope.isEventLeader = false;
			scope.usersAvailability = 'grass';
			scope.callInProgress = false;
			spyOn(window, 'alert');
			spyOn(scope, 'parseUsersAvailability');
			scope.updateAvailability();
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventTeamsAvailabilityService.updateAvailability).toHaveBeenCalledWith(4, 'grass');
			expect(window.alert).toHaveBeenCalledWith('Your Availability Has Been Updated!');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

	describe('findEventTeamUserAvailabilityId Test', function(){
		it('should return the correct value', function(){
			var userId = 3;
			var date = 33;
			scope.usersAvailability = [{
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
			scope.usersAvailability = [{
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
	});

});