describe('emailService Test Suite', function(){

    var emailService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_emailService_, $httpBackend){
        emailService = _emailService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoints
		var getPotentialParticipantsResult = emailService.getPotentialParticipants();
		var getPotentialAdditionalParticipantsResult = emailService.getPotentialAdditionalParticipants();
		var getConfirmedParticipantsResult = emailService.getConfirmedParticipants();
		var getConfirmedParticipantsWithLinesResult = emailService.getConfirmedParticipantsWithLines();
		var getNotRespondedParticipantsResult = emailService.getNotRespondedParticipants();
		var getWaitlistedParticipantsResult = emailService.getWaitlistedParticipants();
		httpBackend.when('GET', /\/participants/).respond({
            myKey: 'myString'
        });
		httpBackend.flush();
        expect(getPotentialParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getPotentialAdditionalParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getConfirmedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getConfirmedParticipantsWithLinesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getNotRespondedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getWaitlistedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test POST endpoints
        var potentialParticipantstResult = emailService.potentialParticipants();
        var participantsResult = emailService.participants();
        var participantsReminderResult = emailService.participantsReminder();
        var notRespondedParticipantsResult = emailService.notRespondedParticipants();
        var waitlistedParticipantsResult = emailService.waitlistedParticipants();
        httpBackend.when('POST', /\/participants/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(potentialParticipantstResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(participantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(participantsReminderResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(notRespondedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(waitlistedParticipantsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoints
		var getPotentialParticipantsResult = emailService.getPotentialParticipants();
		var getPotentialAdditionalParticipantsResult = emailService.getPotentialAdditionalParticipants();
		var getConfirmedParticipantsResult = emailService.getConfirmedParticipants();
		var getConfirmedParticipantsWithLinesResult = emailService.getConfirmedParticipantsWithLines();
		var getNotRespondedParticipantsResult = emailService.getNotRespondedParticipants();
		var getWaitlistedParticipantsResult = emailService.getWaitlistedParticipants();
		httpBackend.when('GET', /\/participants/).respond(500, 'chicken fingers');
		httpBackend.flush();
        expect(getPotentialParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(getPotentialAdditionalParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(getConfirmedParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(getConfirmedParticipantsWithLinesResult.$$state.value).toEqual('chicken fingers');
        expect(getNotRespondedParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(getWaitlistedParticipantsResult.$$state.value).toEqual('chicken fingers');
    	// Test POST endpoints
		var potentialParticipantsResult = emailService.potentialParticipants();
		var participantsResult = emailService.participants();
        var participantsReminderResult = emailService.participantsReminder();
        var notRespondedParticipantsResult = emailService.notRespondedParticipants();
        var waitlistedParticipantsResult = emailService.waitlistedParticipants();
        httpBackend.when('POST', /\/participants/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(potentialParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(participantsResult.$$state.value).toEqual('chicken fingers');
        expect(participantsReminderResult.$$state.value).toEqual('chicken fingers');
        expect(notRespondedParticipantsResult.$$state.value).toEqual('chicken fingers');
        expect(waitlistedParticipantsResult.$$state.value).toEqual('chicken fingers');
    });

});