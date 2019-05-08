describe('rsvpService Test Suite', function(){

    var rsvpService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_rsvpService_, $httpBackend){
        rsvpService = _rsvpService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoints
    	var getEventResult = rsvpService.getEvent();
    	var getChallengeResult = rsvpService.getChallenge();
    	var getRulesResult = rsvpService.getRules();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getEventResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		expect(getChallengeResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		expect(getRulesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test POST endpoints
        var rsvpResult = rsvpService.rsvp();
        var emailChallengerResult = rsvpService.emailChallenger();
        httpBackend.when('POST', /\/event/|/\/email/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(rsvpResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(emailChallengerResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoints
		var getEventResult = rsvpService.getEvent();
		var getChallengeResult = rsvpService.getChallenge();
        var getRulesResult = rsvpService.getRules();
		httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getEventResult.$$state.value).toEqual('chicken fingers');
        expect(getChallengeResult.$$state.value).toEqual('chicken fingers');
        expect(getRulesResult.$$state.value).toEqual('chicken fingers');
		// Test POST endpoints
		var rsvpResult = rsvpService.rsvp();
		var emailChallengerResult = rsvpService.emailChallenger();
        httpBackend.when('POST', /\/event/|/\/email/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(rsvpResult.$$state.value).toEqual('chicken fingers');
        expect(emailChallengerResult.$$state.value).toEqual('chicken fingers');
    });

});