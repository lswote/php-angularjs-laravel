describe('deleteFacilityModalController Test Suite', function(){

    var q, deferred, scope, rootScope, deleteFacilityModalService, addFacilityLeaderModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        deleteFacilityModalService = {
        	delete: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(deleteFacilityModalService, 'delete').and.callThrough();
        addFacilityLeaderModalService = {
        	getFacilities: function(){
                deferred = q.defer();
                deferred.resolve({
					facilities: 'control'
				});
                return deferred.promise;
            }
        };
        spyOn(addFacilityLeaderModalService, 'getFacilities').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
			privilege: 'admin'
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('deleteFacilityModalController', {
            $scope: scope,
			deleteFacilityModalService: deleteFacilityModalService,
			addFacilityLeaderModalService: addFacilityLeaderModalService
        });
    }));

    describe('getFacilities Test', function(){
    	it('should set scope.facilities to its correct value after addFacilityLeaderModalService.getFacilities() return success', function(){
			scope.facilities = 'soap';
			scope.getFacilities();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.facilities).toEqual('control');
		});
	});

    describe('checkDeleteFacilityInput Test', function(){
		it('should set scope.showDeleteFacilityErrors to its correct value and return false', function(){
			scope.deleteFacilityObject = {
				facilityId: null
			};
			scope.showDeleteFacilityErrors = {
				facilityId: false
			};
			expect(scope.checkDeleteFacilityInput()).toBeFalsy();
			expect(scope.showDeleteFacilityErrors).toEqual({
				facilityId: true
			});
		});
		it('should not change scope.showDeleteFacilityErrors and return true', function(){
			scope.deleteFacilityObject = {
				facilityId: 123
			};
			scope.showDeleteFacilityErrors = {
				facilityId: false
			};
			expect(scope.checkDeleteFacilityInput()).toBeTruthy();
			expect(scope.showDeleteFacilityErrors).toEqual({
				facilityId: false
			});
		});
	});

    describe('resetDeleteFacilityErrors Test', function(){
    	it('should reset scope.showDeleteFacilityErrors', function(){
    		scope.showDeleteFacilityErrors = {
				facilityId: true
			};
			scope.resetDeleteFacilityErrors();
			expect(scope.showDeleteFacilityErrors).toEqual({
				facilityId: false
			});
		});
	});

    describe('deleteFacility Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetDeleteFacilityErrors() and ' +
		   'scope.checkDeleteFacilityInput().  It should then set scope.deleteFacilityObject to its correct value and call scope.getFacilities() ' +
		   'after deleteFacilityModalService.delete() returns success', function(){
    		scope.deleteFacilityObject = {
    			facilityId: 45
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetDeleteFacilityErrors');
    		spyOn(scope, 'checkDeleteFacilityInput').and.returnValue(true);
    		spyOn(scope, 'getFacilities');
    		scope.deleteFacility();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetDeleteFacilityErrors).toHaveBeenCalled();
    		expect(scope.checkDeleteFacilityInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(deleteFacilityModalService.delete).toHaveBeenCalledWith(45);
    		expect(scope.getFacilities).toHaveBeenCalled();
    		expect(scope.deleteFacilityObject).toEqual({
				facilityId: null
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});