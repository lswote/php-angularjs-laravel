describe('eventSignupsService Test Suite', function(){

    var eventSignupsService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_eventSignupsService_, $httpBackend){
        eventSignupsService = _eventSignupsService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
        // Test PUT endpoint
		var eventUser = {};
		var updateSignupResult = eventSignupsService.updateSignup(eventUser);
		var eventUsers = [{
			event_id: 2
		}];
        var updateSignupsResult = eventSignupsService.updateSignups(eventUsers);
        httpBackend.when('PUT', /\/signup/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateSignupResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(updateSignupsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
        // Test PUT endpoint
		var eventUser = {};
		var updateSignupResult = eventSignupsService.updateSignup(eventUser);
		var eventUsers = [{
			event_id: 2
		}];
		var updateSignupsResult = eventSignupsService.updateSignups(eventUsers);
        httpBackend.when('PUT', /\/signup/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateSignupResult.$$state.value).toEqual('chicken fingers');
        expect(updateSignupsResult.$$state.value).toEqual('chicken fingers');
    });

});