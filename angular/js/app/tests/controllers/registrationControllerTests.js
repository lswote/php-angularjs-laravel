describe('registrationController Test Suite', function(){

    var q, rootScope, scope, location, window, deferred, registrationService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        registrationService = {
            register: function(){
                deferred = q.defer();
                deferred.resolve({
					user: {
						id: 1,
						first_name: 'beth',
						last_name: 'lee',
						privilege: 'admin',
						email: 'beth@yahoo.com',
						username: 'beth',
						token: '1234'
					}
                });
                return deferred.promise;
            }
        };
        spyOn(registrationService, 'register').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $location, $window, $q, $injector){
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('registrationController', {
            $scope: scope,
            registrationService: registrationService
        });
    }));

    describe('checkInputs Test', function(){
    	it('should set scope.errors to its correct value and return the correct value', function(){
    		scope.errors = {
				token: false,
				emailRequired: false,
				usernameRequired: false,
				usernameTaken: false,
				password: false,
				firstName: false,
				lastName: false
			};
    		scope.token = 'one';
    		scope.email = null;
    		scope.username = null;
    		scope.password = '12345';
    		scope.firstName = null;
    		scope.lastName = null;
    		expect(scope.checkInputs()).toBeFalsy();
    		expect(scope.errors).toEqual({
				token: false,
				emailRequired: true,
				usernameRequired: true,
				usernameTaken: false,
				password: true,
				firstName: true,
				lastName: true
			});
		});
	});

    describe('resetErrors Test', function(){
    	it('should set scope.errors to its correct value', function(){
    		scope.errors = {
    			token: false,
				emailRequired: true,
				usernameRequired: true,
				usernameTaken: true,
				password: true,
				firstName: true,
				lastName: true
			};
    		scope.resetErrors();
    		expect(scope.errors).toEqual({
				token: false,
				emailRequired: false,
				usernameRequired: false,
				usernameTaken: false,
				password: false,
				firstName: false,
				lastName: false
			});
		});
	});

    describe('register Test', function(){
    	it('should call scope.resetErrors() and scope.checkInputs() and set scope.registerInProgress to its correct value.  It should set rootScope.userAuthenticated, ' +
		   'rootScope.user, rootScope.apiToken, rootScope.currentPath, and scope.registerInProgress to their correct values and call window.localStorage.setItem() ' +
		   'and location.path()', function(){
    		scope.token = 'token';
    		scope.email = 'base@yahoo.com';
    		scope.username = 'base';
    		scope.password = 'password';
    		scope.firstName = 'nancy';
    		scope.lastName = 'gunther';
    		scope.registerInProgress = false;
    		rootScope.userAuthenticated = false;
    		rootScope.user = 'egg';
    		rootScope.apiToken = '3333';
    		rootScope.currentPath = 'dadsf';
    		spyOn(scope, 'resetErrors');
    		spyOn(scope, 'checkInputs').and.returnValue(true);
    		spyOn(window.localStorage, 'setItem');
    		spyOn(location, 'path');
    		scope.register();
    		expect(scope.resetErrors).toHaveBeenCalled();
    		expect(scope.checkInputs).toHaveBeenCalled();
    		expect(scope.registerInProgress).toBeTruthy();
    		scope.$apply();
    		expect(registrationService.register).toHaveBeenCalledWith(scope.token, scope.email, scope.username, scope.password, scope.firstName, scope.lastName);
    		expect(rootScope.userAuthenticated).toBeTruthy();
    		expect(rootScope.user).toEqual({
				id: 1,
				first_name: 'beth',
				last_name: 'lee',
				privilege: 'admin',
				email: 'beth@yahoo.com',
				username: 'beth'
			});
    		expect(rootScope.apiToken).toEqual('1234');
    		expect(window.localStorage.setItem).toHaveBeenCalledWith('apiToken', '1234');
    		expect(rootScope.currentPath).toEqual('/');
    		expect(location.path).toHaveBeenCalledWith('/');
    		expect(scope.registerInProgress).toBeFalsy();
		});
	});

    describe('parseUrlTokenParam Test', function(){
    	it('should set scope.token to its correct value', function(){
    		location.search = {
    			token: 'car'
			};
    		scope.parseUrlTokenParam();
    		expect(scope.token).toEqual(location.search.token);
		});
	});

});