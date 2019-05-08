describe('addFacilityParticipantModalService Test Suite', function(){

    var addFacilityParticipantModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addFacilityParticipantModalService_, $httpBackend){
        addFacilityParticipantModalService = _addFacilityParticipantModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
		var participant = {};
        var addFacilityParticipantrResult = addFacilityParticipantModalService.addFacilityParticipant(participant);
        httpBackend.when('POST', /\/participant/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addFacilityParticipantrResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
        var participant = {};
		var addFacilityParticipantrResult = addFacilityParticipantModalService.addFacilityParticipant(participant);
        httpBackend.when('POST', /\/participant/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addFacilityParticipantrResult.$$state.value).toEqual('chicken fingers');
    });

});