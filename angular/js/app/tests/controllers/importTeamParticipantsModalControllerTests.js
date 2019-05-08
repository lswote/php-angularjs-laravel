describe('importTeamParticipantsModalController Test Suite', function(){

    var scope, rootScope, deferred, q, importTeamParticipantsModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        importTeamParticipantsModalService = {
            upload: function(){
                deferred = q.defer();
                deferred.resolve({
					results: {
						imported_count: 24,
						lines_not_added: 2
					}
				});
                return deferred.promise;
            }
        };
        spyOn(importTeamParticipantsModalService, 'upload').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('importTeamParticipantsModalController', {
            $scope: scope,
			importTeamParticipantsModalService: importTeamParticipantsModalService
        });
    }));

    describe('checkFileInput Test', function(){
		it('should set scope.showImportTeamParticipantsErrors to its correct value and return false', function(){
			scope.importTeamParticipantsObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'No file selected'
			};
			scope.showImportTeamParticipantsErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkFileInput()).toBeFalsy();
			expect(scope.showImportTeamParticipantsErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showImportTeamParticipantsErrors and return true', function(){
			scope.importTeamParticipantsObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'file.exe'
			};
			scope.showImportTeamParticipantsErrors = {
				file: false,
				fileType: false,
				size: false,
			};
			expect(scope.checkFileInput()).toBeTruthy();
			expect(scope.showImportTeamParticipantsErrors).toEqual({
				file: false,
				fileType: false,
				size: false,
			});
		});
	});

    describe('resetFileErrors Test', function(){
    	it('should reset scope.showImportTeamParticipantsErrors', function(){
    		scope.showImportTeamParticipantsErrors = {
    			titanium: true,
				brick: true,
				linesNotAdded: [1, 2]
			};
			scope.resetFileErrors();
			expect(scope.showImportTeamParticipantsErrors).toEqual({
				titanium: false,
				brick: false,
				linesNotAdded: []
			});
		});
	});

    describe('importTeamParticipants Test', function(){
    	it('should set scope.callInProgress, scope.callSuccess, and scope.importedCount to their correct values and call scope.resetFileErrors() and scope.checkFileInput().  ' +
		   'It should then set scope.showImportTeamParticipantsErrors and scope.importTeamParticipantsObject to their correct values and call rootScope.getEvents() after ' +
		   'scope.importTeamParticipantsToS3() and importTeamParticipantsModalService.upload() return success', function(){
    		rootScope.selectedEvent = {
    			id: 45
			};
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		scope.importedCount = 5;
    		scope.showImportTeamParticipantsErrors = {};
    		spyOn(scope, 'resetFileErrors');
    		spyOn(scope, 'checkFileInput').and.returnValue(true);
    		rootScope.getEvents = jasmine.createSpy('getEvents');
    		scope.importTeamParticipantsToS3 = function(){
                deferred = q.defer();
                deferred.resolve({
					Key: 'woods'
				});
                return deferred.promise;
            };
    		spyOn(scope, 'importTeamParticipantsToS3').and.callThrough();
    		spyOn(document, 'getElementById').and.returnValue({});
    		scope.importTeamParticipants();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.importedCount).toEqual(0);
    		expect(scope.resetFileErrors).toHaveBeenCalled();
    		expect(scope.checkFileInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(scope.importTeamParticipantsToS3).toHaveBeenCalled();
    		expect(importTeamParticipantsModalService.upload).toHaveBeenCalledWith(rootScope.selectedEvent.id, 'woods');
    		expect(scope.importedCount).toEqual(24);
    		expect(scope.showImportTeamParticipantsErrors).toEqual({
				linesNotAdded: 2
			});
    		expect(scope.importTeamParticipantsObject).toEqual({
				inputFileText: 'No file selected'
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
    		expect(rootScope.getEvents).toHaveBeenCalled();
		});
	});

});