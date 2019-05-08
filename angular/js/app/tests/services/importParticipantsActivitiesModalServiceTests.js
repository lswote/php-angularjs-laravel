describe('importParticipantsActivitiesModalService Test Suite', function(){

    var importParticipantsActivitiesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_importParticipantsActivitiesModalService_, $httpBackend){
        importParticipantsActivitiesModalService = _importParticipantsActivitiesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test POST endpoint
    	var uploadResult = importParticipantsActivitiesModalService.upload();
    	httpBackend.when('POST', /\/participants/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(uploadResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test POST endpoint
		var uploadResult = importParticipantsActivitiesModalService.upload();
		httpBackend.when('POST', /\/participants/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(uploadResult.$$state.value).toEqual('chicken fingers');
    });

});