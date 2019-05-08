describe('eventPairingsController Test Suite', function(){

    var q, deferred, rootScope, scope, window, eventService, editEventModalService, perRoundLinesModalService, dashboardService, helperService;

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
			getEventLines: function(){
        		deferred = q.defer();
                deferred.resolve({
					lines: 'head'
				});
                return deferred.promise;
			}
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        spyOn(eventService, 'getEventTeams').and.callThrough();
        spyOn(eventService, 'getEventLines').and.callThrough();
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
		perRoundLinesModalService = {
        	getLinesPerMatch: function(){
                deferred = q.defer();
                deferred.resolve({
					lines: [{
						line_play_type: 'ws',
						line_type: 'singles'
					}, {
						line_play_type: 'md',
						line_type: 'doubles'
					}, {
						line_play_type: 'xd',
						line_type: 'doubles'
					}]
				});
                return deferred.promise;
            }
		};
		spyOn(perRoundLinesModalService, 'getLinesPerMatch').and.callThrough();
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
            findArrayIndex: function(){}
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
        $controller('eventPairingsController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventService: eventService,
			editEventModalService: editEventModalService,
			perRoundLinesModalService: perRoundLinesModalService,
			dashboardService: dashboardService,
			helperService: helperService
        });
    }));

    describe('getEventsAsParticipant Test', function(){
    	it('should set scope.participantEvents, scope.displayEventForm, and scope.event to their correct values after dashboardService.getEvents() ' +
		   'returns success', function(){
    		scope.participantEvents = 'aaa';
    		scope.displayEventForm = false;
    		scope.event = 'cccc';
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		spyOn(scope, 'getEvent');
    		spyOn(scope, 'parseEventLines');
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
    		expect(scope.event).toEqual({
				id: 44,
				name: 'ripped'
			});
    		expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('getEventsAsLeader Test', function(){
		it('should call scope.getEvent() after eventService.getEventsAsLeader() returns success', function(){
			spyOn(scope, 'getEvent');
			spyOn(scope, 'parseEventLines');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('getEvent Test', function(){
		it('should set scope.event and scope.displayEventForm to their correct values after editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.displayEventForm = false;
			spyOn(scope, 'parseEventLines');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam'
			});
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('parseEventLines Test', function(){
    	it('should set scope.teams and scope.eventLines to their correct values', function(){
    		scope.eventLines = [{
    			matches: {
    				team_one: {
    					name: 'blue'
					},
					team_two: {
    					name: 'red'
					},
					round: 1
				},
				pair_one: {
					id: 1
				},
				pair_two: {
					id: 2
				},
				line_play_type: 'wd'
			}];
    		scope.teams = 'come';
    		spyOn(helperService, 'findArrayIndex').and.returnValues(false, 0, false, 1);
    		scope.parseEventLines();
    		expect(scope.teams).toEqual([{
    			name: 'blue',
				lines: [{
    				matches: {
						team_one: {
							name: 'blue'
						},
						team_two: {
							name: 'red'
						},
						round: 1
					},
					pair_one: {
						id: 1,
						pair: 'pair_one'
					},
					pair_two: {
						id: 2
					},
					line_play_type: 'wd',
    				current_team_lineup: {
    					id: 1,
						pair: 'pair_one'
					}
				}]
			}, {
    			name: 'red',
				lines: [{
    				matches: {
						team_one: {
							name: 'blue'
						},
						team_two: {
							name: 'red'
						},
						round: 1
					},
					pair_one: {
						id: 1
					},
					pair_two: {
						id: 2,
						pair: 'pair_two'
					},
					line_play_type: 'wd',
    				current_team_lineup: {
    					id: 2,
						pair: 'pair_two'
					}
				}]
			}]);
    		expect(scope.eventLines).toEqual([{
    			matches: {
    				team_one: {
    					name: 'blue'
					},
					team_two: {
    					name: 'red'
					},
					round: 1
				},
				pair_one: {
					id: 1
				},
				pair_two: {
					id: 2
				},
				line_play_type: 'wd',
				line_sex: 'female'
			}]);
		});
	});

	describe('getEventLines Test', function(){
		it('should set scope.getEventLinesInProgress to its correct value.  It should then set scope.eventLines to its correct value and call scope.parseEventLines() after ' +
		   'eventService.getEventLines() returns success', function(){
			scope.getEventLinesInProgress = false;
			scope.eventLines = 'poison';
			spyOn(scope, 'parseEventLines');
			scope.getEventLines();
			expect(scope.getEventLinesInProgress).toBeTruthy();
			scope.$apply();
			expect(eventService.getEventLines).toHaveBeenCalledWith(4);
			expect(scope.eventLines).toEqual('head');
			expect(scope.parseEventLines).toHaveBeenCalled();
			expect(scope.getEventLinesInProgress).toBeFalsy();
		});
	});

	describe('getLinesPerMatch Test', function(){
		it('should set scope.scope.allLines, scope.femaleLines, scope.maleLines, and scope.comboLines to their correct values after perRoundLinesModalService.getLinesPerMatch() ' +
		   'returns success', function(){
			scope.allLines = 'aaa';
			scope.femaleLines = 'bbb';
			scope.maleLines = 'ccc';
			scope.comboLines = 'dddd';
			spyOn(scope, 'parseEventLines')
			scope.getLinesPerMatch();
			scope.$apply();
			expect(perRoundLinesModalService.getLinesPerMatch).toHaveBeenCalledWith(4);
			expect(scope.allLines).toEqual([{
				line_play_type: 'ws',
				line_type: 'singles'
			}, {
				line_play_type: 'md',
				line_type: 'doubles'
			}, {
				line_play_type: 'xd',
				line_type: 'doubles'
			}]);
			expect(scope.femaleLines).toEqual(['WS1']);
			expect(scope.maleLines).toEqual(['MD1']);
			expect(scope.comboLines).toEqual(['XD1']);
		});
	});

	describe('getEventTeams Test', function(){
		it('should set scope.eventTeamUsers to its correct value after eventService.getEventTeams() returns success', function(){
			scope.eventTeamUsers = 'before';
			spyOn(scope, 'parseEventLines');
			scope.getEventTeams();
			scope.$apply();
			expect(eventService.getEventTeams).toHaveBeenCalledWith(4);
			expect(scope.eventTeamUsers).toEqual('hello');
		});
	});

	describe('hideLine Test', function(){
		it('should return true', function(){
			var line = 'WS1';
			scope.filters = {
				lineType: 'wd'
			};
			expect(scope.hideLine(line)).toBeTruthy();
		});
		it('should return true', function(){
			var line = 'WS1';
			scope.filters = {
				lineType: 'wd',
				startLineNumber: 2
			};
			expect(scope.hideLine(line)).toBeTruthy();
		});
		it('should return false', function(){
			var line = 'WD1';
			scope.filters = {
				lineType: 'wd'
			};
			expect(scope.hideLine(line)).toBeFalsy();
		});
	});

	describe('$watch filters.startLine, filters.endLine Test', function(){
		it('should set scope.filters to its correct value', function(){
			scope.filters = {
				startLine: 1,
				endLine: 2
			};
			spyOn(scope, 'parseEventLines');
			scope.$apply();
			scope.filters = {
				startLine: 'WD2',
				endLine: 'WD6'
			};
			scope.$apply();
			expect(scope.filters).toEqual({
				startLine: 'WD2',
				endLine: 'WD6',
				lineType: 'wd',
				startLineNumber: '2',
				endLineNumber: '6'
			});
		});
	});

	describe('$watch filters.startLine Test', function(){
		it('should set scope.filters.endLine to its correct value', function(){
			scope.filters = {
				startLine: 2
			};
			spyOn(scope, 'parseEventLines');
			scope.$apply();
			scope.filters = {
				startLine: 'wd5',
				endLine: 'md5'
			};
			scope.$apply();
			expect(scope.filters.endLine).toEqual('wd5');
		});
		it('should set scope.filters.endLine to its correct value', function(){
			scope.filters = {
				startLine: 2
			};
			spyOn(scope, 'parseEventLines');
			scope.$apply();
			scope.filters = {
				startLine: 'wd7',
				endLine: 'wd5'
			};
			scope.$apply();
			expect(scope.filters.endLine).toEqual('wd7');
		});
		it('should set scope.filters.endLine to its correct value', function(){
			scope.filters = {
				startLine: 2
			};
			spyOn(scope, 'parseEventLines');
			scope.$apply();
			scope.filters = {
				startLine: null,
				endLine: 'wd5'
			};
			scope.$apply();
			expect(scope.filters.endLine).toEqual('');
		});
	});

	describe('$watch filters.endLine Test', function(){
		it('should set scope.filters.startLine to its correct value', function(){
			scope.filters = {
				endLine: 2
			};
			spyOn(scope, 'parseEventLines');
			scope.$apply();
			scope.filters = {
				startLine: 'wd2',
				endLine: null
			};
			scope.$apply();
			expect(scope.filters.startLine).toEqual('');
		});
	});

});