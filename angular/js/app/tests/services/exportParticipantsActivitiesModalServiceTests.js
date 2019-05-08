describe('exportParticipantsActivitiesModalService Test Suite', function(){

    var window, exportParticipantsActivitiesModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_exportParticipantsActivitiesModalService_, $window, $httpBackend){
    	window = $window;
        exportParticipantsActivitiesModalService = _exportParticipantsActivitiesModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    describe('download Test', function(){
    	it('should call window.open()', function(){
    		spyOn(window, 'open');
    		exportParticipantsActivitiesModalService.download();
    		expect(window.open).toHaveBeenCalled();
		});
	});

});