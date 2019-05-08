teamsRIt.service('exportParticipantsActivitiesModalService', function($q, $http, $rootScope, $window, internalConstants){

    // Request to download .csv file
    this.download = function(){
    	$window.open(internalConstants.baseURL + 'v1/facility/participants/activities?api_token=' + $rootScope.apiToken);
    };

});