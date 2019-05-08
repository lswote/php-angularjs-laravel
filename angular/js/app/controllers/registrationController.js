teamsRIt.controller('registrationController', function($scope, $rootScope, $location, $window, internalConstants, registrationService){

    // Default values
    $scope.token = null;
    $scope.email = null;
    $scope.username = null;
    $scope.password = null;
    $scope.firstName = null;
    $scope.lastName = null;
    // Errors object
	$scope.errors = {
		token: false,
		emailRequired: false,
		usernameRequired: false,
		usernameTaken: false,
		password: false,
		firstName: false,
		lastName: false
	};

	// Validate all of our password inputs
    $scope.checkInputs = function(){
    	var noErrors = true;
		if(!$scope.token){
			$scope.errors.token = true;
    		noErrors = false;
		}
		if(!$scope.email){
			$scope.errors.emailRequired = true;
    		noErrors = false;
		}
		if(!$scope.username){
			$scope.errors.usernameRequired = true;
    		noErrors = false;
		}
    	if(!$scope.password || $scope.password.length < 6){
    		$scope.errors.password = true;
    		noErrors = false;
		}
		if(!$scope.firstName){
			$scope.errors.firstName= true;
    		noErrors = false;
		}
		if(!$scope.lastName){
			$scope.errors.lastName = true;
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

    // Registers a new account
	$scope.register = function(){
		$scope.resetErrors();
		if($scope.checkInputs() === true){
			$scope.registerInProgress = true;
			registrationService.register($scope.token, $scope.email, $scope.username, $scope.password, $scope.firstName, $scope.lastName).then(function(data){
				$rootScope.userAuthenticated = true;
				$rootScope.user = {
					id: data.user.id,
					first_name: data.user.first_name,
					last_name: data.user.last_name,
					email: data.user.email,
					username: data.user.username,
					privilege: data.user.privilege
				};
				$rootScope.apiToken = data.user.token;
				$window.localStorage.setItem('apiToken', $rootScope.apiToken);
				$rootScope.currentPath = '/';
				$location.path('/');
			}, function(data){
				if(data.error === 'Invalid token'){
					$scope.errors.token = true;
				}
				else if(data.error === 'Username taken'){
					$scope.errors.usernameTaken = true
				}
				else{
					$window.alert('Something went wrong.  Registration failed');
				}
			}).finally(function(){
				$scope.registerInProgress = false;
			});
		}
	};

	// Get token param from URL if provided
	$scope.parseUrlTokenParam = function(){
		if($location.search.token){
			$scope.token = $location.search.token;
		}
	};

});