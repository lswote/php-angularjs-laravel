teamsRIt.controller('importParticipantsModalController', function($scope, $rootScope, importParticipantsModalService, internalConstants){

	// Default values
	$scope.callSuccess = false;
	$scope.importedCount = false;

	// Object that determines which upload file input error to show
	$scope.showImportParticipantsErrors = {
		file: false,
		fileType: false,
		size: false,
		linesNotAdded: []
	};
	// Object that holds our new file info
	$scope.importParticipantsObject = {
		inputFileText: 'No file selected'
	};
	// File types we allow for upload
	$scope.allowedFileTypes = ['csv'];

	// Input errors when file is changed
	$(document).on('change', '#file-input', function(){
		$scope.showImportParticipantsErrors.file = false;
		var inputFileName = $(this)[0].files[0].name;
		var inputFileType = inputFileName.split('.').pop().toLowerCase();
		if($scope.allowedFileTypes.indexOf(inputFileType) > -1){
			$scope.importParticipantsObject.inputFileText = inputFileName;
		}
		else{
			$scope.importParticipantsObject.inputFileText = 'File type not supported';
		}
		$scope.showImportParticipantsErrors.size = $(this)[0].files[0].size > 11000000;
		$scope.$apply();
	});

	// Check the file the user wants to upload
	$scope.checkFileInput = function(){
		var noErrors = true;
		if($scope.importParticipantsObject.inputFileText == 'No file selected'){
			$scope.showImportParticipantsErrors.file = true;
			noErrors = false;
		}
		if($scope.importParticipantsObject.inputFileText == 'File type not supported'){
			$scope.showImportParticipantsErrors.fileType = true;
			noErrors = false;
		}
		if($scope.showImportParticipantsErrors.size){
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all upload file errors
	$scope.resetFileErrors = function(){
		for(var i in $scope.showImportParticipantsErrors){
			if($scope.showImportParticipantsErrors.hasOwnProperty(i) && i !==  'size' && i !== 'linesNotAdded'){
				$scope.showImportParticipantsErrors[i] = false;
			}
			else if(i === 'linesNotAdded'){
				$scope.showImportParticipantsErrors[i] = [];
			}
		}
	};

	// Uploads the user's file
	$scope.importParticipants = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.importedCount = 0;
		$scope.resetFileErrors();
		if($scope.checkFileInput() === true){
			$scope.importParticipantsToS3().then(function(data){
				if($rootScope.importType === 'facilities'){
					return importParticipantsModalService.facility(data.Key);
				}
				else{
					return importParticipantsModalService.event($rootScope.selectedEvent.id, data.Key);
				}
			}, function(){
				$scope.callSuccess = false;
			}).then(function(data){
				$scope.importedCount = data.results.imported_count;
				$scope.showImportParticipantsErrors.linesNotAdded = data.results.lines_not_added;
				document.getElementById('file-input').value = null;
				$scope.importParticipantsObject = {
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
	$scope.importParticipantsToS3 = function(){
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
		var id = $rootScope.importType === 'facilities' ? $rootScope.user.facility_id : $rootScope.selectedEvent.id;
		return new Promise(function(resolve, reject){
			s3.upload({
				Key: 'imports/participants/' + $rootScope.importType + '/' + id + '-' + Math.round(Math.random() * (999999 - 100000) + 100000),
				Body: file,
				ACL: 'authenticated-read'
			}, function(error, data){
				error ? reject(error) : resolve(data);
			});
		})
	};


});