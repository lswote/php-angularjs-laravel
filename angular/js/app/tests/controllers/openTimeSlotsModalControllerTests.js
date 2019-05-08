describe('openTimeSlotsModalController Test Suite', function(){

    var q, deferred, rootScope, scope, openTimeSlotsModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        openTimeSlotsModalService = {
            getOpenTimeSlotsInfo: function(){
                deferred = q.defer();
                deferred.resolve({
					open_time_slots_info: 'blue'
				});
                return deferred.promise;
            }
        };
        spyOn(openTimeSlotsModalService, 'getOpenTimeSlotsInfo').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.selectedEvent = {
        	id: 55
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('openTimeSlotsModalController', {
            $scope: scope,
			openTimeSlotsModalService: openTimeSlotsModalService
        });
    }));

	describe('parseParticipantsInfo Test', function(){
		it('should set scope.rsvpedParticipants, scope.femaleRsvpedParticipants, scope.maleRsvpedParticipants, scope.waitlistedParticipants, scope.femaleWaitlistedParticipants, ' +
		   'and scope.maleWaitlistedParticipants to their correct values', function(){
			scope.openTimeSlotsInfo = {
				users: [{
					pivot: {
						rsvped: '2018-04-09 23:44:88',
						waitlisted: 0
					},
					sex: 'female'
				}, {
					pivot: {
						rsvped: '2018-04-09 23:44:88',
						waitlisted: 0
					},
					sex: 'male'
				}, {
					pivot: {
						rsvped: '2018-04-09 23:44:88',
						waitlisted: 0
					},
					sex: 'female'
				}, {
					pivot: {
						rsvped: '2018-04-09 23:44:88',
						waitlisted: 1
					},
					sex: 'male'
				}]
			};
			scope.parseParticipantsInfo();
			expect(scope.rsvpedParticipants).toEqual(4);
			expect(scope.femaleRsvpedParticipants).toEqual(2);
			expect(scope.maleRsvpedParticipants).toEqual(2);
			expect(scope.waitlistedParticipants).toEqual(1);
			expect(scope.femaleWaitlistedParticipants).toEqual(0);
			expect(scope.maleWaitlistedParticipants).toEqual(1);
		});
	});

	describe('parseCourtsInfo Test', function(){
		it('should set scope.maxNumOfMatches, scope.assignedMatches, and scope.openCourtsWithNoAssignments to their correct values', function(){
			scope.openTimeSlotsInfo = {
				max_playing_surfaces: 3,
				num_of_start_times: 2,
				lines: [1, 2, 3]
			};
			scope.maxNumOfMatches = 23842;
			scope.assignedMatches = 2359;
			scope.openCourtsWithNoAssignments = 85858;
			scope.parseCourtsInfo();
			expect(scope.maxNumOfMatches).toEqual(6);
			expect(scope.assignedMatches).toEqual(3);
			expect(scope.openCourtsWithNoAssignments).toEqual(3);
		});
	});

	describe('adjustOpenSlotsCounts Test', function(){
		it('should set scope.openSlots, scope.femaleOpenSlots, scope.maleOpenSlots, and scope.comboOpenSlots to their correct values', function(){
			scope.openSlots = 0;
			scope.femaleOpenSlots = 0;
			scope.maleOpenSlots = 0;
			scope.comboOpenSlots = 0;
			scope.adjustOpenSlotsCounts({
				line_play_type: 'ws'
			});
			scope.adjustOpenSlotsCounts({
				line_play_type: 'wd'
			});
			scope.adjustOpenSlotsCounts({
				line_play_type: 'xd'
			});
			scope.adjustOpenSlotsCounts({
				line_play_type: 'ms'
			});
			expect(scope.openSlots).toEqual(4);
			expect(scope.femaleOpenSlots).toEqual(2);
			expect(scope.maleOpenSlots).toEqual(1);
			expect(scope.comboOpenSlots).toEqual(1);
		});
	});

	describe('parseOpenSlotsInfo Test', function(){
		it('should call scope.adjustOpenSlotsCounts()', function(){
			scope.openTimeSlotsInfo = {
				lines: [{
					line_type: 'singles',
					pair_one_id: 3,
					pair_two_id: null
				}, {
					line_type: 'singles',
					pair_one_id: 4,
					pair_two_id: 5
				}, {
					line_type: 'singles',
					pair_one_id: null,
					pair_two_id: null
				}, {
					line_type: 'singles',
					pair_one_id: null,
					pair_two_id: null
				}, {
					line_type: 'doubles',
					pair_one: {
						user_one_id: null,
						user_two_id: 44
					},
					pair_two: {
						user_one_id: 55,
						user_two_id: 44
					}
				}, {
					line_type: 'doubles',
					pair_one: {
						user_one_id: null,
						user_two_id: 444
					},
					pair_two: {
						user_one_id: 5511,
						user_two_id: null
					}
				}, {
					line_type: 'doubles',
					pair_one: {
						user_one_id: 345,
						user_two_id: 444
					},
					pair_two: {
						user_one_id: null,
						user_two_id: null
					}
				}]
			};
			spyOn(scope, 'adjustOpenSlotsCounts');
			scope.parseOpenSlotsInfo();
			expect(scope.adjustOpenSlotsCounts.calls.count()).toEqual(10);
		});
	});

	describe('getOpenTimeSlotsInfo Test', function(){
		it('should set scope.openTimeSlotsInfo to its correct value and call scope.parseParticipantsInfo(), scope.parseCourtsInfo(), and scope.parseOpenSlotsInfo() after ' +
		   'openTimeSlotsModalService.getOpenTimeSlotsInfo() returns success', function(){
			scope.openTimeSlotsInfo = 'brown';
			spyOn(scope, 'parseParticipantsInfo');
			spyOn(scope, 'parseCourtsInfo');
			spyOn(scope, 'parseOpenSlotsInfo');
			scope.getOpenTimeSlotsInfo();
			scope.$apply();
			expect(openTimeSlotsModalService.getOpenTimeSlotsInfo).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.openTimeSlotsInfo).toEqual('blue');
			expect(scope.parseParticipantsInfo).toHaveBeenCalled();
			expect(scope.parseCourtsInfo).toHaveBeenCalled();
			expect(scope.parseOpenSlotsInfo).toHaveBeenCalled();
		});
	});

});