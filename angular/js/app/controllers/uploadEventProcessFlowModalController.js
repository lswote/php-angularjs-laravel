teamsRIt.controller('uploadEventProcessFlowModalController', function($scope, $rootScope, uploadEventProcessFlowModalService, internalConstants){

	// Default values
	$scope.callSuccess = false;

	// Object that determines which input error to show
	$scope.showUploadEventProcessFlowErrors = {
		file: false,
		fileType: false,
		size: false
	};
	// Object that holds our new file and associated meta info
	$scope.uploadEventProcessFlowObject = {
		type: 'tennis',
		inputFileText: 'No file selected'
	};
	// File types we allow for upload
	$scope.allowedFileTypes = ['pdf', 'png', 'jpeg', 'jpg', 'gif'];

	// Input errors when file is changed
	$(document).on('change', '#file-input', function(){
		$scope.showUploadEventProcessFlowErrors.file = false;
		var inputFileName = $(this)[0].files[0].name;
		var inputFileType = inputFileName.split('.').pop().toLowerCase();
		if($scope.allowedFileTypes.indexOf(inputFileType) > -1){
			$scope.uploadEventProcessFlowObject.inputFileText = inputFileName;
		}
		else{
			$scope.uploadEventProcessFlowObject.inputFileText = 'File type not supported';
		}
		$scope.showUploadEventProcessFlowErrors.size = $(this)[0].files[0].size > 11000000;
		$scope.$apply();
	});

	// Check inputs
	$scope.checkUploadEventProcessFlowInputs = function(){
		var noErrors = true;
		if($scope.uploadEventProcessFlowObject.inputFileText == 'No file selected'){
			$scope.showUploadEventProcessFlowErrors.file = true;
			noErrors = false;
		}
		if($scope.uploadEventProcessFlowObject.inputFileText == 'File type not supported'){
			$scope.showUploadEventProcessFlowErrors.fileType = true;
			noErrors = false;
		}
		if($scope.showUploadEventProcessFlowErrors.size){
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all errors
	$scope.resetUploadEventProcessFlowErrors = function(){
		for(var i in $scope.showUploadEventProcessFlowErrors){
			if($scope.showUploadEventProcessFlowErrors.hasOwnProperty(i) && i !=  'size'){
				$scope.showUploadEventProcessFlowErrors[i] = false;
			}
		}
	};

	// Uploads the user's file
	$scope.uploadEventProcessFlow = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetUploadEventProcessFlowErrors();
		if($scope.checkUploadEventProcessFlowInputs() === true){
			$scope.uploadFileToS3().then(function(data){
				return uploadEventProcessFlowService.fileMeta(data.Location);
			}, function(){
				$scope.callSuccess = false;
			}).then(function(){
				document.getElementById('file-input').value = null;
				$scope.uploadEventProcessFlowObject = {
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