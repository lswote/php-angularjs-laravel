describe('eventResultsModalController Test Suite', function(){

    var q, deferred, scope, rootScope, eventService, matchLineTimesModalService, editEventModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        eventService = {
        	getEventLines: function(){
                deferred = q.defer();
                deferred.resolve({
					lines: [1, 2]
				});
                return deferred.promise;
            },
			updateEventLinesScores: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventLines').and.callThrough();
        spyOn(eventService, 'updateEventLinesScores').and.callThrough();
        matchLineTimesModalService = {
        	getEventMatches: function(){
        		deferred = q.defer();
                deferred.resolve({
					matches: 'boy'
				});
                return deferred.promise;
			}
		};
        spyOn(matchLineTimesModalService, 'getEventMatches').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'sam',
						event_type: 'social'
					}
				});
                return deferred.promise;
            }
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
        helperService = {
        	parseTime: function(){},
			findArrayIndex: function(){},
			getTodaysDate: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
			privilege: 'admin'
		};
    	rootScope.selectedEvent = {
    		id: 1,
			name: 'home'
		};
    	rootScope.eventResultsMode = 'add';
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('eventResultsModalController', {
            $scope: scope,
			eventService: eventService,
			matchLineTimesModalService: matchLineTimesModalService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('getEvent Test', function(){
		it('should set scope.event and scope.displayEventForm to their correct values and call scope.getMatches() after editEventModalService.getEvent() returns ' +
		   'success', function(){
			scope.event = {};
			scope.displayEventForm = false;
			spyOn(scope, 'getMatches');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(1);
			expect(scope.getMatches).toHaveBeenCalled();
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				eventType: 'social'
			});
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('getRoundInfo Test', function(){
    	it('should return the correct value', function(){
    		var line = {
    			match_id: 4
			};
			scope.matches = [{
				id: 3,
				round: 1,
				date: '1/1/2018'
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			expect(scope.getRoundInfo(line)).toEqual({
				roundNumber: 1,
				roundDate: '1/1/2018'
			});
		});
	});

    describe('parseRoundMatchLineNumber Test', function(){
    	it('should set scope.roundMatchLineNumber to its correct value', function(){
    		var roundMatchNumber = 4;
    		var result = {
    			roundDate: 3
			};
    		scope.roundMatchLineNumber = {};
    		scope.parseRoundMatchLineNumber(roundMatchNumber, result);
    		expect(scope.roundMatchLineNumber).toEqual({
				3: {
					4: 1
				}
			});
		});
	});

    describe('assignRoundMatchLineNumber Test', function(){
    	it('should set scope.eventLines to its correct value and call scope.parseRoundMatchLineNumber()', function(){
    		var index = 0;
    		var i = 1;
			scope.eventLines = [{
				id: 4
			}, {
				id: 6
			}];
			scope.matches = [{
				round_match_number: 5
			}];
			scope.roundMatchLineNumber = {
				'3/1/2018': {
					5: 8
				}
			};
			spyOn(scope, 'getRoundInfo').and.returnValue({
				roundDate: '3/1/2018'
			});
			spyOn(scope, 'parseRoundMatchLineNumber');
			scope.assignRoundMatchLineNumber(index, i);
			expect(scope.eventLines).toEqual([{
				id: 4
			}, {
				id: 6,
				round_match_number: 5,
				round_match_line_number: 8
			}]);
			expect(scope.parseRoundMatchLineNumber).toHaveBeenCalledWith(5, {
				roundDate: '3/1/2018'
			});
		});
	});

    describe('parseEventLines Test', function(){
    	it('should set scope.roundMatchLineNumber and scope.eventLines to their correct values', function(){
    		scope.event = {
    			eventType: 'american'
			};
    		scope.roundMatchLineNumber = 'blast';
    		scope.eventLines = [{
    			start_time: 1,
				line_type: 'singles',
				winning_pair_id: null
			}, {
    			start_time: 2,
				line_type: 'singles',
				winning_pair_id: null
			}, {
    			start_time: 3,
				line_type: 'doubles',
				winning_pair_id: 2
			}];
    		scope.matches = [{
    			date: 2
			}, {
    			date: 3
			}, {
    			date: 4
			}];
    		spyOn(helperService, 'parseTime').and.returnValues('a', 'b', 'c');
    		spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1, 2);
    		scope.parseEventLines();
    		expect(scope.roundMatchLineNumber).toEqual({});
    		expect(scope.eventLines).toEqual([{
    			start_time: 1,
				start_time_formatted: 'a',
				line_type: 'singles',
				singles_line_number: 1,
				winning_pair_id: null,
				date: 2
			}, {
    			start_time: 2,
				start_time_formatted: 'b',
				line_type: 'singles',
				singles_line_number: 2,
				winning_pair_id: null,
				date: 3
			}]);
		});
	});

    describe('getEventLines Test', function(){
    	it('should set scope.getEventLinesInProgress to its correct value.  It should then set scope.eventLines and scope.numOfLinesBeforeParse to their correct values ' +
		   'and call scope.parseEventLines() after eventService.getEventLines() returns success', function(){
    		scope.getEventLinesInProgress = false;
    		scope.eventLines = 'beautiful';
    		scope.numOfLinesBeforeParse = 'yeah';
    		spyOn(scope, 'parseEventLines');
    		spyOn(scope, 'getMatches');
    		scope.getEventLines();
    		expect(scope.getEventLinesInProgress).toBeTruthy();
    		scope.$apply();
    		expect(eventService.getEventLines).toHaveBeenCalledWith(1);
    		expect(scope.eventLines).toEqual([1, 2]);
    		expect(scope.numOfLinesBeforeParse).toEqual(2);
    		expect(scope.parseEventLines).toHaveBeenCalled();
    		expect(scope.getEventLinesInProgress).toBeFalsy();
		});
	});

    describe('sortByDate Test', function(){
    	it('should return the correct value', function(){
    		var a = {
    			date: '2018-08-22'
			};
    		var b = {
    			date: '2018-08-01'
			};
    		expect(scope.sortByDate(a, b)).toEqual(1);
		});
    	it('should return the correct value', function(){
    		var a = {
    			date: '2018-07-22'
			};
    		var b = {
    			date: '2018-08-01'
			};
    		expect(scope.sortByDate(a, b)).toEqual(-1);
		});
    	it('should return the correct value', function(){
    		var a = {
    			date: '2018-08-22'
			};
    		var b = {
    			date: '2018-08-22'
			};
    		expect(scope.sortByDate(a, b)).toEqual(0);
		});
	});

    describe('setRoundDateFilter Test', function(){
    	it('should set scope.filters.roundDate to its correct value', function(){
    		scope.roundDates = [{
    			number: 1,
				date: '2018-09-25'
			}, {
    			number: 2,
				date: '2018-08-25'
			}, {
    			number: 3,
				date: '2018-10-25'
			}];
    		scope.filters = {
    			roundDate: 'aaaa'
			};
    		spyOn(helperService, 'getTodaysDate').and.returnValue('2018-09-25');
    		scope.setRoundDateFilter();
    		expect(scope.filters.roundDate).toEqual('2018-09-25');
		});
    	it('should set scope.filters.roundDate to its correct value', function(){
    		scope.roundDates = [{
    			number: 1,
				date: '2018-09-25'
			}, {
    			number: 2,
				date: '2018-08-25'
			}, {
    			number: 3,
				date: '2018-10-25'
			}];
    		scope.filters = {
    			roundDate: '2018-08-25'
			};
    		spyOn(helperService, 'getTodaysDate').and.returnValue('2018-08-25');
    		scope.setRoundDateFilter();
    		expect(scope.filters.roundDate).toEqual('2018-08-25');
		});
    	it('should set scope.filters.roundDate to its correct value', function(){
    		scope.roundDates = [{
    			number: 1,
				date: '2018-09-25'
			}, {
    			number: 2,
				date: '2018-08-25'
			}, {
    			number: 3,
				date: '2018-10-25'
			}];
    		scope.filters = {
    			roundDate: '2018-08-25'
			};
    		spyOn(helperService, 'getTodaysDate').and.returnValue('2018-07-25');
    		scope.setRoundDateFilter();
    		expect(scope.filters.roundDate).toEqual('2018-08-25');
		});
    	it('should set scope.filters.roundDate to its correct value', function(){
    		scope.roundDates = [{
    			number: 1,
				date: '2018-09-25'
			}, {
    			number: 2,
				date: '2018-08-25'
			}, {
    			number: 3,
				date: '2018-10-25'
			}];
    		scope.filters = {
    			roundDate: '2018-08-25'
			};
    		spyOn(helperService, 'getTodaysDate').and.returnValue('2018-12-25');
    		scope.setRoundDateFilter();
    		expect(scope.filters.roundDate).toEqual('2018-08-25');
		});
	});

    describe('parseMatches Test', function(){
    	it('should set scope.matches, scope.roundDates, and scope.filters to their correct values and call scope.setRoundDateFilter()', function(){
    		scope.filters = {};
    		scope.roundDates = 'hero';
    		scope.matches = [{
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: null,
				date: 'a',
				round: 1
			}, {
    			start_time: '18:45:00',
				line_type: 'singles',
				event_surface_number: null,
				date: 'a',
				round: 1
			}, {
    			start_time: '05:00:00',
				line_type: 'doubles',
				event_surface_number: 4,
				date: 'a',
				round: 1
			}];
    		spyOn(scope, 'setRoundDateFilter');
    		spyOn(helperService, 'findArrayIndex').and.returnValues(false, 0, 0, 0);
    		scope.parseMatches();
    		expect(scope.matches).toEqual([{
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: '',
				date: 'a',
				round: 1,
				round_match_number: 1
			}, {
    			start_time: '18:45:00',
				line_type: 'singles',
				event_surface_number: '',
				date: 'a',
				round: 1,
				round_match_number: 2
			}, {
    			start_time: '05:00:00',
				line_type: 'doubles',
				event_surface_number: '4',
				date: 'a',
				round: 1,
				round_match_number: 3
			}]);
    		expect(scope.roundDates).toEqual([{
    			number: 1,
				date: 'a'
			}]);
    		expect(scope.filters.roundDate).toEqual('a');
    		expect(scope.setRoundDateFilter).toHaveBeenCalled();
		});
	});

	describe('getMatches Test', function(){
		it('should set scope.matches to its correct value and call scope.parseMatches() and scope.getEventLines() after matchLineTimesModalService.getEventMatches() returns ' +
		   'success', function(){
			scope.selectedEvent = {
				id: 45
			};
			scope.matches = 'do';
			spyOn(scope, 'parseMatches');
			spyOn(scope, 'getEventLines');
			scope.getMatches();
			scope.$apply();
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(scope.selectedEvent.id);
			expect(scope.matches).toEqual('boy');
			expect(scope.parseMatches).toHaveBeenCalled();
			expect(scope.getEventLines).toHaveBeenCalled();
		});
	});

    describe('buildLineResultsArray Test', function(){
    	it('should set scope.lineResults to its correct value', function(){
    		scope.lineResults = 'sight';
    		scope.eventLines = [{
    			id: 1,
				winning_pair_id: 2,
				line_scores: [{
    				id: 1,
					pair_one_score: 4,
					pair_two_score: 6
				}]
			}, {
    			id: 2,
				winning_pair_id: 1,
				line_scores: [{
    				id: 2,
					pair_one_score: 6,
					pair_two_score: 1
				}]
			}];
    		scope.buildLineResultsArray();
    		expect(scope.lineResults).toEqual([{
    			line_id: 1,
				winning_pair_id: 2,
				sets: [{
    				line_score_id: 1,
					pair_one_score: 4,
					pair_two_score: 6
				}]
			}, {
    			line_id: 2,
				winning_pair_id: 1,
				sets: [{
    				line_score_id: 2,
					pair_one_score: 6,
					pair_two_score: 1
				}]
			}]);
		});
	});

    describe('updateLineScores Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.buildLineResultsArray().  It should then call scope.getStandings() ' +
		   'after eventService.updateEventLinesScores() returns success', function(){
    		rootScope.currentPage = 'eventStandings';
			scope.lineResults = 'chicken';
			scope.callInProgress = false;
			scope.callSuccess = true;
			spyOn(scope, 'buildLineResultsArray');
			scope.getStandings = jasmine.createSpy('getStandings');
			spyOn(scope, 'getMatches');
			scope.updateLineScores();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			expect(scope.buildLineResultsArray).toHaveBeenCalled();
			scope.$apply();
			expect(eventService.updateEventLinesScores).toHaveBeenCalledWith(scope.lineResults);
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.getStandings).toHaveBeenCalled();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

    describe('showLine Test', function(){
		it('should return the correct value', function(){
			scope.selectedEvent = {
				event_type: 'league'
			};
			scope.filters = {
				roundDate: '1/1/2018',
				matchId: 44,
				lineId: 3
			};
			var line = {
				date: '1/1/2018',
				match_id: 44,
				id: 3
			};
			expect(scope.showLine(line)).toBeTruthy();
		});
		it('should return the correct value', function(){
			scope.selectedEvent = {
				event_type: 'social'
			};
			var line = {
				date: '1/1/2018',
				match_id: 44,
				id: 3
			};
			expect(scope.showLine(line)).toBeTruthy();
		});
		it('should return the correct value', function(){
			scope.selectedEvent = {
				event_type: 'league'
			};
			scope.filters = {
				roundDate: '2'
			};
			var line = {
				date: '1/1/2018',
				match_id: 44,
				id: 3
			};
			expect(scope.showLine(line)).toBeFalsy();
		});
	});

    describe('$watch filters.roundDate Test', function(){
    	it('should set scope.filters to its correct value', function(){
    		scope.filters = {
    			roundDate: 3,
				matchId: null,
				lineId: null
			};
    		spyOn(scope, 'getEventLines');
    		spyOn(scope, 'getMatches');
    		scope.$apply();
    		scope.filters = {
    			roundDate: 4,
				matchId: 'shape',
				lineId: 'become'
			};
    		scope.$apply();
    		expect(scope.filters).toEqual({
				roundDate: 4,
				matchId: null,
				lineId: null
			});
		});
	});

    describe('$watch filters.matchId Test', function(){
    	it('should set scope.filters.lineId to its correct value', function(){
    		scope.filters = {
				matchId: null,
				lineId: null
			};
    		spyOn(scope, 'getEventLines');
    		spyOn(scope, 'getMatches');
    		scope.$apply();
    		scope.filters = {
				matchId: 4,
				lineId: 'become'
			};
    		scope.$apply();
    		expect(scope.filters).toEqual({
				matchId: 4,
				lineId: null
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