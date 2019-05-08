describe('createEventModalController Test Suite', function(){

    var q, deferred, scope, rootScope, createEventModalService, facilityActivitiesService, editEventModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        createEventModalService = {
            create: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(createEventModalService, 'create').and.callThrough();
        facilityActivitiesService = {
        	getFacilityInfo: function(){
                deferred = q.defer();
                deferred.resolve({
					facility: {
						activities: 'pig'
					}
				});
                return deferred.promise;
            }
		};
        spyOn(facilityActivitiesService, 'getFacilityInfo').and.callThrough();
        editEventModalService = {
        	getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 44,
						name: 'aaaa',
						activity_id: 4,
						event_type: 'soap',
						event_sub_type: 'beer',
						start_date: '2018-10-09',
						event_leaders: [{
							username: 'hahaha'
						}],
						type_of_play: 'social',
						participant_charge: 3.11,
						charge_cc: 1,
						gender_type: 'both',
						for_age_type: 'adult',
						for_membership_type: 'member',
						for_active: 1,
						rounds_interval_metric: 'minutes',
						rounds_interval: 45,
						rounds: 2,
						num_of_start_times: 4,
						standard_line_duration: 60,
						start_time: '16:00:00'
					}
				});
                return deferred.promise;
            }
		};
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        helperService = {
        	parseTime: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
    		facility_id: 5
		};
    	rootScope.selectedEvent = {
    		id: 544
		};
    	rootScope.modalViewOnly = {};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('createEventModalController', {
            $scope: scope,
			createEventModalService: createEventModalService,
			facilityActivitiesService: facilityActivitiesService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('updateEventSubType Test', function(){
    	it('should test whether the rounds select list get it elements changed based on the passed in item', function(){
			scope.updateEventSubType('single');
			scope.$apply();
			expect(scope.numberRounds).toEqual([1]);
			scope.updateEventSubType('series');
			scope.$apply();
			expect(scope.numberRounds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		});
	});

    describe('getFacility Test', function(){
    	it('should then set scope.facilityActivities to its correct value after facilityActivitiesService.getFacilityInfo() returns success', function(){
			scope.facilityActivities = 'bird';
			scope.getFacility();
			scope.$apply();
			expect(facilityActivitiesService.getFacilityInfo).toHaveBeenCalled();
			expect(scope.facilityActivities).toEqual('pig');
		});
	});

    describe('checkCreateEventInput Test', function(){
		it('should set scope.showCreateEventErrors to its correct value and return false', function(){
			scope.createEventObject = {
				name: null,
				activity: 'tennis',
				eventType: 'social',
				eventSubType: 'series',
				typeOfPlay: null,
				roundsIntervalMetric: 'minutes',
				roundsInterval: 30,
                rounds: 1,
				standardLineDuration: 75,
                genderType: 'both',
                participantCharge: 2.00,
                chargeCc: null,
				eventLeaderUsername: null,
				startDate: null,
				startTime: null,
				numOfStartTimes: null,
				ageType: 'adult',
				membershipType: null,
				activeStatus: '1'
			};
			scope.showCreateEventErrors = {
                name: false,
                eventType: false,
                eventSubType: false,
 				typeOfPlay: false,
				startDate: false,
                ageType: false,
                genderType: false,
                membershipType: false,
				activeStatus: false,
				participantCharge: false,
				chargeCc: false,
				roundsIntervalMetric: false,
				roundsInterval: false,
				rounds: false,
				numOfStartTimes: false,
				standardLineDuration: false,
				startTime: false
			};
			expect(scope.checkCreateEventInput()).toBeFalsy();
			expect(scope.showCreateEventErrors).toEqual({
				name: true,
                eventType: false,
                eventSubType: false,
				typeOfPlay: true,
                startDate: true,
				ageType: false,
                genderType: false,
                membershipType: true,
				activeStatus: false,
				participantCharge: false,
				chargeCc: true,
				roundsIntervalMetric: false,
				roundsInterval: false,
				rounds: false,
				numOfStartTimes: true,
				standardLineDuration: false,
				startTime: true
			});
		});
		it('should not change scope.showCreateEventErrors and return true', function(){
			scope.createEventObject = {
				name: 'aaa',
				activity: 'tennis',
				eventType: 'social',
                eventSubType: 'somehting',
				typeOfPlay: 'gender',
				roundsIntervalMetric: 'days',
				roundsInterval: 4,
                rounds: 1,
				standardLineDuration: 5,
                genderType: 'male',
				participantCharge: 2.00,
				chargeCc: 1,
				eventLeaderUsername: null,
				startDate: '4/2/2018',
				startTime: '4:00 PM',
				numOfStartTimes: 4,
				ageType: 'adult',
				membershipType: 'member',
				activeStatus: 1
			};
			scope.showCreateEventErrors = {
                name: false,
                eventType: false,
                eventSubType: false,
 				typeOfPlay: false,
				startDate: false,
                ageType: false,
                genderType: false,
                membershipType: false,
				activeStatus: false,
				participantCharge: false,
				chargeCc: false,
				roundsIntervalMetric: false,
				roundsInterval: false,
				rounds: false,
				numOfStartTimes: false,
				standardLineDuration: false,
				startTime: false
			};
			expect(scope.checkCreateEventInput()).toBeTruthy();
			expect(scope.showCreateEventErrors).toEqual({
                name: false,
                eventType: false,
                eventSubType: false,
 				typeOfPlay: false,
				startDate: false,
                ageType: false,
                genderType: false,
                membershipType: false,
				activeStatus: false,
				participantCharge: false,
				chargeCc: false,
				roundsIntervalMetric: false,
				roundsInterval: false,
				rounds: false,
				numOfStartTimes: false,
				standardLineDuration: false,
				startTime: false
			});
		});
	});

    describe('resetCreateEventErrors Test', function(){
    	it('should reset scope.showCreateEventErrors', function(){
    		scope.showCreateEventErrors = {
    			titanium: true,
				brick: true
			};
			scope.resetCreateEventErrors();
			expect(scope.showCreateEventErrors).toEqual({
				titanium: false,
				brick: false
			});
		});
	});

    describe('createEvent Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetCreateEventErrors() and scope.checkCreateEventInput().  It should ' +
		   'then set scope.createEventObject to its correct value and call rootScope.getEvents() and rootScope.toggleModal() after createEventModalService.create() returns ' +
		   'success', function(){
    		scope.createEventObject = {
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetCreateEventErrors');
    		spyOn(scope, 'checkCreateEventInput').and.returnValue(true);
    		rootScope.getEvents = jasmine.createSpy('getEvents');
    		rootScope.toggleModal = jasmine.createSpy('toggleModal');
    		scope.createEvent();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetCreateEventErrors).toHaveBeenCalled();
    		expect(scope.checkCreateEventInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(createEventModalService.create).toHaveBeenCalledWith({
				egg: 'white'
			});
    		expect(rootScope.getEvents).toHaveBeenCalled();
    		expect(scope.createEventObject).toEqual({
				type: 'tennis'
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

    describe('getEvent Test', function(){
    	it('should set scope.createEventObject to its correct value after editEventModalService.getEvent() returns success', function(){
    		scope.createEventObject = 'hello';
    		spyOn(helperService, 'parseTime').and.returnValue('4:00 PM');
    		scope.getEvent();
    		scope.$apply();
    		expect(editEventModalService.getEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
    		expect(scope.createEventObject).toEqual({
				id: 44,
				name: 'aaaa',
				activityId: '4',
				eventType: 'soap',
				eventSubType: 'beer',
				startDate: '2018-10-09',
				eventLeaderUsername: 'hahaha',
				typeOfPlay: 'social',
				participantCharge: 3.11,
				chargeCc: '1',
				genderType: 'both',
				ageType: 'adult',
				membershipType: 'member',
				activeStatus: '1',
				roundsIntervalMetric: 'minutes',
				roundsInterval: '45',
				rounds: '2',
				numOfStartTimes: '4',
				standardLineDuration: '60',
				startTime: '4:00 PM'
			});
		});
	});

    describe('$watch createEventObject.eventType Test', function(){
    	it('should set scope.numOfStartTimesArray to its correct value', function(){
    		scope.createEventObject = {
    			eventType: null
			};
    		scope.$apply();
    		scope.createEventObject = {
    			eventType: 'social'
			};
    		scope.numOfStartTimesArray = 'mmmmm';
    		scope.$apply();
    		expect(scope.numOfStartTimesArray).toEqual([1, 2]);
    		scope.createEventObject = {
    			eventType: 'league'
			};
    		scope.$apply();
    		expect(scope.numOfStartTimesArray).toEqual([1, 2, 3, 4, 5]);
		});
	});

});
