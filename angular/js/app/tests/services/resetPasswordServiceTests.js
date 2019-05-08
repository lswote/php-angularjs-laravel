describe('resetPasswordService Test Suite', function(){

    var resetPasswordService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_resetPasswordService_, $httpBackend){
        resetPasswordService = _resetPasswordService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test PUT endpoint
        var resetResult = resetPasswordService.reset();
        httpBackend.when('PUT', /\/password/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(resetResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test PUT endpoint
		var resetResult = resetPasswordService.reset();
        httpBackend.when('PUT', /\/password/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(resetResult.$$state.value).toEqual('chicken fingers');
    });

});