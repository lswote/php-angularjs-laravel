describe('addSubToLineupModalService Test Suite', function(){

    var addSubToLineupModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addSubToLineupModalService_, $httpBackend){
        addSubToLineupModalService = _addSubToLineupModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
        var addSubstituteResult = addSubToLineupModalService.addSubstitute();
        httpBackend.when('POST', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addSubstituteResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
        var addSubstituteResult = addSubToLineupModalService.addSubstitute();
        httpBackend.when('POST', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addSubstituteResult.$$state.value).toEqual('chicken fingers');
    });

});