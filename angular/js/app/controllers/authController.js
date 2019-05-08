teamsRIt.controller('authController', function($scope, $rootScope, $location, $window, internalConstants, authService){

	// Make base URL available in our controllers
	$rootScope.baseURL = internalConstants.baseURL;
	// Current path
	$rootScope.currentPath = $location.path();
	// Tells us which modal view to show
	$rootScope.showModalView = {};
	// Tells us whether a modal view is view only
	$rootScope.modalViewOnly = {};

    // Our login form object
    $scope.loginObject = {
    	username: null,
		password: null
	};

    // Resets all login inputs
    $scope.resetLoginInputs = function(){
    	for(var i in $scope.loginObject){
    		if($scope.loginObject.hasOwnProperty(i)){
    			$scope.loginObject[i] = null;
			}
		}
	};

    // Authenticates user credentials and sets up an API token
    $scope.login = function(){
        $scope.loginFailed = false;
        authService.login($scope.loginObject.username, $scope.loginObject.password).then(function(data){
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
        }, function(){
        	$rootScope.userAuthenticated = false;
            $scope.loginFailed = true;
            $('#login-form #username').focus();
        });
        $scope.resetLoginInputs();
    };

    // Returns the API token given as a URL param if it exists
    $scope.parseApiTokenFromUrl = function(){
		var params = $location.search();
		return params.api_token;
	};

    // Checks whether we have a saved API token and if so, whether the token is valid or not
    $scope.authAPIToken = function(){
        $rootScope.apiToken = $window.localStorage.getItem('apiToken');
        if(!$rootScope.apiToken || $rootScope.apiToken === 'undefined'){
        	$rootScope.apiToken = $scope.parseApiTokenFromUrl();
        	$window.localStorage.setItem('apiToken', $rootScope.apiToken);
		}
		$location.search('api_token', null);
        if($rootScope.apiToken){
            authService.authAPIToken($rootScope.apiToken).then(function(data){
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
            }, function(){
                $rootScope.userAuthenticated = false;
            }).finally(function(){
                $scope.userAuthenticationComplete = true;
            });
        }
        else{
            $scope.userAuthenticationComplete = true;
        }
    };
    $scope.authAPIToken();

    // Redirects user to homepage site
    $scope.redirectToHomePage = function(){
    	$window.location.href = internalConstants.homepageURL;
	};

    // Logs our user out and deactivates the token he / she has been using
    $scope.logout = function(){
        authService.logout();
        $window.localStorage.removeItem('apiToken');
        $scope.userAuthenticationComplete = true;
        $rootScope.userAuthenticated = false;
        $scope.redirectToHomePage();
    };

    // Show / hide logout link
    $scope.toggleLogout = function(){
    	$scope.showLogout = !$scope.showLogout;
	};

    // Show / hide our pop-up modal
    $rootScope.toggleModal = function(largeSize){
		$rootScope.showModal = !$rootScope.showModal;
		if(!$rootScope.showModal){
			for(var i in $rootScope.showModalView){
				if($rootScope.showModalView.hasOwnProperty(i)){
					$rootScope.showModalView[i] = false;
				}
			}
			$scope.callSuccess = false;
			$rootScope.largeSizeModal = false;
			if($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest'){
				$scope.$eval();
			}
			else{
				$scope.$apply();
			}
		}
		else{
			$rootScope.largeSizeModal = largeSize ? largeSize : false;
		}
	};

    // Bind click event so that we close our pop-up modal with any outside click when it's visible
    $(document).on('click touchstart', function(event){
		if($(event.target).closest('#modal, .modal-toggle').length === 0 && $rootScope.showModal){
			$rootScope.toggleModal();
			$scope.$apply();
		}
		if($(event.target).closest('.icon').length === 0 && $rootScope.areDropdownsOpen && $rootScope.areDropdownsOpen()){
			$rootScope.closeAllDropdowns();
			$scope.$apply();
		}
	});

});