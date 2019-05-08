describe('authController Test Suite', function(){

    var q, rootScope, scope, location, window, deferred, authService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        authService = {
            login: function(){
                deferred = q.defer();
                deferred.resolve({
					user: {
						id: 1,
						first_name: 'jessica',
						last_name: 'lee',
						email: 'jessica@yahoo.com',
						username: 'jessica',
						facility_id: 2,
						privilege: 'admin',
						token: 'token1234'
					}
                });
                return deferred.promise;
            },
            authAPIToken: function(){
                deferred = q.defer();
                deferred.resolve({
					user: {
						id: 2,
						first_name: 'sarah',
						last_name: 'lee',
						facility_id: 2,
						privilege: 'admin',
						email: 'sarah@yahoo.com',
						username: 'sarah'
					}
				});
                return deferred.promise;
            },
            logout: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(authService, 'login').and.callThrough();
        spyOn(authService, 'authAPIToken').and.callThrough();
        spyOn(authService, 'logout').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $location, $window, $q, $injector){
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('authController', {
            $scope: scope,
            authService: authService
        });
    }));

    describe('resetLoginInputs Test', function(){
    	it('should set scope.login to its correct value', function(){
    		scope.loginObject = {
    			username: 'akdfj@asdg.com',
				password: 'hello'
			};
			scope.resetLoginInputs();
    		expect(scope.loginObject).toEqual({
    			username: null,
				password: null
			});
		});
	});

    describe('login Test', function(){
        it('should set scope.loginFailed to false and call scope.resetLoginInputs().  It should then set rootScope.userAuthenticated, rootScope.user, and ' +
		   'rootScope.apiToken to their correct values and call window.localStorage.setItem() after authService.login() returns success)', function(){
           	scope.loginObject = {
           		username: 'aaa',
				password: 'bbb'
			};
        	scope.loginFailed = true;
           	rootScope.userAuthenticated = false;
           	rootScope.user = 'apples';
           	rootScope.apiToken = 'hog';
           	spyOn(window.localStorage, 'setItem');
           	spyOn(scope, 'resetLoginInputs');
           	scope.login();
           	expect(scope.loginFailed).toBeFalsy();
           	expect(scope.resetLoginInputs).toHaveBeenCalled();
           	scope.$apply();
           	expect(authService.login).toHaveBeenCalledWith(scope.loginObject.username, scope.loginObject.password);
           	expect(rootScope.userAuthenticated).toBeTruthy();
           	expect(rootScope.user).toEqual({
				id: 1,
				first_name: 'jessica',
				last_name: 'lee',
				facility_id: 2,
				privilege: 'admin',
				email: 'jessica@yahoo.com',
				username: 'jessica'
			});
           	expect(rootScope.apiToken).toEqual('token1234');
           	expect(window.localStorage.setItem).toHaveBeenCalledWith('apiToken', rootScope.apiToken);
        });
    });

    describe('parseApiTokenFromUrl Test', function(){
    	it('should call location.search() and return the correct value', function(){
    		spyOn(location, 'search').and.returnValue({
				api_token: 'slimshady'
			});
    		expect(scope.parseApiTokenFromUrl()).toEqual('slimshady');
		});
	});

    describe('authAPIToken Test', function(){
        it('should set rootScope.apiToken to its correct value and call location.search().  It should set rootScope.userAuthenticated, rootScope.user and ' +
		   'scope.userAuthenticationComplete to their correct values on authService.authAPIToken() success', function(){
            rootScope.apiToken = 'garbage';
            rootScope.userAuthenticated = false;
            rootScope.user = null;
            scope.userAuthenticationComplete = false;
            spyOn(window.localStorage, 'getItem').and.returnValue('storedtoken');
            spyOn(location, 'search');
            scope.authAPIToken();
            expect(rootScope.apiToken).toEqual('storedtoken');
            expect(location.search).toHaveBeenCalled();
            scope.$apply();
            expect(authService.authAPIToken).toHaveBeenCalledWith('storedtoken');
            expect(rootScope.userAuthenticated).toBeTruthy();
            expect(rootScope.user).toEqual({
				id: 2,
				first_name: 'sarah',
				last_name: 'lee',
				facility_id: 2,
				privilege: 'admin',
				email: 'sarah@yahoo.com',
				username: 'sarah'
			});
            expect(scope.userAuthenticationComplete).toBeTruthy();
        });
        it('should set rootScope.apiToken to null and call location.search().  It should then set scope.userAuthenticationComplete to true.  authService.authAPIToken should ' +
           'not be called', function(){
            rootScope.apiToken = 'token';
            scope.userAuthenticationComplete = 'table';
            spyOn(window.localStorage, 'getItem').and.returnValue(null);
            spyOn(scope, 'parseApiTokenFromUrl').and.returnValue(undefined);
            spyOn(location, 'search');
            scope.authAPIToken();
            expect(rootScope.apiToken).toEqual(undefined);
            expect(location.search).toHaveBeenCalled();
            expect(scope.userAuthenticationComplete).toBeTruthy();
            scope.$apply();
            expect(authService.authAPIToken).not.toHaveBeenCalled();
        });
        it('should set rootScope.apiToken to its correct value and then set rootScope.userAuthenticated, rootScope.user, and scope.userAuthenticationComplete ' +
		   'to their correct values on authService.authAPIToken() success.  It should also call scope.parseApiTokenFromUrl(), window.localStorage.setItem(), and ' +
		   'location.search()', function(){
			rootScope.apiToken = 'garbage';
            rootScope.userAuthenticated = false;
            rootScope.user = 'asdfa';
            scope.userAuthenticationComplete = false;
            spyOn(window.localStorage, 'getItem').and.returnValue(null);
            spyOn(scope, 'parseApiTokenFromUrl').and.returnValue('newvalue');
            spyOn(window.localStorage, 'setItem');
            spyOn(location, 'search');
            scope.authAPIToken();
            expect(scope.parseApiTokenFromUrl).toHaveBeenCalled();
            expect(rootScope.apiToken).toEqual('newvalue');
            expect(window.localStorage.setItem).toHaveBeenCalledWith('apiToken', 'newvalue');
            expect(location.search).toHaveBeenCalledWith('api_token', null);
            scope.$apply();
            expect(authService.authAPIToken).toHaveBeenCalledWith('newvalue');
            expect(rootScope.userAuthenticated).toBeTruthy();
            expect(rootScope.user).toEqual({
				id: 2,
				first_name: 'sarah',
				last_name: 'lee',
				facility_id: 2,
				privilege: 'admin',
				email: 'sarah@yahoo.com',
				username: 'sarah'
			});
            expect(scope.userAuthenticationComplete).toBeTruthy();
		});
    });

    describe('logout Test', function(){
        it('should call authService.logout() and then set scope.userAuthenticationComplete ' +
           'and rootScope.userAuthenticated to their correct values.  It should also call window.localStorage.removeItem() and scope.redirectToHomePage()', function(){
            scope.userAuthenticationComplete = false;
            rootScope.userAuthenticated = true;
            spyOn(window.localStorage, 'removeItem');
            spyOn(scope, 'redirectToHomePage');
            scope.logout();
            scope.$apply();
            expect(authService.logout).toHaveBeenCalled();
            expect(window.localStorage.removeItem).toHaveBeenCalledWith('apiToken');
            expect(scope.userAuthenticationComplete).toBeTruthy();
            expect(rootScope.userAuthenticated).toBeFalsy();
            expect(scope.redirectToHomePage).toHaveBeenCalled();
        });
    });

    describe('toggleLogout Test', function(){
    	it('should set scope.showLogout to its opposite value', function(){
    		scope.showLogout = true;
    		scope.toggleLogout();
    		expect(scope.showLogout).toBeFalsy();
		});
	});

    describe('toggleModal Test', function(){
    	it('should set rootScope.showModal, scope.callSuccess, and rootScope.largeSizeModal to their correct values and reset rootScope.showModalView', function(){
    		rootScope.showModal = true;
    		rootScope.showModalView = {
    			cabbage: true,
				desk: false
			};
    		scope.callSuccess = true;
    		rootScope.largeSizeModal = true;
    		rootScope.toggleModal();
    		expect(rootScope.showModal).toBeFalsy();
    		expect(rootScope.showModalView).toEqual({
				cabbage: false,
				desk: false
			});
    		expect(scope.callSuccess).toBeFalsy();
    		expect(rootScope.largeSizeModal).toBeFalsy();
		});
    	it('should set rootScope.showModal and rootScope.largeSizeModal to their correct values', function(){
    		rootScope.showModal = false;
    		rootScope.largeSizeModal = false;
    		rootScope.toggleModal(true);
    		expect(rootScope.showModal).toBeTruthy();
    		expect(rootScope.largeSizeModal).toBeTruthy();
		});
	});

});