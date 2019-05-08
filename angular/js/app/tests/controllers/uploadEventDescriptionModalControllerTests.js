describe('uploadEventDescriptionModalController Test Suite', function(){

    var scope, rootScope, deferred, q, uploadEventDescriptionModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        uploadEventDescriptionModalService = {
            fileMeta: function(){
                deferred = q.defer();
                deferred.resolve('hottub');
                return deferred.promise;
            }
        };
        spyOn(uploadEventDescriptionModalService, 'fileMeta').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('uploadEventDescriptionModalController', {
            $scope: scope,
			uploadEventDescriptionModalService: uploadEventDescriptionModalService
        });
    }));

    describe('checkUploadEventDescriptionInputs Test', function(){
		it('should set scope.showUploadEventDescriptionErrors to its correct value and return false', function(){
			scope.uploadEventDescriptionObject = {
				title: 'complicated',
				type: 'tennis',
				inputFileText: 'No file selected'
			};
			scope.showUploadEventDescriptionErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkUploadEventDescriptionInputs()).toBeFalsy();
			expect(scope.showUploadEventDescriptionErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showUploadEventDescriptionErrors and return true', function(){
			scope.uploadEventDescriptionObject = {
				title: 'complicated',
				type: 'tennis',
				inputFileText: 'file.exe'
			};
			scope.showUploadEventDescriptionErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkUploadEventDescriptionInputs()).toBeTruthy();
			expect(scope.showUploadEventDescriptionErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

    describe('resetUploadEventDescriptionErrors Test', function(){
    	it('should reset scope.showUploadEventDescriptionErrors', function(){
    		scope.showUploadEventDescriptionErrors = {
    			file: true,
				fileType: true,
				size: false
			};
			scope.resetUploadEventDescriptionErrors();
			expect(scope.showUploadEventDescriptionErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

});