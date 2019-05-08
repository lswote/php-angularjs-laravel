describe('matchLineTimesModalService Test Suite', function(){

    var matchLineTimesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_matchLineTimesModalService_, $httpBackend){
        matchLineTimesModalService = _matchLineTimesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getEventMatchesResult = matchLineTimesModalService.getEventMatches();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getEventMatchesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getEventMatchesResult = matchLineTimesModalService.getEventMatches();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getEventMatchesResult.$$state.value).toEqual('chicken fingers');
    });

});