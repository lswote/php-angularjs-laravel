describe('addEventParticipantModalService Test Suite', function(){

    var addEventParticipantModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addEventParticipantModalService_, $httpBackend){
        addEventParticipantModalService = _addEventParticipantModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoint
        var getEventParticipantsResult = addEventParticipantModalService.getEventParticipants();
        httpBackend.when('GET', /\/participants/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getEventParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test POST endpoint
		var id = 5;
		var username = '';
		var participantType = '';
        var addEventParticipantResult = addEventParticipantModalService.addEventParticipant(id, username, participantType);
        httpBackend.when('POST', /\/participant/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addEventParticipantResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoint
        var getEventParticipantsResult = addEventParticipantModalService.getEventParticipants();
        httpBackend.when('GET', /\/participants/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getEventParticipantsResult.$$state.value).toEqual('chicken fingers');
		// Test POST endpoint
        var id = 5;
		var username = '';
		var participantType = '';
        var addEventParticipantResult = addEventParticipantModalService.addEventParticipant(id, username, participantType);
        httpBackend.when('POST', /\/participant/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addEventParticipantResult.$$state.value).toEqual('chicken fingers');
    });

});