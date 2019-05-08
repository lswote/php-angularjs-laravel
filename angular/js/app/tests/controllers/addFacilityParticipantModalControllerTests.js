describe('addFacilityParticipantModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addFacilityParticipantModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        addFacilityParticipantModalService = {
            addFacilityParticipant: function(){
            	deferred = q.defer();
                deferred.resolve({
					facilities: 'shampoo'
				});
                return deferred.promise;
			}
        };
        spyOn(addFacilityParticipantModalService, 'addFacilityParticipant').and.callThrough();
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
        $controller('addFacilityParticipantModalController', {
            $scope: scope,
			addFacilityParticipantModalService: addFacilityParticipantModalService
        });
    }));
    
    describe('checkAddFacilityParticipantInput Test', function(){
		it('should set scope.addFacilityParitcipantErrors to its correct value and return false', function(){
			scope.addFacilityParticipantObject = {
				firstName: null,
				lastName: null,
				gender: 'male',
				email: 'brown@yahoo.com',
				username: 'stay',
				phone: null,
				room: null,
				password: null,
				membershipType: 'member',
				active: '1',
				ageType: 'adult'
			};
			scope.addFacilityParitcipantErrors = {
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				usernameTaken: false,
				password: false
			};
			expect(scope.checkAddFacilityParticipantInput()).toBeFalsy();
			expect(scope.addFacilityParitcipantErrors).toEqual({
				firstName: true,
				lastName: true,
				email: false,
				username: false,
				usernameTaken: false,
				password: true
			});
		});
		it('should not change scope.addFacilityParitcipantErrors and return true', function(){
			scope.addFacilityParticipantObject = {
				firstName: 'sarah',
				lastName: 'smith',
				gender: 'male',
				email: 'brown@yahoo.com',
				username: 'stop',
				phone: '8011111',
				room: 420,
				password: 'password',
				membershipType: 'member',
				active: '1',
				ageType: 'adult'
			};
			scope.addFacilityParitcipantErrors = {
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				usernameTaken: false,
				password: false
			};
			expect(scope.checkAddFacilityParticipantInput()).toBeTruthy();
			expect(scope.addFacilityParitcipantErrors).toEqual({
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				usernameTaken: false,
				password: false
			});
		});
	});

    describe('resetAddFacilityParticipantErrors Test', function(){
    	it('should reset scope.addFacilityParitcipantErrors', function(){
    		scope.addFacilityParitcipantErrors = {
    			firstName: false,
				lastName: true,
				email: true,
				username: true,
				usernameTaken: true,
				password: false
			};
			scope.resetAddFacilityParticipantErrors();
			expect(scope.addFacilityParitcipantErrors).toEqual({
				firstName: false,
				lastName: false,
				email: false,
				username: false,
				usernameTaken: false,
				password: false
			});
		});
	});

    describe('addFacilityParticipant Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddFacilityParticipantErrors() and ' +
		   'scope.checkAddFacilityParticipantInput().  It should then set scope.addFacilityParticipantObject to its correct value after ' +
		   'addFacilityParticipantModalService.addFacilityParticipant() returns success', function(){
    		scope.addFacilityParticipantObject = {
    			facilityId: 44,
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddFacilityParticipantErrors');
    		spyOn(scope, 'checkAddFacilityParticipantInput').and.returnValue(true);
    		scope.addFacilityParticipant();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddFacilityParticipantErrors).toHaveBeenCalled();
    		expect(scope.checkAddFacilityParticipantInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(addFacilityParticipantModalService.addFacilityParticipant).toHaveBeenCalledWith({
				facilityId: 44,
				egg: 'white'
			});
    		expect(scope.addFacilityParticipantObject).toEqual({
				firstName: null,
				lastName: null,
				gender: 'male',
				email: null,
				username: null,
				phone: null,
				room: null,
				password: null,
				membershipType: 'member',
				active: '1',
				ageType: 'adult'
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});