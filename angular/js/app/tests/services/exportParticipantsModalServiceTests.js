describe('exportParticipantsModalService Test Suite', function(){

    var window, exportParticipantsModalService, httpBackend;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_exportParticipantsModalService_, $window, $httpBackend){
    	window = $window;
        exportParticipantsModalService = _exportParticipantsModalService_;
        httpBackend = $httpBackend;
        $httpBackend.whenGET(/\/pages\//).respond(200);
    }));

    describe('downloadEvent Test', function(){
    	it('should call window.open()', function(){
    		var eventId = 8342;
    		spyOn(window, 'open');
    		exportParticipantsModalService.downloadEvent(eventId);
    		expect(window.open).toHaveBeenCalled();
		});
	});

    describe('downloadFacility Test', function(){
    	it('should call window.open()', function(){
    		var facilityId = 678;
    		spyOn(window, 'open');
    		exportParticipantsModalService.downloadFacility(facilityId);
    		expect(window.open).toHaveBeenCalled();
		});
	});

});