describe('teamDrawModalController Test Suite', function(){

    var q, deferred, scope, rootScope, teamDrawModalService, editEventModalService, eventLinesService, eventService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
    	teamDrawModalService = {
    		getNextUnassignedGroup: function(){
                deferred = q.defer();
                deferred.resolve({
					next_group: {
						sex: 'female',
						group_number: 2,
						spots: [1, 2]
					}
				});
                return deferred.promise;
            }
		};
    	spyOn(teamDrawModalService, 'getNextUnassignedGroup').and.callThrough();
        editEventModalService = {
            getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 4,
						users: [{
							id: 1
						}, {
							id: 2
						}]
					}
				});
                return deferred.promise;
            }
        };
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        eventLinesService = {
    		getParticipantsRankings: function(){
    			deferred = q.defer();
                deferred.resolve({
					participants_rankings: [{
						id: 1,
						pivot: {
							ranking: 34.29
						}
					}, {
						id: 2,
						pivot: {
							ranking: 54.29
						}
					}]
                });
                return deferred.promise;
			}
		};
    	spyOn(eventLinesService, 'getParticipantsRankings').and.callThrough();
    	eventService = {
    		updateEventTeams: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
			updateEventTeamsComplete: function(){
    			deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
		};
    	spyOn(eventService, 'updateEventTeams').and.callThrough();
    	spyOn(eventService, 'updateEventTeamsComplete').and.callThrough();
    	helperService = {
        	findArrayIndex: function(){},
			formatDate: function(){},
			formatTime: function(){},
        	parseTime: function(){},
			convertMilitaryTimeToMinutes: function(){},
			convertMinutesToMilitaryTime: function(){},
			shuffleArray: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
    		id: 44
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('teamDrawModalController', {
            $scope: scope,
			teamDrawModalService: teamDrawModalService,
			editEventModalService: editEventModalService,
			eventLinesService: eventLinesService,
			eventService: eventService,
			helperService: helperService
        });
    }));

    describe('parseParticipantSpotsBySex Test', function(){
    	it('should scope.femaleSpots and scope.maleSpots to their correct values', function(){
			scope.femaleSpots = 434;
			scope.maleSpots = 999;
			scope.event = {
				event_team_users: [{
					sex: 'female'
				}, {
					sex: 'female'
				}, {
					sex: 'male'
				}, {
					sex: 'female'
				}]
			};
			scope.parseParticipantSpotsBySex();
			expect(scope.femaleSpots).toEqual(3);
			expect(scope.maleSpots).toEqual(1);
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

    describe('getParticipantsRankings Test', function(){
    	it('should set scope.participants to its correct value and call scope.sortParticipantsBySexAndRanking() and scope.getNextUnassignedGroup() after ' +
		   'eventLinesService.getParticipantsRankings() returns success', function(){
    		scope.event = {
    			activity_id: 4,
				facility_id: 5
			};
    		scope.participants = [{
				id: 1
			}, {
				id: 2
			}];
    		spyOn(scope, 'sortParticipantsBySexAndRanking');
    		spyOn(scope, 'getNextUnassignedGroup');
    		spyOn(helperService, 'findArrayIndex').and.returnValues(0, 1, 0, 1);
    		spyOn(scope, 'getEvent');
    		spyOn(scope, 'parseParticipantSpotsBySex');
    		scope.getParticipantsRankings();
    		scope.$apply();
    		expect(eventLinesService.getParticipantsRankings).toHaveBeenCalledWith(scope.event.activityId, scope.event.facilityId);
    		expect(scope.participants).toEqual([{
				id: 1,
				ranking: 34.29
			}, {
				id: 2,
				ranking: 54.29
			}]);
    		expect(scope.sortParticipantsBySexAndRanking).toHaveBeenCalled();
    		expect(scope.getNextUnassignedGroup).toHaveBeenCalled();
		});
	});

    describe('rsvpedSort Test', function(){
    	it('should return the correct value', function(){
    		var a = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-26 18:51:07'
					}
				}]
			};
    		var b = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-27 18:51:07'
					}
				}]
			};
    		expect(scope.rsvpedSort(a, b)).toEqual(1);
    		a = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-26 18:51:07'
					}
				}]
			};
    		b = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-25 18:51:07'
					}
				}]
			};
    		expect(scope.rsvpedSort(a, b)).toEqual(-1);
    		a = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-26 18:51:07'
					}
				}]
			};
    		b = {
    			events: [{
    				pivot: {
    					rsvped: '2018-06-26 18:51:07'
					}
				}]
			};
    		expect(scope.rsvpedSort(a, b)).toEqual(0);
		});
	});

    describe('rankingSort Test', function(){
    	it('should return the correct value', function(){
    		var a = {
    			ranking: 34.32
			};
    		var b = {
    			ranking: 54.32
			};
    		expect(scope.rankingSort(a, b)).toEqual(1);
    		a = {
    			ranking: 34.32
			};
    		b = {
    			ranking: 14.32
			};
    		expect(scope.rankingSort(a, b)).toEqual(-1);
    		a = {
    			ranking: 14.32
			};
    		b = {
    			ranking: 14.32
			};
    		expect(scope.rankingSort(a, b)).toEqual(0);
		});
	});

	describe('sortParticipantsBySexAndRanking Test', function(){
		it('should set scope.femaleParticipants and scope.maleParticipants to their correct values', function(){
			scope.participants = [{
				id: 4,
				sex: 'female'
			}, {
				id: 5,
				sex: 'female'
			}, {
				id: 6,
				sex: 'female'
			}, {
				id: 7,
				sex: 'male'
			}];
			scope.femaleSpots = 2;
			scope.maleSpots = 1;
			scope.femaleParticipants = 'one';
			scope.maleParticipants = 'two';
			scope.rankingSort = function(){};
			scope.rsvpedSort = function(){};
			scope.sortParticipantsBySexAndRanking();
			expect(scope.femaleParticipants).toEqual([{
				id: 4,
				sex: 'female'
			}, {
				id: 5,
				sex: 'female'
			}]);
			expect(scope.maleParticipants).toEqual([{
				id: 7,
				sex: 'male'
			}]);
		});
	});

	describe('getEvent Test', function(){
		it('should set scope.event and scope.participants to their correct values and call scope.parseParticipantSexCounts(), scope.parseParticipantSpotsBySex() and ' +
		   'scope.getParticipantsRankings() after editEventModalService.getEvent() returns success', function(){
			scope.event = 'yellow';
			scope.participants = 'green';
			spyOn(scope, 'parseParticipantSexCounts');
			spyOn(scope, 'parseParticipantSpotsBySex');
			spyOn(scope, 'getParticipantsRankings');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.event).toEqual({
				id: 4,
				users: [{
					id: 1
				}, {
					id: 2
				}]
			});
			expect(scope.participants).toEqual([{
				id: 1
			}, {
				id: 2
			}]);
			expect(scope.parseParticipantSexCounts).toHaveBeenCalled();
			expect(scope.parseParticipantSpotsBySex).toHaveBeenCalled();
			expect(scope.getParticipantsRankings).toHaveBeenCalled();
		});
	});

	describe('selectCurrentGroupParticipants Test', function(){
		it('should set scope.currentGroupParticipants to its correct value', function(){
			scope.currentGroupNumber = 3;
			scope.currentGroupSpots = [1, 2];
			scope.currentGroupSex = 'female';
			scope.femaleParticipants = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			scope.currentGroupParticipants = 'hello';
			scope.selectCurrentGroupParticipants();
			expect(scope.currentGroupParticipants).toEqual([5, 6]);
		});
	});

	describe('getNextUnassignedGroup Test', function(){
		it('should set scope.currentGroupSex, scope.currentGroupNumber, scope.currentGroupSpots, scope.spotButtonWidthString, scope.currentGroupAssignmentComplete, and ' +
		   'scope.callInProgress to their correct values and call scope.selectCurrentGroupParticipants() after teamDrawModalService.getNextUnassignedGroup() ' +
		   'returns success', function(){
			scope.currentGroupSex = 'male';
			scope.currentGroupNumber = 44;
			scope.currentGroupSpots = 'red';
			scope.spotButtonWidthString = 'rain';
			scope.currentGroupAssignmentComplete = true;
			scope.callInProgress = true;
			spyOn(scope, 'selectCurrentGroupParticipants');
			spyOn(scope, 'getParticipantsRankings');
			spyOn(scope, 'parseParticipantSpotsBySex');
			scope.getNextUnassignedGroup();
			scope.$apply();
			expect(teamDrawModalService.getNextUnassignedGroup).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.currentGroupSex).toEqual('female');
			expect(scope.currentGroupNumber).toEqual(2);
			expect(scope.currentGroupSpots).toEqual([1 ,2]);
			expect(scope.spotButtonWidthString).toEqual('50%');
			expect(scope.selectCurrentGroupParticipants).toHaveBeenCalled();
			expect(scope.currentGroupAssignmentComplete).toBeFalsy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

	describe('assignToTeams Test', function(){
		it('should set scope.currentGroupSpots, scope.currentGroupParticipants, and scope.currentGroupAssignmentComplete to their correct values', function(){
			scope.currentGroupParticipants = 'staeak';
			scope.currentGroupSpots = [{
				id: 4
			}, {
				id: 5
			}];
			scope.currentGroupAssignmentComplete = false;
			spyOn(helperService, 'shuffleArray').and.returnValue([{
				id: 1,
				first_name: 'sarah',
				last_name: 'smith'
			}, {
				id: 2,
				first_name: 'hannah',
				last_name: 'deutsch'
			}]);
			scope.assignToTeams();
			expect(scope.currentGroupSpots).toEqual([{
				id: 4,
				user_id: 1,
				user: {
					first_name: 'sarah',
					last_name: 'smith'
				}
			}, {
				id: 5,
				user_id: 2,
				user: {
					first_name: 'hannah',
					last_name: 'deutsch'
				}
			}]);
			expect(scope.currentGroupParticipants).toEqual([]);
			expect(scope.currentGroupAssignmentComplete).toBeTruthy();
		});
	});

	describe('updateEventTeams Test', function(){
		it('should set scope.callInProgress to true.  It should then call scope.getNextUnassignedGroup() after eventService.updateEventTeams() returns success', function(){
			scope.currentGroupSpots = 'sports car';
			scope.callInProgress = false;
			spyOn(scope, 'getNextUnassignedGroup');
			spyOn(scope, 'getParticipantsRankings');
			spyOn(scope, 'parseParticipantSpotsBySex');
			scope.updateEventTeams();
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventService.updateEventTeams).toHaveBeenCalledWith(rootScope.selectedEvent.id, scope.currentGroupSpots);
			expect(scope.getNextUnassignedGroup).toHaveBeenCalled();
		});
	});

	describe('updateEventTeamsComplete Test', function(){
		it('should set scope.callInProgress to true.  It should then call scope.getEvents() and rootscope.toggleModal() after eventService.updateEventTeamsComplete() ' +
		   'returns success', function(){
			scope.callInProgress = false;
			scope.getEvents = jasmine.createSpy('getEvents');
			rootScope.toggleModal = jasmine.createSpy('toggleModal');
			spyOn(scope, 'getParticipantsRankings');
			spyOn(scope, 'parseParticipantSpotsBySex');
			scope.updateEventTeamsComplete();
			expect(scope.callInProgress).toBeTruthy();
			scope.$apply();
			expect(eventService.updateEventTeamsComplete).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.getEvents).toHaveBeenCalled();
			expect(rootScope.toggleModal).toHaveBeenCalled();
		});
	});

});