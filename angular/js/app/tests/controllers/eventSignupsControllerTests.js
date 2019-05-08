describe('eventSignupsController Test Suite', function(){

    var q, deferred, scope, rootScope, window, eventSignupsService, eventService, editEventModalService, dashboardService, eventLinesService, helperService;

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
    	eventSignupsService = {
    		updateSignup: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
    		updateSignups: 	function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
		};
    	spyOn(eventSignupsService, 'updateSignup').and.callThrough();
    	spyOn(eventSignupsService, 'updateSignups').and.callThrough();
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
						event_leaders: [],
						start_date: '4-6-17',
						start_time: '1:00',
						num_of_start_times: 4,
						standard_line_duration: 50,
						users: 'hoo',
						activity_id: 4,
						facility_id: 5
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
						}],
						activity_id: 4,
						facility_id: 5
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
        $controller('eventSignupsController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventSignupsService: eventSignupsService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			dashboardService: dashboardService,
			eventLinesService: eventLinesService,
			helperService: helperService
        });
    }));

    describe('getEventsAsParticipant Test', function(){
    	it('should set scope.participantEvents, scope.displayEventForm, scope.isEventLeader, scope.participants, and scope.event to their correct values and call ' +
		   'scope.parseParticipants(), scope.getParticipantsRankings(), and scope.parseAvailableStartTimes() after dashboardService.getEvents() returns success', function(){
    		scope.participantEvents = 'aaa';
    		scope.displayEventForm = false;
    		scope.isEventLeader = true;
    		scope.participants = 'bbb';
    		scope.event = 'cccc';
    		spyOn(scope, 'parseParticipants');
    		spyOn(scope, 'getParticipantsRankings');
    		spyOn(scope, 'parseAvailableStartTimes');
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		spyOn(scope, 'getEvent');
    		scope.getEventsAsParticipant();
    		scope.$apply();
    		expect(dashboardService.getEvents).toHaveBeenCalled();
    		expect(scope.participantEvents).toEqual([{
    			id: 44,
				start_time: '17:00:00',
				num_of_start_times: 2,
				standard_line_duration: 75,
				users: [{
					sex: 'female',
					pivot: 'darkness'
				}],
				activity_id: 4,
				facility_id: 5
			}]);
    		expect(scope.displayEventForm).toBeTruthy();
    		expect(scope.isEventLeader).toBeFalsy();
    		expect(scope.participants).toEqual([{
    			id: 1,
				first_name: 'smile',
				last_name: 'strapon',
				sex: 'female',
				events: [{
    				pivot: 'darkness'
				}]
			}]);
    		expect(scope.parseParticipants).toHaveBeenCalled();
    		expect(scope.event).toEqual({
				id: 44,
				startTime: '17:00:00',
				numOfStartTimes: 2,
				standardLineDuration: 75,
				activityId: 4,
				facilityId: 5
			});
    		expect(scope.getParticipantsRankings).toHaveBeenCalled();
    		expect(scope.parseAvailableStartTimes).toHaveBeenCalled();
		});
	});

	describe('getEventsAsLeader Test', function(){
		it('should set scope.isEventLeader to its correct value and call scope.getEvent() after eventService.getEventsAsLeader() returns success', function(){
			scope.isEventLeader = false;
			spyOn(scope, 'getEvent');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.isEventLeader).toBeTruthy();
			expect(scope.getEvent).toHaveBeenCalled();
		});
		it('should call scope.getEventsAsParticipant() after eventService.getEventsAsLeader() returns success', function(){
			rootScope.user.privilege = 'participant';
			spyOn(scope, 'getEventsAsParticipant');
			spyOn(helperService, 'findArrayIndex').and.returnValue(false);
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEventsAsParticipant).toHaveBeenCalled();
		});
	});

	describe('getParticipantsRankings Test', function(){
    	it('should set scope.participants to its correct value and call scope.filterParticipants() after eventLinesService.getParticipantsRankings() returns success', function(){
    		scope.event = {
    			activity_id: 4,
				facility_id: 5
			};
    		scope.participants = [{
				id: 1
			}, {
				id: 2
			}];
    		spyOn(scope, 'filterParticipants');
    		spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1);
    		spyOn(scope, 'getEvent');
    		scope.getParticipantsRankings();
    		scope.$apply();
    		expect(eventLinesService.getParticipantsRankings).toHaveBeenCalledWith(scope.event.activityId, scope.event.facilityId);
    		expect(scope.participants).toEqual([{
				id: 1,
				ranking: 34.29
			}, {
				id: 2,
				ranking: 54.29
			}]);
    		expect(scope.filterParticipants).toHaveBeenCalled();
		});
	});

	describe('parseParticipants Test', function(){
		it('should set scope.participants to its correct value', function(){
			scope.isEventLeader = true;
			scope.participants = [{
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 1,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333'
					}
				}]
			}, {
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333'
					}
				}]
			}];
			spyOn(helperService, 'formatDate').and.returnValues('Apr 28, 18', 'Apr 29, 18');
			spyOn(helperService, 'formatTime').and.returnValues('3:00 PM', '4:00 PM');
			spyOn(helperService, 'parseTime').and.returnValues('2:00 PM', '2:30 PM');
			scope.parseParticipants();
			expect(scope.participants).toEqual([{
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 1,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333',
						status: 'waitlisted',
						rsvped_formatted: 'Apr 28 3:00 PM',
						preferred_start_time_formatted: '2:00 PM'
					}
				}]
			}, {
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333',
						status: 'available',
						rsvped_formatted: 'Apr 29 4:00 PM',
						preferred_start_time_formatted: '2:30 PM'
					}
				}]
			}]);
		});
		it('should set scope.participants to its correct value', function(){
			scope.isEventLeader = false;
			scope.participants = [{
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333'
					}
				}]
			}, {
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 1,
						rsvped: '2222',
						preferred_start_time: '3333'
					}
				}]
			}];
			spyOn(helperService, 'formatDate').and.returnValues('Apr 28, 18', 'Apr 29, 18');
			spyOn(helperService, 'formatTime').and.returnValues('3:00 PM', '4:00 PM');
			spyOn(helperService, 'parseTime').and.returnValues('2:00 PM', '2:30 PM');
			scope.parseParticipants();
			expect(scope.participants).toEqual([{
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 0,
						rsvped: '2222',
						preferred_start_time: '3333',
						status: 'available',
						rsvped_formatted: 'Apr 28 3:00 PM',
						preferred_start_time_formatted: '2:00 PM'
					}
				}]
			}, {
				events: [{
					pivot: {
						confirmed: 0,
						waitlisted: 0,
						unavailable: 1,
						rsvped: '2222',
						preferred_start_time: '3333',
						status: 'unavailable',
						rsvped_formatted: 'Apr 29 4:00 PM',
						preferred_start_time_formatted: '2:30 PM'
					}
				}]
			}]);
		});
	});

	describe('filterParticipantsByName Test', function(){
		it('should return the correct value', function(){
			var participants = [{
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
			expect(scope.filterParticipantsByName(participants)).toEqual([{
				first_name: 'sam',
				last_name: 'smith'
			}, {
				first_name: 'laura',
				last_name: 'smith'
			}]);
		});
	});

	describe('filterParticipantsByGender Test', function(){
		it('should return the correct value', function(){
			var participants = [{
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
			expect(scope.filterParticipantsByGender(participants)).toEqual([{
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

	describe('filterParticipantsByStatus Test', function(){
		it('should return the correct value', function(){
			var participants = [{
				first_name: 'sam',
				last_name: 'smith',
				sex: 'male',
				events: [{
					pivot: {
						status: 'in'
					}
				}]
			}, {
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female',
				events: [{
					pivot: {
						status: 'in'
					}
				}]
			}, {
				first_name: 'wayne',
				last_name: 'bogon',
				sex: 'male',
				events: [{
					pivot: {
						status: 'waitlisted'
					}
				}]
			},{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female',
				events: [{
					pivot: {
						status: 'unavailable'
					}
				}]
			}];
			scope.filters = {
				status: 'in'
			};
			expect(scope.filterParticipantsByStatus(participants)).toEqual([{
				first_name: 'sam',
				last_name: 'smith',
				sex: 'male',
				events: [{
					pivot: {
						status: 'in'
					}
				}]
			}, {
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female',
				events: [{
					pivot: {
						status: 'in'
					}
				}]
			}]);
		});
	});

	describe('filterParticipantsByPreferredStartTime Test', function(){
		it('should return the correct value', function(){
			var participants = [{
				first_name: 'sam',
				last_name: 'smith',
				sex: 'male',
				events: [{
					pivot: {
						status: 'in',
						preferred_start_time: '02:00:00'
					}
				}]
			}, {
				first_name: 'laura',
				last_name: 'smith',
				sex: 'female',
				events: [{
					pivot: {
						status: 'in',
						preferred_start_time: '02:00:00'
					}
				}]
			}, {
				first_name: 'wayne',
				last_name: 'bogon',
				sex: 'male',
				events: [{
					pivot: {
						status: 'waitlisted',
						preferred_start_time: null
					}
				}]
			},{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female',
				events: [{
					pivot: {
						status: 'unavailable',
						preferred_start_time: null
					}
				}]
			}];
			scope.filters = {
				preferredStartTime: null
			};
			expect(scope.filterParticipantsByPreferredStartTime(participants)).toEqual([{
				first_name: 'wayne',
				last_name: 'bogon',
				sex: 'male',
				events: [{
					pivot: {
						status: 'waitlisted',
						preferred_start_time: null
					}
				}]
			},{
				first_name: 'lauren',
				last_name: 'nickholson',
				sex: 'female',
				events: [{
					pivot: {
						status: 'unavailable',
						preferred_start_time: null
					}
				}]
			}]);
		});
	});

	describe('filterParticipants Test', function(){
		it('should call scope.filterParticipantsByName() and scope.filterParticipantsByStatus() and set scope.foundParticipants to its correct value', function(){
			scope.filters = {
				name: 'something',
				gender: null,
				status: 'in',
				preferredStartTime: null
			};
			scope.foundParticipants = 'tomatoes';
			scope.participants = 'white';
			spyOn(scope, 'filterParticipantsByName').and.returnValue('yellow');
			spyOn(scope, 'filterParticipantsByGender');
			spyOn(scope, 'filterParticipantsByStatus').and.returnValue('eggs');
			spyOn(scope, 'filterParticipantsByPreferredStartTime');
			scope.filterParticipants();
			expect(scope.filterParticipantsByName).toHaveBeenCalledWith('white');
			expect(scope.filterParticipantsByGender).not.toHaveBeenCalled();
			expect(scope.filterParticipantsByStatus).toHaveBeenCalledWith('yellow');
			expect(scope.filterParticipantsByPreferredStartTime).not.toHaveBeenCalled();
			expect(scope.foundParticipants).toEqual('eggs');
		});
	});

	describe('$watch sort.sortBy Test', function(){
		it('should set scope.sortByArray to its correct value', function(){
			scope.sort = {
				sortBy: 'hola'
			};
			spyOn(scope, 'getEvent');
			scope.$apply();
			scope.sortByArray = ['sex'];
			scope.sort.sortBy = 'name';
			scope.$apply();
			expect(scope.sortByArray).toEqual(['sex', 'first_name', 'last_name']);
			scope.sort.sortBy = 'ranking';
			scope.$apply();
			expect(scope.sortByArray).toEqual(['sex', '-ranking']);
		});
	});

	describe('$watch foundParticipants Test', function(){
		it('should set scope.participants to its correct value', function(){
			scope.foundParticipants = 'silly';
			scope.participants = [{
				id: 1,
				events: [{
					pivot: {}
				}]
			}, {
				id: 2,
				events: [{
					pivot: {}
				}]
			}];
			spyOn(scope, 'getEvent');
			scope.$apply();
			scope.foundParticipants = [{
				id: 1,
				events: [{
					pivot: {
						status: 'in',
						preferred_start_time: '02:00:00'
					}
				}]
			}, {
				id: 2,
				events: [{
					pivot: {
						status: 'waitlisted',
						preferred_start_time: '05:00:00'
					}
				}]
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1);
			scope.$apply();
			expect(scope.participants).toEqual([{
				id: 1,
				events: [{
					pivot: {
						status: 'in',
						preferred_start_time: '02:00:00'
					}
				}]
			}, {
				id: 2,
				events: [{
					pivot: {
						status: 'waitlisted',
						preferred_start_time: '05:00:00'
					}
				}]
			}])
		});
	});

	describe('getEvent Test', function(){
		it('should set scope.event, scope.participants, and scope.displayEventForm to their correct values and call scope.parseParticipants(), ' +
		   'scope.getParticipantsRankings(), scope.getParticipantsRankings(), and scope.parseAvailableStartTimes() after editEventModalService.getEvent() ' +
		   'returns success', function(){
			scope.event = {};
			scope.participants = 'so';
			scope.displayEventForm = false;
			spyOn(scope, 'parseParticipants');
			spyOn(scope, 'getParticipantsRankings');
			spyOn(scope, 'parseAvailableStartTimes');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4, true);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				eventType: 'social',
				typeOfPlay: 'mixed',
				eventLeaderName: null,
				startDate: '4-6-17',
				startTime: '1:00',
				numOfStartTimes: 4,
				standardLineDuration: 50,
				activityId: 4,
				facilityId: 5
			});
			expect(scope.participants).toEqual('hoo');
			expect(scope.parseParticipants).toHaveBeenCalled();
			expect(scope.getParticipantsRankings).toHaveBeenCalled();
			expect(scope.parseAvailableStartTimes).toHaveBeenCalled();
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

	describe('$watch filters Test', function(){
		it('should call scope.filterParticipants()', function(){
			scope.filters = 'happy';
			spyOn(scope, 'getEvent');
			scope.$apply();
			scope.filters = 'apple';
			spyOn(scope, 'filterParticipants');
			scope.$apply();
			expect(scope.filterParticipants).toHaveBeenCalled();
		});
	});

	describe('parseAvailableStartTimes Test', function(){
    	it('should set scope.availableStartTimes to its correct value', function(){
    		scope.event = {
    			startTime: '16:00:00',
				numOfStartTimes: 2
			};
    		scope.availableStartTimes = 'aaaa';
    		spyOn(helperService, 'parseTime').and.returnValues('4:00 PM', '5:00 PM');
    		spyOn(helperService, 'convertMilitaryTimeToMinutes');
    		spyOn(helperService, 'convertMinutesToMilitaryTime').and.returnValue('17:00:00');
    		scope.parseAvailableStartTimes();
    		expect(scope.availableStartTimes).toEqual([{
    			start_time: '16:00:00',
				start_time_formatted: '4:00 PM'
			}, {
    			start_time: '17:00:00',
				start_time_formatted: '5:00 PM'
			}])
		});
	});

	describe('buildSignupsArray Test', function(){
		it('should return the correct value', function(){
			scope.participants = [{
				id: 3,
				events: [{
					pivot: {
						confirmed: 1
					}
				}]
			}, {
				id: 4,
				events: [{
					pivot: {
						confirmed: 0
					}
				}]
			}, {
				id: 5,
				events: [{
					pivot: {
						confirmed: 1
					}
				}]
			}];
			expect(scope.buildSignupsArray()).toEqual([{
				confirmed: 1
			}, {
				confirmed: 0
			}, {
				confirmed: 1
			}])
		});
	});

	describe('updateStatuses Test', function(){
		it('should set scope.callInProgress to its correct value.  It should then set window.location to its correct value and call window.alert() after ' +
		   'eventSignupsService.updateSignups() returns success', function(){
			scope.isEventLeader = true;
			scope.completeEventSetupDone = 1;
			scope.callInProgress = false;
			spyOn(scope, 'buildSignupsArray').and.returnValue('paramschicken');
			spyOn(window, 'alert');
			spyOn(scope, 'getEvent');
			scope.updateStatuses(true);
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventSignupsService.updateSignups).toHaveBeenCalledWith('paramschicken', scope.completeEventSetupDone);
			expect(window.alert).toHaveBeenCalledWith('Signup Statuses Updated!');
			expect(window.location.href).toEqual('/');
		});
		it('should set scope.callInProgress to its correct value.  It should then set window.location to its correct value and call window.alert() after ' +
		   'eventSignupsService.updateSignup() returns success', function(){
			scope.isEventLeader = false;
			scope.callInProgress = false;
			spyOn(scope, 'buildSignupsArray').and.returnValue(['release']);
			spyOn(window, 'alert');
			spyOn(scope, 'getEvent');
			scope.updateStatuses();
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventSignupsService.updateSignup).toHaveBeenCalledWith('release');
			expect(window.alert).toHaveBeenCalledWith('Your Status Has Been Updated!');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});