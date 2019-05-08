describe('editParticipantModalService Test Suite', function(){

    var editParticipantModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_editParticipantModalService_, $httpBackend){
        editParticipantModalService = _editParticipantModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getParticipantsResult = editParticipantModalService.getParticipants();
        httpBackend.when('GET', /\/participants/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test PUT endpoint
		var user = {};
        var updateResult = editParticipantModalService.update(user);
        httpBackend.when('PUT', /\/user/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getParticipantsResult = editParticipantModalService.getParticipants();
        httpBackend.when('GET', /\/participants/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getParticipantsResult.$$state.value).toEqual('chicken fingers');
        // Test PUT endpoint
		var user = {};
		var updateResult = editParticipantModalService.update(user);
        httpBackend.when('PUT', /\/user/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateResult.$$state.value).toEqual('chicken fingers');
    });

});