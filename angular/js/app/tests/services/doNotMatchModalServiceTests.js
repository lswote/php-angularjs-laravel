describe('doNotMatchModalService Test Suite', function(){

    var doNotMatchModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_doNotMatchModalService_, $httpBackend){
        doNotMatchModalService = _doNotMatchModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoint
    	var getDoNotMatchRequestsResult = doNotMatchModalService.getDoNotMatchRequests();
    	httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getDoNotMatchRequestsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test DELETE endpoint
        var deleteRequestResult = doNotMatchModalService.deleteRequest();
        httpBackend.when('DELETE', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(deleteRequestResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoint
		var getDoNotMatchRequestsResult = doNotMatchModalService.getDoNotMatchRequests();
		httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getDoNotMatchRequestsResult.$$state.value).toEqual('chicken fingers');
		// Test DELETE endpoint
		var deleteRequestResult = doNotMatchModalService.deleteRequest();
        httpBackend.when('DELETE', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(deleteRequestResult.$$state.value).toEqual('chicken fingers');
    });

});