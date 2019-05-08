teamsRIt.controller('importParticipantsActivitiesModalController', function($scope, $rootScope, importParticipantsActivitiesModalService, internalConstants){

	// Default values
	$scope.callSuccess = false;
	$scope.importedCount = false;

	// Object that determines which upload file input error to show
	$scope.showImportParticipantsActivitiesErrors = {
		file: false,
		fileType: false,
		size: false,
		linesNotAdded: []
	};
	// Object that holds our new file info
	$scope.importParticipantsActivitiesObject = {
		inputFileText: 'No file selected'
	};
	// File types we allow for upload
	$scope.allowedFileTypes = ['csv'];

	// Input errors when file is changed
	$(document).on('change', '#file-input', function(){
		$scope.showImportParticipantsActivitiesErrors.file = false;
		var inputFileName = $(this)[0].files[0].name;
		var inputFileType = inputFileName.split('.').pop().toLowerCase();
		if($scope.allowedFileTypes.indexOf(inputFileType) > -1){
			$scope.importParticipantsActivitiesObject.inputFileText = inputFileName;
		}
		else{
			$scope.importParticipantsActivitiesObject.inputFileText = 'File type not supported';
		}
		$scope.showImportParticipantsActivitiesErrors.size = $(this)[0].files[0].size > 11000000;
		$scope.$apply();
	});

	// Check the file the user wants to upload
	$scope.checkFileInput = function(){
		var noErrors = true;
		if($scope.importParticipantsActivitiesObject.inputFileText == 'No file selected'){
			$scope.showImportParticipantsActivitiesErrors.file = true;
			noErrors = false;
		}
		if($scope.importParticipantsActivitiesObject.inputFileText == 'File type not supported'){
			$scope.showImportParticipantsActivitiesErrors.fileType = true;
			noErrors = false;
		}
		if($scope.showImportParticipantsActivitiesErrors.size){
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all upload file errors
	$scope.resetFileErrors = function(){
		for(var i in $scope.showImportParticipantsActivitiesErrors){
			if($scope.showImportParticipantsActivitiesErrors.hasOwnProperty(i) && i !==  'size' && i !== 'linesNotAdded'){
				$scope.showImportParticipantsActivitiesErrors[i] = false;
			}
			else if(i === 'linesNotAdded'){
				$scope.showImportParticipantsActivitiesErrors[i] = [];
			}
		}
	};

	// Uploads the user's file
	$scope.importParticipantsActivities = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.importedCount = 0;
		$scope.resetFileErrors();
		if($scope.checkFileInput() === true){
			$scope.importParticipantsActivitiesToS3().then(function(data){
				return importParticipantsActivitiesModalService.upload(data.Key);
			}, function(){
				$scope.callSuccess = false;
			}).then(function(data){
				$scope.importedCount = data.results.imported_count;
				$scope.showImportParticipantsActivitiesErrors.linesNotAdded = data.results.lines_not_added;
				document.getElementById('file-input').value = null;
				$scope.importParticipantsActivitiesObject = {
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

	// Uploads our CSV / Excel document
	$scope.importParticipantsActivitiesToS3 = function(){
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
				Key: 'imports/participants/activities/' + $rootScope.user.facility_id + '-' + Math.round(Math.random() * (999999 - 100000) + 100000),
				Body: file,
				ACL: 'authenticated-read'
			}, function(error, data){
				error ? reject(error) : resolve(data);
			});
		})
	};


});