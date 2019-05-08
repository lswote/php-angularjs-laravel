describe('changePasswordModalController Test Suite', function(){

    var q, deferred, scope, rootScope, changePasswordModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        changePasswordModalService = {
            changePassword: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(changePasswordModalService, 'changePassword').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('changePasswordModalController', {
            $scope: scope,
			changePasswordModalService: changePasswordModalService
        });
    }));

    describe('checkChangePasswordInputs Test', function(){
		it('should set scope.changePasswordErrors to its correct value and return false', function(){
			scope.changePasswordObject = {
				currentPassword: null,
				newPassword: 'password',
				newPasswordConfirm: null
			};
			scope.changePasswordErrors = {
                currentPassword: false,
				newPassword: false,
				newPasswordConfirm: false
			};
			expect(scope.checkChangePasswordInputs()).toBeFalsy();
			expect(scope.changePasswordErrors).toEqual({
				currentPassword: true,
				newPassword: false,
				newPasswordConfirm: true
			});
		});
		it('should not change scope.changePasswordErrors and return true', function(){
			scope.changePasswordObject = {
				currentPassword: 'aaaa',
				newPassword: 'password',
				newPasswordConfirm: 'password'
			};
			scope.changePasswordErrors = {
                currentPassword: false,
				newPassword: false,
				newPasswordConfirm: false
			};
			expect(scope.checkChangePasswordInputs()).toBeTruthy();
			expect(scope.changePasswordErrors).toEqual({
                currentPassword: false,
				newPassword: false,
				newPasswordConfirm: false
			});
		});
	});

    describe('resetChangePasswordErrors Test', function(){
    	it('should reset scope.showCreateEventErrors', function(){
    		scope.changePasswordErrors = {
    			currentPassword: true,
				newPassword: true,
				newPasswordConfirm: false
			};
			scope.resetChangePasswordErrors();
			expect(scope.changePasswordErrors).toEqual({
				currentPassword: false,
				newPassword: false,
				newPasswordConfirm: false
			});
		});
	});

    describe('changePassword Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetChangePasswordErrors() and scope.checkChangePasswordInputs().  ' +
		   'It should also set scope.changePasswordObject to its correct value after changePasswordModalService.changePassword() returns success', function(){
			scope.changePasswordObject = {
				currentPassword: 'egg',
				newPassword: 'blue'
			};
    		scope.callInProgress = false;
			scope.callSuccess = true;
			spyOn(scope, 'resetChangePasswordErrors');
			spyOn(scope, 'checkChangePasswordInputs').and.returnValue(true);
			scope.changePassword();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			expect(scope.resetChangePasswordErrors).toHaveBeenCalled();
			expect(scope.checkChangePasswordInputs).toHaveBeenCalled();
			scope.$apply();
			expect(changePasswordModalService.changePassword).toHaveBeenCalledWith('egg', 'blue');
			expect(scope.changePasswordObject).toEqual({
				currentPassword: null,
				newPassword: null,
				newPasswordConfirm: null
			});
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});