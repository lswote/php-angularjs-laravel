teamsRIt.controller('uploadEventDescriptionModalController', function($scope, $rootScope, uploadEventDescriptionModalService, internalConstants){

	// Default values
	$scope.callSuccess = false;

	// Object that determines which input error to show
	$scope.showUploadEventDescriptionErrors = {
		file: false,
		fileType: false,
		size: false
	};
	// Object that holds our new file and associated meta info
	$scope.uploadEventDescriptionObject = {
		type: 'tennis',
		inputFileText: 'No file selected'
	};
	// File types we allow for upload
	$scope.allowedFileTypes = ['pdf', 'png', 'jpeg', 'jpg', 'gif'];

	// Input errors when file is changed
	$(document).on('change', '#file-input', function(){
		$scope.showUploadEventDescriptionErrors.file = false;
		var inputFileName = $(this)[0].files[0].name;
		var inputFileType = inputFileName.split('.').pop().toLowerCase();
		if($scope.allowedFileTypes.indexOf(inputFileType) > -1){
			$scope.uploadEventDescriptionObject.inputFileText = inputFileName;
		}
		else{
			$scope.uploadEventDescriptionObject.inputFileText = 'File type not supported';
		}
		$scope.showUploadEventDescriptionErrors.size = $(this)[0].files[0].size > 11000000;
		$scope.$apply();
	});

	// Check inputs
	$scope.checkUploadEventDescriptionInputs = function(){
		var noErrors = true;
		if($scope.uploadEventDescriptionObject.inputFileText == 'No file selected'){
			$scope.showUploadEventDescriptionErrors.file = true;
			noErrors = false;
		}
		if($scope.uploadEventDescriptionObject.inputFileText == 'File type not supported'){
			$scope.showUploadEventDescriptionErrors.fileType = true;
			noErrors = false;
		}
		if($scope.showUploadEventDescriptionErrors.size){
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all errors
	$scope.resetUploadEventDescriptionErrors = function(){
		for(var i in $scope.showUploadEventDescriptionErrors){
			if($scope.showUploadEventDescriptionErrors.hasOwnProperty(i) && i !=  'size'){
				$scope.showUploadEventDescriptionErrors[i] = false;
			}
		}
	};

	// Uploads the user's file
	$scope.uploadEventDescription = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetUploadEventDescriptionErrors();
		if($scope.checkUploadEventDescriptionInputs() === true){
			$scope.uploadFileToS3().then(function(data){
				return uploadEventDescriptionModalService.fileMeta(data.Location);
			}, function(){
				$scope.callSuccess = false;
			}).then(function(){
				document.getElementById('file-input').value = null;
				$scope.uploadEventDescriptionObject = {
					type: 'tennis',
					inputFileText: 'No file selected'
				};
				$scope.callSuccess = true;
			}, function(){
				$scope.callSuccess = false;
			}).finally(function(){
				$scope.callInProgress = false;
				$scope.$apply();
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Uploads our file to S3
	$scope.uploadFileToS3 = function(){
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
		return new Promise(function(resolve, reject){
			s3.upload({
				Key: 'facilities/' + '1-' + Math.round(Math.random() * (999999 - 100000) + 100000),
				Body: file,
				ACL: 'public-read'
			}, function(error, data){
				error ? reject(error) : resolve(data);
			});
		})
	};


});