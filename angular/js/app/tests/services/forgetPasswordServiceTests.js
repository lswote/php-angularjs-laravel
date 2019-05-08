describe('forgotPasswordService Test Suite', function(){

    var forgotPasswordService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_forgotPasswordService_, $httpBackend){
        forgotPasswordService = _forgotPasswordService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
        var sendEmailResult = forgotPasswordService.sendEmail();
        httpBackend.when('POST', /\/password/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(sendEmailResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
		var sendEmailResult = forgotPasswordService.sendEmail();
        httpBackend.when('POST', /\/password/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(sendEmailResult.$$state.value).toEqual('chicken fingers');
    });

});