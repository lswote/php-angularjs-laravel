describe('addSubAvailabilityModalService Test Suite', function(){

    var addSubAvailabilityModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addSubAvailabilityModalService_, $httpBackend){
        addSubAvailabilityModalService = _addSubAvailabilityModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoint
        var getSubstitutesResult = addSubAvailabilityModalService.getSubstitutes();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getSubstitutesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test POST endpoint
		var id = 5;
		var username = '';
		var participantType = '';
        var addSubstituteResult = addSubAvailabilityModalService.addSubstitute(id, username, participantType);
        httpBackend.when('POST', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addSubstituteResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoint
        var getSubstitutesResult = addSubAvailabilityModalService.getSubstitutes();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getSubstitutesResult.$$state.value).toEqual('chicken fingers');
		// Test POST endpoint
        var id = 5;
		var username = '';
		var participantType = '';
        var addSubstituteResult = addSubAvailabilityModalService.addSubstitute(id, username, participantType);
        httpBackend.when('POST', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addSubstituteResult.$$state.value).toEqual('chicken fingers');
    });

});