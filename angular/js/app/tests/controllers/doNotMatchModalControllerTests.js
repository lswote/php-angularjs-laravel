describe('doNotMatchModalController Test Suite', function(){

    var q, deferred, scope, rootScope, helperService, doNotMatchModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        helperService = {
        	findArrayIndex: function(){
        		return 1;
			}
		};
		spyOn(helperService, 'findArrayIndex').and.callThrough();
    	doNotMatchModalService = {
            getDoNotMatchRequests: function(){
            	deferred = q.defer();
                deferred.resolve({
					do_not_match_requests: 'changeit'
				});
                return deferred.promise;
			},
        	deleteRequest: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(doNotMatchModalService, 'getDoNotMatchRequests').and.callThrough();
        spyOn(doNotMatchModalService, 'deleteRequest').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
			id: 16
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('doNotMatchModalController', {
            $scope: scope,
			helperService: helperService,
			doNotMatchModalService: doNotMatchModalService
        });
    }));

    describe('getDoNotMatchRequests Test', function(){
    	it('should set scope.doNotMatchInProgres to its correct value.  It should then set scope.doNotMatchRequests to its correct value after ' +
		   'doNotMatchModalService.getDoNotMatchRequests() returns success', function(){
			scope.doNotMatchInProgres = false;
			scope.doNotMatchRequests = 'wait';
			scope.getDoNotMatchRequests();
			expect(scope.doNotMatchInProgres).toBeTruthy();
			scope.$apply();
			expect(doNotMatchModalService.getDoNotMatchRequests).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.doNotMatchRequests).toEqual('changeit');
			expect(scope.doNotMatchInProgres).toBeFalsy();
		});
	});

    describe('deleteRequest Test', function(){
    	it('should call doNotMatchModalService.deleteRequest() and set scope.doNotMatchRequests to its correct value', function(){
    		var requestId = 393;
    		scope.doNotMatchRequests = [{
    			name: 'taking'
			}, {
    			name: 'love'
			}];
    		scope.deleteRequest(requestId);
    		expect(doNotMatchModalService.deleteRequest).toHaveBeenCalledWith(requestId);
    		expect(scope.doNotMatchRequests).toEqual([{
    			name: 'taking'
			}]);
		});
	});

});