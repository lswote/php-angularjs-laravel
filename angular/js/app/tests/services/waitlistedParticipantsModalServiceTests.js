describe('waitlistedParticipantsModalService Test Suite', function(){

    var waitlistedParticipantsModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_waitlistedParticipantsModalService_, $httpBackend){
        waitlistedParticipantsModalService = _waitlistedParticipantsModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getWaitlistedParticipantsResult = waitlistedParticipantsModalService.getWaitlistedParticipants();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getWaitlistedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getWaitlistedParticipantsResult = waitlistedParticipantsModalService.getWaitlistedParticipants();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getWaitlistedParticipantsResult.$$state.value).toEqual('chicken fingers');
    });

});