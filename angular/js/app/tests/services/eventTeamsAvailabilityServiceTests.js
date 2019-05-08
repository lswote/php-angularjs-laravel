describe('eventTeamsAvailabilityService Test Suite', function(){

    var eventTeamsAvailabilityService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_eventTeamsAvailabilityService_, $httpBackend){
        eventTeamsAvailabilityService = _eventTeamsAvailabilityService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
        // Test GET endpoint
		var getAvailabilityResult = eventTeamsAvailabilityService.getAvailability();
        httpBackend.when('GET', /\/teams/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getAvailabilityResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    	// Test PUT endpoints
		var updateAvailabilitiesResult = eventTeamsAvailabilityService.updateAvailabilities();
        var updateAvailabilityResult = eventTeamsAvailabilityService.updateAvailability();
        httpBackend.when('PUT', /\/teams/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateAvailabilitiesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(updateAvailabilityResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
        // Test GET endpoint
		var getAvailabilityResult = eventTeamsAvailabilityService.getAvailability();
		httpBackend.when('GET', /\/teams/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getAvailabilityResult.$$state.value).toEqual('chicken fingers');
    	// Test PUT endpoints
		var updateAvailabilitiesResult = eventTeamsAvailabilityService.updateAvailabilities();
		var updateAvailabilityResult = eventTeamsAvailabilityService.updateAvailability();
        httpBackend.when('PUT', /\/teams/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateAvailabilitiesResult.$$state.value).toEqual('chicken fingers');
        expect(updateAvailabilityResult.$$state.value).toEqual('chicken fingers');
    });

});