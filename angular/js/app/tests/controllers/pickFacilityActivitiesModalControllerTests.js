describe('pickFacilityActivitiesModalController Test Suite', function(){

    var q, deferred, scope, rootScope, window, addFacilityLeaderModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
        module(function($provide){
        	$provide.value('$window', {
                location: {
                	href: ''
                }
            });
		});
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
    beforeEach(inject(function($controller, $rootScope, $q, $window, $injector){
    	scope = $rootScope.$new();
    	rootScope = $rootScope;
    	rootScope.user = {
    		privilege: 'admin'
		};
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('pickFacilityActivitiesModalController', {
            $scope: scope,
			addFacilityLeaderModalService: addFacilityLeaderModalService
        });
    }));

    describe('getFacilities Test', function(){
    	it('should set scope.facilities to its correct value after addFacilityLeaderModalService.getFacilities() returns success', function(){
			scope.facilities = 'turn';
			scope.getFacilities();
			scope.$apply();
			expect(addFacilityLeaderModalService.getFacilities).toHaveBeenCalled();
			expect(scope.facilities).toEqual('insecure');
		});
	});

    describe('$watch selectedFacilityId Test', function(){
    	it('should set window.location.href to its correct value', function(){
    		scope.selectedFacilityId = 2;
			scope.$apply();
			scope.selectedFacilityId = 3;
			scope.$apply();
			expect(window.location.href).toEqual('/facility/3/activities');
		});
	});

});