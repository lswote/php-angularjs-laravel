describe('notConfirmedParticipantsModalService Test Suite', function(){

    var notConfirmedParticipantsModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_notConfirmedParticipantsModalService_, $httpBackend){
        notConfirmedParticipantsModalService = _notConfirmedParticipantsModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getNotConfirmedParticipantsResult = notConfirmedParticipantsModalService.getNotConfirmedParticipants();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getNotConfirmedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getNotConfirmedParticipantsResult = notConfirmedParticipantsModalService.getNotConfirmedParticipants();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getNotConfirmedParticipantsResult.$$state.value).toEqual('chicken fingers');
    });

});