describe('dashboardService Test Suite', function(){

    var dashboardService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_dashboardService_, $httpBackend){
        dashboardService = _dashboardService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoints
        var getFacilityInfoResult = dashboardService.getEvents();
		var getEventsResult = dashboardService.getEvents();
        httpBackend.when('GET', /\/events/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getFacilityInfoResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoints
		var getFacilityInfoResult = dashboardService.getEvents();
        var getEventsResult = dashboardService.getEvents();
        httpBackend.when('GET', /\/events/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getFacilityInfoResult.$$state.value).toEqual('chicken fingers');
        expect(getEventsResult.$$state.value).toEqual('chicken fingers');
    });

});