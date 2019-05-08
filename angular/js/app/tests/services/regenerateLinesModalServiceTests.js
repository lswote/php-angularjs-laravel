describe('regenerateLinesModalService Test Suite', function(){

    var regenerateLinesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_regenerateLinesModalService_, $httpBackend){
        regenerateLinesModalService = _regenerateLinesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test POST endpoint
    	var regenerateLinesResult = regenerateLinesModalService.regenerateLines();
    	httpBackend.when('POST', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(regenerateLinesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test POST endpoint
		var regenerateLinesResult = regenerateLinesModalService.regenerateLines();
		httpBackend.when('POST', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(regenerateLinesResult.$$state.value).toEqual('chicken fingers');
    });

});