teamsRIt.service('printScorecardsModalService', function($q, $http, internalConstants){

    // Generates a scorecard
    this.generateScorecard = function(id, size, roundDate){
        var deferred = $q.defer();
        var roundDateString = '';
        if(roundDate){
        	roundDateString = roundDateString + '?round_date=' + roundDate;
		}
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/event/' + id + '/scorecard/' + size + roundDateString,
		    responseType: 'arraybuffer'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

});