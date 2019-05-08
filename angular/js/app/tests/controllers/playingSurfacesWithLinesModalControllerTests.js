describe('playingSurfacesWithLinesModalController Test Suite', function(){

    var q, deferred, rootScope, scope, playingSurfacesWithLinesModalService, eventService, matchLineTimesModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        playingSurfacesWithLinesModalService = {
            getSurfaces: function(){
                deferred = q.defer();
                deferred.resolve({
					surfaces: 'home'
				});
                return deferred.promise;
            },
			updateSurfaceAssignments: function(){
				deferred = q.defer();
				deferred.resolve();
				return deferred.promise;
			}
        };
        spyOn(playingSurfacesWithLinesModalService, 'getSurfaces').and.callThrough();
        spyOn(playingSurfacesWithLinesModalService, 'updateSurfaceAssignments').and.callThrough();
        eventService = {
            getEventLines: function(){
                deferred = q.defer();
                deferred.resolve({
					lines: [{
						id: 4
					}, {
						id: 3
					}]
				});
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventLines').and.callThrough();
        matchLineTimesModalService = {
        	getEventMatches: function(){
                deferred = q.defer();
                deferred.resolve({
					matches: 'girl'
				});
                return deferred.promise;
            }
		};
        spyOn(matchLineTimesModalService, 'getEventMatches').and.callThrough();
        helperService = {
        	findArrayIndex: function(){},
        	findArrayIndexMultipleKeys: function(){},
			parseTime: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
        rootScope.selectedEvent = {
			id: 2
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('playingSurfacesWithLinesModalController', {
            $scope: scope,
			playingSurfacesWithLinesModalService: playingSurfacesWithLinesModalService,
			eventService: eventService,
			matchLineTimesModalService: matchLineTimesModalService,
			helperService: helperService
        });
    }));

    describe('updateLineTypeCounts Test', function(){
    	it('should set scope.lineTypeCounts to its correct value and return the correct value', function(){
			var line = {
				line_play_type: 'md',
				match_id: 2
			};
			scope.matches = [{
				id: 2,
				date: 44
			}];
			scope.lineTypeCounts = {};
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			expect(scope.updateLineTypeCounts(line)).toEqual(44);
			expect(scope.lineTypeCounts).toEqual({
				2: {
					md: 1
				}
			});
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

    describe('isLineUsingEmergencySurface Test', function(){
    	it('should return true', function(){
    		var line = {
    			event_surface_number: 5
			};
    		scope.emergencySurfaces = [{
				pivot: {
					event_surface_number: 5
				}
			}];
    		expect(scope.isLineUsingEmergencySurface(line)).toBeTruthy();
		});
    	it('should return false', function(){
    		var line = {
    			event_surface_number: 7
			};
    		scope.emergencySurfaces = [{
				pivot: {
					event_surface_number: 5
				}
			}];
    		expect(scope.isLineUsingEmergencySurface(line)).toBeFalsy();
		});
	});

	describe('parseLines Test', function(){
    	it('should set scope.linesWithEmergencySurfaces and scope.lines to their correct values and call scope.parseRoundMatchLineNumber()', function(){
    		rootScope.selectedEvent = {
    			event_type: 'league'
			};
    		scope.lineTypeCounts = {
    			2: {
    				wd: 1,
					md: 1,
					xd: 1
				}
			};
    		scope.lines = [{
    			id: 1,
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: null,
				match_id: 2,
				line_play_type: 'wd'
			}, {
    			id: 2,
    			start_time: '18:45:00',
				line_type: 'singles',
				event_surface_number: null,
				match_id: 2,
				line_play_type: 'md'
			}, {
    			id: 3,
    			start_time: '05:00:00',
				line_type: 'doubles',
				event_surface_number: 4,
				match_id: 2,
				line_play_type: 'xd'
			}];
    		scope.matches = [{
    			round_match_number: 4
			}];
    		spyOn(scope, 'updateLineTypeCounts');
    		spyOn(helperService, 'parseTime').and.returnValues('4:00 AM', '6:45 PM', '5:00 AM');
    		spyOn(scope, 'getRoundInfo').and.returnValue({
				roundNumber: 2,
				roundDate: '2/2/2018'
			});
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		spyOn(scope, 'parseRoundMatchLineNumber').and.callThrough();
    		spyOn(scope, 'isLineUsingEmergencySurface').and.returnValues(false, false, true);
    		scope.parseLines();
    		expect(scope.parseRoundMatchLineNumber.calls.count()).toEqual(3);
    		expect(scope.lines).toEqual([{
    			id: 1,
    			start_time: '04:00:00',
				start_time_formatted: '4:00 AM',
				line_type: 'singles',
				event_surface_number: '',
				match_id: 2,
				line_play_type: 'wd',
				line_type_number: 'WD1',
				round_number: 2,
				round_date: '2/2/2018',
				round_match_number: 4,
				round_match_line_number: 1
			}, {
    			id: 2,
    			start_time: '18:45:00',
				start_time_formatted: '6:45 PM',
				line_type: 'singles',
				event_surface_number: '',
				match_id: 2,
				line_play_type: 'md',
				line_type_number: 'MD1',
				round_number: 2,
				round_date: '2/2/2018',
				round_match_number: 4,
				round_match_line_number: 2
			}, {
    			id: 3,
    			start_time: '05:00:00',
				start_time_formatted: '5:00 AM',
				line_type: 'doubles',
				event_surface_number: '4',
				match_id: 2,
				line_play_type: 'xd',
				line_type_number: 'XD1',
				round_number: 2,
				round_date: '2/2/2018',
				round_match_number: 4,
				round_match_line_number: 3
			}]);
    		expect(scope.linesWithEmergencySurfaces).toEqual([3]);
		});
	});

	describe('sortLines Test', function(){
		it('shoudl return the array in the correct order', function(){
			var array = [{
				id: 3
			}, {
				id: 1
			}, {
				id: 5
			}];
			array.sort(scope.sortLines);
			expect(array).toEqual([{
				id: 1
			}, {
				id: 3
			}, {
				id: 5
			}]);
		});
	});

	describe('getLines Test', function(){
		it('should set scope.lines and scope.lineTypeCounts to their correct values and call scope.parseLines() after eventService.getEventLines() returns success', function(){
			scope.lines = 'do';
			scope.lineTypeCounts = 'way';
			spyOn(scope, 'parseLines');
			scope.getLines();
			scope.$apply();
			expect(eventService.getEventLines).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.lines).toEqual([{
				id: 3
			}, {
				id: 4
			}]);
			expect(scope.lineTypeCounts).toEqual({});
			expect(scope.parseLines).toHaveBeenCalled();
		});
	});

	describe('parseMatches Test', function(){
		it('should set scope.roundDates, scope.roundMatchNumbers, and scope.matches to their correct values', function(){
			scope.roundDates = 'egg';
			scope.roundMatchNumbers = 'maple';
			scope.matches = [{
				round: 1,
				event_surface_number: 4,
				date: '6/1/2018'
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(false);
			scope.parseMatches();
			expect(scope.roundDates).toEqual([{
				number: 1,
				date: '6/1/2018'
			}]);
			expect(scope.roundMatchNumbers).toEqual([1]);
			expect(scope.matches).toEqual([{
				round: 1,
				event_surface_number: '4',
				date: '6/1/2018',
				round_match_number: 1
			}]);
		});
	});

	describe('getMatches Test', function(){
		it('should set scope.matches to its correct value and call scope.parseMatches() and scope.getLines() after matchLineTimesModalService.getEventMatches() ' +
		   'returns success', function(){
			scope.matches = 'do';
			spyOn(scope, 'parseMatches');
			spyOn(scope, 'getLines');
			scope.getMatches();
			scope.$apply();
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.matches).toEqual('girl');
			expect(scope.parseMatches).toHaveBeenCalled();
			expect(scope.getLines).toHaveBeenCalled();
		});
	});

	describe('parseSurfaces Test', function(){
		it('should set scope.emergencySurfaces and scope.surfaces to their correct values', function(){
			var surfaces = [{
				id: 1,
				pivot: {
					emergency_surface: 1
				}
			}, {
				id: 2,
				pivot: {
					emergency_surface: 0
				}
			}];
			scope.surfaces = 'eee';
			scope.emergencySurfaces = 'aaa';
			scope.parseSurfaces(surfaces);
			expect(scope.surfaces).toEqual([{
				id: 2,
				pivot: {
					emergency_surface: 0
				}
			}]);
			expect(scope.emergencySurfaces).toEqual([{
				id: 1,
				pivot: {
					emergency_surface: 1
				}
			}]);
		});
	});

	describe('getSurfaces Test', function(){
		it('should set scope.surfaces to its correct value after playingSurfacesWithLinesModalService.getSurfaces() returns success', function(){
			scope.surfaces = 'switch';
			spyOn(scope, 'parseLines');
			scope.getSurfaces();
			scope.$apply();
			expect(playingSurfacesWithLinesModalService.getSurfaces).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.surfaces).toEqual('home');
		});
	});

	describe('resetNonLeagueDropdown Test', function(){
		it('should set scope.lines to its correct value', function(){
			scope.lines = [{
				id: 1,
				event_surface_number: 1,
				start_time: '04:00:00'
			}, {
				id: 2,
				event_surface_number: 1,
				start_time: '05:00:00'
			}, {
				id: 3,
				event_surface_number: 2,
				start_time: '04:00:00'
			}, {
				id: 4,
				event_surface_number: 3,
				start_time: '05:00:00'
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValues(3, 2);
			spyOn(helperService, 'findArrayIndexMultipleKeys').and.returnValue(2);
			spyOn(scope, 'parseLines');
			scope.resetNonLeagueDropdown(4, 2, '04:00:00');
			expect(scope.lines).toEqual([
				{
				id: 1,
				event_surface_number: 1,
				start_time: '04:00:00'
			}, {
				id: 2,
				event_surface_number: 1,
				start_time: '05:00:00'
			}, {
				id: 3,
				event_surface_number: '',
				start_time: '04:00:00'
			}, {
				id: 4,
				event_surface_number: 3,
				start_time: '05:00:00'
			}
			]);
		});
	});

	describe('resetLeagueDropdown Test', function(){
		it('should set scope.lines to its correct value', function(){
			scope.lines = [{
				id: 1,
				event_surface_number: 1,
				start_time: '04:00:00'
			}, {
				id: 2,
				event_surface_number: 1,
				start_time: '05:00:00'
			}, {
				id: 3,
				event_surface_number: 2,
				start_time: '04:00:00'
			}, {
				id: 4,
				event_surface_number: 3,
				start_time: '05:00:00'
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValues(3, 2);
			spyOn(helperService, 'findArrayIndexMultipleKeys').and.returnValue(2);
			spyOn(scope, 'parseLines');
			scope.resetLeagueDropdown(4, 2, '04:00:00', 2);
			expect(scope.lines).toEqual([
				{
				id: 1,
				event_surface_number: 1,
				start_time: '04:00:00'
			}, {
				id: 2,
				event_surface_number: 1,
				start_time: '05:00:00'
			}, {
				id: 3,
				event_surface_number: '',
				start_time: '04:00:00'
			}, {
				id: 4,
				event_surface_number: 3,
				start_time: '05:00:00'
			}
			]);
		});
	});

	describe('resetDropdown Test', function(){
		it('should call scope.resetNonLeagueDropdown()', function(){
			var line = {
				id: 3,
				event_surface_number: 4,
				start_time: '2:00 PM',
				round_number: 2
			};
			rootScope.selectedEvent = {
				event_type: 'social'
			};
			spyOn(scope, 'resetNonLeagueDropdown');
			scope.resetDropdown(line);
			expect(scope.resetNonLeagueDropdown).toHaveBeenCalledWith(line.id, line.event_surface_number, line.start_time);
		});
		it('should call scope.resetLeagueDropdown()', function(){
			var line = {
				id: 3,
				event_surface_number: 4,
				start_time: '2:00 PM',
				round_number: 2
			};
			rootScope.selectedEvent = {
				event_type: 'league'
			};
			spyOn(scope, 'resetLeagueDropdown');
			scope.resetDropdown(line);
			expect(scope.resetLeagueDropdown).toHaveBeenCalledWith(line.id, line.event_surface_number, line.start_time, line.round_number);
		});
	});

	describe('toggleEmergencySurface Test', function(){
		it('should set scope.linesWithEmergencySurfaces and scope.lines to their correct values', function(){
			var lineId = 44;
			scope.linesWithEmergencySurfaces = [22];
			scope.lines = [{
				id: 88
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			scope.toggleEmergencySurface(lineId);
			expect(scope.linesWithEmergencySurfaces).toEqual([22, 44]);
			expect(scope.lines).toEqual([{
				id: 88,
				event_surface_number: null
			}]);
			lineId = 22;
			scope.toggleEmergencySurface(lineId);
			expect(scope.linesWithEmergencySurfaces).toEqual([44]);
		});
	});

	describe('updateSurfaceAssignments Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  playingSurfacesWithLinesModalService.updateSurfaceAssignments() should then ' +
		   'return success', function(){
			scope.lines = 'city';
			scope.callInProgress = false;
			scope.callSuccess = true;
			spyOn(scope, 'parseLines');
			scope.updateSurfaceAssignments();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(playingSurfacesWithLinesModalService.updateSurfaceAssignments).toHaveBeenCalledWith(rootScope.selectedEvent.id, 'city');
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

	describe('showLine Test', function(){
		it('should return false', function(){
			var line = {
				round_date: '5/1/2018',
				round_match_number: 4
			};
			scope.filters = {
				roundDate: '4/1/2018'
			};
			expect(scope.showLine(line)).toBeFalsy();
		});
		it('should return false', function(){
			var line = {
				round_date: '5/1/2018',
				round_match_number: 4
			};
			scope.filters = {
				roundDate: '5/1/2018',
				matchNumber: 3
			};
			expect(scope.showLine(line)).toBeFalsy();
		});
		it('should return true', function(){
			var line = {
				round_date: '5/1/2018',
				round_match_number: 4
			};
			scope.filters = {};
			expect(scope.showLine(line)).toBeTruthy();
		});
	});

	describe('$watch filters.roundDate Test', function(){
		it('should set scope.filters.matchNumber to null', function(){
			scope.filters = {
				roundDate: 2
			};
			spyOn(scope, 'parseLines');
			scope.$apply();
			scope.filters = {
				roundDate: 3,
				matchNumber: 4
			};
			scope.$apply();
			expect(scope.filters).toEqual({
				roundDate: 3,
				matchNumber: null
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

	describe('orderLines Test', function(){
		it('should return the correct value', function(){
			var line = {
				round_number: 4
			};
			expect(scope.orderLines(line)).toEqual(4);
		});
		it('should return the correct value', function(){
			var line = {
				round_number: -2
			};
			expect(scope.orderLines(line)).toEqual(102);
		});
	});

});