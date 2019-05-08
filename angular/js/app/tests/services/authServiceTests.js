describe('authService Test Suite', function(){

    var authService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_authService_, $httpBackend){
        authService = _authService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoint
        var authAPITokenResult = authService.authAPIToken();
        httpBackend.when('GET', /\/verify/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(authAPITokenResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test POST endpoint
        var loginResult = authService.login();
        httpBackend.when('POST', /\/login/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(loginResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test DELETE endpoint
        var logoutResult = authService.logout();
        httpBackend.when('DELETE', /\/logout/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(logoutResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoint
		var authAPITokenResult = authService.authAPIToken();
        httpBackend.when('GET', /\/verify/).respond(500, 'chicken fingers');
        httpBackend.flush();
		expect(authAPITokenResult.$$state.value).toEqual('chicken fingers');
		// Test POST endpoint
        var loginResult = authService.login();
        httpBackend.when('POST', /\/login/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(loginResult.$$state.value).toEqual('chicken fingers');
        // Test DELETE endpoints
        var logoutResult = authService.logout();
        httpBackend.when('DELETE', /\/logout/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(logoutResult.$$state.value).toEqual('chicken fingers');
    });

});