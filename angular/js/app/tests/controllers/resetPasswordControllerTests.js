describe('resetPasswordController Test Suite', function(){

    var q, rootScope, scope, location, window, deferred, resetPasswordService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        resetPasswordService = {
            reset: function(){
                deferred = q.defer();
                deferred.resolve({
					user: {
						id: 1,
						first_name: 'beth',
						last_name: 'lee',
						privilege: 'admin',
						email: 'beth@yahoo.com',
						username: 'beth',
						token: '1234',
						facility_id: 58585
					}
                });
                return deferred.promise;
            }
        };
        spyOn(resetPasswordService, 'reset').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $location, $window, $q, $injector){
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('resetPasswordController', {
            $scope: scope,
            resetPasswordService: resetPasswordService
        });
    }));

    describe('checkInputs Test', function(){
    	it('should set scope.errors to its correct value and return the correct value', function(){
    		scope.errors = {
    			token: false,
				newPassword: false,
				newPasswordConfirm: false
			};
    		scope.token = null;
    		scope.newPassword = null;
    		scope.newPasswordConfirm = null;
    		expect(scope.checkInputs()).toBeFalsy();
    		expect(scope.errors).toEqual({
				token: true,
				newPassword: true,
				newPasswordConfirm: true
			});
		});
	});

    describe('resetErrors Test', function(){
    	it('should set scope.errors to its correct value', function(){
    		scope.errors = {
    			token: true,
				newPassword: true,
				newPasswordConfirm: true
			};
    		scope.resetErrors();
    		scope.errors = {
    			token: false,
				newPassword: false,
				newPasswordConfirm: false
			};
		});
	});

    describe('reset Test', function(){
    	it('should call scope.resetErrors() and scope.checkInputs() and set scope.resetInProgress to its correct value.  It should set rootScope.userAuthenticated, ' +
		   'rootScope.user, rootScope.apiToken, and rootScope.currentPath to their correct values and call window.localStorage.setItem(), window.alert() ' +
		   'and location.path() after resetPasswordService.reset() returns success', function(){
    		scope.token = 'base1332233';
    		scope.newPassword = 'alive';
    		scope.resetInProgress = false;
    		rootScope.userAuthenticated = false;
    		rootScope.user = 'egg';
    		rootScope.apiToken = '3333';
    		rootScope.currentPath = 'dadsf';
    		spyOn(scope, 'resetErrors');
    		spyOn(scope, 'checkInputs').and.returnValue(true);
    		spyOn(window.localStorage, 'setItem');
    		spyOn(window, 'alert');
    		spyOn(location, 'path');
    		scope.reset();
    		expect(scope.resetErrors).toHaveBeenCalled();
    		expect(scope.checkInputs).toHaveBeenCalled();
    		expect(scope.resetInProgress).toBeTruthy();
    		scope.$apply();
    		expect(resetPasswordService.reset).toHaveBeenCalledWith(scope.token, scope.newPassword);
    		expect(rootScope.userAuthenticated).toBeTruthy();
    		expect(rootScope.user).toEqual({
				id: 1,
				first_name: 'beth',
				last_name: 'lee',
				privilege: 'admin',
				email: 'beth@yahoo.com',
				username: 'beth',
				facility_id: 58585
			});
    		expect(rootScope.apiToken).toEqual('1234');
    		expect(window.localStorage.setItem).toHaveBeenCalledWith('apiToken', rootScope.apiToken);
    		expect(window.alert).toHaveBeenCalledWith('Thank you.  Your password has been reset.  You have been logged in');
    		expect(rootScope.currentPath).toEqual('/');
    		expect(location.path).toHaveBeenCalledWith('/');
    		expect(scope.resetInProgress).toBeFalsy();
		});
	});

    describe('parseUrlTokenParam Test', function(){
    	it('should set scope.token to its correct value', function(){
    		spyOn(location, 'search').and.returnValue({
    			token: 'bicycle'
			});
    		scope.parseUrlTokenParam();
    		expect(scope.token).toEqual('bicycle');
		});
	});

});