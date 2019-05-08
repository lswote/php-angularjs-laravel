describe('facilityActivitiesService Test Suite', function(){

    var facilityActivitiesService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_facilityActivitiesService_, $httpBackend){
        facilityActivitiesService = _facilityActivitiesService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getFacilityInfoResult = facilityActivitiesService.getFacilityInfo();
        httpBackend.when('GET', /\/facility/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getFacilityInfoResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test PUT endpoint
		var updateResult = facilityActivitiesService.update();
        httpBackend.when('PUT', /\/facility/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getFacilityInfoResult = facilityActivitiesService.getFacilityInfo();
        httpBackend.when('GET', /\/facility/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getFacilityInfoResult.$$state.value).toEqual('chicken fingers');
		// Test PUT endpoint
        var updateResult = facilityActivitiesService.update();
        httpBackend.when('PUT', /\/facility/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateResult.$$state.value).toEqual('chicken fingers');
    });

});