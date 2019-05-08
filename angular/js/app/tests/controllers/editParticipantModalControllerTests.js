describe('editParticipantModalController Test Suite', function(){

    var q, deferred, scope, rootScope, editParticipantModalService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Mock out fake service
    beforeEach(function(){
        editParticipantModalService = {
        	getParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					participants: 'control'
				});
                return deferred.promise;
            },
			update: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(editParticipantModalService, 'getParticipants').and.callThrough();
        spyOn(editParticipantModalService, 'update').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
			privilege: 'admin'
		};
    	scope = $rootScope.$new();
    	q = $q;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('editParticipantModalController', {
            $scope: scope,
			editParticipantModalService: editParticipantModalService
        });
    }));

    describe('filterParticipants Test', function(){
    	it('should set scope.foundParticipants to its correct value', function(){
    		scope.searchTerm = 'lost';
    		scope.participants = [{
    			first_name: 'charlie',
				last_name: 'smith',
				email: 'wall@gmail.com',
				username: 'csmith'
			}, {
    			first_name: 'sarah',
				last_name: 'hogenburg',
				email: 'lost@yahoo.com',
				username: 'shog'
			}];
    		scope.foundParticipants = 'take my time';
    		scope.filterParticipants();
    		expect(scope.foundParticipants).toEqual([{
    			first_name: 'sarah',
				last_name: 'hogenburg',
				email: 'lost@yahoo.com',
				username: 'shog'
			}]);
		});
    	it('should set scope.foundParticipants to an empty array', function(){
    		scope.searchTerm = 'alksj2a';
    		scope.participants = [{
    			first_name: 'charlie',
				last_name: 'smith',
				email: 'wall@gmail.com',
				username: 'csmith'
			}, {
    			first_name: 'sarah',
				last_name: 'hogenburg',
				email: 'lost@yahoo.com',
				username: 'shog'
			}];
    		scope.foundParticipants = 'take my time';
    		scope.filterParticipants();
    		expect(scope.foundParticipants).toEqual([]);
		});
	});

    describe('getParticipants Test', function(){
    	it('should set scope.getParticipantsInProgress to its correct value.  It should then set scope.participants to its correct value and call scope.filterParticipants() ' +
		   'after editParticipantModalService.getParticipants() returns success', function(){
    		scope.getParticipantsInProgress = false;
    		scope.participants = 'aaa';
    		spyOn(scope, 'filterParticipants');
    		scope.getParticipants();
    		expect(scope.getParticipantsInProgress).toBeTruthy();
    		scope.$apply();
    		expect(editParticipantModalService.getParticipants).toHaveBeenCalled();
    		expect(scope.participants).toEqual('control');
    		expect(scope.filterParticipants).toHaveBeenCalled();
    		expect(scope.getParticipantsInProgress).toBeFalsy();
		});
	});

    describe('$watch searchTerm Test', function(){
    	it('should call scope.filterParticipants()', function(){
    		scope.searchTerm = 'something';
    		spyOn(scope, 'filterParticipants');
    		scope.$apply();
    		scope.searchTerm = 'other thing';
    		scope.$apply();
    		expect(scope.filterParticipants.calls.count()).toEqual(2);
		});
	});

    describe('toggleView Test', function(){
    	it('should set scope.selectedParticipantId, scope.selectedParticipantEmail, scope.selectedParticipant, and scope.showView to their correct values', function(){
    		var participant = {
    			id: 5,
				email: 'dream@gmail.com'
			};
    		scope.showView = 'listing';
    		scope.selectedParticipantId = 'eyes';
    		scope.selectedParticipantEmail = 'email';
    		scope.selectedParticipant = 'pancake';
    		scope.toggleView(participant);
    		expect(scope.selectedParticipantId).toEqual(participant.id);
    		expect(scope.selectedParticipantEmail).toEqual(participant.email);
    		expect(scope.selectedParticipant).toEqual(participant);
    		expect(scope.showView).toEqual('update-form');
		});
    	it('should set scope.showView to its correct value', function(){
    		scope.showView = 'update-form';
    		scope.toggleView();
    		expect(scope.showView).toEqual('listing');
		});
	});

    describe('update Test', function(){
    	it('should set scope.callInProgress and scope.callSuccess to their correct values.  It should then set scope.searchTerm to its correct value and call ' +
		   'scope.getParticipants() and scope.toggleView() after editParticipantModalService.update() returns success', function(){
    		scope.selectedParticipant = {
    			id: 111,
				email: 'go@yahoo.com'
			};
			scope.callInProgress = false;
			scope.callSuccess = true;
			scope.searchTerm = 'oah';
			spyOn(scope, 'getParticipants');
			spyOn(scope, 'toggleView');
			spyOn(scope, 'filterParticipants');
			scope.update();
			expect(scope.callInProgress).toBeTruthy();
			expect(scope.callSuccess).toBeFalsy();
			scope.$apply();
			expect(editParticipantModalService.update).toHaveBeenCalledWith(scope.selectedParticipant);
			expect(scope.getParticipants).toHaveBeenCalled();
			expect(scope.searchTerm).toEqual(scope.selectedParticipant.email);
			expect(scope.toggleView).toHaveBeenCalled();
			expect(scope.callSuccess).toBeTruthy();
			expect(scope.callInProgress).toBeFalsy();
		});
	});

});