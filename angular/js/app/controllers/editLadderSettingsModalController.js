teamsRIt.controller('editLadderSettingsModalController', function($scope, $rootScope, ladderModalService){

    $scope.settings={
        receive_daily_summary: '0',
		days: 1
    };

    // Get event data
    $scope.getLadderSettings = function(){
        ladderModalService.getUserSettings($rootScope.selectedEvent.id, $rootScope.user.id).then(function(data){
            $scope.settings.receive_daily_summary = data.settings.receive_daily_summary.toString();
        });
    }
    $scope.getLadderSettings();

    $scope.saveLadderSettings=function(){
        ladderModalService.saveUserSettings($rootScope.selectedEvent.id, $rootScope.user.id, $scope.settings).then(function(){
        }, function(data){
            alert('Something went wrong. '+data.error);
		}).finally(function(){
            $scope.toggleModal();
        });
    }

    $scope.requestSummary = function(){
        ladderModalService.getSummaryReport($rootScope.selectedEvent.id, $scope.settings.days).then(function(){ 
        });
    }

});
