teamsRIt.service('activityMasterRecordModalService', function($q, $http, internalConstants, helperService){

    // Get a list of all activities
    this.getActivities = function(){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: internalConstants.baseURL + 'v1/activities'
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Adds a new activity
    this.addActivity = function(activity){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: internalConstants.baseURL + 'v1/activity',
			data: $.param({
                name: helperService.capitalizeWords(activity.name),
                two_teams_per_line: activity.twoTeamsPerLine,
				three_teams_per_line: activity.threeTeamsPerLine,
				four_teams_per_line: activity.fourTeamsPerLine,
				five_teams_per_line: activity.fiveTeamsPerLine,
				doubles: activity.doubles,
				competition_scoring_format: activity.competitionScoringFormat,
				line_scoring_format: activity.lineScoringFormat,
				point: activity.pointHighLow,
				surface_type: activity.surfaceType,
				line_type: activity.setOrGame
            })
        })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    // Updates an existing activity
    this.updateActivity = function(activity){
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: internalConstants.baseURL + 'v1/activity/' + activity.id,
			data: $.param({
                name: activity.name,
                two_teams_per_line: activity.twoTeamsPerLine,
				three_teams_per_line: activity.threeTeamsPerLine,
				four_teams_per_line: activity.fourTeamsPerLine,
				five_teams_per_line: activity.fiveTeamsPerLine,
				doubles: activity.doubles,
				competition_scoring_format: activity.competitionScoringFormat,
				line_scoring_format: activity.lineScoringFormat,
				point: activity.pointHighLow,
				surface_type: activity.surfaceType,
				line_type: activity.setOrGame
            })
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