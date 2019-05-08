describe('expiringContractsModalController Test Suite', function(){

    var q, deferred, scope, addFacilityLeaderModalService;

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
					facilities: 'insecure'
				});
                return deferred.promise;
            }
        };
        spyOn(addFacilityLeaderModalService, 'getFacilities').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('expiringContractsModalController', {
            $scope: scope,
			addFacilityLeaderModalService: addFacilityLeaderModalService
        });
    }));

    describe('getExpiringContracts Test', function(){
		it('should should set scope.getExpiringContractsInProgress to its correct value.  It should then set scope.expiringContracts to its correct value and call ' +
		   'scope.filterExpiringContracts() after addFacilityLeaderModalService.getFacilities() return success', function(){
			scope.getExpiringContractsInProgress = false;
			scope.expiringContracts = 'fear';
			spyOn(scope, 'filterExpiringContracts');
			scope.getExpiringContracts();
			expect(scope.getExpiringContractsInProgress).toBeTruthy();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.expiringContracts).toEqual('insecure');
			expect(scope.filterExpiringContracts).toHaveBeenCalled();
			expect(scope.getExpiringContractsInProgress).toBeFalsy();
		});
	});

    describe('filterExpiringContracts Test', function(){
    	it('should set scope.expiringContractsToShow to its correct value', function(){
    		scope.beforeDate = '2018-04-01';
    		scope.expiringContracts = [{
    			name: 'a',
				contract_expiration_date: '2018-03-01'
			}, {
    			name: 'b',
				contract_expiration_date: '2018-03-21'
			}, {
    			name: 'c',
				contract_expiration_date: '2018-08-01'
			}];
    		scope.filterExpiringContracts();
    		expect(scope.expiringContractsToShow).toEqual([{
    			name: 'a',
				contract_expiration_date: '2018-03-01'
			}, {
    			name: 'b',
				contract_expiration_date: '2018-03-21'
			}]);
		});
	});

    describe('$watch beforeDate Test', function(){
    	it('should call scope.filterExpiringContracts()', function(){
    		scope.beforeDate = '2018-09-09';
    		spyOn(scope, 'filterExpiringContracts');
    		scope.$apply();
    		expect(scope.filterExpiringContracts).toHaveBeenCalled();
		});
	});

});