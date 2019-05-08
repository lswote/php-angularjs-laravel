describe('addWaitlistedParticipantToTeamModalService Test Suite', function(){

    var addWaitlistedParticipantToTeamModalService, httpBackend, helperService;

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
    beforeEach(inject(function(_addWaitlistedParticipantToTeamModalService_, $httpBackend){
        addWaitlistedParticipantToTeamModalService = _addWaitlistedParticipantToTeamModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getOpenSlotsResult = addWaitlistedParticipantToTeamModalService.getOpenSlots();
        httpBackend.when('GET', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getOpenSlotsResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    	// Test PUT endpoint
        var setAsCaptainResult = addWaitlistedParticipantToTeamModalService.setAsCaptain();
        httpBackend.when('PUT', /\/event/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(setAsCaptainResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
        var getOpenSlotsResult = addWaitlistedParticipantToTeamModalService.getOpenSlots();
        httpBackend.when('GET', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getOpenSlotsResult.$$state.value).toEqual('chicken fingers');
    	// Test PUT endpoint
        var setAsCaptainResult = addWaitlistedParticipantToTeamModalService.setAsCaptain();
        httpBackend.when('PUT', /\/event/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(setAsCaptainResult.$$state.value).toEqual('chicken fingers');
    });

});