describe('createFacilityModalService Test Suite', function(){

    var createFacilityModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_createFacilityModalService_, $httpBackend){
        createFacilityModalService = _createFacilityModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
		var facility = {};
        var createResult = createFacilityModalService.create(facility);
        httpBackend.when('POST', /\/facility/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(createResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
        var facility = {};
		var createResult = createFacilityModalService.create(facility);
        httpBackend.when('POST', /\/facility/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(createResult.$$state.value).toEqual('chicken fingers');
    });

});