describe('importParticipantsModalService Test Suite', function(){

    var importParticipantsModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_importParticipantsModalService_, $httpBackend){
        importParticipantsModalService = _importParticipantsModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoints
        var eventResult = importParticipantsModalService.event();
        var facilityResult = importParticipantsModalService.facility();
        httpBackend.when('POST', /\/participants/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(eventResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        expect(facilityResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoints
		var eventResult = importParticipantsModalService.event();
		var facilityResult = importParticipantsModalService.facility();
        httpBackend.when('POST', /\/participants/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(eventResult.$$state.value).toEqual('chicken fingers');
        expect(facilityResult.$$state.value).toEqual('chicken fingers');
    });

});