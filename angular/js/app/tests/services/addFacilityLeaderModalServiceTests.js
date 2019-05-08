describe('addFacilityLeaderModalService Test Suite', function(){

    var addFacilityLeaderModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addFacilityLeaderModalService_, $httpBackend){
        addFacilityLeaderModalService = _addFacilityLeaderModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test GET endpoint
    	var getFacilitiesResult = addFacilityLeaderModalService.getFacilities();
    	httpBackend.when('GET', /\/facilities/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getFacilitiesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
		// Test POST endpoint
		var leader = {};
        var addFacilityLeaderResult = addFacilityLeaderModalService.addFacilityLeader(leader);
        httpBackend.when('POST', /\/leader/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addFacilityLeaderResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test GET endpoint
		var getFacilitiesResult = addFacilityLeaderModalService.getFacilities();
		httpBackend.when('GET', /\/facilities/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getFacilitiesResult.$$state.value).toEqual('chicken fingers');
		// Test POST endpoint
        var leader = {};
		var addFacilityLeaderResult = addFacilityLeaderModalService.addFacilityLeader(leader);
        httpBackend.when('POST', /\/leader/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addFacilityLeaderResult.$$state.value).toEqual('chicken fingers');
    });

});