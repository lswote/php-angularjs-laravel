describe('eventService Test Suite', function(){

    var eventService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_eventService_, $httpBackend){
        eventService = _eventService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoints
        var getEventsAsLeaderResult = eventService.getEventsAsLeader();
        var getEventsAsCaptainResult = eventService.getEventsAsCaptain();
        var getEventLeadersResult = eventService.getEventLeaders();
        var getEventLinesResult = eventService.getEventLines();
        var getEventMatchResultsEnteredResult = eventService.getEventMatchResultsEntered();
        var getEventTeamsResult = eventService.getEventTeams();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getEventsAsLeaderResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventsAsCaptainResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventLeadersResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventLinesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventMatchResultsEnteredResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(getEventTeamsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test POST endpoint
		var createEventLinesResult = eventService.createEventLines();
		var createEventTeamsResult = eventService.createEventTeams();
        var updateEventTeamsCompleteResult = eventService.updateEventTeamsComplete();
		httpBackend.when('POST', /\/lines/|/\/teams/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(createEventLinesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(createEventTeamsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(updateEventTeamsCompleteResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test PUT endpoints
		var updateEventMatchesResult = eventService.updateEventMatches();
		var updateEventLinesScoresResult = eventService.updateEventLinesScores();
        var updateEventTeamsResult = eventService.updateEventTeams();
		httpBackend.when('PUT', /\/lines/|/\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateEventMatchesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(updateEventLinesScoresResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(updateEventTeamsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test DELETE endpoint
        var deleteEventLeaderResult = eventService.deleteEventLeader();
        httpBackend.when('DELETE', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(deleteEventLeaderResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoints
		var getEventsAsLeaderResult = eventService.getEventsAsLeader();
		var getEventsAsCaptainResult = eventService.getEventsAsCaptain();
        var getEventLeadersResult = eventService.getEventLeaders();
        var getEventLinesResult = eventService.getEventLines();
        var getEventMatchResultsEnteredResult = eventService.getEventMatchResultsEntered();
        var getEventTeamsResult = eventService.getEventTeams();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getEventsAsLeaderResult.$$state.value).toEqual('chicken fingers');
        expect(getEventsAsCaptainResult.$$state.value).toEqual('chicken fingers');
        expect(getEventLeadersResult.$$state.value).toEqual('chicken fingers');
        expect(getEventLinesResult.$$state.value).toEqual('chicken fingers');
        expect(getEventTeamsResult.$$state.value).toEqual('chicken fingers');
        // Test POST endpoint
		var createEventLinesResult = eventService.createEventLines();
		var createEventTeamsResult = eventService.createEventTeams();
		var updateEventTeamsCompleteResult = eventService.updateEventTeamsComplete();
        httpBackend.when('POST', /\/lines/|/\/teams/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(createEventLinesResult.$$state.value).toEqual('chicken fingers');
        expect(createEventTeamsResult.$$state.value).toEqual('chicken fingers');
        expect(updateEventTeamsCompleteResult.$$state.value).toEqual('chicken fingers');
		// Test PUT endpoints
        var updateEventMatchesResult = eventService.updateEventMatches();
        var updateEventLinesScoresResult = eventService.updateEventLinesScores();
        var updateEventTeamsResult = eventService.updateEventTeams();
        httpBackend.when('PUT', /\/lines/|/\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateEventMatchesResult.$$state.value).toEqual('chicken fingers');
        expect(updateEventLinesScoresResult.$$state.value).toEqual('chicken fingers');
        expect(updateEventTeamsResult.$$state.value).toEqual('chicken fingers');
        // Test DELETE endpoint
		var deleteEventLeaderResult = eventService.deleteEventLeader();
        httpBackend.when('DELETE', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(deleteEventLeaderResult.$$state.value).toEqual('chicken fingers');
    });

});