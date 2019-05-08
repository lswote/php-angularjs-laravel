describe('eventLinesService Test Suite', function(){

    var eventLinesService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_eventLinesService_, $httpBackend){
        eventLinesService = _eventLinesService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getParticipantsRankingsResult = eventLinesService.getParticipantsRankings();
        httpBackend.when('GET', /\/facility/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getParticipantsRankingsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getParticipantsRankingsResult = eventLinesService.getParticipantsRankings();
        httpBackend.when('GET', /\/facility/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getParticipantsRankingsResult.$$state.value).toEqual('chicken fingers');
    });

});