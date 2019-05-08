describe('editCaptainsModalController Test Suite', function(){

    var q, deferred, scope, rootScope, eventService, editCaptainsModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        eventService = {
        	getEventTeams: function(){
                deferred = q.defer();
                deferred.resolve({
					event_team_users: 'alone'
				});
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventTeams').and.callThrough();
        editCaptainsModalService = {
        	updateEventTeamCaptains: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
		};
		spyOn(editCaptainsModalService, 'updateEventTeamCaptains').and.callThrough();
        helperService = {
			findArrayIndex: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
			privilege: 'admin'
		};
    	rootScope.selectedEvent = {
    		id: 1
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('editCaptainsModalController', {
            $scope: scope,
			eventService: eventService,
			editCaptainsModalService: editCaptainsModalService,
			helperService: helperService
        });
    }));

    describe('findTeamCaptain Test', function(){
    	it('should return the correct value', function(){
    		var eventTeamId = 2;
    		scope.eventTeamUsers = [{
    			user_id: 3,
				event_team_id: 2,
				captain: 0
			}, {
    			user_id: 4,
				event_team_id: 1,
				captain: 0
			}, {
    			user_id: 5,
				event_team_id: 2,
				captain: 1
			}];
    		expect(scope.findTeamCaptain(eventTeamId)).toEqual('5');
		});
    	it('should return null', function(){
    		var eventTeamId = 6;
    		scope.eventTeamUsers = [{
    			user_id: 3,
				event_team_id: 2,
				captain: 0
			}, {
    			user_id: 4,
				event_team_id: 1,
				captain: 0
			}, {
    			user_id: 5,
				event_team_id: 2,
				captain: 1
			}];
    		expect(scope.findTeamCaptain(eventTeamId)).toBeNull();
		});
	});

    describe('parseEventTeams Test', function(){
    	it('should set scope.eventTeams to its correct value', function(){
    		scope.eventTeams = 'worth';
    		scope.eventTeamUsers = [{
				event_team_id: 2,
				event_teams: {
					name: 'blue'
				}
			}, {
				event_team_id: 1,
				event_teams: {
					name: 'red'
				}
			}, {
				event_team_id: 2,
				event_teams: {
					name: 'yellow'
				}
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValue(false);
    		spyOn(scope, 'findTeamCaptain').and.returnValues(4, 5, 6);
    		scope.parseEventTeams();
    		expect(scope.eventTeams).toEqual([{
				name: 'blue',
				captain_user_id: 4
			}, {
				name: 'red',
				captain_user_id: 5
			}, {
				name: 'yellow',
				captain_user_id: 6
			}]);
		});
	});

    describe('getEventTeams Test', function(){
		it('should set scope.getEventTeamsInProgress to its correct value.  It should then set scope.eventTeamUsers to its correct value and call scope.parseEventTeams() ' +
		   'after eventService.getEventTeams() returns success', function(){
			scope.getEventTeamsInProgress = false;
			scope.eventTeamUsers = 'aaaa';
			spyOn(scope, 'parseEventTeams');
			scope.getEventTeams();
			expect(scope.getEventTeamsInProgress).toBeTruthy();
			scope.$apply();
			expect(eventService.getEventTeams).toHaveBeenCalledWith(1);
			expect(scope.eventTeamUsers).toEqual('alone');
			expect(scope.parseEventTeams).toHaveBeenCalled();
			expect(scope.getEventTeamsInProgress).toBeFalsy();
		});
	});

    describe('updateEventTeamCaptains Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call editCaptainsModalService.updateEventTeamCaptains()', function(){
			scope.eventTeamUsers = 'bbbb';
			scope.callInProgress = false;
			scope.callSuccess = true;
			scope.updateEventTeamCaptains();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(editCaptainsModalService.updateEventTeamCaptains).toHaveBeenCalledWith(1, 'bbbb');
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

    describe('resetCaptainFlag Test', function(){
    	it('should set scope.eventTeamUsers to its correct value', function(){
    		scope.eventTeamUsers = [{
    			id: 1,
				captain: 0
			}, {
    			id: 2,
				captain: 1
			}, {
    			id: 3,
				captain: 0
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValues(1, false, false);
    		scope.resetCaptainFlag();
    		expect(scope.eventTeamUsers).toEqual([{
    			id: 1,
				captain: 1
			}, {
    			id: 2,
				captain: 0
			}, {
    			id: 3,
				captain: 0
			}]);
		});
	});

    describe('$watch eventTeams Test', function(){
    	it('should call scope.resetCaptainFlag()', function(){
    		scope.eventTeams = [{
    			id: 1
			}, {
    			id: 2
			}];
    		scope.$apply();
    		scope.eventTeams = [{
    			id: 3
			}, {
    			id: 4
			}];
    		spyOn(scope, 'resetCaptainFlag');
    		scope.$apply();
    		expect(scope.resetCaptainFlag).toHaveBeenCalled();
		});
	});

});