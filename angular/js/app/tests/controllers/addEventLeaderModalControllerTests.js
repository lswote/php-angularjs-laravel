describe('addEventLeaderModalController Test Suite', function(){

    var q, deferred, scope, rootScope, addEventLeaderModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        addEventLeaderModalService = {
        	addEventLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(addEventLeaderModalService, 'addEventLeader').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('addEventLeaderModalController', {
            $scope: scope,
			addEventLeaderModalService: addEventLeaderModalService
        });
    }));

    describe('checkAddEventLeaderInput Test', function(){
		it('should set scope.showAddEventLeaderErrors to its correct value and return false', function(){
			scope.addEventLeaderObject = {
				username: null
			};
			scope.showAddEventLeaderErrors = {
				username: false
			};
			expect(scope.checkAddEventLeaderInput()).toBeFalsy();
			expect(scope.showAddEventLeaderErrors).toEqual({
				username: true
			});
		});
		it('should not change scope.showAddEventLeaderErrors and return true', function(){
			scope.addEventLeaderObject = {
				username: 'adf@adsg.com'
			};
			scope.showAddEventLeaderErrors = {
				username: false
			};
			expect(scope.checkAddEventLeaderInput()).toBeTruthy();
			expect(scope.showAddEventLeaderErrors).toEqual({
				username: false
			});
		});
	});

    describe('resetAddEventLeaderErrors Test', function(){
    	it('should reset scope.showAddEventLeaderErrors', function(){
    		scope.showAddEventLeaderErrors = {
				username: true
			};
			scope.resetAddEventLeaderErrors();
			expect(scope.showAddEventLeaderErrors).toEqual({
				username: false
			});
		});
	});

    describe('addEventLeader Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetAddEventLeaderErrors() and scope.checkAddEventLeaderInput().  ' +
		   'It should then set scope.addEventLeaderObject to its correct value after addEventLeaderModalService.addEventLeader() returns success', function(){
    		rootScope.selectedEvent = {
    			id: 4
			};
    		scope.addEventLeaderObject = {
    			egg: 'white'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetAddEventLeaderErrors');
    		spyOn(scope, 'checkAddEventLeaderInput').and.returnValue(true);
    		scope.addEventLeader();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetAddEventLeaderErrors).toHaveBeenCalled();
    		expect(scope.checkAddEventLeaderInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(addEventLeaderModalService.addEventLeader).toHaveBeenCalledWith(rootScope.selectedEvent.id, {
				egg: 'white'
			});
    		expect(scope.addEventLeaderObject).toEqual({
				username: null
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});