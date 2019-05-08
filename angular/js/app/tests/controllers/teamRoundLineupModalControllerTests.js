describe('teamRoundLineupModalController Test Suite', function(){

    var q, deferred, rootScope, scope, eventService, matchLineTimesModalService, helperService;

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
					lines: [{
						id: 2
					}, {
						id: 3
					}, {
						id: 1
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
        	findArrayIndex: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('teamRoundLineupModalController', {
            $scope: scope,
			$routeParams: {
				id: 4
			},
			eventService: eventService,
			matchLineTimesModalService: matchLineTimesModalService,
			helperService: helperService
        });
    }));
    
    describe('parseMatchLineStartTimesArray Test', function(){
    	it('should set scope.matchLineStartTimes to its correct value', function(){
    		var line = {
    			line_play_type: 'md',
				match_id: 5,
				id: 3
			};
    		scope.lineTypeCounts = {
    			5: {
    				md: 4
				}
			};
    		scope.matchLineStartTimes = {};
    		scope.parseMatchLineStartTimesArray(line);
    		expect(scope.matchLineStartTimes).toEqual({
				3: 'MD4'
			});
		});
	});

    describe('updateLineTypeCounts Test', function(){
    	it('should set scope.lineTypeCounts to its correct value and return the correct value', function(){
			var line = {
				line_play_type: 'md',
				match_id: 2,
				pair_one: 'maybe',
				pair_two: 'year'
			};
			scope.matches = [{
				id: 2,
				date: 44,
				team_one: {
					name: 'orange'
				},
				team_two: {
					name: 'black'
				}
			}];
			rootScope.selectedTeam = 'orange';
			scope.lineTypeCounts = {};
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			expect(scope.updateLineTypeCounts(line)).toEqual({
				roundDate: 44,
				matchTeams: ['orange', 'black'],
				selectedTeam: 'maybe'
			});
			expect(scope.lineTypeCounts).toEqual({
				2: {
					md: 1
				}
			});
		});
	});

	describe('parseLines Test', function(){
    	it('should set scope.lineTypeCounts, scope.matchLineStartTimes, and scope.lines to their correct values and call scope.parseMatchLineStartTimesArray()', function(){
    		scope.lineTypeCounts = {
    			2: {
    				wd: 1,
					md: 1,
					xd: 1
				}
			};
    		scope.matchLineStartTimes = 'tear';
    		scope.lines = [{
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: null,
				match_id: 2,
				line_play_type: 'wd'
			}];
    		spyOn(scope, 'updateLineTypeCounts').and.returnValue({
				roundDate: 1,
				matchTeams: ['red', 'yellow'],
				selectedTeam: 'hunger'
			});
    		spyOn(scope, 'parseMatchLineStartTimesArray');
    		scope.parseLines();
    		expect(scope.lineTypeCounts).toEqual({});
    		expect(scope.matchLineStartTimes).toEqual({});
    		expect(scope.lines).toEqual([{
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: null,
				match_id: 2,
				line_play_type: 'wd',
				round_date: 1,
				match_teams: ['red', 'yellow'],
				selected_team: 'hunger'
			}]);
    		expect(scope.parseMatchLineStartTimesArray).toHaveBeenCalledWith({
    			start_time: '04:00:00',
				line_type: 'singles',
				event_surface_number: null,
				match_id: 2,
				line_play_type: 'wd',
				round_date: 1,
				match_teams: ['red', 'yellow'],
				selected_team: 'hunger'
			});
		});
	});

	describe('getLines Test', function(){
		it('should set scope.lines to its correct value and call scope.parseLines() after eventService.getEventLines() returns success', function(){
			scope.lines = 'do';
			spyOn(scope, 'parseLines');
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
		it('should set scope.matches, scope.roundDates, and scope.playoffTeams to their correct values', function(){
			scope.matches = [{
				event_surface_number: 4,
				date: 3,
				round: -1,
				team_one: {
					name: 'blue'
				},
				team_two: {
					name: 'red'
				}
			}, {
				event_surface_number: null,
				date: 5,
				round: -1,
				team_one: {
					name: 'orange'
				},
				team_two: {
					name: 'red'
				}
			}];
			scope.roundDates = 'see';
			scope.playoffTeams = 'wwww';
			spyOn(helperService, 'findArrayIndex').and.returnValues(false, false);
			scope.parseMatches();
			expect(scope.matches).toEqual([{
				event_surface_number: '4',
				date: 3,
				round: -1,
				team_one: {
					name: 'blue'
				},
				team_two: {
					name: 'red'
				}
			}, {
				event_surface_number: '',
				date: 5,
				round: -1,
				team_one: {
					name: 'orange'
				},
				team_two: {
					name: 'red'
				}
			}]);
			expect(scope.roundDates).toEqual([{
				number: -1,
				date: 3
			}, {
				number: -1,
				date: 5
			}]);
			expect(scope.playoffTeams).toEqual({
				'-1': ['blue', 'red', 'orange']
			})
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
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(4);
			expect(scope.matches).toEqual('girl');
			expect(scope.parseMatches).toHaveBeenCalled();
			expect(scope.getLines).toHaveBeenCalled();
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