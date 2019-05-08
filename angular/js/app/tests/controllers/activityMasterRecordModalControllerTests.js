describe('activityMasterRecordModalController Test Suite', function(){

    var q, deferred, scope, rootScope, activityMasterRecordModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        activityMasterRecordModalService = {
        	getActivities: function(){
        		deferred = q.defer();
                deferred.resolve({
					activities: 'blue'
				});
                return deferred.promise;
			},
			addActivity: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
        	updateActivity: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(activityMasterRecordModalService, 'getActivities').and.callThrough();
        spyOn(activityMasterRecordModalService, 'addActivity').and.callThrough();
        spyOn(activityMasterRecordModalService, 'updateActivity').and.callThrough();
        helperService = {
        	findArrayIndex: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('activityMasterRecordModalController', {
            $scope: scope,
			activityMasterRecordModalService: activityMasterRecordModalService,
			helperService: helperService
        });
    }));

    describe('clearActivityValues Test', function(){
    	it('should set scope.activityMasterRecordObject to its correct value', function(){
    		scope.activityMasterRecordObject = {
    			id: 4,
				name: 'something',
				twoTeamsPerLine: 1,
				threeTeamsPerLine: 1,
				fourTeamsPerLine: 0,
				fiveTeamsPerLine: null,
				doubles: null,
				competitionScoringFormat: null,
				lineScoringFormat: null,
				pointHighLow: null,
				surfaceType: null,
				setOrGame: null
			};
    		scope.clearActivityValues();
			expect(scope.activityMasterRecordObject).toEqual({
				id: null,
				name: null,
				twoTeamsPerLine: null,
				threeTeamsPerLine: null,
				fourTeamsPerLine: null,
				fiveTeamsPerLine: null,
				doubles: null,
				competitionScoringFormat: null,
				lineScoringFormat: null,
				pointHighLow: null,
				surfaceType: null,
				setOrGame: null
			});
		});
	});

    describe('selectView Test', function(){
    	it('should set scope.selectedView to its correct value and call scope.clearActivityValues()', function(){
    		var view = 'edit';
    		scope.selectedView = 'add';
    		spyOn(scope, 'clearActivityValues');
    		scope.selectView(view);
    		expect(scope.clearActivityValues).toHaveBeenCalled();
    		expect(scope.selectedView).toEqual(view);
		});
	});

    describe('getActivities Test', function(){
    	it('should set scope.activities to its correct value after activityMasterRecordModalService.getActivities() returns success', function(){
    		scope.activities = 'hi';
    		scope.getActivities();
    		scope.$apply();
    		expect(activityMasterRecordModalService.getActivities).toHaveBeenCalled();
    		expect(scope.activities).toEqual('blue');
		});
	});

    /*describe('$watch activityMasterRecordObject.id Test', function(){
    	it('should set scope.activityMasterRecordObject to its correct value', function(){
    		scope.activities = [{
    			id: 4,
				name: 'tennis',
				two_lines_per_team: '1',
				three_lines_per_team: '1',
				four_lines_per_team: '1',
				five_lines_per_team: '1',
				doubles: '0',
				competition_scoring_format: '3',
				line_scoring_format: 'wl',
				point_high_low: 'high',
				surface_type: 'court',
				set_or_game: 'set'
			}];
    		spyOn(helperService, 'findArrayIndex').and.returnValue(0);
    		scope.activityMasterRecordObject.id = 4;
    		scope.$apply();
    		scope.activityMasterRecordObject.id = 5;
    		scope.$apply();
			expect(scope.activityMasterRecordObject).toEqual({
				id: '4',
				name: 'tennis',
				twoTeamsPerLine: '1',
				threeTeamsPerLine: '1',
				fourTeamsPerLine: '1',
				fiveTeamsPerLine: '1',
				doubles: '0',
				competitionScoringFormat: '3',
				lineScoringFormat: 'wl',
				pointHighLow: 'high',
				surfaceType: 'court',
				setOrGame: 'set'
			});
		});
	});*/

    describe('$watch activityMasterRecordObject.lineScoringFormat Test', function(){
    	it('should scope.activityMasterRecordObject.pointHighLow to an empty string if the new value is "wl"', function(){
    		scope.activityMasterRecordObject = {
    			pointHighLow: 'my voice'
			};
    		scope.activityMasterRecordObject.lineScoringFormat = 'points';
			scope.$apply();
			scope.activityMasterRecordObject.lineScoringFormat = 'wl';
			scope.$apply();
			expect(scope.activityMasterRecordObject.pointHighLow).toEqual('');
		});
	});

    describe('checkActivityMasterRecordInput Test', function(){
		it('should set scope.showActivityMasterRecordErrors to its correct value and return false', function(){
			scope.selectedView = 'edit';
			scope.activityMasterRecordObject = {
				id: null,
				name: null,
				twoTeamsPerLine: null,
				threeTeamsPerLine: null,
				fourTeamsPerLine: null,
				fiveTeamsPerLine: null,
				doubles: null,
				competitionScoringFormat: null,
				lineScoringFormat: null,
				pointHighLow: null,
				surfaceType: null,
				setOrGame: null
			};
			scope.showActivityMasterRecordErrors = {
				id: false,
				name: false,
				twoTeamsPerLine: false,
				threeTeamsPerLine: false,
				fourTeamsPerLine: false,
				fiveTeamsPerLine: false,
				doubles: false,
				competitionScoringFormat: false,
				lineScoringFormat: false,
				pointHighLow: false,
				surfaceType: false,
				setOrGame: false
			};
			expect(scope.checkActivityMasterRecordInput()).toBeFalsy();
			expect(scope.showActivityMasterRecordErrors).toEqual({
				id: true,
				name: false,
				twoTeamsPerLine: true,
				threeTeamsPerLine: true,
				fourTeamsPerLine: true,
				fiveTeamsPerLine: true,
				doubles: true,
				competitionScoringFormat: true,
				lineScoringFormat: true,
				pointHighLow: true,
				surfaceType: true,
				setOrGame: true
			});
		});
		it('should not change scope.showActivityMasterRecordErrors and return true', function(){
			scope.selectedView = 'add';
			scope.activityMasterRecordObject = {
				id: '4',
				name: 'come on',
				twoTeamsPerLine: '1',
				threeTeamsPerLine: '1',
				fourTeamsPerLine: '1',
				fiveTeamsPerLine: '1',
				doubles: '1',
				competitionScoringFormat: '3',
				lineScoringFormat: 'wl',
				pointHighLow: null,
				surfaceType: 'surface',
				setOrGame: 'set'
			};
			scope.showActivityMasterRecordErrors = {
				id: false,
				name: false,
				twoTeamsPerLine: false,
				threeTeamsPerLine: false,
				fourTeamsPerLine: false,
				fiveTeamsPerLine: false,
				doubles: false,
				competitionScoringFormat: false,
				lineScoringFormat: false,
				pointHighLow: false,
				surfaceType: false,
				setOrGame: false
			};
			expect(scope.checkActivityMasterRecordInput()).toBeTruthy();
			expect(scope.showActivityMasterRecordErrors).toEqual({
				id: false,
				name: false,
				twoTeamsPerLine: false,
				threeTeamsPerLine: false,
				fourTeamsPerLine: false,
				fiveTeamsPerLine: false,
				doubles: false,
				competitionScoringFormat: false,
				lineScoringFormat: false,
				pointHighLow: false,
				surfaceType: false,
				setOrGame: false
			});
		});
	});

    describe('resetshowActivityMasterRecordErrors Test', function(){
    	it('should reset scope.showActivityMasterRecordErrors', function(){
    		scope.showActivityMasterRecordErrors = {
				name: true
			};
			scope.resetshowActivityMasterRecordErrors();
			expect(scope.showActivityMasterRecordErrors).toEqual({
				name: false
			});
		});
	});

    describe('addActivity Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetshowActivityMasterRecordErrors() and ' +
		   'scope.checkActivityMasterRecordInput().  It should then call scope.getActivities() and scope.clearActivityValues() after ' +
		   'activityMasterRecordModalService.addActivity() returns success', function(){
    		scope.activityMasterRecordObject = 'again';
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetshowActivityMasterRecordErrors');
    		spyOn(scope, 'checkActivityMasterRecordInput').and.returnValue(true);
    		spyOn(scope, 'getActivities');
    		spyOn(scope, 'clearActivityValues');
    		scope.addActivity();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetshowActivityMasterRecordErrors).toHaveBeenCalled();
    		scope.$apply();
    		expect(activityMasterRecordModalService.addActivity).toHaveBeenCalledWith(scope.activityMasterRecordObject);
    		expect(scope.getActivities).toHaveBeenCalled();
    		expect(scope.clearActivityValues).toHaveBeenCalled();
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

    describe('updateActivity Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetshowActivityMasterRecordErrors() and ' +
		   'scope.checkActivityMasterRecordInput().  It should then call scope.getActivities() and scope.clearActivityValues() after ' +
		   'activityMasterRecordModalService.updateActivity() returns success', function(){
    		scope.activityMasterRecordObject = 'again';
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		spyOn(scope, 'resetshowActivityMasterRecordErrors');
    		spyOn(scope, 'checkActivityMasterRecordInput').and.returnValue(true);
    		spyOn(scope, 'getActivities');
    		spyOn(scope, 'clearActivityValues');
    		scope.updateActivity();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetshowActivityMasterRecordErrors).toHaveBeenCalled();
    		scope.$apply();
    		expect(activityMasterRecordModalService.updateActivity).toHaveBeenCalledWith(scope.activityMasterRecordObject);
    		expect(scope.getActivities).toHaveBeenCalled();
    		expect(scope.clearActivityValues).toHaveBeenCalled();
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});