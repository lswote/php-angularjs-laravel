describe('editFacilityModalService Test Suite', function(){

    var editFacilityModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_editFacilityModalService_, $httpBackend){
        editFacilityModalService = _editFacilityModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
        // Test PUT endpoint
		var facility = {};
        var editResult = editFacilityModalService.update(facility);
        httpBackend.when('PUT', /\/facility/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(editResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
        // Test PUT endpoint
		var facility = {};
		var editResult = editFacilityModalService.update(facility);
        httpBackend.when('PUT', /\/facility/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(editResult.$$state.value).toEqual('chicken fingers');
    });

});