describe('dashboardImageModalController Test Suite', function(){

    var scope, rootScope, deferred, q, dashboardImageModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        dashboardImageModalService = {
            image: function(){
                deferred = q.defer();
                deferred.resolve({
					facility: {
						image_url: 'whistle',
						disable_image_banner: '1'
					}
				});
                return deferred.promise;
            }
        };
        spyOn(dashboardImageModalService, 'image').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $injector, $q){
    	rootScope = $rootScope;
    	rootScope.toggleModal = function(){};
    	rootScope.facility = {};
    	rootScope.user = {};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('dashboardImageModalController', {
            $scope: scope,
			dashboardImageModalService: dashboardImageModalService
        });
    }));

    describe('checkImageInput Test', function(){
		it('should set scope.showUploadImageErrors to its correct value and return false', function(){
			scope.disabled = 0;
			scope.uploadImageObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'No file selected'
			};
			scope.showUploadImageErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkImageInput()).toBeFalsy();
			expect(scope.showUploadImageErrors).toEqual({
				file: true,
				fileType: false,
				size: false
			});
		});
		it('should not change scope.showUploadImageErrors and return true', function(){
			scope.uploadImageObject = {
				title: 'complicated',
				type: 'timesheet',
				inputFileText: 'file.exe'
			};
			scope.showUploadImageErrors = {
				file: false,
				fileType: false,
				size: false
			};
			expect(scope.checkImageInput()).toBeTruthy();
			expect(scope.showUploadImageErrors).toEqual({
				file: false,
				fileType: false,
				size: false
			});
		});
	});

    describe('resetImageErrors Test', function(){
    	it('should reset scope.showUploadImageErrors', function(){
    		scope.showUploadImageErrors = {
    			titanium: true,
				brick: true
			};
			scope.resetImageErrors();
			expect(scope.showUploadImageErrors).toEqual({
				titanium: false,
				brick: false
			});
		});
	});

    describe('toggleDisableImage Test', function(){
    	it('should set scope.disableImage to its correct value', function(){
    		scope.disableImage = 0;
    		scope.toggleDisableImage();
    		expect(scope.disableImage).toEqual(1);
		});
	});

    describe('uploadImage Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values and call scope.resetImageErrors() and scope.checkImageInput().  It should then ' +
		   'set rootScope.facility and scope.uploadImageObject to their correct values and call rootScope.toggleModal() after scope.uploadImageObject() and ' +
		   'dashboardImageModalService.image() return success', function(){
    		scope.disableImage = 1;
    		scope.callInProgress = false;
    		scope.callSuccess = true;
    		rootScope.facility = {};
    		spyOn(scope, 'resetImageErrors');
    		spyOn(scope, 'checkImageInput').and.returnValue(true);
    		scope.uploadImageToS3 = function(){
                deferred = q.defer();
                deferred.resolve({
					Location: 'woods',

				});
                return deferred.promise;
            };
    		spyOn(scope, 'uploadImageToS3').and.callThrough();
    		spyOn(document, 'getElementById').and.returnValue({});
    		spyOn(rootScope, 'toggleModal');
    		scope.uploadImage();
    		expect(scope.callInProgress).toBeTruthy();
    		expect(scope.callSuccess).toBeFalsy();
    		expect(scope.resetImageErrors).toHaveBeenCalled();
    		expect(scope.checkImageInput).toHaveBeenCalled();
    		scope.$apply();
    		expect(scope.uploadImageToS3).toHaveBeenCalled();
    		expect(dashboardImageModalService.image).toHaveBeenCalledWith('woods', scope.disableImage);
    		expect(scope.uploadImageObject).toEqual({
				inputFileText: 'No file selected'
			});
    		expect(rootScope.facility).toEqual({
				image_url: 'whistle',
				disable_image_banner: 1
			});
    		expect(scope.callSuccess).toBeTruthy();
    		expect(scope.callInProgress).toBeFalsy();
    		expect(rootScope.toggleModal).toHaveBeenCalled();
		});
	});

});