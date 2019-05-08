describe('activityMasterRecordModalService Test Suite', function(){

    var activityMasterRecordModalService, httpBackend, helperService;

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
    beforeEach(inject(function(_activityMasterRecordModalService_, $httpBackend){
        activityMasterRecordModalService = _activityMasterRecordModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    it('should confirm that all AJAX requests return a resolved promise if APIs return a successful response', function(){
		// Test GET endpoint
        var getActivitiesResult = activityMasterRecordModalService.getActivities();
        httpBackend.when('GET', /\/activities/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(getActivitiesResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    	// Test POST endpoint
		var activity = {};
        var addActivityResult = activityMasterRecordModalService.addActivity(activity);
        httpBackend.when('POST', /\/activity/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(addActivityResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    	// Test PUT endpoint
        var updateActivityResult = activityMasterRecordModalService.updateActivity(activity);
        httpBackend.when('PUT', /\/activity/).respond({
            myKey: 'myString'
        });
        httpBackend.flush();
        expect(updateActivityResult.$$state.value).toEqual({
            myKey: 'myString'
        });
    });

    it('should confirm that all AJAX requests return a promise call failed message if APIs return a failure', function(){
		// Test GET endpoint
        var getActivitiesResult = activityMasterRecordModalService.getActivities();
        httpBackend.when('GET', /\/activities/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(getActivitiesResult.$$state.value).toEqual('chicken fingers');
    	// Test POST endpoint
		var activity = {};
        var addActivityResult = activityMasterRecordModalService.addActivity(activity);
        httpBackend.when('POST', /\/activity/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(addActivityResult.$$state.value).toEqual('chicken fingers');
    	// Test PUT endpoint
        var updateActivityResult = activityMasterRecordModalService.updateActivity(activity);
        httpBackend.when('PUT', /\/activity/).respond(500, 'chicken fingers');
        httpBackend.flush();
        expect(updateActivityResult.$$state.value).toEqual('chicken fingers');
    });

});