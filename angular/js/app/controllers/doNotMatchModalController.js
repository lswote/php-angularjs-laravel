teamsRIt.controller('doNotMatchModalController', function($scope, $rootScope, doNotMatchModalService, helperService){

	// Get all do not match requests for an event
	$scope.getDoNotMatchRequests = function(){
		$scope.doNotMatchInProgres = true;
		doNotMatchModalService.getDoNotMatchRequests($rootScope.selectedEvent.id).then(function(data){
			$scope.doNotMatchRequests = data.do_not_match_requests;
		}).finally(function(){
			$scope.doNotMatchInProgres = false;
		});
	};
	$scope.getDoNotMatchRequests();

	// Deletes a do not match request
	$scope.deleteRequest = function(requestId){
		doNotMatchModalService.deleteRequest(requestId);
		var index = helperService.findArrayIndex($scope.doNotMatchRequests, 'id', requestId);
		$scope.doNotMatchRequests.splice(index, 1);
	};

});