describe('eventToDosController Test Suite', function(){
    var q, deferred, scope, rootScope, eventService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        eventService = {
            getEventsAsLeader: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(eventService, 'getEventsAsLeader').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
        rootScope = $rootScope;
        rootScope.user = {
            privilege: 'facility leader'
        };
        scope = $rootScope.$new();
        q = $q;
        $injector
            .get('$httpBackend')
            .whenGET(/\/pages\//)
            .respond(200);
        $controller('eventToDosController', {
            $scope: scope,
            $routeParams: {
                id: 109
            },
            eventService: eventService
        });
    }));

    /*describe('getEventsAsLeader Test', function(){
        it('should set scope.displayEventForm to its correct value after eventService.getEventsAsLeader() return success', function(){
            scope.displayEventForm = false;
            scope.getEventsAsLeader();
            scope.$apply();
            expect(eventService.getEventsAsLeader).toHaveBeenCalled();
            expect(scope.displayEventForm).toBeTruthy();
        });
    });

    describe('getEventsAsLeader Test', function(){
        it('should calculate the correct due date', function(){
            scope.selectedEvent = { start_date: new Date() };
            scope.tasks = [
                [
                    {
                        description: 'Testing 1',
                        id: '1.0',
                        prevTask: null,
                        daysOffset: 0,
                        status: 'I'
                    },
                    {
                        description: 'Testing 2',
                        id: '1.1',
                        prevTask: '1.0',
                        daysOffset: 1,
                        status: 'I'
                    },
                    {
                        description: 'Testing 3',
                        id: '1.2',
                        prevTask: '1.1',
                        daysOffset: 1,
                        status: 'I'
                    }
                ]
            ];
            scope.$apply();
            var task1 = scope.tasks[0][0];
            expect(eventService.calculateDueDate(0, task1)).toBeTruthy();
        });
    });*/

});
