teamsRIt.controller('forgotPasswordController', function($scope, $rootScope, $location, $window, internalConstants, forgotPasswordService){

    // Default values
    $scope.username = null;
    // Errors object
	$scope.errors = {
		username: false
	};

	// Validate all of our password inputs
    $scope.checkInputs = function(){
    	var noErrors = true;
		if(!$scope.username){
			$scope.errors.username = true;
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

    // Send reset e-mail
	$scope.sendEmail = function(){
		$scope.resetErrors();
		if($scope.checkInputs() === true){
			$scope.sendEmailInProgress = true;
			forgotPasswordService.sendEmail($scope.username).then().finally(function(){
				$window.alert('Thank you.  A reset e-mail has been sent to your inbox.');
				$rootScope.currentPath = '/';
				$location.path('/');
				$scope.sendEmailInProgress = false;
			});
		}
	};

});