describe('addEventLeaderModalService Test Suite', function(){

    var addEventLeaderModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_addEventLeaderModalService_, $httpBackend){
        addEventLeaderModalService = _addEventLeaderModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test POST endpoint
		var id = 5;
		var leader = {};
        var addEventLeaderResult = addEventLeaderModalService.addEventLeader(id, leader);
        httpBackend.when('POST', /\/leader/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addEventLeaderResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test POST endpoint
        var id = 5;
		var leader = {};
		var addEventLeaderResult = addEventLeaderModalService.addEventLeader(id, leader);
        httpBackend.when('POST', /\/leader/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addEventLeaderResult.$$state.value).toEqual('chicken fingers');
    });

});