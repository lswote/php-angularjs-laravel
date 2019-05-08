describe('importParticipantsActivitiesModalController Test Suite', function(){

    var scope, rootScope, deferred, q, importParticipantsActivitiesModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        importParticipantsActivitiesModalService = {
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
        spyOn(importParticipantsActivitiesModalService, 'upload').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('importParticipantsActivitiesModalController', {
            $scope: scope,
			importParticipantsActivitiesModalService: importParticipantsActivitiesModalService
        });
    }));

    describe('checkFileInput Test', function(){
		it('should set scope.showImportParticipantsActivitiesErrors to its correct value and return false', function(){
			scope.importParticipantsActivitiesObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'No file selected'
			};
			scope.showImportParticipantsActivitiesErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkFileInput()).toBeFalsy();
			expect(scope.showImportParticipantsActivitiesErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showImportParticipantsActivitiesErrors and return true', function(){
			scope.importParticipantsActivitiesObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'file.exe'
			};
			scope.showImportParticipantsActivitiesErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkFileInput()).toBeTruthy();
			expect(scope.showImportParticipantsActivitiesErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

    describe('resetFileErrors Test', function(){
    	it('should reset scope.showImportParticipantsErrors', function(){
    		scope.showImportParticipantsActivitiesErrors = {
    			titanium: true,
				brick: true,
				linesNotAdded: [1, 2]
			};
			scope.resetFileErrors();
			expect(scope.showImportParticipantsActivitiesErrors).toEqual({
				titanium: false,
				brick: false,
				linesNotAdded: []
			});
		});
	});

    describe('importParticipantsActivities Test', function(){
    	it('should set scope.callInProgress, scope.callSuccess, and scope.importedCount to their correct values and call scope.resetFileErrors() and scope.checkFileInput().  ' +
		   'It should then set scope.showImportParticipantsActivitiesErrors and scope.importParticipantsActivitiesObject to their correct values after ' +
		   'scope.importParticipantsActivitiesToS3() and importParticipantsActivitiesModalService.upload() return success', function(){
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		scope.importedCount = 5;
    		scope.showImportParticipantsActivitiesErrors = {};
    		rootScope.importType = 'facilities';
    		spyOn(scope, 'resetFileErrors');
    		spyOn(scope, 'checkFileInput').and.returnValue(true);
    		scope.importParticipantsActivitiesToS3 = function(){
                deferred = q.defer();
                deferred.resolve({
					Key: 'woods'
				});
                return deferred.promise;
            };
    		spyOn(scope, 'importParticipantsActivitiesToS3').and.callThrough();
    		spyOn(document, 'getElementById').and.returnValue({});
    		scope.importParticipantsActivities();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.importedCount).toEqual(0);
    		expect(scope.resetFileErrors).toHaveBeenCalled();
    		expect(scope.checkFileInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(scope.importParticipantsActivitiesToS3).toHaveBeenCalled();
    		expect(importParticipantsActivitiesModalService.upload).toHaveBeenCalledWith('woods');
    		expect(scope.importedCount).toEqual(24);
    		expect(scope.showImportParticipantsActivitiesErrors).toEqual({
				linesNotAdded: 2
			});
    		expect(scope.importParticipantsActivitiesObject).toEqual({
				inputFileText: 'No file selected'
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});