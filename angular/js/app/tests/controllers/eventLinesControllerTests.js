describe('eventLinesController Test Suite', function(){

    var q, deferred, rootScope, scope, window, eventLinesService, eventService, editEventModalService, helperService;

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
    	eventLinesService = {
    		getParticipantsRankings: function(){
    			deferred = q.defer();
                deferred.resolve({
					participants_rankings: 'everything'
                });
                return deferred.promise;
			}
		};
    	spyOn(eventLinesService, 'getParticipantsRankings').and.callThrough();
    	eventService = {
        	getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			getEventLines: function(){
        		deferred = q.defer();
                deferred.resolve({
					lines: 'pickles'
                });
                return deferred.promise;
			},
			updateEventMatches: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
        spyOn(eventService, 'getEventLines').and.callThrough();
        spyOn(eventService, 'updateEventMatches').and.callThrough();
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
						start_date: '1:00',
						num_of_start_times: 4,
						users: 'hoo',
						activity_id: 2,
						facility_id: 3
					}
				});
                return deferred.promise;
            }
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
        helperService = {
            findArrayIndex: function(){},
			parseTime: function(){}
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
        $controller('eventLinesController', {
            $scope: scope,
			$routeParams: {
            	id: 4
			},
			eventLinesService: eventLinesService,
			eventService: eventService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('getEventsAsLeader Test', function(){
		it('should call scope.getEvent() after eventService.getEventsAsLeader() returns success', function(){
			spyOn(scope, 'getEvent');
			spyOn(scope, 'parseEventMatches');
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('getParticipantsRankings Test', function(){
    	it('should set scope.participantRankings to its correct value after eventLinesService.getParticipantsRankings() returns success', function(){
    		scope.event = {
    			activity_id: 4,
				facility_id: 5
			};
    		scope.participantRankings = 'fall';
    		spyOn(scope, 'parseEventMatches');
    		scope.getParticipantsRankings();
    		scope.$apply();
    		expect(eventLinesService.getParticipantsRankings).toHaveBeenCalledWith(scope.event.activity_id, scope.event.facility_id);
    		expect(scope.participantRankings).toEqual('everything');
		});
	});

    describe('getEvent Test', function(){
		it('should set scope.event, scope.eventUsers and scope.displayEventForm to their correct values and call scope.getParticipantsRankings() after ' +
		   'editEventModalService.getEvent() returns success', function(){
			scope.event = {};
			scope.eventUsers = 'tropics';
			scope.displayEventForm = false;
			spyOn(scope, 'getParticipantsRankings');
			spyOn(scope, 'parseEventMatches');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				activity_id: 2,
				facility_id: 3
			});
			expect(scope.eventUsers).toEqual('hoo');
			expect(scope.getParticipantsRankings).toHaveBeenCalled();
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('parseEventMatches Test', function(){
    	it('should set scope.eventMatches and scope.availableStartTimes to their correct values', function(){
    		scope.eventMatches = [{
    			start_time: '12:30:00',
				line_play_type: 'ws'
			}, {
    			start_time: '16:15:00',
				line_play_type: 'ms'
			}, {
    			start_time: '05:00:00',
				line_play_type: 'wd'
			}];
    		scope.availableStartTimes = 'hio';
    		spyOn(helperService, 'parseTime').and.returnValues('12:30 PM', '4:15 PM', '5:00 AM');
    		scope.parseEventMatches();
    		expect(scope.eventMatches).toEqual([{
    			start_time: '12:30:00',
				start_time_formatted: '12:30 PM',
				line_play_type: 'ws',
				match_line_sex: 'female'
			}, {
    			start_time: '16:15:00',
				start_time_formatted: '4:15 PM',
				line_play_type: 'ms',
				match_line_sex: 'male'
			}, {
    			start_time: '05:00:00',
				start_time_formatted: '5:00 AM',
				line_play_type: 'wd',
				match_line_sex: 'female'
			}]);
    		expect(scope.availableStartTimes).toEqual(['12:30 PM', '4:15 PM', '5:00 AM'])
		});
	});

    describe('getEventMatches Test', function(){
    	it('should set scope.getEventMatchesInProgress to its correct value.  It should then set scope.eventMatches to its correct value and call scope.parseEventMatches() ' +
		   'after eventService.getEventLines() returns success', function(){
    		scope.getEventMatchesInProgress = false;
    		spyOn(scope, 'parseEventMatches');
    		scope.getEventMatches();
    		expect(scope.getEventMatchesInProgress).toBeTruthy();
    		scope.$apply();
    		expect(eventService.getEventLines).toHaveBeenCalledWith(4);
    		expect(scope.eventMatches).toEqual('pickles');
    		expect(scope.parseEventMatches).toHaveBeenCalled();
    		expect(scope.getEventMatchesInProgress).toBeFalsy();
		});
	});

    describe('setSelectedUserSexForXdEmptySlot Test', function(){
    	it('should set scope.selectedUserSex to female', function(){
    		var match = {
    			pair_one: {
    				user_one: {
    					sex: 'male'
					},
					user_two: {
    					sex: 'female'
					}
				},
				pair_two: {
    				user_one: {
    					sex: 'male'
					}
				}
			};
    		scope.selectedUserSex = 'male';
    		scope.setSelectedUserSexForXdEmptySlot(match);
    		expect(scope.selectedUserSex).toEqual('female');
		});
    	it('should set scope.selectedUserSex to male', function(){
    		var match = {
    			pair_one: {
    				user_one: {
    					sex: 'female'
					},
					user_two: {
    					sex: 'female'
					}
				},
				pair_two: {
    				user_one: {
    					sex: 'male'
					}
				}
			};
    		scope.selectedUserSex = 'female';
    		scope.setSelectedUserSexForXdEmptySlot(match);
    		expect(scope.selectedUserSex).toEqual('male');
		});
	});

    describe('setSelectedUserSexForEmptySlot Test', function(){
    	it('should set scope.selectedUserSex to female', function(){
    		var match = {
    			line_play_type: 'ws'
			};
    		scope.selectedUserSex = 'male';
    		scope.setSelectedUserSexForEmptySlot(match);
    		expect(scope.selectedUserSex).toEqual('female');
		});
    	it('should set scope.selectedUserSex to male', function(){
    		var match = {
    			line_play_type: 'xs',
				pair_one: {
    				sex: 'female'
				}
			};
    		scope.selectedUserSex = 'female';
    		scope.setSelectedUserSexForEmptySlot(match);
    		expect(scope.selectedUserSex).toEqual('male');
		});
	});

    describe('toggleSelectedUsers Test', function(){
    	it('should set scope.selectedUsers, scope.selectedUsersDetailed, scope.selectedUserSex, scope.selectedMatchId, scope.selectedPairId, and scope.selectedTeamId to ' +
		   'their correct values', function(){
    		scope.selectedUsers = [5];
    		scope.selectedUsersDetailed = [{
    			user_id: 5
			}];
    		scope.selectedUserSex = 'male';
    		scope.selectedMatchId = 4;
    		scope.selectedPairId = 5;
    		scope.selectedTeamId = 1;
    		scope.toggleSelectedUsers(5, 'male', 1, 2, 'pair_one', 'user_two');
    		expect(scope.selectedUsers).toEqual([]);
    		expect(scope.selectedUsersDetailed).toEqual([]);
    		expect(scope.selectedUserSex).toBeNull();
    		expect(scope.selectedMatchId).toBeNull();
    		expect(scope.selectedPairId).toBeNull();
    		expect(scope.selectedTeamId).toBeNull();
		});
    	it('should set scope.selectedUsers, scope.selectedUsersDetailed, scope.selectedUserSex, scope.selectedMatchId, scope.selectedPairId, and scope.selectedTeamId to ' +
		   'their correct values', function(){
    		scope.selectedUsers = [];
    		scope.selectedUsersDetailed = [];
    		scope.selectedUserSex = 'female';
    		scope.selectedMatchId = 23;
    		scope.selectedPairId = 55;
    		scope.selectedTeamId = 41;
    		scope.toggleSelectedUsers(5, 'male', 1, 2, 'pair_one', 'user_two', 3);
    		expect(scope.selectedUsers).toEqual([5]);
    		expect(scope.selectedUsersDetailed).toEqual([{
    			user_id: 5,
				pair_id: 2,
				match_id: 1,
				team_number: 'pair_one',
				user_number: 'user_two'
			}]);
    		expect(scope.selectedUserSex).toEqual('male');
    		expect(scope.selectedMatchId).toEqual(1);
    		expect(scope.selectedPairId).toEqual(2);
    		expect(scope.selectedTeamId).toEqual(3);
		});
	});

    describe('disableCheckbox Test', function(){
    	it('should return true', function(){
    		scope.selectedUsers = [2, 3];
    		expect(scope.disableCheckbox(4, 'female', 1, 1)).toBeTruthy();
		});
    	it('should return true', function(){
    		scope.selectedUserSex = 'male';
    		scope.selectedUsers = [3];
    		expect(scope.disableCheckbox(4, 'female', 1, 1)).toBeTruthy();
		});
    	it('should return true', function(){
    		scope.selectedMatchId = 1;
    		scope.selectedUsers = [1];
    		scope.selectedTeamId = 1;
    		expect(scope.disableCheckbox(4, 'female', 1, 1)).toBeTruthy();
		});
    	it('should return false', function(){
    		scope.selectedUsers = [1];
    		expect(scope.disableCheckbox(4, 'female', 1)).toBeFalsy();
		});
	});

    describe('clearSelectedUsers Test', function(){
    	it('should set scope.selectedUsers, scope.selectedUsersDetailed, scope.selectedUserSex, and scope.selectedMatchId to their correct values', function(){
    		scope.selectedUsers = 'a';
    		scope.selectedUsersDetailed = 'b';
    		scope.selectedUserSex = 'c';
    		scope.selectedMatchId = 'd';
    		scope.clearSelectedUsers();
    		expect(scope.selectedUsers).toEqual([]);
    		expect(scope.selectedUsersDetailed).toEqual([]);
    		expect(scope.selectedUserSex).toBeNull();
    		expect(scope.selectedMatchId).toBeNull();
		});
	});

    describe('swapPlayers Test', function(){
		it('should set scope.eventMatches and scope.playersSwapped to their correct values and call scope.clearSelectedUsers()', function(){
			spyOn(helperService, 'findArrayIndex').and.returnValues(0, 2);
			scope.eventMatches = JSON.parse('[{"id":1,"event_id":1,"line_type":"doubles","line_play_type":"md","pair_one_id":5,"pair_two_id":6,"start_time":"16:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":5,"user_one_id":7,"user_two_id":8,"created_at":"2018-03-26T01:47:24+00:00","user_one":{"id":7,"first_name":"Nate","last_name":"Lee","sex":"male","email":"nate@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"user_two":{"id":8,"first_name":"Scott","last_name":"Smith","sex":"male","email":"scott@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"}},"pair_two":{"id":6,"user_one_id":5,"user_two_id":6,"created_at":"2018-03-26T01:47:24+00:00","user_one":{"id":5,"first_name":"Charles","last_name":"England","sex":"male","email":"charles@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"user_two":{"id":6,"first_name":"Steve","last_name":"Jenson","sex":"male","email":"steve@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"}},"start_time_formatted":"4:00 PM","$$hashKey":"object:31"},{"id":2,"event_id":1,"line_type":"singles","line_play_type":"ws","pair_one_id":1,"pair_two_id":2,"start_time":"17:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":1,"first_name":"Sarah","last_name":"Huckabee","sex":"female","email":"pihish@gmail.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"facility leader","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"pair_two":{"id":2,"first_name":"Lo","last_name":"Bo","sex":"female","email":"pihish1@yahoo.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"start_time_formatted":"5:00 PM","$$hashKey":"object:32"},{"id":3,"event_id":1,"line_type":"singles","line_play_type":"ms","pair_one_id":10,"pair_two_id":9,"start_time":"18:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":10,"first_name":"Pier","last_name":"Paul","sex":"male","email":"pier@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"pair_two":{"id":9,"first_name":"Rick","last_name":"Pier","sex":"male","email":"rick@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"start_time_formatted":"6:00 PM","$$hashKey":"object:33"}]');
			scope.selectedUsersDetailed = JSON.parse('[{"user_id":5,"pair_id":6,"match_id":1,"team_number":"pair_two","user_number":"user_one"},{"user_id":10,"pair_id":false,"match_id":3,"team_number":"pair_one","user_number":false}]');
			spyOn(scope, 'clearSelectedUsers');
			scope.swapPlayers();
			expect(scope.eventMatches).toEqual(JSON.parse('[{"id":1,"event_id":1,"line_type":"doubles","line_play_type":"md","pair_one_id":5,"pair_two_id":6,"start_time":"16:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":5,"user_one_id":7,"user_two_id":8,"created_at":"2018-03-26T01:47:24+00:00","user_one":{"id":7,"first_name":"Nate","last_name":"Lee","sex":"male","email":"nate@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"user_two":{"id":8,"first_name":"Scott","last_name":"Smith","sex":"male","email":"scott@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"}},"pair_two":{"id":6,"user_one_id":10,"user_two_id":6,"created_at":"2018-03-26T01:47:24+00:00","user_one":{"id":10,"first_name":"Pier","last_name":"Paul","sex":"male","email":"pier@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"user_two":{"id":6,"first_name":"Steve","last_name":"Jenson","sex":"male","email":"steve@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"}},"start_time_formatted":"4:00 PM","$$hashKey":"object:31"},{"id":2,"event_id":1,"line_type":"singles","line_play_type":"ws","pair_one_id":1,"pair_two_id":2,"start_time":"17:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":1,"first_name":"Sarah","last_name":"Huckabee","sex":"female","email":"pihish@gmail.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"facility leader","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"pair_two":{"id":2,"first_name":"Lo","last_name":"Bo","sex":"female","email":"pihish1@yahoo.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"start_time_formatted":"5:00 PM","$$hashKey":"object:32"},{"id":3,"event_id":1,"line_type":"singles","line_play_type":"ms","pair_one_id":5,"pair_two_id":9,"start_time":"18:00:00","created_at":"2018-03-26T01:47:24+00:00","updated_at":"2018-03-26T01:47:24+00:00","pair_one":{"id":5,"first_name":"Charles","last_name":"England","sex":"male","email":"charles@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:44+00:00","updated_at":"2018-03-25T21:46:44+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"pair_two":{"id":9,"first_name":"Rick","last_name":"Pier","sex":"male","email":"rick@teamsrit.com","phone":"666-444-9999","remember_token":null,"image_url":null,"privilege":"participant","created_at":"2018-03-25T21:46:45+00:00","updated_at":"2018-03-25T21:46:45+00:00","deleted_at":"1970-01-01T00:00:00+00:00"},"start_time_formatted":"6:00 PM","$$hashKey":"object:33"}]'));
			expect(scope.clearSelectedUsers).toHaveBeenCalled();
			expect(scope.playersSwapped).toBeTruthy();
		});
	});

    describe('updateEventMatches Test', function(){
    	it('should set scope.callInProgress and window.location.href to their correct values and call window.alert() after eventService.updateEventMatches() ' +
		   'returns success', function(){
    		scope.event = {
    			id: 5
			};
    		scope.eventMatches = 'cheese';
    		scope.playersSwapped = true;
    		scope.callInProgress = false;
    		spyOn(window, 'alert');
    		spyOn(scope, 'parseEventMatches');
    		scope.updateEventMatches(true);
    		expect(scope.callInProgress).toBeTruthy();
    		scope.$apply();
    		expect(eventService.updateEventMatches).toHaveBeenCalledWith(5, 'cheese');
    		expect(window.alert).toHaveBeenCalledWith('Lines Updated!');
    		expect(window.location.href).toEqual('/');
		});
	});

    describe('femaleColumnsFilter Test', function(){
    	it('should return true', function(){
    		var line = {
    			start_time_formatted: '4:00 PM',
				match_line_sex: 'female',
				line_play_type: 'ws'
			};
    		scope.eventStartTime = '4:00 PM';
    		scope.typeOfLine = 'ws';
    		scope.availableStartTimes = [1, 2];
    		expect(scope.femaleColumnsFilter(line)).toBeTruthy();
		});
    	it('should return false', function(){
    		var line = {
    			start_time_formatted: '4:00 PM',
				match_line_sex: 'female',
				line_play_type: 'ws'
			};
    		scope.eventStartTime = '4:00 PM';
    		scope.typeOfLine = 'md';
    		scope.availableStartTimes = [1, 2];
    		expect(scope.femaleColumnsFilter(line)).toBeFalsy();
		});
	});

    describe('maleColumnsFilter Test', function(){
    	it('should return true', function(){
    		var line = {
    			start_time_formatted: '4:00 PM',
				match_line_sex: 'male',
				line_play_type: 'md'
			};
    		scope.eventStartTime = '4:00 PM';
    		scope.typeOfLine = 'md';
    		expect(scope.maleColumnsFilter(line)).toBeTruthy();
		});
    	it('should return false', function(){
    		var line = {
    			start_time_formatted: '4:00 PM',
				match_line_sex: 'female',
				line_play_type: 'ws'
			};
    		scope.eventStartTime = '4:00 PM';
    		scope.typeOfLine = 'md';
    		expect(scope.maleColumnsFilter(line)).toBeFalsy();
		});
	});

    describe('sortByMatchLineType Test', function(){
    	it('should return the correct values', function(){
    		var match = {
    			line_play_type: 'ms'
			};
    		expect(scope.sortByMatchLineType(match)).toEqual(3);
    		match = {
    			line_play_type: 'xd'
			};
    		expect(scope.sortByMatchLineType(match)).toEqual(6);
		});
	});

    describe('sortByRanking Test', function(){
    	it('should return the correct value if match type is singles', function(){
    		var match = {
    			line_type: 'singles',
				pair_one: {
    				id: 1
				},
				pair_two: {
    				id: 2
				}
			};
    		scope.participantRankings = [{
				pivot: {
					ranking: 54.82
				}
			}, {
    			pivot: {
    				ranking: 32.83
				}
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1, 2);
    		spyOn(scope, 'getEventsAsLeader');
    		expect(scope.sortByRanking(match)).toEqual(-88);
		});
    	it('should return the correct value if match type is doubles', function(){
    		var match = {
    			line_type: 'doubles',
				pair_one: {
    				user_one: {
    					id: 1
					},
					user_two: {
    					id: 2
					}
				},
				pair_two: {
    				user_one: {
    					id: 3
					},
					user_two: {
    					id: 4
					}
				}
			};
    		scope.participantRankings = [{
				pivot: {
					ranking: 54.82
				}
			}, {
    			pivot: {
    				ranking: 32.83
				}
			}, {
    			pivot: {
    				ranking: 62.83
				}
			}, {
    			pivot: {
    				ranking: 31.91
				}
			}, {
    			pivot: {
    				ranking: 48.43
				}
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValues(1, 2, 3, 4);
			expect(scope.sortByRanking(match)).toEqual(-176);
		});
	});

});