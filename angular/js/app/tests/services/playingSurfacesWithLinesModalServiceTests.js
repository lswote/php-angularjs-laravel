describe('playingSurfacesWithLinesModalServiceTests Test Suite', function(){

    var playingSurfacesWithLinesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_playingSurfacesWithLinesModalService_, $httpBackend){
        playingSurfacesWithLinesModalService = _playingSurfacesWithLinesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getSurfacesResult = playingSurfacesWithLinesModalService.getSurfaces();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getSurfacesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
        // Test PUT endpoint
        var updateSurfaceAssignmentsResult = playingSurfacesWithLinesModalService.updateSurfaceAssignments();
        httpBackend.when('PUT', /\/lines/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateSurfaceAssignmentsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
		var getSurfacesResult = playingSurfacesWithLinesModalService.getSurfaces();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getSurfacesResult.$$state.value).toEqual('chicken fingers');
        // Test PUT endpoint
		var updateSurfaceAssignmentsResult = playingSurfacesWithLinesModalService.updateSurfaceAssignments();
        httpBackend.when('PUT', /\/lines/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateSurfaceAssignmentsResult.$$state.value).toEqual('chicken fingers');
    });

});