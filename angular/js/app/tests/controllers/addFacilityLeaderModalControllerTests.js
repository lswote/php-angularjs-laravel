describe('addFacilityLeaderModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addFacilityLeaderModalService;

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
					facilities: 'shampoo'
				});
                return deferred.promise;
			},
        	addFacilityLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(addFacilityLeaderModalService, 'getFacilities').and.callThrough();
        spyOn(addFacilityLeaderModalService, 'addFacilityLeader').and.callThrough();
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
        $controller('addFacilityLeaderModalController', {
            $scope: scope,
			addFacilityLeaderModalService: addFacilityLeaderModalService
        });
    }));

    describe('getFacilities Test', function(){
    	it('should set scope.facilities to its correct value after addFacilityLeaderModalService.getFacilities() returns success', function(){
			scope.facilities = 'soap';
			scope.getFacilities();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.facilities).toEqual('shampoo');
		});
	});
    
    describe('checkAddFacilityLeaderInput Test', function(){
		it('should set scope.showAddFacilityLeaderErrors to its correct value and return false', function(){
			scope.addFacilityLeaderObject = {
				facilityId: 1,
				firstName: null,
				lastName: 'asd',
				email: null,
				username: null,
				password: 'adf',
				confirmPassword: 'adff'
			};
			scope.showAddFacilityLeaderErrors = {
				facilityId: false,
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				password: false,
				confirmPassword: false
			};
			expect(scope.checkAddFacilityLeaderInput()).toBeFalsy();
			expect(scope.showAddFacilityLeaderErrors).toEqual({
				facilityId: false,
				firstName: true,
				lastName: false,
				email: true,
				username: true,
				password: false,
				confirmPassword: true
			});
		});
		it('should not change scope.showAddFacilityLeaderErrors and return true', function(){
			scope.addFacilityLeaderObject = {
				facilityId: 1,
				firstName: 'asdf',
				lastName: 'asd',
				email: 'adf@adsg.com',
				username: 'laksjfd',
				password: 'adf',
				confirmPassword: 'adf'
			};
			scope.showAddFacilityLeaderErrors = {
				facilityId: false,
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				password: false,
				confirmPassword: false
			};
			expect(scope.checkAddFacilityLeaderInput()).toBeTruthy();
			expect(scope.showAddFacilityLeaderErrors).toEqual({
				facilityId: false,
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				password: false,
				confirmPassword: false
			});
		});
	});

    describe('resetAddFacilityLeaderErrors Test', function(){
    	it('should reset scope.showAddFacilityLeaderErrors', function(){
    		scope.showAddFacilityLeaderErrors = {
    			facilityId: true,
				firstName: true,
				lastName: true,
				email: false,
				password: true,
				confirmPassword: false
			};
			scope.resetAddFacilityLeaderErrors();
			expect(scope.showAddFacilityLeaderErrors).toEqual({
				facilityId: false,
				firstName: false,
				lastName: false,
				email: false,
				password: false,
				confirmPassword: false
			});
		});
	});

    describe('addFacilityLeader Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddFacilityLeaderErrors() and scope.checkAddFacilityLeaderInput().  ' +
		   'It should then set scope.addFacilityLeaderObject to its correct value after addFacilityLeaderModalService.addFacilityLeader() returns success', function(){
    		scope.addFacilityLeaderObject = {
    			facilityId: 44,
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddFacilityLeaderErrors');
    		spyOn(scope, 'checkAddFacilityLeaderInput').and.returnValue(true);
    		scope.addFacilityLeader();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddFacilityLeaderErrors).toHaveBeenCalled();
    		expect(scope.checkAddFacilityLeaderInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(addFacilityLeaderModalService.addFacilityLeader).toHaveBeenCalledWith({
				facilityId: 44,
				egg: 'white'
			});
    		expect(scope.addFacilityLeaderObject).toEqual({
				firstName: null,
				lastName: null,
				email: null,
				username: null,
				password: null,
				confirmPassword: null
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});