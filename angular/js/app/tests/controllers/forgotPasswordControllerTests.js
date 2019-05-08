describe('forgotPasswordController Test Suite', function(){

    var q, rootScope, scope, location, window, deferred, forgotPasswordService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        forgotPasswordService = {
            sendEmail: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(forgotPasswordService, 'sendEmail').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $location, $window, $q, $injector){
        rootScope = $rootScope;
        scope = $rootScope.$new();
        location = $location;
        q = $q;
        window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('forgotPasswordController', {
            $scope: scope,
            forgotPasswordService: forgotPasswordService
        });
    }));

    describe('checkInputs Test', function(){
    	it('should set scope.errors to its correct value and return the correct value', function(){
    		scope.errors = {
				username: false
			};
    		scope.username = null;
    		expect(scope.checkInputs()).toBeFalsy();
    		expect(scope.errors).toEqual({
				username: true
			});
		});
	});

    describe('resetErrors Test', function(){
    	it('should set scope.errors to its correct value', function(){
    		scope.errors = {
				username: true
			};
    		scope.resetErrors();
    		expect(scope.errors).toEqual({
				username: false
			});
		});
	});

    describe('sendEmail Test', function(){
    	it('should call scope.resetErrors() and scope.checkInputs() and set scope.sendEmailInProgress to its correct value.  It should then set rootScope.currentPath ' +
		   'to its correct value and call window.alert() and location.path() after forgotPasswordService.sendEmail() returns success', function(){
    		scope.username = 'base';
    		scope.sendEmailInProgress = false;
    		rootScope.currentPath = 'dadsf';
    		spyOn(scope, 'resetErrors');
    		spyOn(scope, 'checkInputs').and.returnValue(true);
    		spyOn(window, 'alert');
    		spyOn(location, 'path');
    		scope.sendEmail();
    		expect(scope.resetErrors).toHaveBeenCalled();
    		expect(scope.checkInputs).toHaveBeenCalled();
    		expect(scope.sendEmailInProgress).toBeTruthy();
    		scope.$apply();
    		expect(forgotPasswordService.sendEmail).toHaveBeenCalledWith(scope.username);
    		expect(window.alert).toHaveBeenCalledWith('Thank you.  A reset e-mail has been sent to your inbox.');
    		expect(rootScope.currentPath).toEqual('/');
    		expect(location.path).toHaveBeenCalledWith('/');
    		expect(scope.sendEmailInProgress).toBeFalsy();
		});
	});

});