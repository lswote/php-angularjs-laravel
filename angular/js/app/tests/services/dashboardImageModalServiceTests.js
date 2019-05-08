describe('dashboardImageModalService Test Suite', function(){

    var dashboardImageModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_dashboardImageModalService_, $httpBackend){
        dashboardImageModalService = _dashboardImageModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test PUT endpoint
		var event = {};
        var imageResult = dashboardImageModalService.image(event);
        httpBackend.when('PUT', /\/image/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(imageResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test PUT endpoint
        var event = {};
		var imageResult = dashboardImageModalService.image(event);
        httpBackend.when('PUT', /\/image/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(imageResult.$$state.value).toEqual('chicken fingers');
    });

});