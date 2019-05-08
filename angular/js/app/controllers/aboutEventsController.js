teamsRIt.controller('aboutEventsController', function($scope, $rootScope, $window){
    $rootScope.currentPage = 'about-events';
    $rootScope.facility = {};
    $rootScope.facility.image_url = 'images/bannergolf2.jpg';
    $scope.selectedEvent = 1;
});
