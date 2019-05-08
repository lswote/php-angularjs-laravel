describe('matchLineTimesModalController Test Suite', function(){

    var q, deferred, scope, rootScope, matchLineTimesModalService, editEventModalService, playingSurfacesWithLinesModalService, eventService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        matchLineTimesModalService = {
        	getEventMatches: function(){
				deferred = q.defer();
                deferred.resolve({
					matches: 'again'
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
						name: 'beautiful',
						activity_id: 2,
						facility_id: 3,
						users: 'da'
					}
				});
                return deferred.promise;
			}
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
		playingSurfacesWithLinesModalService = {
			getSurfaces: function(){
				deferred = q.defer();
                deferred.resolve({
					surfaces: 'love'
				});
                return deferred.promise;
			}
		};
		spyOn(playingSurfacesWithLinesModalService, 'getSurfaces').and.callThrough();
		eventService = {
			getEventLines: function(){
				deferred = q.defer();
                deferred.resolve({
					lines: [{
						id: 3
					}, {
						id: 2
					}, {
						id: 1
					}]
				});
                return deferred.promise;
			}
		};
		spyOn(eventService, 'getEventLines').and.callThrough();
		helperService = {
			findArrayIndex: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
			id: 11
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('matchLineTimesModalController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			matchLineTimesModalService: matchLineTimesModalService,
			editEventModalService: editEventModalService,
			playingSurfacesWithLinesModalService: playingSurfacesWithLinesModalService,
			eventService: eventService,
			helperService: helperService
        });
    }));

    describe('getEvent Test', function(){
    	it('should set scope.event, scope.eventUsers, and scope.displayEventForm to their correct values after editEventModalService.getEvent() returns success', function(){
    		scope.event = {};
    		scope.eventUsers = 'lalal';
    		scope.displayEventForm = false;
    		spyOn(scope, 'parseLines');
    		spyOn(scope, 'parseMatches');
    		scope.getEvent();
    		scope.$apply();
    		expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
    		expect(scope.event).toEqual({
				id: 1,
				name: 'beautiful',
				activity_id: 2,
				facility_id: 3
			});
    		expect(scope.eventUsers).toEqual('da');
    		expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('parseCourtsString Test', function(){
    	it('should set scope.matches to its correct value', function(){
    		var line = {
    			event_surface_number: 3
			};
    		scope.matches = [{
    			courts_string: '1, 2',
				courts_array: [1, 2]
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		scope.parseCourtsString(line);
    		expect(scope.matches).toEqual([{
    			courts_string: '1, 2, 3',
				courts_array: [1, 2, 3]
			}]);
		});
	});

    describe('parseStartTimesArray Test', function(){
    	it('should set scope.startTimes to its correct value', function(){
    		var line = {
    			start_time: 4
			};
    		scope.startTimes = [1];
    		scope.parseStartTimesArray(line);
    		expect(scope.startTimes).toEqual([1, 4]);
		});
	});

    describe('parseMatchLineStartTimesArray Test', function(){
    	it('should set scope.matchLineStartTimes to its correct value', function(){
    		var line = {
    			match_id: 4,
				start_time: 3,
				id: 10,
				line_play_type: 'xd'
			};
    		scope.matches = [{
    			date: 4
			}];
    		scope.lineTypeCounts = {
    			4: {
    				xd: 2
				}
			};
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		scope.matchLineStartTimes = {};
    		scope.parseMatchLineStartTimesArray(line);
    		expect(scope.matchLineStartTimes).toEqual({
				4: {
					4: {
						3: 'XD2'
					}
				}
			});
		});
	});

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

    describe('parseLines Test', function(){
    	it('should set scope.startTimes, scope.matchLineStartTimes, scope.lineTypeCounts, and scope.lines to their correct values and call scope.parseCourtsString(), ' +
		   'scope.parseStartTimesArray(), and scope.parseMatchLineStartTimesArray()', function(){
    		scope.lines = [{
    			id: 1
			}, {
    			id: 2
			}, {
    			id: 3
			}];
    		scope.startTimes = 'aaa';
    		scope.matchLineStartTimes = 'bbb';
    		scope.lineTypeCounts = 'cry';
    		spyOn(scope, 'updateLineTypeCounts').and.returnValue('safe');
    		spyOn(scope, 'parseCourtsString');
    		spyOn(scope, 'parseStartTimesArray');
    		spyOn(scope, 'parseMatchLineStartTimesArray');
    		scope.parseLines();
    		expect(scope.startTimes).toEqual([]);
    		expect(scope.matchLineStartTimes).toEqual([]);
    		expect(scope.lineTypeCounts).toEqual({});
    		expect(scope.lines).toEqual([{
    			id: 1,
				round_date: 'safe'
			}, {
    			id: 2,
				round_date: 'safe'
			}, {
    			id: 3,
				round_date: 'safe'
			}]);
    		expect(scope.parseCourtsString).toHaveBeenCalledWith({
				id: 1,
				round_date: 'safe'
			});
    		expect(scope.parseCourtsString).toHaveBeenCalledWith({
				id: 2,
				round_date: 'safe'
			});
    		expect(scope.parseCourtsString).toHaveBeenCalledWith({
				id: 3,
				round_date: 'safe'
			});
    		expect(scope.parseStartTimesArray).toHaveBeenCalledWith({
				id: 1,
				round_date: 'safe'
			});
    		expect(scope.parseStartTimesArray).toHaveBeenCalledWith({
				id: 2,
				round_date: 'safe'
			});
    		expect(scope.parseStartTimesArray).toHaveBeenCalledWith({
				id: 3,
				round_date: 'safe'
			});
    		expect(scope.parseMatchLineStartTimesArray).toHaveBeenCalledWith({
				id: 1,
				round_date: 'safe'
			});
    		expect(scope.parseMatchLineStartTimesArray).toHaveBeenCalledWith({
				id: 2,
				round_date: 'safe'
			});
    		expect(scope.parseMatchLineStartTimesArray).toHaveBeenCalledWith({
				id: 3,
				round_date: 'safe'
			});
		});
	});

    describe('getLines Test', function(){
    	it('should set scope.lines to its correct value and call scope.parseLines() after eventService.getEventLines() returns success', function(){
    		scope.lines = 'stars';
    		spyOn(scope, 'parseLines');
    		spyOn(scope, 'parseMatches');
    		scope.getLines();
    		scope.$apply();
    		expect(eventService.getEventLines).toHaveBeenCalledWith(4);
    		expect(scope.lines).toEqual([{
    			id: 1
			}, {
    			id: 2
			}, {
    			id: 3
			}]);
    		expect(scope.parseLines).toHaveBeenCalled();
		});
	});

	describe('parseMatches Test', function(){
		it('should set scope.roundDates, scope.matches, and scope.selectedRoundDate to their correct values', function(){
			scope.roundDates = 'lost';
			scope.matches = [{
				event_surface_number: 3,
				date: 3,
				round: -1
			}, {
				event_surface_number: null,
				date: 4,
				round: -1
			}];
			scope.selectedRoundDate = 'hey';
			spyOn(helperService, 'findArrayIndex').and.returnValues(false, false, 0);
			scope.parseMatches();
			expect(scope.roundDates).toEqual([{
				number: -1,
				date: 3
			}, {
				number: -1,
				date: 4
			}]);
			expect(scope.matches).toEqual([{
				event_surface_number: '3',
				date: 3,
				round: -1
			}, {
				event_surface_number: '',
				date: 4,
				round: -1
			}]);
			expect(scope.selectedRoundDate).toEqual(3);
		});
	});

	describe('getMatches Test', function(){
		it('should set scope.matches to its correct value and call scope.parseMatches() and scope.getLines() after matchLineTimesModalService.getEventMatches() returns ' +
		   'success', function(){
			scope.matches = 'yeah';
			spyOn(scope, 'parseMatches');
			spyOn(scope, 'getLines');
			spyOn(scope, 'parseLines');
			scope.getMatches();
			scope.$apply();
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(4);
			expect(scope.matches).toEqual('again');
			expect(scope.parseMatches).toHaveBeenCalled();
			expect(scope.getLines).toHaveBeenCalled();
		});
	});

	describe('getSurfaces Test', function(){
		it('should set scope.surfaces to its correct value after playingSurfacesWithLinesModalService.getSurfaces() returns success', function(){
			scope.surfaces = 'compares';
			spyOn(scope, 'parseLines');
			spyOn(scope, 'parseMatches');
			scope.getSurfaces();
			scope.$apply();
			expect(playingSurfacesWithLinesModalService.getSurfaces).toHaveBeenCalledWith(4);
			expect(scope.surfaces).toEqual('love');
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