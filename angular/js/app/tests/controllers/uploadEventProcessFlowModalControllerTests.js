describe('uploadEventProcessFlowModalController Test Suite', function(){

    var scope, rootScope, deferred, q, uploadEventProcessFlowMOdalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        uploadEventProcessFlowMOdalService = {
            fileMeta: function(){
                deferred = q.defer();
                deferred.resolve('hottub');
                return deferred.promise;
            }
        };
        spyOn(uploadEventProcessFlowMOdalService, 'fileMeta').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('uploadEventProcessFlowModalController', {
            $scope: scope,
			uploadEventProcessFlowMOdalService: uploadEventProcessFlowMOdalService
        });
    }));

    describe('checkUploadEventProcessFlowInputs Test', function(){
		it('should set scope.showUploadEventProcessFlowErrors to its correct value and return false', function(){
			scope.uploadEventProcessFlowObject = {
				title: 'complicated',
				type: 'tennis',
				inputFileText: 'No file selected'
			};
			scope.showUploadEventProcessFlowErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkUploadEventProcessFlowInputs()).toBeFalsy();
			expect(scope.showUploadEventProcessFlowErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showUploadEventProcessFlowErrors and return true', function(){
			scope.uploadEventProcessFlowObject = {
				title: 'complicated',
				type: 'tennis',
				inputFileText: 'file.exe'
			};
			scope.showUploadEventProcessFlowErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkUploadEventProcessFlowInputs()).toBeTruthy();
			expect(scope.showUploadEventProcessFlowErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

    describe('resetUploadEventProcessFlowErrors Test', function(){
    	it('should reset scope.showUploadEventProcessFlowErrors', function(){
    		scope.showUploadEventProcessFlowErrors = {
    			file: true,
				fileType: true,
				size: false
			};
			scope.resetUploadEventProcessFlowErrors();
			expect(scope.showUploadEventProcessFlowErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

});