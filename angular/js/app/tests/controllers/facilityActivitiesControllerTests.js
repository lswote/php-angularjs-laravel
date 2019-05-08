describe('facilityActivitiesController Test Suite', function(){

    var q, deferred, scope, rootScope, window, facilityActivitiesService, activityMasterRecordModalService, helperService;

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
        facilityActivitiesService = {
        	getFacilityInfo: function(){
                deferred = q.defer();
                deferred.resolve({
					facility: {
						name: 'oh',
						activities: 'beautiful life'
					}
				});
                return deferred.promise;
            },
			update: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			}
        };
        spyOn(facilityActivitiesService, 'getFacilityInfo').and.callThrough();
        spyOn(facilityActivitiesService, 'update').and.callThrough();
        activityMasterRecordModalService = {
        	getActivities: function(){
        		deferred = q.defer();
                deferred.resolve({
					activities: [{
						id: 1,
						name: 'jacqline'
					}, {
						id: 2,
						name: 'tammy'
					}, {
						id: 3,
						name: 'jessy'
					}]
				});
                return deferred.promise;
			}
		};
        spyOn(activityMasterRecordModalService, 'getActivities').and.callThrough();
        helperService = {
        	findArrayIndex: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $window, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
			privilege: 'facility leader'
		};
    	scope = $rootScope.$new();
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('facilityActivitiesController', {
            $scope: scope,
			$routeParams: {
            	id: 109
			},
			facilityActivitiesService: facilityActivitiesService,
			activityMasterRecordModalService: activityMasterRecordModalService,
			helperService: helperService
        });
    }));

    describe('parseSelectedActivities Test', function(){
    	it('should set scope.selectedActivities to its correct value', function(){
    		scope.selectedActivities = [{
    			pivot: {
    				competition_scoring_format: 3
				}
			}, {
    			pivot: {
    				competition_scoring_format: 4
				}
			}];
    		scope.parseSelectedActivities();
    		expect(scope.selectedActivities).toEqual([{
    			pivot: {
    				competition_scoring_format: '3'
				}
			}, {
    			pivot: {
    				competition_scoring_format: '4'
				}
			}])
		});
	});

    describe('getFacility Test', function(){
    	it('should set scope.facility, scope.facilityActivities, scope.selectedActivities, and scope.displayFacilityForm to their correct values and call ' +
		   'scope.getNonFacilityActivities() and scope.parseSelectedActivities() after facilityActivitiesService.getFacilityInfo() returns success', function(){
    		scope.facility = 'fancy';
    		scope.facilityActivities = 'hello';
    		scope.selectedActivities = 'aaa';
    		scope.displayFacilityForm = false;
    		spyOn(scope, 'getNonFacilityActivities');
    		spyOn(scope, 'parseSelectedActivities');
    		scope.getFacility();
    		scope.$apply();
    		expect(facilityActivitiesService.getFacilityInfo).toHaveBeenCalledWith(109);
    		expect(scope.facility).toEqual({
				name: 'oh',
				activities: 'beautiful life'
			});
    		expect(scope.facilityActivities).toEqual('beautiful life');
    		expect(scope.selectedActivities).toEqual('beautiful life');
    		expect(scope.displayFacilityForm).toBeTruthy();
    		expect(scope.getNonFacilityActivities).toHaveBeenCalled();
    		expect(scope.parseSelectedActivities).toHaveBeenCalled();
		});
	});

    describe('getNonFacilityActivities Test', function(){
    	it('should set scope.nonFacilityActivities to its correct value after activityMasterRecordModalService.getActivities() returns success', function(){
    		scope.nonFacilityActivities = 'burgers';
    		spyOn(helperService, 'findArrayIndex').and.returnValues(false, 1, false, false, 1, false);
    		spyOn(scope, 'parseSelectedActivities');
    		spyOn(scope, 'addActivity');
    		spyOn(scope, 'removeActivity');
    		scope.getNonFacilityActivities();
    		scope.$apply();
    		expect(activityMasterRecordModalService.getActivities).toHaveBeenCalled();
    		expect(scope.nonFacilityActivities).toEqual([{
				id: 1,
				name: 'jacqline'
			}, {
				id: 3,
				name: 'jessy'
			}]);
		});
	});

    describe('$watch selectedActivityId Test', function(){
    	it('should set scope.selectedActivities to its correct value and call scope.parseSelectedActivities() if new value is set', function(){
    		spyOn(scope, 'parseSelectedActivities');
    		scope.selectedActivityId = 3;
    		scope.$apply();
    		scope.facilityActivities = ['one', 'two'];
    		scope.selectedActivities = 'orange';
    		spyOn(helperService, 'findArrayIndex').and.returnValue(1);
    		scope.selectedActivityId = 4;
    		scope.$apply();
    		expect(scope.selectedActivities).toEqual(['two']);
    		expect(scope.parseSelectedActivities).toHaveBeenCalled();
		});
    	it('should set scope.selectedActivities to its correct value', function(){
    		spyOn(scope, 'parseSelectedActivities');
    		scope.selectedActivityId = 5;
    		scope.$apply();
    		scope.facilityActivities = 'aaaa';
    		scope.selectedActivities = 'orange';
    		scope.selectedActivityId = null;
    		scope.$apply();
    		expect(scope.selectedActivities).toEqual(scope.facilityActivities);
		});
	});

    /*describe('selectedActivities Test', function(){
    	it('should set scope.facilityActivities to its correct value', function(){
    		scope.facilityActivities = [{
    			id: 1,
				name: 'apple'
			}, {
    			id: 2,
				name: 'orange'
			}, {
    			id: 1,
				name: 'pear'
			}];
    		spyOn(scope, 'parseSelectedActivities');
    		scope.selectedActivities = 'aaa';
    		scope.$apply();
    		spyOn(helperService, 'findArrayIndex').and.returnValues(0 , 1);
    		scope.selectedActivities = [{
    			id: 1,
				name: 'nicole'
			}, {
    			id: 2,
				name: 'libby'
			}];
    		scope.$apply();
    		expect(scope.facilityActivities).toEqual([{
    			id: 1,
				name: 'nicole'
			}, {
    			id: 2,
				name: 'libby'
			}, {
    			id: 1,
				name: 'pear'
			}])
		});
	});*/

    describe('toggleNonFacilityActivities Test', function(){
    	it('should set scope.showNonFacilityActivities to its opposite value', function(){
    		scope.showNonFacilityActivities = false;
    		scope.toggleNonFacilityActivities();
    		expect(scope.showNonFacilityActivities).toBeTruthy();
    		scope.toggleNonFacilityActivities();
    		expect(scope.showNonFacilityActivities).toBeFalsy();
		});
	});

    describe('addActivity Test', function(){
    	it('should set scope.facilityActivities, scope.selectedActivities, and scope.nonFacilityActivities to their correct values and call ' +
		   'scope.parseSelectedActivities()', function(){
    		var activityId = 4;
    		scope.nonFacilityActivities = [{
    			id: 1,
				name: 'pong heaven'
			}, {
    			id: 2,
				name: 'zeemo bodega'
			}];
    		scope.facilityActivities = [];
    		scope.selectedActivities = [];
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0)
    		spyOn(scope, 'parseSelectedActivities');
    		scope.addActivity(activityId);
    		expect(scope.facilityActivities).toEqual([{
    			id: 1,
				name: 'pong heaven',
				pivot: {
    				facility_id: 109,
					activity_id: 1,
					num_of_surfaces: null,
					next_event_date: null,
					next_event_type: null
				}
			}]);
    		expect(scope.selectedActivities).toEqual([{
    			id: 1,
				name: 'pong heaven',
				pivot: {
    				facility_id: 109,
					activity_id: 1,
					num_of_surfaces: null,
					next_event_date: null,
					next_event_type: null
				}
			}]);
    		expect(scope.nonFacilityActivities).toEqual([{
    			id: 2,
				name: 'zeemo bodega'
			}]);
    		expect(scope.parseSelectedActivities).toHaveBeenCalled();
		});
	});

    describe('removeActivity Test', function(){
    	it('should set scope.nonFacilityActivities, scope.facilityActivities, scope.selectedActivities, and scope.selectedActivityId to their correct values and call ' +
		   'scope.parseSelectedActivities()', function(){
    		var activityId = 4;
    		scope.nonFacilityActivities = [];
    		scope.facilityActivities = [{
    			id: 1,
				name: 'cheese factory'
			}];
    		scope.selectedActivities = 'hehehe';
    		scope.selectedActivityId = 4;
    		spyOn(scope, 'parseSelectedActivities');
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		scope.removeActivity(activityId);
    		expect(scope.nonFacilityActivities).toEqual([{
    			id: 1,
				name: 'cheese factory'
			}]);
    		expect(scope.facilityActivities).toEqual([]);
    		expect(scope.selectedActivities).toEqual([]);
    		expect(scope.parseSelectedActivities).toHaveBeenCalled();
    		expect(scope.selectedActivityId).toEqual('');
		});
	});

    /*describe('buildFacilityActivitiesUpdateObject Test', function(){
		it('should set scope.facilityActivitiesUpdateObject to its correct value', function(){
			scope.facilityActivities = [{
				id: 1,
				pivot: {
					two_teams_per_line: 1,
					three_teams_per_line: 1,
					four_teams_per_line: 1,
					five_teams_per_line: 0,
					doubles: 1,
					competition_scoring_format: 3,
					line_scoring_format: 'wl',
					point: 'high',
					surface_type: 'court',
					line_type: 'set',
					num_of_surfaces: 4,
					next_event_date: '2018-04-01',
					next_event_type: 'social'
				}
			}, {
				id: 2,
				pivot: {
					two_teams_per_line: 1,
					three_teams_per_line: 1,
					four_teams_per_line: 1,
					five_teams_per_line: 0,
					doubles: 1,
					competition_scoring_format: 3,
					line_scoring_format: 'wl',
					point: 'high',
					surface_type: 'court',
					line_type: 'set',
					num_of_surfaces: 4,
					next_event_date: '2018-05-01',
					next_event_type: 'social'
				}
			}];
			scope.facilityActivitiesUpdateObject = 'food';
			scope.buildFacilityActivitiesUpdateObject();
			expect(scope.facilityActivitiesUpdateObject).toEqual({
				1: {
					two_teams_per_line: 1,
					three_teams_per_line: 1,
					four_teams_per_line: 1,
					five_teams_per_line: 0,
					doubles: 1,
					competition_scoring_format: 3,
					line_scoring_format: 'wl',
					point: 'high',
					surface_type: 'court',
					line_type: 'set',
					num_of_surfaces: 4,
					next_event_date: '2018-03-31',
					next_event_type: 'social'
				},
				2: {
					two_teams_per_line: 1,
					three_teams_per_line: 1,
					four_teams_per_line: 1,
					five_teams_per_line: 0,
					doubles: 1,
					competition_scoring_format: 3,
					line_scoring_format: 'wl',
					point: 'high',
					surface_type: 'court',
					line_type: 'set',
					num_of_surfaces: 4,
					next_event_date: '2018-04-30',
					next_event_type: 'social'
				}
			});
		});
	});*/

    describe('updateFacilityActivities Test', function(){
    	it('should set scope.callInProgress to its correct value and call scope.buildFacilityActivitiesUpdateObject().  It should then set window.location.href to its correct ' +
		   'value and call window.alert() after facilityActivitiesService.update() returns success', function(){
    		scope.facilityActivitiesUpdateObject = {
    			name: 'baby'
			};
    		scope.callInProgress = false;
    		spyOn(scope, 'buildFacilityActivitiesUpdateObject');
    		spyOn(window, 'alert');
    		spyOn(scope, 'parseSelectedActivities');
    		scope.updateFacilityActivities();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.buildFacilityActivitiesUpdateObject).toHaveBeenCalled();
    		scope.$apply();
    		expect(facilityActivitiesService.update).toHaveBeenCalledWith(109, scope.facilityActivitiesUpdateObject);
    		expect(window.alert).toHaveBeenCalledWith('Facility Activities Updated!');
    		expect(window.location.href).toEqual('/admin');
		});
	});

});