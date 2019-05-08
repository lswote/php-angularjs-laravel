describe('changePasswordModalService Test Suite', function(){

    var changePasswordModalService, httpBackend, helperService;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        helperService = {
			capitalizeWords: function(){}
		};
		spyOn(helperService, 'capitalizeWords').and.callThrough();
		module(function($provide){
			$provide.value('helperService', helperService);
	    });
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_changePasswordModalService_, $httpBackend){
        changePasswordModalService = _changePasswordModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
    	// Test PUT endpoint
        var changePasswordResult = changePasswordModalService.changePassword();
        httpBackend.when('PUT', /\/password/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(changePasswordResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
    	// Test PUT endpoint
        var changePasswordResult = changePasswordModalService.changePassword();
        httpBackend.when('PUT', /\/password/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(changePasswordResult.$$state.value).toEqual('chicken fingers');
    });

});