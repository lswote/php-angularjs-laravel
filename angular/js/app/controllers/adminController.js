teamsRIt.controller('adminController', function($scope, $rootScope, dashboardService){

	// Current page variable
	$rootScope.currentPage = 'admin';

	// Gets info about our facility
	$scope.getFacilityInfo = function(){
		dashboardService.getFacilityInfo().then(function(data){
			$rootScope.facility = data.facility;
			if(!data.facility.image_url || $rootScope.user.privilege === 'admin'){
				$rootScope.facility.image_url = '../../../images/bannergolf2.jpg';
			}
		});
	};
	$scope.getFacilityInfo();

});