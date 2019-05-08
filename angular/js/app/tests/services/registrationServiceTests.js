describe('registrationService Test Suite', function(){

    var registrationService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_registrationService_, $httpBackend){
        registrationService = _registrationService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
        var registerResult = registrationService.register();
        httpBackend.when('POST', /\/register/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(registerResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
        var registerResult = registrationService.register();
        httpBackend.when('POST', /\/register/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(registerResult.$$state.value).toEqual('chicken fingers');
    });

});