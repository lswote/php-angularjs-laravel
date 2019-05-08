teamsRIt.controller('resetPasswordController', function($scope, $rootScope, $location, $window, internalConstants, resetPasswordService){

    // Default values
	$scope.token = null;
    $scope.newPassword = null;
    $scope.newPasswordConfirm = null;
    // Errors object
	$scope.errors = {
		newPassword: false,
		newPasswordConfirm: false
	};

	// Validate all of our password inputs
    $scope.checkInputs = function(){
    	var noErrors = true;
    	if(!$scope.token){
    		$scope.errors.token = true;
    		noErrors = false;
		}
		if(!$scope.newPassword || $scope.newPassword.length < 6){
			$scope.errors.newPassword = true;
    		noErrors = false;
		}
		if(!$scope.newPasswordConfirm || $scope.newPassword !== $scope.newPasswordConfirm){
			$scope.errors.newPasswordConfirm= true;
    		noErrors = false;
		}
		return noErrors;
	};

    // Hide all errors
    $scope.resetErrors = function(){
    	for(var i in $scope.errors){
    		if($scope.errors.hasOwnProperty(i)){
    			$scope.errors[i] = false;
			}
		}
	};

    // Reset password for account
	$scope.reset = function(){
		$scope.resetErrors();
		if($scope.checkInputs() === true){
			$scope.resetInProgress = true;
			resetPasswordService.reset($scope.token, $scope.newPassword).then(function(data){
				$rootScope.userAuthenticated = true;
				$rootScope.user = {
					id: data.user.id,
					first_name: data.user.first_name,
					last_name: data.user.last_name,
					email: data.user.email,
					username: data.user.username,
					facility_id: data.user.facility_id,
					privilege: data.user.privilege
				};
				$rootScope.apiToken = data.user.token;
				$window.localStorage.setItem('apiToken', $rootScope.apiToken);
				$window.alert('Thank you.  Your password has been reset.  You have been logged in');
				$rootScope.currentPath = '/';
				$location.path('/');
			}, function(){
				$window.alert('Invalid token provided');
			}).finally(function(){
				$scope.resetInProgress = false;
			});
		}
	};

	// Get token param from URL if provided
	$scope.parseUrlTokenParam = function(){
		if($location.search().token){
			$scope.token = $location.search().token;
		}
	};
	$scope.parseUrlTokenParam();

});