describe('eventPlayoffController Test Suite', function(){

    var q, deferred, rootScope, scope, window, eventPlayoffService, eventService, editEventModalService, helperService;

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
    	eventPlayoffService = {
    		getPlayoffMatches: function(){
    			deferred = q.defer();
                deferred.resolve({
					playoff_matches: 'something'
                });
                return deferred.promise;
			},
			getTeamScores: function(){
    			deferred = q.defer();
                deferred.resolve({
					team_scores: [{
						score: 4
					}, {
						score: 3
					}]
				});
                return deferred.promise;
			},
			updatePlayoffMatches: function(){
    			deferred = q.defer();
                deferred.resolve()
                return deferred.promise;
			}
		};
    	spyOn(eventPlayoffService, 'getPlayoffMatches').and.callThrough();
    	spyOn(eventPlayoffService, 'getTeamScores').and.callThrough();
    	spyOn(eventPlayoffService, 'updatePlayoffMatches').and.callThrough();
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
						ranked: 1,
						activity_id: 4,
						facility_id: 5,
						users: 'love'
					}
				});
                return deferred.promise;
            }
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
        helperService = {
            findArrayIndex: function(){},
			findArrayIndices: function(){}
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
        $controller('eventPlayoffController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventPlayoffService: eventPlayoffService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('getEvent Test', function(){
		it('should set scope.event and scope.displayEventForm to their correct values after editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.eventUsers = 'so';
			scope.displayEventForm = false;
			spyOn(scope, 'getTeamScores');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				ranked: 1,
				activityId: 4,
				facilityId: 5
			});
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('getEventsAsLeader Test', function(){
		it('should call scope.getEvent() after eventService.getEventsAsLeader() ' +
		   'returns success', function(){
			spyOn(scope, 'getEvent');
			spyOn(scope, 'getTeamScores');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('parsePlayoffMatches Test', function(){
    	it('should set scope.playoffMatches, scope.rounds, and scope.roundWidth to their correct values', function(){
    		scope.teamScores = [{
    			id: 1,
				name: 'one'
			}, {
    			id: 2,
				name: 'two'
			}, {
    			id: 3,
    			name: 'three'
			}, {
    			id: 4,
    			name: 'four'
			}];
    		scope.playoffMatches = [{
    			round: -1,
				winning_team_id: 1
			}];
    		scope.rounds = 'aaa';
			spyOn(helperService, 'findArrayIndex').and.returnValues(2);
			scope.parsePlayoffMatches();
			expect(scope.playoffMatches).toEqual([{
    			round: -1,
				winning_team_id: 1,
				team_one: {
    				id: 1,
					name: 'one'
				},
				team_two: {
    				id: 4,
					name: 'four'
				},
				winning_team_name: 'three'
			}]);
			expect(scope.rounds).toEqual([-1]);
			expect(scope.roundWidth).toEqual(50);
		});
	});

    describe('getPlayoffMatches Test', function(){
    	it('should set scope.playoffMatches to its correct value and call scope.getTeamScores() after eventPlayoffService.getPlayoffMatches() returns success', function(){
    		scope.playoffMatches = 'aaa';
    		spyOn(scope, 'getTeamScores');
    		scope.getPlayoffMatches();
    		scope.$apply();
    		expect(eventPlayoffService.getPlayoffMatches).toHaveBeenCalledWith(4);
    		expect(scope.playoffMatches).toEqual('something');
    		expect(scope.getTeamScores).toHaveBeenCalled();
		});
	});

	describe('sortByScore Test', function(){
		it('should return the correct value', function(){
			var a = {
				score: 4
			};
			var b = {
				score: 5
			};
			expect(scope.sortByScore(a, b)).toEqual(1);
		});
		it('should return the correct value', function(){
			var a = {
				score: 4,
				sets_lost: 9
			};
			var b = {
				score: 4,
				sets_lost: 6
			};
			expect(scope.sortByScore(a, b)).toEqual(3);
		});
		it('should return the correct value', function(){
			var a = {
				score: 4,
				sets_lost: 6,
				games_lost: 7
			};
			var b = {
				score: 4,
				sets_lost: 6,
				games_lost: 5
			};
			expect(scope.sortByScore(a, b)).toEqual(2);
		});
	});

	describe('getTeamScores Test', function(){
		it('should set scope.teamScores to its correct value and call scope.parsePlayoffMatches() after eventPlayoffService.getTeamScores() returns success', function(){
			scope.teamScores = 'eee';
			spyOn(scope, 'parsePlayoffMatches');
			scope.getTeamScores();
			scope.$apply();
			expect(eventPlayoffService.getTeamScores).toHaveBeenCalledWith(4);
			expect(scope.teamScores).toEqual([{
				score: 4
			}, {
				score: 3
			}]);
			expect(scope.parsePlayoffMatches).toHaveBeenCalled();
		});
	});

	describe('selectWinningTeam Test', function(){
		it('should set scope.playoffMatches to its correct value', function(){
			var matchId = 55;
			var winningTeamId = 66;
			var winningTeamName = 'blue';
			scope.playoffMatches = [{
				id: 4
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			scope.selectWinningTeam(matchId, winningTeamId, winningTeamName);
			expect(scope.playoffMatches).toEqual([{
				id: 4,
				winning_team_id: 66,
				winning_team_name: 'blue'
			}]);
		});
	});

	describe('returnChampionshipTeam Test', function(){
		it('should return the correct value', function(){
			scope.playoffMatches = [{
				winning_team_name: 'blue'
			}, {
				winning_team_name: 'orange'
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(1);
			expect(scope.returnChampionshipTeam()).toEqual('orange');
		});
	});

	describe('checkAndAddTeamId Test', function(){
		it('should set scope.playoffMatches to its correct value', function(){
			scope.teamScores = [{
				id: 2
			}, {
				id: 3
			}, {
				id: 4
			}];
			scope.playoffMatches = [{
				winning_team_name: 'white',
				team_one: {
					name: 'purple'
				},
				team_two: {
					name: 'yellow'
				}
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1, 2);
			scope.checkAndAddTeamId();
			expect(scope.playoffMatches).toEqual([{
				winning_team_id: 2,
				winning_team_name: 'white',
				team_one: {
					id: 3,
					name: 'purple'
				},
				team_two: {
					id: 4,
					name: 'yellow'
				}
			}]);
		});
	});

	describe('showTeam Test', function(){
		it('should return the correct value', function(){
			var round = -1;
			var selectedTeamName = 'brown';
			scope.playoffMatches = [{
				id: 1,
				round: -1,
				team_one: {
					name: 'yellow'
				},
				team_two: {
					name: 'pink'
				}
			}, {
				id: 2,
				round: -1,
				team_one: {
					name: 'brown'
				},
				team_two: {
					name: 'green'
				}
			}];
			spyOn(helperService, 'findArrayIndices').and.returnValue([0, 1]);
			expect(scope.showTeam(round, selectedTeamName)).toBeFalsy();
		});
	});

	describe('updatePlayoffMatches Test', function(){
		it('should set scope.callInProgress to its correct value and call scope.checkAndAddTeamId().  It should then call window.alert() after ' +
		   'eventPlayoffService.updatePlayoffMatches() returns success', function(){
			scope.playoffMatches = 'aaaa';
			scope.callInProgress = false;
			spyOn(scope, 'checkAndAddTeamId');
			spyOn(window, 'alert');
			scope.updatePlayoffMatches();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.checkAndAddTeamId).toHaveBeenCalled();
			scope.$apply();
			expect(eventPlayoffService.updatePlayoffMatches).toHaveBeenCalledWith(4, 'aaaa');
			expect(window.alert).toHaveBeenCalledWith('Results Updated!');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});