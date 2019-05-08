describe('eventController Test Suite', function(){

    var q, deferred, scope, rootScope, window, eventService, editEventModalService, socialEventLinesService, leagueEventLinesService, ladderEventLinesService, helperService;

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

    // Mock out fake services
    beforeEach(function(){
        eventService = {
        	getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			createEventLines: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
			createEventTeams: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        spyOn(eventService, 'createEventLines').and.callThrough();
        spyOn(eventService, 'createEventTeams').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 1,
						name: 'sam',
						event_type: 'social',
						event_sub_type: 'maggie',
						type_of_play: 'mixed',
						event_leaders: [],
						start_date: '1:00',
						num_of_start_times: 4,
						users: 'hoo',
						comb_play: 1,
						max_playing_surfaces: 4,
						single_women_lines: 5,
						single_men_lines: 6,
						ranked: 1,
						sets: 3,
						num_of_playoff_rounds: 3,
						rounds_interval_metric: 'days',
						rounds_interval: '4',
						rounds: '2',
						standard_line_duration: '45',
						start_time: '5:00 PM',
						women_sitting_per_round: 1,
						men_sitting_per_round: 1,
						team_assignment_method: 'pairing',
						num_of_teams: 3,
						line_scoring_format: 'point'
					}
				});
                return deferred.promise;
            },
            edit: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
		spyOn(editEventModalService, 'edit').and.callThrough();
		socialEventLinesService = {
			calculateLinesGender: function(){
				return 'social-calculateLinesGender';
			},
			calculateLinesGenderSinglesOnly: function(){
				return 'social-calculateLinesGenderSinglesOnly';
			},
			calculateLinesMixed: function(){
				return 'social-calculateLinesMixed';
			},
			calculateLinesMixedSinglesOnly: function(){
				return 'social-calculateLinesMixedSinglesOnly';
			}
		};
		leagueEventLinesService = {
			calculateLinesGender: function(){
				return 'league-calculateLinesGender';
			},
			calculateLinesGenderSinglesOnly: function(){
				return 'league-calculateLinesGenderSinglesOnly';
			},
			calculateLinesMixed: function(){
				return 'league-calculateLinesMixed';
			},
			calculateLinesMixedSinglesOnly: function(){
				return 'league-calculateLinesMixedSinglesOnly';
			}
		};
		ladderEventLinesService = {
			calculateLinesGender: function(){
				return 'ladder-calculateLinesGender';
			},
			calculateLinesGenderSinglesOnly: function(){
				return 'ladder-calculateLinesGenderSinglesOnly';
			},
			calculateLinesMixed: function(){
				return 'ladder-calculateLinesMixed';
			},
			calculateLinesMixedSinglesOnly: function(){
				return 'ladder-calculateLinesMixedSinglesOnly';
			}
		};
		helperService = {
        	parseTime: function(){},
			reverseParseTime: function(){},
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
        $controller('eventController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventService: eventService,
			editEventModalService: editEventModalService,
			helperService: helperService,
			socialEventLinesService: socialEventLinesService,
			leagueEventLinesService: leagueEventLinesService,
			ladderEventLinesService: ladderEventLinesService
        });
    }));

    describe('checkEventConfigInputs Test', function(){
		it('should set scope.showEventConfigErrors to its correct value and return false', function(){
			scope.event = {
				eventType: 'league',
				numOfFacilitySurfaces: 5
			};
			scope.eventConfig = {
				teamsPerLine: '2',
				combPlay: null,
				maxSurfaces: null,
				singlesOnly: '0',
				singleWomenLines: null,
				singleMenLines: null,
				ranked: '1',
				sets: null,
				rotateStartTime: null,
				hasPlayoff: null,
				startDate: null,
				startTime: null,
				womenSittingPerRound: null,
				menSittingPerRound: null,
				numOfStartTimes: null,
				selectedTeamCount: null,
				teamAssignmentMethod: null
			};
			scope.showEventConfigErrors = {
				combPlay: false,
				maxSurfaces: false,
				singleWomenLines: false,
				singleMenLines: false,
				sets: false,
				rotateStartTime: false,
				hasPlayoff: false,
				startDate: false,
				startTime: false,
				womenSittingPerRound: false,
				menSittingPerRound: false,
				teamAssignmentMethod: false
			};
			expect(scope.checkEventConfigInputs()).toBeFalsy();
			expect(scope.showEventConfigErrors).toEqual({
				combPlay: true,
				maxSurfaces: true,
				singleWomenLines: true,
				singleMenLines: true,
				sets: true,
				rotateStartTime: true,
				hasPlayoff: true,
				startDate: true,
				startTime: true,
				womenSittingPerRound: true,
				menSittingPerRound: true,
				teamAssignmentMethod: true
			});
		});
		it('should not change scope.showEventConfigErrors and return true', function(){
			scope.event = {
				eventType: 'social',
				numOfFacilitySurfaces: 5
			};
			scope.eventConfig = {
				teamsPerLine: '2',
				combPlay: '1',
				maxSurfaces: 2,
				singlesOnly: '0',
				singleWomenLines: 3,
				singleMenLines: 1,
				ranked: '0',
				sets: 5,
				rotateStartTime: '1',
				hasPlayoff: '4',
				startDate: '2018-04-09',
				startTime: '4:00 PM',
				numOfStartTimes: 4,
				selectedTeamCount: 2,
				teamAssignmentMethod: 'pairing'
			};
			scope.showEventConfigErrors = {
				combPlay: false,
				maxSurfaces: false,
				singleWomenLines: false,
				singleMenLines: false,
				sets: false,
				rotateStartTime: false,
				hasPlayoff: false,
				startDate: false,
				startTime: false,
				womenSittingPerRound: false,
				menSittingPerRound: false,
				teamAssignmentMethod: false
			};
			expect(scope.checkEventConfigInputs()).toBeTruthy();
			expect(scope.showEventConfigErrors).toEqual({
				combPlay: false,
				maxSurfaces: false,
				singleWomenLines: false,
				singleMenLines: false,
				sets: false,
				rotateStartTime: false,
				hasPlayoff: false,
				startDate: false,
				startTime: false,
				womenSittingPerRound: false,
				menSittingPerRound: false,
				teamAssignmentMethod: false
			});
		});
	});

    describe('resetEventConfigErrors Test', function(){
    	it('should reset scope.showEventConfigErrors', function(){
    		scope.showEventConfigErrors = {
    			combPlay: false,
				maxSurfaces: false,
				singleWomenLines: true,
				singleMenLines: true,
				sets: true,
				rotateStartTime: false
			};
			scope.resetEventConfigErrors();
			expect(scope.showEventConfigErrors).toEqual({
				combPlay: false,
				maxSurfaces: false,
				singleWomenLines: false,
				singleMenLines: false,
				sets: false,
				rotateStartTime: false
			});
		});
	});

    describe('getEventsAsLeader Test', function(){
		it('should call scope.getEvent() after eventService.getEventsAsLeader() returns success', function(){
			scope.displayEventForm = true;
			spyOn(scope, 'getEvent');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('parseParticipantSexCounts Test', function(){
    	it('should set scope.maleCount and scope.femaleCount to their correct values', function(){
    		scope.participants = [{
    			sex: 'female'
			}, {
    			sex: 'female'
			}, {
    			sex: 'female'
			}, {
    			sex: 'male'
			}];
    		scope.maleCount = 421;
    		scope.femaleCount = 391;
    		scope.parseParticipantSexCounts();
    		expect(scope.maleCount).toEqual(1);
    		expect(scope.femaleCount).toEqual(3);
		});
	});

    describe('setNumOfFacilitySurfaces Test', function(){
    	it('should set scope.event to its correct value', function(){
    		var event = {
    			activity_id: 22,
				facilities: {
    				activities: [{
    					pivot: {
    						activity_id: 23,
							num_of_surfaces: 5
						}
					}, {
    					pivot: {
    						activity_id: 22,
							num_of_surfaces: 10
						}
					}]
				}
			};
    		scope.event = {};
    		scope.setNumOfFacilitySurfaces(event);
    		expect(scope.event).toEqual({
				numOfFacilitySurfaces: 10
			});
		});
	});

    describe('setFacilityActivityDefaults Test', function(){
    	it('should set scope.eventConfig.sets and scope.eventConfig.lineScoringFormat to their correct values', function(){
    		var event = {
    			facilities: {
    				activities: [{
    					pivot: {
    						id: 1,
							competition_scoring_format: 3,
							line_scoring_format: 'wl'
						}
					}, {
    					pivot: {
    						id: 2,
							competition_scoring_format: 5,
							line_scoring_format: 'points'
						}
					}]
				}
			};
    		scope.eventConfig = {
    			sets: 59
			};
    		spyOn(helperService, 'findArrayIndex').and.returnValue(1);
    		scope.setFacilityActivityDefaults(event);
    		expect(scope.eventConfig.sets).toEqual('5');
    		expect(scope.eventConfig.lineScoringFormat).toEqual('points');
		});
	});

	describe('getEvent Test', function(){
		it('should set scope.event, scope.eventConfig, scope.startDateObject, scope.selectedTeamCount, scope.participants, and scope.displayEventForm to their correct values ' +
		   'and call scope.setNumOfFacilitySurfaces, scope.setFacilityActivityDefaults(), scope.parseParticipantSexCounts(), scope.calculateLines(), and ' +
		   'scope.calculateStartTimesAndSurfacesCombo() after editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.eventConfig = {};
			scope.startDateObject = 'bear';
			scope.participants = 'so';
			scope.displayEventForm = false;
			spyOn(scope, 'setNumOfFacilitySurfaces');
			spyOn(scope, 'setFacilityActivityDefaults');
			spyOn(helperService, 'parseTime').and.returnValue('5:00 PM');
			spyOn(scope, 'parseParticipantSexCounts');
			spyOn(scope, 'calculateLines');
			spyOn(scope, 'calculateStartTimesAndSurfacesCombo');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				eventType: 'social',
				eventSubType: 'maggie',
				typeOfPlay: 'mixed',
				eventLeaderName: null,
				startDate: '1:00',
				numOfStartTimes: 4
			});
			expect(scope.setNumOfFacilitySurfaces).toHaveBeenCalledWith({
				id: 1,
				name: 'sam',
				event_type: 'social',
				event_sub_type: 'maggie',
				type_of_play: 'mixed',
				event_leaders: [],
				start_date: '1:00',
				num_of_start_times: 4,
				users: 'hoo',
				comb_play: 1,
				max_playing_surfaces: 4,
				single_women_lines: 5,
				single_men_lines: 6,
				ranked: 1,
				sets: 3,
				num_of_playoff_rounds: 3,
				rounds_interval_metric: 'days',
				rounds_interval: '4',
				rounds: '2',
				standard_line_duration: '45',
				start_time: '5:00 PM',
				women_sitting_per_round: 1,
				men_sitting_per_round: 1,
				team_assignment_method: 'pairing',
				num_of_teams: 3,
				line_scoring_format: 'point'
			});
			expect(scope.setFacilityActivityDefaults).toHaveBeenCalledWith({
				id: 1,
				name: 'sam',
				event_type: 'social',
				event_sub_type: 'maggie',
				type_of_play: 'mixed',
				event_leaders: [],
				start_date: '1:00',
				num_of_start_times: 4,
				users: 'hoo',
				comb_play: 1,
				max_playing_surfaces: 4,
				single_women_lines: 5,
				single_men_lines: 6,
				ranked: 1,
				sets: 3,
				num_of_playoff_rounds: 3,
				rounds_interval_metric: 'days',
				rounds_interval: '4',
				rounds: '2',
				standard_line_duration: '45',
				start_time: '5:00 PM',
				women_sitting_per_round: 1,
				men_sitting_per_round: 1,
				team_assignment_method: 'pairing',
				num_of_teams: 3,
				line_scoring_format: 'point'
			});
			expect(scope.eventConfig).toEqual({
				typeOfPlay: 'mixed',
				combPlay: '1',
				maxSurfaces: 4,
				singleWomenLines:5,
				singleMenLines: 6,
				ranked: '1',
				sets: '3',
				hasPlayoff: '1',
				roundsIntervalMetric: 'days',
				roundsInterval: '4',
				numOfRounds: '2',
				standardLineDuration: '45',
				startDate: '1:00',
				startTime: '5:00 PM',
				womenSittingPerRound: 1,
				menSittingPerRound: 1,
				teamAssignmentMethod: 'pairing',
				lineScoringFormat: 'point'
			});
			expect(scope.startDateObject).toEqual('1:00T12:00:00Z');
			expect(scope.selectedTeamCount).toEqual(3);
			expect(scope.participants).toEqual('hoo');
			expect(scope.parseParticipantSexCounts).toHaveBeenCalled();
			expect(scope.calculateLines).toHaveBeenCalled();
			expect(scope.calculateStartTimesAndSurfacesCombo).toHaveBeenCalled();
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

	describe('buildNonMultiFacilityLinesAggregateArray Test', function(){
		it('should set scope.linesAggregateArray to its correct value', function(){
			scope.linesAggregateArray = 'so';
			scope.perTeamLinesNet = [{
				menDoubles: 5,
				mixedSingles: 1
			}];
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			scope.buildNonMultiFacilityLinesAggregateArray();
			expect(scope.linesAggregateArray).toEqual([{
				line_play_type: 'md',
				count: 5
			}, {
				line_play_type: 'xs',
				count: 1
			}])
		});
	});

	describe('updateNumOfRemovals Test', function(){
		it('should set scope.numOfFemalesToRemove, scope.numOfMalesToRemove, scope.netMaleCount, and scope.netFemaleCount to their correct values', function(){
			var matchLineType = 'ws';
			scope.maleCount = 20;
			scope.femaleCount = 18;
			scope.numOfFemalesToRemove = 0;
			scope.numOfMalesToRemove = 0;
			scope.netMaleCount = 234324;
			scope.netFemaleCount = 34983;
			scope.updateNumOfRemovals(matchLineType);
			expect(scope.numOfFemalesToRemove).toEqual(1);
			expect(scope.netFemaleCount).toEqual(17);
			expect(scope.netMaleCount).toEqual(20);
			matchLineType = 'md';
			scope.updateNumOfRemovals(matchLineType);
			expect(scope.numOfMalesToRemove).toEqual(2);
			expect(scope.netFemaleCount).toEqual(17);
			expect(scope.netMaleCount).toEqual(18);
		});
	});

	describe('removeOverflowLines Test', function(){
		it('should set scope.linesAggregateArray, scope.numOfFemalesToRemove, and scope.numOfMalesToRemove to their correct values and call scope.updateNumOfRemovals()', function(){
			scope.selectedTeamCount = 4;
			scope.netMaleCount = 18;
			scope.netFemaleCount = 20;
			scope.netTotalLines = 10;
			scope.event = {
				eventType: 'league',
				numOfStartTimes: 2
			};
			scope.eventConfig = {
				typeOfPlay: 'gender',
				maxSurfaces: 9
			};
			scope.linesAggregateArray = [{
				line_play_type: 'wd',
				count: 4
			}, {
				line_play_type: 'md',
				count: 2
			}];
			scope.numOfFemalesToRemove = 2;
			scope.numOfMalesToRemove = 3;
			spyOn(helperService, 'findArrayIndex').and.returnValue(0);
			spyOn(scope, 'updateNumOfRemovals');
			scope.removeOverflowLines();
			expect(scope.linesAggregateArray).toEqual([{
				line_play_type: 'wd',
				count: 3
			}, {
				line_play_type: 'md',
				count: 2
			}]);
			expect(scope.updateNumOfRemovals).toHaveBeenCalledWith('wd');
			expect(scope.numOfFemalesToRemove).toEqual(8);
			expect(scope.numOfMalesToRemove).toEqual(12);
		});
	});

	describe('buildMultiFacilityLinesAggregateArray Test', function(){
		it('should set scope.linesAggregateArray to its correct value', function(){
			scope.eventConfig = {
				doubleWomenLines: 4,
				singleWomenLines: 2,
				doubleMenLines: 3,
				singleMenLines: 0,
				doubleComboLines: 1,
				singleComboLines: 3
			};
			scope.linesAggregateArray = 'eee';
			scope.buildMultiFacilityLinesAggregateArray();
			expect(scope.linesAggregateArray).toEqual([{
				line_play_type: 'wd',
				count: scope.eventConfig.doubleWomenLines
			}, {
				line_play_type: 'ws',
				count: scope.eventConfig.singleWomenLines
			}, {
				line_play_type: 'md',
				count: scope.eventConfig.doubleMenLines
			}, {
				line_play_type: 'ms',
				count: scope.eventConfig.singleMenLines
			}, {
				line_play_type: 'xd',
				count: scope.eventConfig.doubleComboLines
			}, {
				line_play_type: 'xs',
				count: scope.eventConfig.singleComboLines
			}]);
		});
	});

	describe('buildLinesAggregateArray Test', function(){
		it('should call scope.buildNonMultiFacilityLinesAggregateArray() and scope.removeOverflowLines()', function(){
			scope.event = {
				eventType: 'league'
			};
			spyOn(scope, 'buildNonMultiFacilityLinesAggregateArray');
			spyOn(scope, 'buildMultiFacilityLinesAggregateArray');
			spyOn(scope, 'removeOverflowLines');
			scope.buildLinesAggregateArray();
			expect(scope.buildNonMultiFacilityLinesAggregateArray).toHaveBeenCalled();
			expect(scope.buildMultiFacilityLinesAggregateArray).not.toHaveBeenCalled();
			expect(scope.removeOverflowLines).toHaveBeenCalled();
		});
		it('should call scope.buildMultiFacilityLinesAggregateArray()', function(){
			scope.event = {
				eventType: 'multifacility'
			};
			spyOn(scope, 'buildNonMultiFacilityLinesAggregateArray');
			spyOn(scope, 'buildMultiFacilityLinesAggregateArray');
			scope.buildLinesAggregateArray();
			expect(scope.buildNonMultiFacilityLinesAggregateArray).not.toHaveBeenCalled();
			expect(scope.buildMultiFacilityLinesAggregateArray).toHaveBeenCalled();
		});
	});

	describe('setNetLines Test', function(){
		it('should set scope.netWomenLines, scope.netMenLines, and scope.netTotalLines to their correct values', function(){
			scope.event = {
				eventType: 'league'
			};
			scope.selectedTeamCount = 5;
			var eventTypeLinesService = {
				testPerTeam: function(){
					return {
						womenLines: 3,
						menLines: 3,
						totalLines: 6
					}
				}
			};
			scope.netWomenLines = 4;
			scope.netMenLines = 4;
			scope.netTotalLines = 4;
			scope.setNetLines(eventTypeLinesService, 'test');
			expect(scope.netWomenLines).toEqual(3);
			expect(scope.netMenLines).toEqual(3);
			expect(scope.netTotalLines).toEqual(6);
		});
	});

	describe('calculateLinesBasedOnConfig Test', function(){
		it('should rset scope.perTeamLines and scope.perTeamLinesNet to their correct values and call scope.setNetLines()', function(){
			var eventTypeLinesService = {
				calculateLinesGenderSinglesOnly: jasmine.createSpy().and.returnValues(1 ,2)
			};
			scope.eventConfig = {
				typeOfPlay: 'gender',
				singlesOnly: '1'
			};
			spyOn(scope, 'setNetLines');
			scope.calculateLinesBasedOnConfig(eventTypeLinesService);
			expect(scope.perTeamLines).toEqual(1);
			expect(scope.perTeamLinesNet).toEqual(2);
			expect(scope.setNetLines).toHaveBeenCalledWith(eventTypeLinesService, 'calculateLinesGenderSinglesOnly');
		});
		it("should set scope.eventConfig.combPlay, scope.perTeamLines, and scope.perTeamLinesNet to their correct values and call scope.setNetLines()", function(){
			var eventTypeLinesService = {
				calculateLinesMixed: jasmine.createSpy().and.returnValues(5 ,6)
			};
			scope.eventConfig = {
				combPlay: '1',
				typeOfPlay: 'mixed',
				singlesOnly: '0'
			};
			spyOn(scope, 'setNetLines');
			scope.calculateLinesBasedOnConfig(eventTypeLinesService);
			expect(scope.perTeamLines).toEqual(5);
			expect(scope.perTeamLinesNet).toEqual(6);
			expect(scope.setNetLines).toHaveBeenCalledWith(eventTypeLinesService, 'calculateLinesMixed');
		});
	});

	describe('calculateNumberRoundsArray Test', function(){
		it('should set scope.numberRounds to its correct value', function(){
			scope.selectedTeamCount = 4;
			scope.numberRounds = 'eee';
			scope.calculateNumberRoundsArray();
			expect(scope.numberRounds).toEqual([3, 6, 9, 12, 15]);
		});
		it('should set scope.eventConfig.numOfRounds and scope.numberRounds to their correct values', function(){
			scope.eventConfig = {
				numOfRounds: 'aaa'
			};
			scope.numberRounds = 'eee';
			scope.calculateNumberRoundsArray();
			expect(scope.eventConfig.numOfRounds).toEqual('');
			expect(scope.numberRounds).toEqual([]);
		});
	});

	describe('calculateLines Test', function(){
		it('should set scope.womenLines, scope.menLines, and scope.totalLines to their correct values and call ' +
		   'scope.calculateNumberRoundsArray() and scope.calculateLinesBasedOnConfig()', function(){
			scope.event = {
				eventType: 'league'
			};
			scope.womeLines = 'goodbye';
			scope.menLines = 'findout';
			scope.totalLines = 'go';
			spyOn(scope, 'calculateNumberRoundsArray');
			spyOn(scope, 'calculateLinesBasedOnConfig').and.returnValue({
				womenLines: 4,
				menLines: 2,
				totalLines: 3,
				perTeamLines: 5
			});
			scope.calculateLines();
			expect(scope.calculateNumberRoundsArray).toHaveBeenCalled();
			expect(scope.calculateLinesBasedOnConfig).toHaveBeenCalledWith(leagueEventLinesService);
			expect(scope.womenLines).toEqual('-');
			expect(scope.menLines).toEqual('-');
			expect(scope.totalLines).toEqual('-');
		});
	});

	describe('calculateStartTimesAndSurfacesCombo Test', function(){
		it('should set scope.perTeamSurfaces to its correct value', function(){
			scope.event = {
				eventType: 'league'
			};
			scope.eventConfig = {
				combPlay: false,
				maxSurfaces: 4,
				typeOfPlay: 'mixed'
			};
			scope.perTeamSurfaces = 'thing';
			scope.perTeamLines = JSON.parse('[{"totalTeams":1,"womenLines":null,"menLines":null,"additionalWomen":null,"additionalMen":null,"combLines":null,"totalLines":null,"additionalPlayers":null,"mixedDoubles":null},{"totalTeams":2,"womenLines":2,"menLines":3,"additionalWomen":0,"additionalMen":0,"combLines":0,"totalLines":5,"additionalPlayers":0,"womenDoubles":2,"menDoubles":3,"womenSingles":0,"menSingles":0,"mixedDoubles":0},{"totalTeams":4,"womenLines":1,"menLines":1,"additionalWomen":2,"additionalMen":0,"combLines":0,"totalLines":2,"additionalPlayers":2,"womenDoubles":1,"menDoubles":1,"womenSingles":0,"menSingles":0,"mixedDoubles":0},{"totalTeams":6,"womenLines":0,"menLines":1,"additionalWomen":4,"additionalMen":0,"combLines":0,"totalLines":1,"additionalPlayers":4,"womenDoubles":0,"menDoubles":1,"womenSingles":0,"menSingles":0,"mixedDoubles":0},{"totalTeams":8,"womenLines":0,"menLines":0,"additionalWomen":2,"additionalMen":4,"combLines":0,"totalLines":0,"additionalPlayers":6,"womenDoubles":0,"menDoubles":0,"womenSingles":0,"menSingles":0,"mixedDoubles":0},{"totalTeams":9,"womenLines":null,"menLines":null,"additionalWomen":null,"additionalMen":null,"combLines":null,"totalLines":null,"additionalPlayers":null,"mixedDoubles":null},{"totalTeams":16,"womenLines":0,"menLines":0,"additionalWomen":10,"additionalMen":12,"combLines":0,"totalLines":0,"additionalPlayers":22,"womenDoubles":0,"menDoubles":0,"womenSingles":0,"menSingles":0,"mixedDoubles":0},{"totalTeams":25,"womenLines":null,"menLines":null,"additionalWomen":null,"additionalMen":null,"combLines":null,"totalLines":null,"additionalPlayers":null,"mixedDoubles":null}]');
			spyOn(scope, 'calculateLines');
			scope.calculateStartTimesAndSurfacesCombo();
			expect(scope.perTeamSurfaces).toEqual(JSON.parse('[{"totalTeams":1,"oneStartTime":null,"twoStartTime":null,"threeStartTime":null,"fourStartTime":null,"fiveStartTime":null},{"totalTeams":2,"oneStartTime":5,"twoStartTime":3,"threeStartTime":2,"fourStartTime":2,"fiveStartTime":1},{"totalTeams":4,"oneStartTime":4,"twoStartTime":2,"threeStartTime":2,"fourStartTime":1,"fiveStartTime":1},{"totalTeams":6,"oneStartTime":3,"twoStartTime":2,"threeStartTime":1,"fourStartTime":1,"fiveStartTime":1},{"totalTeams":8,"oneStartTime":0,"twoStartTime":0,"threeStartTime":0,"fourStartTime":0,"fiveStartTime":0},{"totalTeams":9,"oneStartTime":null,"twoStartTime":null,"threeStartTime":null,"fourStartTime":null,"fiveStartTime":null},{"totalTeams":16,"oneStartTime":0,"twoStartTime":0,"threeStartTime":0,"fourStartTime":0,"fiveStartTime":0},{"totalTeams":25,"oneStartTime":null,"twoStartTime":null,"threeStartTime":null,"fourStartTime":null,"fiveStartTime":null}]'));
		});
	});

	describe('buildEditObject Test', function(){
		it('should return the correct value', function(){
			scope.selectedTeamCount = 8;
			scope.event = {
				eventType: 'league',
				numOfStartTimes: 4
			};
			scope.eventConfig = {
				combPlay: '1',
				teamsPerLine: '1',
				maxSurfaces: '2',
				singlesOnly: '0',
				singleWomenLines: '2',
				singleMenLines: '1',
				ranked: '1',
				sets: '5',
				typeOfPlay: 'mixed',
				numOfRounds: '4',
				hasPlayoff: '1',
				roundsIntervalMetric: 'days',
				roundsInterval: '40',
				womenSittingPerRound: null,
				menSittingPerRound: null,
				startDate: 'a',
				startTime:'0',
				standardLineDuration: '15',
				teamAssignmentMethod: 'import',
				lineScoringFormat: 'point'
			};
			spyOn(helperService, 'reverseParseTime').and.returnValue('0');
			expect(scope.buildEditObject()).toEqual({
				id: 4,
				type_of_play: 'mixed',
				comb_play: '1',
				teams_per_line: '1',
				max_playing_surfaces: '2',
				singles_only: '0',
				single_women_lines: '2',
				single_men_lines: '1',
				ranked: '1',
				sets: '5',
				line_scoring_format: 'point',
				rounds: '4',
				has_playoff: '1',
				rounds_interval_metric: 'days',
				rounds_interval: '40',
				women_sitting_per_round: null,
				men_sitting_per_round: null,
				start_date: 'a',
				start_time: '0',
				standard_line_duration: '15',
				num_of_start_times: 4,
				num_of_teams: 8,
				team_assignment_method: 'import'
			});
		});
	});

	describe('calculateMinFemalesNeeded Test', function(){
		it('should return the correct value', function(){
			scope.eventConfig = {
				doubleWomenLines: 2,
				singleWomenLines: 1,
				doubleComboLines: 3
			};
			expect(scope.calculateMinFemalesNeeded()).toEqual(8);
		});
	});

	describe('calculateMinMalesNeeded Test', function(){
		it('should return the correct value', function(){
			scope.eventConfig = {
				doubleMenLines: 0,
				singleMenLines: 2,
				doubleComboLines: 3
			};
			expect(scope.calculateMinMalesNeeded()).toEqual(5);
		});
	});

	describe('minParticipantsMet Test', function(){
		it('should call window.alert()', function(){
			scope.femaleCount = 4;
			scope.maleCount = 3;
			spyOn(scope, 'calculateMinFemalesNeeded').and.returnValue(3);
			spyOn(scope, 'calculateMinMalesNeeded').and.returnValue(4);
			spyOn(window, 'alert');
			scope.minParticipantsMet();
			expect(window.alert).toHaveBeenCalledWith('Not enough male participants to complete event setup');
		});
	});

	describe('completeEventSetup Test', function(){
		it('should set scope.callInProgress to its correct value and call scope.resetEventConfigErrors(), scope.checkEventConfigInputs(), scope.buildLinesAggregateArray(), and' +
		   'scope.buildEditObject().  It should then call window.alert() after editEventModalService.edit() and eventService.createEventTeams() return success', function(){
			scope.numOfFemalesToRemove = 0;
			scope.numOfMalesToRemove = 0;
			scope.event = {
				eventType: 'league',
				numOfStartTimes: 4
			};
			scope.eventConfig = {
				combPlay: '1',
				teamsPerLine: '1',
				maxSurfaces: '2',
				singlesOnly: '0',
				singleWomenLines: '2',
				singleMenLines: '1',
				ranked: '1',
				sets: '5',
				typeOfPlay: 'mixed',
				numOfRounds: '4',
				hasPlayoff: '4',
				roundsIntervalMetric: 'days',
				roundsInterval: '40',
				womenSittingPerRound: null,
				menSittingPerRound: null,
				startDate: 'a',
				startTime:'0',
				standardLineDuration: '15',
				teamAssignmentMethod: 'import'
			};
			scope.linesAggregateArray = 'hello';
			scope.callInProgress = false;
			spyOn(scope, 'resetEventConfigErrors');
			spyOn(scope, 'checkEventConfigInputs').and.returnValue(true);
			spyOn(scope, 'buildLinesAggregateArray');
			spyOn(scope, 'buildEditObject').and.returnValue('cheese');
			spyOn(window, 'alert');
			spyOn(scope, 'setNumOfFacilitySurfaces');
			spyOn(scope, 'getEvent');
			scope.completeEventSetup();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.resetEventConfigErrors).toHaveBeenCalled();
			expect(scope.checkEventConfigInputs).toHaveBeenCalled();
			expect(scope.buildLinesAggregateArray).toHaveBeenCalled();
			expect(scope.buildEditObject).toHaveBeenCalled();
			scope.$apply();
			expect(editEventModalService.edit).toHaveBeenCalledWith('cheese');
			expect(eventService.createEventTeams).toHaveBeenCalledWith(4, scope.linesAggregateArray, scope.numOfFemalesToRemove, scope.numOfMalesToRemove);
			expect(window.alert).toHaveBeenCalledWith('Event Setup Complete!');
			expect(window.location.href).toEqual('/');
		});
	});

	describe('$watch eventConfig and selectedTeamCount Test', function(){
		it('should call scope.calculateLines() and scope.calculateStartTimesAndSurfacesCombo()', function(){
			scope.event = {
				eventType: 'social'
			};
			scope.eventConfig = 'true';
			spyOn(scope, 'calculateLines');
			spyOn(scope, 'calculateStartTimesAndSurfacesCombo');
			spyOn(scope, 'getEvent');
			scope.$apply();
			expect(scope.calculateLines).not.toHaveBeenCalled();
			expect(scope.calculateStartTimesAndSurfacesCombo).not.toHaveBeenCalled();
			scope.eventConfigChanged = true;
			scope.selectedTeamCount = 'kalas';
			scope.$apply();
			expect(scope.calculateLines).toHaveBeenCalled();
			expect(scope.calculateStartTimesAndSurfacesCombo).toHaveBeenCalled();
		});
	});

	describe('$watch eventConfig.singlesOnly Test', function(){
		it('should set scope.eventConfig.singleWomenLines and scope.eventConfig.singleMenLines to their correct values', function(){
			scope.eventConfig = {
				singlesOnly: '0'
			};
			spyOn(scope, 'getEvent');
			spyOn(scope, 'calculateLines');
			spyOn(scope, 'calculateStartTimesAndSurfacesCombo');
			scope.$apply();
			scope.eventConfig = {
				singlesOnly: '1',
				singleWomenLines: 3,
				singleMenLines: 2
			};
			scope.$apply();
			expect(scope.eventConfig.singleWomenLines).toEqual(0);
			expect(scope.eventConfig.singleMenLines).toEqual(0);
		});
	});

	describe('$watch eventConfig.roundsIntervalMetric Test', function(){
		it('should set scope.eventConfig.roundsInterval to null', function(){
			scope.eventConfig = {
				roundsIntervalMetric: 'days'
			};
			spyOn(scope, 'getEvent');
			spyOn(scope, 'calculateLines');
			spyOn(scope, 'calculateStartTimesAndSurfacesCombo');
			scope.$apply();
			scope.eventConfig = {
				roundsIntervalMetric: 'minutes',
				roundsInterval: 45
			};
			scope.$apply();
			expect(scope.eventConfig.roundsInterval).toBeNull();
		});
	});

});