describe('eventTeamsController Test Suite', function(){

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
        $controller('eventTeamsController', {
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
			scope.getEventsAsLeader();
			scope.$apply();
			expect(eventService.getEventsAsLeader).toHaveBeenCalled();
			expect(scope.getEvent).toHaveBeenCalled();
		});
	});

    describe('getParticipantsRankings Test', function(){
    	it('should set scope.participantRankings to its correct value after eventLinesService.getParticipantsRankings() returns success', function(){
    		scope.event = {
    			activityId: 4,
				facilityId: 5
			};
    		scope.participantRankings = 'fall';
    		scope.getParticipantsRankings();
    		scope.$apply();
    		expect(eventLinesService.getParticipantsRankings).toHaveBeenCalledWith(scope.event.activityId, scope.event.facilityId);
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
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(4);
			expect(scope.event).toEqual({
				id: 1,
				name: 'sam',
				eventType: 'social',
				activityId: 2,
				facilityId: 3
			});
			expect(scope.eventUsers).toEqual('hoo');
			expect(scope.getParticipantsRankings).toHaveBeenCalled();
			expect(scope.displayEventForm).toBeTruthy();
		});
	});

    describe('buildEventTeamsCountArrays Test', function(){
    	it('should set scope.eventWomenGroupsCountArray, scope.eventMenGroupsCountArray, scope.eventGroupsCountArray, and scope.endGroup to their correct values', function(){
    		scope.eventTeamUsers = [{
				sex: 'female',
				group_number: 2
			}, {
				sex: 'female',
				group_number: 1
			}, {
				sex: 'female',
				group_number: 3
			}, {
				sex: 'male',
				group_number: 1
			}, {
				sex: 'male',
				group_number: 1
			}, {
				sex: 'male',
				group_number: 2
			}];
    		scope.eventWomenGroupsCountArray = 'aaa';
    		scope.eventMenGroupsCountArray = 'bbb';
    		scope.eventGroupsCountArray = 'cccc';
    		scope.endGroup = 34234;
    		scope.buildEventTeamsCountArrays();
    		expect(scope.eventWomenGroupsCountArray).toEqual([1, 2, 3]);
    		expect(scope.eventMenGroupsCountArray).toEqual([1, 2]);
    		expect(scope.eventGroupsCountArray).toEqual([1, 2, 3]);
    		expect(scope.endGroup).toEqual('3');
		});
	});
    
    describe('getEventTeams Test', function(){
		it('should set scope.eventTeamUsers to its correct value and call scope.buildEventTeamsCountArrays() after eventService.getEventTeams() returns success', function(){
			scope.eventTeamUsers = 'aaaa';
			spyOn(scope, 'buildEventTeamsCountArrays');
			scope.getEventTeams();
			scope.$apply();
			expect(eventService.getEventTeams).toHaveBeenCalledWith(4);
			expect(scope.eventTeamUsers).toEqual('hello');
			expect(scope.buildEventTeamsCountArrays).toHaveBeenCalled();
		});
	});

	describe('$watch startGroup, endGroup, showGender Test', function(){
		it('should call scope.clearSelectedUsers()', function(){
			scope.startGroup = 4;
			scope.$apply();
			scope.startGroup = 3;
			spyOn(scope, 'clearSelectedUsers');
			scope.$apply();
			expect(scope.clearSelectedUsers).toHaveBeenCalled();
			scope.endGroup = 4;
			scope.$apply();
			expect(scope.clearSelectedUsers).toHaveBeenCalled();
			scope.showGender = 'women';
			scope.$apply();
			expect(scope.clearSelectedUsers).toHaveBeenCalled();
		});
	});

	describe('$watch startGroup Test', function(){
		it('should set scope.endGroup to its correct values', function(){
			scope.startGroup = 1;
			scope.$apply();
			scope.endGroup = 2;
			scope.startGroup = 3;
			scope.$apply();
			expect(scope.endGroup).toEqual(3);
		});
	});

	describe('$watch showGender Test', function(){
		it('should set scope.eventGroupsCountArray and scope.endGroup to their correct values', function(){
			scope.shownGender = 'female';
			scope.$apply();
			scope.eventMenGroupsCountArray = [1, 2, 3];
			scope.eventGroupsCountArray = 'eeee';
			scope.endGroup = 4;
			scope.showGender = 'male';
			scope.$apply();
			expect(scope.eventGroupsCountArray).toEqual([1, 2, 3]);
			expect(scope.endGroup).toEqual('3');
			scope.eventWomenGroupsCountArray = [1, 2, 3, 4];
			scope.showGender = null;
			scope.$apply();
			expect(scope.eventGroupsCountArray).toEqual([1, 2, 3, 4]);
			expect(scope.endGroup).toEqual('3');
		});
	});

	describe('groupsAndGenderFilter Test', function(){
		it('should return true', function(){
			var slot = {
				sex: 'female',
				group_number: 5
			};
			scope.showGender = 'female';
			scope.endGroup = 7;
			scope.startGroup = 3;
			expect(scope.groupsAndGenderFilter(slot)).toBeTruthy();
		});
		it('should return true', function(){
			var slot = {
				sex: 'male',
				group_number: 5
			};
			scope.showGender = null;
			scope.endGroup = 7;
			scope.startGroup = 3;
			expect(scope.groupsAndGenderFilter(slot)).toBeTruthy();
		});
		it('should return false', function(){
			var slot = {
				sex: 'male',
				group_number: 5
			};
			scope.showGender = 'female';
			scope.endGroup = 7;
			scope.startGroup = 3;
			expect(scope.groupsAndGenderFilter(slot)).toBeFalsy();
		});
	});

	describe('toggleSelectedUsers Test', function(){
		it('should set scope.selectedUsers and scope.selectedUserSex to their correct values', function(){
			scope.selectedUsers = [3];
			scope.selectedUserSex = 'female';
			scope.toggleSelectedUsers(5, 'male');
			expect(scope.selectedUsers).toEqual([3, 5]);
			expect(scope.selectedUserSex).toEqual('female');
			scope.toggleSelectedUsers(3, 'male');
			expect(scope.selectedUsers).toEqual([5]);
			expect(scope.selectedUserSex).toEqual('female');
			scope.toggleSelectedUsers(5, 'male');
			expect(scope.selectedUsers).toEqual([]);
			expect(scope.selectedUserSex).toBeNull();
		});
	});

	describe('disableCheckbox Test', function(){
		it('should return true', function(){
			scope.selectedUsers = [2, 4];
			expect(scope.disableCheckbox(5)).toBeTruthy();
		});
		it('should return true', function(){
			scope.selectedUsers = [5];
			scope.selectedUserSex = 'female';
			expect(scope.disableCheckbox(5, 'male')).toBeTruthy();
		});
		it('should return false', function(){
			scope.selectedUsers = [4];
			expect(scope.disableCheckbox(5)).toBeFalsy();
		});
	});

    describe('clearSelectedUsers Test', function(){
    	it('should set scope.selectedUsers and scope.selectedUserSex to their correct values', function(){
    		scope.selectedUsers = 'a';
    		scope.selectedUserSex = 'female';
    		scope.clearSelectedUsers();
    		expect(scope.selectedUsers).toEqual([]);
    		expect(scope.selectedUserSex).toBeNull();
		});
	});

    describe('swapPlayers Test', function(){
		it('should set scope.eventTeamUsers and scope.playersSwapped to their correct values and call scope.clearSelectedUsers()', function(){
			spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1);
			scope.eventTeamUsers = [{
				user_id: 4,
				users: {
					id: 4,
					egg: 'foo'
				},
				group_number: 4,
				event_team_id: 2,
				captain: 1
			}, {
				user_id: 6,
				users: {
					id: 6,
					egg: 'aaa'
				},
				group_number: 5,
				event_team_id: 3,
				captain: 1
			}];
			spyOn(scope, 'clearSelectedUsers');
			scope.swapPlayers();
			expect(scope.eventTeamUsers).toEqual([{
				user_id: 6,
				users: {
					id: 6,
					egg: 'aaa'
				},
				group_number: 4,
				event_team_id: 2,
				captain: 0
			}, {
				user_id: 4,
				users: {
					id: 4,
					egg: 'foo'
				},
				group_number: 5,
				event_team_id: 3,
				captain: 0
			}]);
			expect(scope.clearSelectedUsers).toHaveBeenCalled();
			expect(scope.playersSwapped).toBeTruthy();
		});
	});

    describe('updateEventTeams Test', function(){
    	it('should set scope.callInProgress and window.location.href to their correct values and call window.alert() after eventService.updateEventTeams() returns ' +
		   'success', function(){
    		scope.event = {
    			id: 5,
				eventType: 'league'
			};
    		scope.eventTeamUsers = 'cheese';
    		scope.playersSwapped = true;
    		scope.callInProgress = false;
    		spyOn(window, 'alert');
    		scope.updateEventTeams(true);
    		expect(scope.callInProgress).toBeTruthy();
    		scope.$apply();
    		expect(eventService.updateEventTeams).toHaveBeenCalledWith(5, 'cheese');
    		expect(window.alert).toHaveBeenCalledWith('Event Teams Updated!');
    		expect(window.location.href).toEqual('/');
		});
	});

});