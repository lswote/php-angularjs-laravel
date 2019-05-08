describe('printScorecardsModalController Test Suite', function(){

    var q, deferred, scope, window, rootScope, printScorecardsModalService, matchLineTimesModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        printScorecardsModalService = {
            generateScorecard: function(){
            	deferred = q.defer();
                deferred.resolve('ever');
                return deferred.promise;
			}
        };
        spyOn(printScorecardsModalService, 'generateScorecard').and.callThrough();
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
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $window, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.selectedEvent = {
			id: 25
		};
    	scope = $rootScope.$new();
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('printScorecardsModalController', {
            $scope: scope,
			printScorecardsModalService: printScorecardsModalService,
			matchLineTimesModalService: matchLineTimesModalService,
			helperService: helperService
        });
    }));

    describe('parseMatches Test', function(){
		it('should set scope.matches, scope.roundDates, and scope.printScorecardsObject to their correct values', function(){
			scope.matches = [{
				event_surface_number: 4,
				date: 3,
				round: 2
			}, {
				event_surface_number: null,
				date: 5,
				round: 2
			}];
			scope.roundDates = 'see';
			scope.printScorecardsObject = {
				roundDate: 'hope'
			};
			spyOn(helperService, 'findArrayIndex').and.returnValues(false, false, 0);
			scope.parseMatches();
			expect(scope.matches).toEqual([{
				event_surface_number: '4',
				date: 3,
				round: 2
			}, {
				event_surface_number: '',
				date: 5,
				round: 2
			}]);
			expect(scope.roundDates).toEqual([{
				number: 2,
				date: 3
			}, {
				number: 2,
				date: 5
			}]);
			expect(scope.printScorecardsObject.roundDate).toEqual(3);
		});
	});

	describe('getMatches Test', function(){
		it('should set scope.matches to its correct value and call scope.parseMatches() after matchLineTimesModalService.getEventMatches() ' +
		   'returns success', function(){
			scope.matches = 'do';
			spyOn(scope, 'parseMatches');
			scope.getMatches();
			scope.$apply();
			expect(matchLineTimesModalService.getEventMatches).toHaveBeenCalledWith(25);
			expect(scope.matches).toEqual('girl');
			expect(scope.parseMatches).toHaveBeenCalled();
		});
	});
    
    describe('generateScorecard Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then call window.open after ' +
		   'printScorecardsModalService.generateScorecard() returns success', function(){
    		scope.printScorecardsObject = {
    			size: 'medium',
				roundDate: '8-2-2018'
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(window, 'open');
    		scope.generateScorecard();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		scope.$apply();
    		expect(printScorecardsModalService.generateScorecard).toHaveBeenCalledWith(rootScope.selectedEvent.id, scope.printScorecardsObject.size,
																					   scope.printScorecardsObject.roundDate);
    		expect(window.open).toHaveBeenCalled();
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
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

});