describe('createFacilityModalController Test Suite', function(){

    var q, deferred, scope, rootScope, createFacilityModalService, addFacilityLeaderModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        createFacilityModalService = {
            create: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(createFacilityModalService, 'create').and.callThrough();
        addFacilityLeaderModalService = {
            getFacilities: function(){
            	deferred = q.defer();
                deferred.resolve({
					facilities: 'shampoo'
				});
                return deferred.promise;
			}
        };
        spyOn(addFacilityLeaderModalService, 'getFacilities').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('createFacilityModalController', {
            $scope: scope,
			createFacilityModalService: createFacilityModalService,
			addFacilityLeaderModalService: addFacilityLeaderModalService
        });
    }));

    describe('checkCreateFacilityInput Test', function(){
		it('should set scope.showCreateFacilityErrors to its correct value and return false', function(){
			scope.createFacilityObject = {
				name: null,
				address: 'tennis',
				city: 'social',
				state: null,
				zip: null,
				parentId: -1,
				contractExpirationDate: null,
				contractExpirationDateDisplay: null,
				paypalLink: null
			};
			scope.showCreateFacilityErrors = {
				name: false
			};
			expect(scope.checkCreateFacilityInput()).toBeFalsy();
			expect(scope.showCreateFacilityErrors).toEqual({
				name: true
			});
		});
		it('should not change scope.showCreateFacilityErrors and return true', function(){
			scope.createFacilityObject = {
				name: 'new name',
				address: 'tennis',
				city: 'social',
				state: null,
				zip: null,
				parentId: -1,
				contractExpirationDate: null,
				contractExpirationDateDisplay: null,
				paypalLink: null
			};
			scope.showCreateFacilityErrors = {
				name: false
			};
			expect(scope.checkCreateFacilityInput()).toBeTruthy();
			expect(scope.showCreateFacilityErrors).toEqual({
				name: false
			});
		});
	});

    describe('resetCreateFacilityErrors Test', function(){
    	it('should reset scope.showCreateFacilityErrors', function(){
    		scope.showCreateFacilityErrors = {
    			titanium: true,
				brick: true
			};
			scope.resetCreateFacilityErrors();
			expect(scope.showCreateFacilityErrors).toEqual({
				titanium: false,
				brick: false
			});
		});
	});

    describe('getFacilities Test', function(){
    	it('should set scope.getFacilitiesInProgress to its correct value.  It should then set scope.facilities to its correct value after ' +
		   'addFacilityLeaderModalService.getFacilities() returns success', function(){
    		scope.getFacilitiesInProgress = false;
			scope.facilities = 'turn';
			scope.getFacilities();
			expect(scope.getFacilitiesInProgress).toBeTruthy();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.facilities).toEqual('shampoo');
			expect(scope.getFacilitiesInProgress).toBeFalsy();
		});
	});

    describe('createFacility Test', function(){
    	it('should set scope.callInProgress, scope.callSuccess to their correct values and call scope.resetCreateFacilityErrors() and scope.checkCreateFacilityInput().  It ' +
		   'should then set scope.createFacilityObject to its correct value after createFacilityModalService.create() returns success', function(){
    		scope.createFacilityObject = {
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetCreateFacilityErrors');
    		spyOn(scope, 'checkCreateFacilityInput').and.returnValue(true);
    		spyOn(scope, 'getDate').and.returnValue('cheese');
    		scope.createFacility();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetCreateFacilityErrors).toHaveBeenCalled();
    		expect(scope.checkCreateFacilityInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(createFacilityModalService.create).toHaveBeenCalledWith({
				egg: 'white'
			});
    		expect(scope.createFacilityObject).toEqual({
				name: null,
				address: null,
				city: null,
				state: 'GA',
				zip: null,
				parentId: null,
				contractExpirationDate: 'cheese',
				contractExpirationDateDisplay: 'cheeseT24:00:00.000Z',
				paypalLink: null
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});