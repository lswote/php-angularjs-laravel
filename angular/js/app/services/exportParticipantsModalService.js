teamsRIt.service('exportParticipantsModalService', function($q, $http, $rootScope, $window, internalConstants){

    // Request to download event participants to .csv file
    this.downloadEvent = function(eventId, exportObject){
        url = internalConstants.baseURL + 'v1/event/' + eventId + '/participants/export?api_token=' + $rootScope.apiToken;
		for(var i in exportObject){
			if(exportObject.hasOwnProperty(i)){
				url += '&'+i+'='+exportObject[i];
			}
		}
        $window.open(encodeURI(url));
    };

    // Request to download facility participants to .csv file
    this.downloadFacility = function(facilityId, exportObject){
        url = internalConstants.baseURL + 'v1/facility/' + facilityId + '/participants/export?api_token=' + $rootScope.apiToken;
		for(var i in exportObject){
			if(exportObject.hasOwnProperty(i)){
				url += '&'+i+'='+exportObject[i];
			}
		}
        $window.open(encodeURI(url));
    };

});