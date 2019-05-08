describe('printScorecardsModalService Test Suite', function(){

    var printScorecardsModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_printScorecardsModalService_, $httpBackend){
        printScorecardsModalService = _printScorecardsModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var generateScorecardResult = printScorecardsModalService.generateScorecard();
        httpBackend.when('GET', /\/scorecard/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(generateScorecardResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var generateScorecardResult = printScorecardsModalService.generateScorecard();
        httpBackend.when('GET', /\/scorecard/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(generateScorecardResult.$$state.value).toEqual('chicken fingers');
    });

});