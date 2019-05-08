describe('createEventRulesModalService Test Suite', function(){

    var createEventRulesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_createEventRulesModalService_, $httpBackend){
        createEventRulesModalService = _createEventRulesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getResult = createEventRulesModalService.getLadderRules();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    	// Test POST endpoint
		var eventRules = {};
        var createResult = createEventRulesModalService.createLadderRules(4, eventRules);
        httpBackend.when('POST', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(createResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
        var getResult = createEventRulesModalService.getLadderRules();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getResult.$$state.value).toEqual('chicken fingers');
    	// Test POST endpoint
        var eventRules = {};
        var createResult = createEventRulesModalService.createLadderRules(4, eventRules);
        httpBackend.when('POST', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(createResult.$$state.value).toEqual('chicken fingers');
    });

});