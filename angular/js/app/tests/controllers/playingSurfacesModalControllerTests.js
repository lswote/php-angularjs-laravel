describe('playingSurfacesModalController Test Suite', function(){

    var q, deferred, rootScope, scope, playingSurfacesModalService, editEventModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        playingSurfacesModalService = {
            getSurfaces: function(){
                deferred = q.defer();
                deferred.resolve({
					surfaces: 'home'
				});
                return deferred.promise;
            },
			updateSelectedSurfaces: function(){
				deferred = q.defer();
				deferred.resolve();
				return deferred.promise;
			}
        };
        spyOn(playingSurfacesModalService, 'getSurfaces').and.callThrough();
        spyOn(playingSurfacesModalService, 'updateSelectedSurfaces').and.callThrough();
        editEventModalService = {
            getEvent: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						id: 4,
						max_playing_surfaces: 5
					}
				});
                return deferred.promise;
            }
        };
        spyOn(editEventModalService, 'getEvent').and.callThrough();
        helperService = {
        	findArrayIndex: function(){},
        	findArrayIndexMultipleKeys: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
        rootScope.selectedEvent = {
			id: 2
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('playingSurfacesModalController', {
            $scope: scope,
			playingSurfacesModalService: playingSurfacesModalService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('getEvent Test', function(){
    	it('should set scope.event to its correct value and call scope.getSurfaces() after editEventModalService.getEvent() returns success', function(){
    		scope.event = {};
    		spyOn(scope, 'getSurfaces');
			scope.getEvent();
			scope.$apply();
			expect(editEventModalService.getEvent).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.event).toEqual({
				id: 4,
				maxPlayingSurfaces: 5
			});
			expect(scope.getSurfaces).toHaveBeenCalled();
		});
	});

    describe('parseSelectedSurfaces Test', function(){
    	it('should set scope.selectedSurfaces and scope.allowAdditionalSurfacesToBeSelected to their correct values', function(){
    		scope.event = {
    			maxPlayingSurfaces: 3
			};
    		scope.surfaces = [{
				events: [{
					id: 1,
					pivot: 'idea'
				}]
			}, {
    			events: [{
					id: 1,
					pivot: 'mistake'
				}, {
    				id: 2,
					pivot: {
    					emergency_surface: 0
					}
				}]
			}];
    		scope.selectedSurfaces = 'apples';
    		scope.allowAdditionalSurfacesToBeSelected = false;
    		spyOn(helperService, 'findArrayIndex').and.returnValues(false, 1);
			scope.parseSelectedSurfaces();
			expect(scope.selectedSurfaces).toEqual([{
				emergency_surface: 0
			}]);
			expect(scope.allowAdditionalSurfacesToBeSelected).toBeTruthy();
		});
	});

    describe('getSurfaces Test', function(){
    	it('should set scope.surfaces to its correct value and call scope.parseSelectedSurfaces() after playingSurfacesModalService.getSurfaces() returns success', function(){
    		scope.surfaces = 'cheek';
    		spyOn(scope, 'parseSelectedSurfaces');
    		scope.getSurfaces();
    		scope.$apply();
    		expect(playingSurfacesModalService.getSurfaces).toHaveBeenCalledWith(rootScope.selectedEvent.id);
    		expect(scope.surfaces).toEqual('home');
    		expect(scope.parseSelectedSurfaces).toHaveBeenCalled();
		});
	});

    describe('toggleSelectedSurface Test', function(){
    	it('should set scope.selectedSurfaces to its correct value and set scope.allowAdditionalSurfacesToBeSelected to false', function(){
    		var facilitySurfaceId = 55;
    		var eventId = 12;
    		scope.event = {
    			maxPlayingSurfaces: 1
			};
    		scope.selectedSurfaces = [];
    		scope.allowAdditionalSurfacesToBeSelected = true;
    		spyOn(helperService, 'findArrayIndexMultipleKeys').and.returnValue(false);
    		scope.toggleSelectedSurface(facilitySurfaceId, eventId);
    		expect(scope.selectedSurfaces).toEqual([{
				facility_surface_id: 55,
				event_id: 12,
				event_surface_number: null,
				emergency_surface: 0
			}]);
    		expect(scope.allowAdditionalSurfacesToBeSelected).toBeFalsy();
		});
    	it('should set scope.selectedSurfaces to its correct value and set scope.allowAdditionalSurfacesToBeSelected to true', function(){
    		var facilitySurfaceId = 55;
    		var eventId = 12;
    		scope.event = {
    			maxPlayingSurfaces: 4
			};
    		scope.selectedSurfaces = [{
    			facility_surface_id: 55,
				event_id: 12
			}];
    		scope.allowAdditionalSurfacesToBeSelected = false;
    		spyOn(helperService, 'findArrayIndexMultipleKeys').and.returnValue(0);
    		scope.toggleSelectedSurface(facilitySurfaceId, eventId);
    		expect(scope.selectedSurfaces).toEqual([]);
    		expect(scope.allowAdditionalSurfacesToBeSelected).toBeTruthy();
		});
	});

    describe('checkEventSurfaceNumbers Test', function(){
    	it('should return false', function(){
			scope.selectedSurfaces = [{
				event_surface_number: 3
			}, {
				event_surface_number: 3
			}, {
				event_surface_number: null
			}];
			expect(scope.checkEventSurfaceNumbers()).toBeFalsy();
		});
    	it('should return true', function(){
			scope.selectedSurfaces = [{
				event_surface_number: 3
			}, {
				event_surface_number: 3
			}, {
				event_surface_number: 5
			}];
			expect(scope.checkEventSurfaceNumbers()).toBeTruthy();
		});
	});

    describe('buildSurfaceNumbersArray Test', function(){
    	it('should set scope.surfaceNumbers to its correct value', function(){
    		scope.selectedSurfaces = [{
    			event_surface_number: 2
			}, {
    			event_surface_number: 1
			}, {
    			event_surface_number: 5
			}];
    		scope.surfaceNumbers = 'aaa';
    		scope.buildSurfaceNumbersArray();
    		expect(scope.surfaceNumbers).toEqual([2, 1, 5]);
		});
	});

    describe('findNextAvailableSurfaceNumber Test', function(){
    	it('should set scope.surfaceNumbers to its correct value and return the correct value', function(){
    		scope.surfaces = [1, 2, 3, 4];
    		scope.surfaceNumbers = [1, 3];
    		expect(scope.findNextAvailableSurfaceNumber()).toEqual(2);
    		expect(scope.surfaceNumbers).toEqual([1, 3, 2]);
		});
	});

    describe('buildAllSurfacesArray Test', function(){
    	it('should set scope.unselectedSurfaces and scope.allSurfaces to their correct values and call scope.buildAllSurfacesArray()', function(){
    		rootScope.selectedEvent = {
    			id: 4
			};
    		scope.surfaces = [{
    			id: 4
			}];
    		scope.unselectedSurfaces = 'hehehe';
    		scope.selectedSurfaces = [{
				facility_surface_id: 3,
				event_id: 3,
				event_surface_number: 3,
				emergency_surface: 1
			}];
    		spyOn(scope, 'buildSurfaceNumbersArray');
    		spyOn(helperService, 'findArrayIndex').and.returnValue(false);
    		spyOn(scope, 'findNextAvailableSurfaceNumber').and.returnValue(4);
    		scope.buildAllSurfacesArray();
    		expect(scope.buildSurfaceNumbersArray).toHaveBeenCalled();
    		expect(scope.unselectedSurfaces).toEqual([{
    			facility_surface_id: 4,
				event_id: 4,
				event_surface_number: 4,
				emergency_surface: 1
			}]);
    		expect(scope.allSurfaces).toEqual([{
    			facility_surface_id: 3,
				event_id: 3,
				event_surface_number: 3,
				emergency_surface: 1
			}, {
    			facility_surface_id: 4,
				event_id: 4,
				event_surface_number: 4,
				emergency_surface: 1
			}]);
		});
	});

    describe('updateSelectedSurfaces Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.buildAllSurfacesArray().  It should then call rootScope.getEvents() ' +
		   'after playingSurfacesModalService.updateSelectedServices() returns success', function(){
    		scope.event = {
    			maxPlayingSurfaces: 2
			};
    		scope.selectedSurfaces = ['c', 'd'];
    		scope.allSurfaces = ['a', 'b'];
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		rootScope.getEvents = jasmine.createSpy('getEvents');
    		spyOn(scope, 'checkEventSurfaceNumbers').and.returnValue(true);
    		spyOn(scope, 'buildAllSurfacesArray');
    		spyOn(scope, 'getSurfaces');
    		scope.updateSelectedSurfaces();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.buildAllSurfacesArray).toHaveBeenCalled();
    		scope.$apply();
    		expect(playingSurfacesModalService.updateSelectedSurfaces).toHaveBeenCalledWith(rootScope.selectedEvent.id, scope.allSurfaces);
    		expect(rootScope.getEvents).toHaveBeenCalled();
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});