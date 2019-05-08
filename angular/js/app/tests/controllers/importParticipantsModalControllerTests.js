describe('importParticipantsModalController Test Suite', function(){

    var scope, rootScope, deferred, q, importParticipantsModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        importParticipantsModalService = {
            facility: function(){
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
        spyOn(importParticipantsModalService, 'facility').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('importParticipantsModalController', {
            $scope: scope,
			importParticipantsModalService: importParticipantsModalService
        });
    }));

    describe('checkFileInput Test', function(){
		it('should set scope.showImportParticipantsErrors to its correct value and return false', function(){
			scope.importParticipantsObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'No file selected'
			};
			scope.showImportParticipantsErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkFileInput()).toBeFalsy();
			expect(scope.showImportParticipantsErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showImportParticipantsErrors and return true', function(){
			scope.importParticipantsObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'file.exe'
			};
			scope.showImportParticipantsErrors = {
				file: false,
				fileType: false,
				size: false,
			};
			expect(scope.checkFileInput()).toBeTruthy();
			expect(scope.showImportParticipantsErrors).toEqual({
				file: false,
				fileType: false,
				size: false,
			});
		});
	});

    describe('resetFileErrors Test', function(){
    	it('should reset scope.showImportParticipantsErrors', function(){
    		scope.showImportParticipantsErrors = {
    			titanium: true,
				brick: true,
				linesNotAdded: [1, 2]
			};
			scope.resetFileErrors();
			expect(scope.showImportParticipantsErrors).toEqual({
				titanium: false,
				brick: false,
				linesNotAdded: []
			});
		});
	});

    describe('importParticipants Test', function(){
    	it('should set scope.callInProgress, scope.callSuccess, and scope.importedCount to their correct values and call scope.resetFileErrors() and scope.checkFileInput().  ' +
		   'It should then set scope.showImportParticipantsErrors and scope.importParticipantsObject to their correct values after scope.importParticipantsToS3() and ' +
		   'importParticipantsModalService.facility() return success', function(){
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		scope.importedCount = 5;
    		scope.showImportParticipantsErrors = {};
    		rootScope.importType = 'facilities';
    		spyOn(scope, 'resetFileErrors');
    		spyOn(scope, 'checkFileInput').and.returnValue(true);
    		scope.importParticipantsToS3 = function(){
                deferred = q.defer();
                deferred.resolve({
					Key: 'woods'
				});
                return deferred.promise;
            };
    		spyOn(scope, 'importParticipantsToS3').and.callThrough();
    		spyOn(document, 'getElementById').and.returnValue({});
    		scope.importParticipants();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.importedCount).toEqual(0);
    		expect(scope.resetFileErrors).toHaveBeenCalled();
    		expect(scope.checkFileInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(scope.importParticipantsToS3).toHaveBeenCalled();
    		expect(importParticipantsModalService.facility).toHaveBeenCalledWith('woods');
    		expect(scope.importedCount).toEqual(24);
    		expect(scope.showImportParticipantsErrors).toEqual({
				linesNotAdded: 2
			});
    		expect(scope.importParticipantsObject).toEqual({
				inputFileText: 'No file selected'
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
		});
	});

});