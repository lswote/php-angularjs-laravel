describe('editFacilityModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addFacilityLeaderModalService, editFacilityModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
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
        editFacilityModalService = {
        	update: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(editFacilityModalService, 'update').and.callThrough();
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
        $controller('editFacilityModalController', {
            $scope: scope,
			addFacilityLeaderModalService: addFacilityLeaderModalService,
			editFacilityModalService: editFacilityModalService
        });
    }));

    describe('filterFacilities Test', function(){
    	it('should set scope.foundFacilities to its correct value', function(){
    		scope.searchTerm = 'could';
    		scope.facilities = [{
    			name: 'say what'
			}, {
    			name: 'could have'
			}];
    		scope.foundFacilities = 'take my time';
    		scope.filterFacilities();
    		expect(scope.foundFacilities).toEqual([{
    			name: 'could have'
			}]);
		});
    	it('should set scope.foundFacilities to an empty array', function(){
    		scope.searchTerm = 'is a chance';
    		scope.facilities = [{
    			name: 'say what'
			}, {
    			name: 'could have'
			}];
    		scope.foundFacilities = 'take my time';
    		scope.filterFacilities();
    		expect(scope.foundFacilities).toEqual([]);
		});
	});

    describe('getFacilities Test', function(){
    	it('should set scope.getFacilitiesInProgress to its correct value.  It should then set scope.facilities to its correct value and call scope.filterFacilities() ' +
		   'after addFacilityLeaderModalService.getFacilities() returns success', function(){
			scope.getFacilitiesInProgress = false;
    		scope.facilities = 'soap';
    		spyOn(scope, 'filterFacilities');
			scope.getFacilities();
			expect(scope.getFacilitiesInProgress).toBeTruthy();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.facilities).toEqual('control');
			expect(scope.filterFacilities).toHaveBeenCalled();
			expect(scope.getFacilitiesInProgress).toBeFalsy();
		});
	});

    describe('$watch searchTerm Test', function(){
    	it('should call scope.filterFacilities()', function(){
    		scope.searchTerm = 'hello';
    		spyOn(scope, 'filterFacilities');
    		scope.$apply();
    		expect(scope.filterFacilities.calls.count()).toEqual(1);
    		scope.searchTerm = 'hold';
    		scope.$apply();
    		expect(scope.filterFacilities.calls.count()).toEqual(2);
		});
	});

    describe('toggleView Test', function(){
    	it('should set scope.showView, scope.selectedFacilityId, scope.selectedFacility, scope.parentName, and scope.contractExpirationDateDisplay to their correct ' +
		   'values', function(){
    		var facility = {
    			id: 22,
				contract_expiration_date: 'aaaa',
				parent_id: 3
			};
    		scope.facilities = [{
    			id: 3,
				name: 'wwww'
			}];
    		scope.showView = 'listing';
    		scope.selectedFacility = 'adsfkadf';
    		scope.parentName = 234;
    		scope.contractExpirationDateDisplay = 'ice cream';
    		scope.toggleView(facility);
    		expect(scope.showView).toEqual('update-form');
    		expect(scope.selectedFacility).toEqual({
				id: 22,
				contract_expiration_date: 'aaaa',
				parent_id: 3
			});
    		expect(scope.parentName).toEqual('wwww');
    		expect(scope.contractExpirationDateDisplay).toEqual(facility.contract_expiration_date + 'T24:00:00.000Z');
		});
    	it('should set scope.showView to its correct value', function(){
    		var facility = {
    			id: 22,
				contract_expiration_date: 'aaaa'
			};
    		scope.showView = 'update-form';
    		scope.toggleView(facility);
    		expect(scope.showView).toEqual('listing');
		});
	});

    describe('update Test', function(){
    	it('should set scope.callInProgress, scope.callSuccess, and scope.selectedFacility to their correct values.  It should then set scope.searchTerm to its correct ' +
		   'value and call scope.getFacilities() and scope.toggleView() after editFacilityModalService.update() returns success', function(){
    		scope.facilities = [{
    			id: 1,
				name: 'a2'
			}];
    		scope.parentName = 'a2';
    		scope.selectedFacility = 'wwwwwaaaaa';
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		scope.selectedFacility = {};
    		scope.searchTerm = 'wwww';
    		spyOn(scope, 'getFacilities');
    		spyOn(scope, 'toggleView');
    		spyOn(scope, 'filterFacilities');
   			scope.update();
   			expect(scope.callInProgress).toBeTruthy();
   			expect(scope.callSuccess).toBeFalsy();
   			expect(scope.selectedFacility).toEqual({
				parent_id: 1
			});
   			scope.$apply();
   			expect(editFacilityModalService.update).toHaveBeenCalledWith(scope.selectedFacility);
   			expect(scope.getFacilities).toHaveBeenCalled();
   			expect(scope.searchTerm).toBeNull();
   			expect(scope.toggleView).toHaveBeenCalled();
   			expect(scope.callSuccess).toBeTruthy();
   			expect(scope.callInProgress).toBeFalsy();
		});
	});

});