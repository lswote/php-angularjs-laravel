teamsRIt.controller('navigationController', function($scope, $rootScope){

	// Shows / hides nav links container
    $rootScope.toggleNavLinks = function(){
    	$('#navigation').toggle();
    };

    // Bind click event so that we close navigation with any outside click when it's open
    $(document).on('click touchstart', function(event){
		if($(event.target).closest('#navigation').length === 0 && !$(event.target).is('.hamburger') && $('#navigation').is(':visible')){
			$rootScope.toggleNavLinks();
			$scope.$apply();
		}
	});

    // Escape key closes navigation if it is open
    $(document).on('keyup', function(event){
    	if($('#navigation').is(':visible') && event.which == 27){
    		$rootScope.toggleNavLinks();
			$scope.$apply();
		}
	});

});