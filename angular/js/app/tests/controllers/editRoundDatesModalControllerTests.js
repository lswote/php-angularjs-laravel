describe('editRoundDatesModalController Test Suite', function(){

    var q, deferred, rootScope, scope, editRoundDatesModalService, matchLineTimesModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        editRoundDatesModalService = {
            updateRoundDates: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(editRoundDatesModalService, 'updateRoundDates').and.callThrough();
        matchLineTimesModalService = {
        	getEventMatches: function(){
                deferred = q.defer();
                deferred.resolve({
					matches: 'girl'
				});
                return deferred.promise;
            }
		};
        spyOn(matchLineTimesModalService, 'getEventMatches').and.callThrough();
        helperService = {
        	findArrayIndex: function(){}
		};
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {};
        rootScope.selectedEvent = {
        	id: 55
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('editRoundDatesModalController', {
            $scope: scope,
			editRoundDatesModalService: editRoundDatesModalService,
			matchLineTimesModalService: matchLineTimesModalService,
			helperService: helperService
        });
    }));

	describe('parseMatches Test', function(){
		it('should set scope.matches and scope.rounds to their correct values', function(){
			scope.matches = [{
				event_surface_number: 4,
				date: 3,
				round: 4
			}, {
				event_surface_number: null,
				date: 5,
				round: 5
			}];
			scope.rounds = 'see';
			spyOn(helperService, 'findArrayIndex').and.returnValues(false, false);
			scope.parseMatches();
			expect(scope.matches).toEqual([{
				event_surface_number: '4',
				date: 3,
				round: 4
			}, {
				event_surface_number: '',
				date: 5,
				round: 5
			}]);
			expect(scope.rounds).toEqual([{
				number: 4,
				date: 3,
				dateObject: '3T12:00:00Z'
			}, {
				number: 5,
				date: 5,
				dateObject: '5T12:00:00Z'
			}]);
		});
	});

	describe('getMatches Test', function(){
		it('should set scope.matches to its correct value and call scope.parseMatches() after matchLineTimesModalService.getEventMatches() returns success', function(){
			scope.matches = 'do';
			spyOn(scope, 'parseMatches');
			scope.getMatches();
			scope.$apply();
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(rootScope.selectedEvent.id);
			expect(scope.matches).toEqual('girl');
			expect(scope.parseMatches).toHaveBeenCalled();
		});
	});

	describe('orderRounds Test', function(){
		it('should return the correct value', function(){
			var round = {
				number: 4
			};
			expect(scope.orderRounds(round)).toEqual(4);
		});
		it('should return the correct value', function(){
			var round = {
				number: -2
			};
			expect(scope.orderRounds(round)).toEqual(102);
		});
	});

	describe('updateRoundDates Test', function(){
		it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call editRoundDatesModalService.updateRoundDates()', function(){
			scope.rounds = 'cheese';
			scope.callInProgress = false;
			scope.callSuccess = true;
			scope.updateRoundDates();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(editRoundDatesModalService.updateRoundDates).toHaveBeenCalledWith(rootScope.selectedEvent.id, 'cheese');
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});