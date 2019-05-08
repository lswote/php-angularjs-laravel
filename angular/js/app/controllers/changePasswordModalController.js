teamsRIt.controller('changePasswordModalController', function($scope, $rootScope, $window, changePasswordModalService){

	// Object that determines which change password error to show
	$scope.changePasswordErrors = {
		currentPassword: false,
		newPassword: false,
		newPasswordConfirm: false
	};

	// Our change password object
	$scope.changePasswordObject = {
		currentPassword: null,
		newPassword: null,
		newPasswordConfirm: null
	};

	// Check our inputs
	$scope.checkChangePasswordInputs = function(){
		var noErrors = true;
		if(!$scope.changePasswordObject.currentPassword){
			$scope.changePasswordErrors.currentPassword = true;
			noErrors = false;
		}
		if(!$scope.changePasswordObject.newPassword || $scope.changePasswordObject.newPassword.length < 6){
			$scope.changePasswordErrors.newPassword = true;
			noErrors = false;
		}
		if(!$scope.changePasswordObject.newPasswordConfirm || $scope.changePasswordObject.newPasswordConfirm !== $scope.changePasswordObject.newPassword){
			$scope.changePasswordErrors.newPasswordConfirm = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all change password errors
	$scope.resetChangePasswordErrors = function(){
		for(var i in $scope.changePasswordErrors){
			if($scope.changePasswordErrors.hasOwnProperty(i)){
				$scope.changePasswordErrors[i] = false;
			}
		}
	};

	// Changes password for current user
	$scope.changePassword = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetChangePasswordErrors();
		if($scope.checkChangePasswordInputs() === true){
			changePasswordModalService.changePassword($scope.changePasswordObject.currentPassword, $scope.changePasswordObject.newPassword).then(function(){
				$scope.changePasswordObject = {
					currentPassword: null,
					newPassword: null,
					newPasswordConfirm: null
				};
				$scope.callSuccess = true;
			}, function(data){
				var error = data.error === 'Current password is invalid' ? data.error : 'Something went wrong.  Password was not changed';
				$window.alert(error);
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});