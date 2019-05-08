teamsRIt.controller('dashboardImageModalController', function($scope, $rootScope, dashboardImageModalService, internalConstants){

	// Default values
	$scope.disableImage = $rootScope.facility.disable_image_banner;
	$scope.callSuccess = false;

	// Object that determines which upload image input error to show
	$scope.showUploadImageErrors = {
		file: false,
		fileType: false,
		size: false
	};
	// Object that holds our new image info
	$scope.uploadImageObject = {
		inputFileText: 'No file selected'
	};
	// File types we allow for upload
	$scope.allowedFileTypes = ['pdf', 'png', 'jpeg', 'jpg', 'gif'];

	// Input errors when file is changed
	$(document).on('change', '#file-input', function(){
		$scope.showUploadImageErrors.file = false;
		var inputFileName = $(this)[0].files[0].name;
		var inputFileType = inputFileName.split('.').pop().toLowerCase();
		if($scope.allowedFileTypes.indexOf(inputFileType) > -1){
			$scope.uploadImageObject.inputFileText = inputFileName;
		}
		else{
			$scope.uploadImageObject.inputFileText = 'File type not supported';
		}
		$scope.showUploadImageErrors.size = $(this)[0].files[0].size > 11000000;
		$scope.$apply();
	});

	// Check the image the user wants to upload
	$scope.checkImageInput = function(){
		var noErrors = true;
		if($scope.uploadImageObject.inputFileText == 'No file selected' && $scope.disabled === 0){
			$scope.showUploadImageErrors.file = true;
			noErrors = false;
		}
		if($scope.uploadImageObject.inputFileText == 'File type not supported'){
			$scope.showUploadImageErrors.fileType = true;
			noErrors = false;
		}
		if($scope.showUploadImageErrors.size){
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all upload image errors
	$scope.resetImageErrors = function(){
		for(var i in $scope.showUploadImageErrors){
			if($scope.showUploadImageErrors.hasOwnProperty(i) && i !=  'size'){
				$scope.showUploadImageErrors[i] = false;
			}
		}
	};

	// Disable / enable our banner image
	$scope.toggleDisableImage = function(){
		$scope.disableImage = $scope.disableImage === 1 ? 0 : 1;
	};

	// Uploads the user's image
	$scope.uploadImage = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetImageErrors();
		if($scope.checkImageInput() === true){
			$scope.uploadImageToS3().then(function(data){
				return dashboardImageModalService.image(data.Location, $scope.disableImage);
			}, function(){
				$scope.callSuccess = false;
			}).then(function(data){
				document.getElementById('file-input').value = null;
				$scope.uploadImageObject = {
					inputFileText: 'No file selected'
				};
				$rootScope.facility.disable_image_banner = parseInt(data.facility.disable_image_banner);
				$rootScope.facility.image_url = data.facility.image_url;
				if(!$rootScope.facility.image_url || $rootScope.user.privilege === 'admin'){
					$rootScope.facility.image_url = '../../../images/meds.jpg';
				}
				$scope.callSuccess = true;
			}, function(){
				$scope.callSuccess = false;
			}).finally(function(){
				$scope.callInProgress = false;
				$rootScope.toggleModal();
				$scope.$apply();
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Uploads an image to S3
	$scope.uploadImageToS3 = function(){
		var s3 = new AWS.S3({
			credentials: {
				accessKeyId: internalConstants.awsKey,
				secretAccessKey: internalConstants.awsSecret
			},
			params: {
				Bucket: internalConstants.awsBucket
			}
		});
		var file = document.getElementById('file-input').files[0];
		if(file){
			return new Promise(function(resolve, reject){
				s3.upload({
					Key: 'facilities/' + '1-' + Math.round(Math.random() * (999999 - 100000) + 100000),
					Body: file,
					ACL: 'public-read'
				}, function(error, data){
					error ? reject(error) : resolve(data);
				});
			});
		}
		else{
			return new Promise(function(resolve){
				return resolve({
					Location: null
				})
			});
		}
	};


});