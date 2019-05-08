describe('rsvpController Test Suite', function(){

    var q, deferred, rootScope, window, scope, location, rsvpService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
        module(function($provide){
        	$provide.value('$window', {
        		open: function(){}
            });
		});
    });

    // Mock out fake service
    beforeEach(function(){
        rsvpService = {
        	getRules: function(){
        		deferred = q.defer();
                deferred.resolve({
					rules_event: [{
						days_play_challenge: 7
					}]
				});
                return deferred.promise;
			},
        	emailChallenger: function(){
        		deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
			},
        	getChallenge: function(){
        		deferred = q.defer();
                deferred.resolve({
					challenge: {
						responded: true,
						event_sub_type: 'singles',
						event_id: 11,
						emails: ['23'],
						challenger: {
							first_name: 'John',
							last_name: 'Black'
						},
						challengee: {
							first_name: 'Jane',
							last_name: 'Smith'
						},
						showAccepted: true,
						status: 'Accepted',
						play_by_date: '2018-08-05',
						accepted_date: '2018-07-26',
						accept_by_date: '2018-08-01',
						challenge_date: '2018-07-25'
					}
				});
                return deferred.promise;
			},
        	getEvent: function(){
        		deferred = q.defer();
                deferred.resolve({
					event: {
						activity: 'tennis',
						event_type: 'social',
						start_date: '2018-04-01',
						start_time: '18:00:00',
						available_start_times: ['14:00:00', '15:00:00', '16:00:00']
					}
				});
                return deferred.promise;
			},
            rsvp: function(){
                deferred = q.defer();
                deferred.resolve({
					event: {
						start_time: '02:00:00',
						name: 'sex',
						charge_cc: 1,
						participant_charge: '32.22',
						facilities: {
							paypal_link: 'https://www.paypal.me/aaa'
						}
					}
				});
                return deferred.promise;
            }
        };
        spyOn(rsvpService, 'getRules').and.callThrough();
        spyOn(rsvpService, 'emailChallenger').and.callThrough();
        spyOn(rsvpService, 'getChallenge').and.callThrough();
        spyOn(rsvpService, 'getEvent').and.callThrough();
        spyOn(rsvpService, 'rsvp').and.callThrough();
        helperService = {
        	capitalizeWords: function(){},
			formatDate: function(){},
        	parseTime: function(){}
		}
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $location, $window, $q, $injector){
        rootScope = $rootScope;
    	scope = $rootScope.$new();
    	location = $location;
    	q = $q;
    	window = $window,
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('rsvpController', {
            $scope: scope,
			rsvpService: rsvpService,
			helperService: helperService
        });
    }));

    describe('emailChallenger Test', function(){
    	it('It does nothing on return after rsvpService.getChallenge() returns success', function(){
    		scope.token = 'token';
    		scope.event_id = 11;
    		scope.response.preferredStartTime = 'available';
    		scope.emails = [23];
    		scope.challenger = 'Jane Smith';
    		scope.challengee = 'John Black';
    		scope.playByDate = '2018-08-05';
    		scope.actionId = 20;
    		scope.emailChallenger();
    		scope.$apply();
    		expect(rsvpService.getRules).toHaveBeenCalledWith(scope.event_id);
			expect(scope.rules.days_play_challenge).toEqual(7);
    		expect(rsvpService.emailChallenger).toHaveBeenCalledWith(scope.token, scope.event_id, scope.response.preferredStartTime, scope.emails, scope.challenger, scope.challengee, scope.playByDate, scope.actionId);
		});
	});

    describe('getChallenge Test', function(){
    	it('should set scope.getChallengeInProgress to its correct value.  It should then set scope.event_id, scope.emails, scope.challenger, scope.challengee, scope.showAccepted, ' +
		   'scope.status, scope.playByDate, scope.acceptByDate, scope.challengeDate and scope.getChallengeSuccess to their correct values after rsvpService.getChallenge() ' +
		   'returns success', function(){
    		scope.token = 'token';
    		scope.actionId = 'goober';
    		scope.getChallengeInProgress = false;
    		scope.getChallengeSuccess = false;
    		scope.getChallenge();
    		expect(scope.getChallengeInProgress).toBeTruthy();
    		scope.$apply();
    		expect(rsvpService.getChallenge).toHaveBeenCalledWith(scope.token, scope.actionId);
    		expect(scope.event_id).toEqual(11);
    		expect(scope.challenger).toEqual('John Black');
    		expect(scope.challengee).toEqual('Jane Smith');
    		expect(scope.showAccepted).toBeTruthy();
    		expect(scope.status).toEqual('Accepted');
    		expect(scope.playByDate).toEqual('2018-08-05');
    		expect(scope.acceptByDate).toEqual('2018-08-01');
    		expect(scope.challengeDate).toEqual('2018-07-25');
    		expect(scope.getChallengeSuccess).toBeTruthy();
    		expect(scope.getChallengeInProgress).toBeFalsy();
		});
	});

    describe('getEvent Test', function(){
    	it('should set scope.getEventInProgress to its correct value.  It should then set scope.event, scope.availableStartTimes and scope.getEventSuccess to their correct values ' +
		   'after rsvpService.getEvent() returns success', function(){
    		scope.token = 'token';
    		scope.getEventInProgress = false;
    		scope.event = 'yo';
    		scope.availableStartTimes = 'animal';
    		scope.getEventSuccess = false;
    		spyOn(helperService, 'capitalizeWords').and.returnValues('Tennis', 'Social' ,'Tennis', 'Social');
    		spyOn(helperService, 'formatDate').and.returnValue('Apr 1, 18', 'Apr 1, 18');
    		spyOn(helperService, 'parseTime').and.returnValues('2:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '2:00 PM', '2:00 PM', '3:00 PM', '4:00 PM');
    		scope.getEvent();
    		expect(scope.getEventInProgress).toBeTruthy();
    		scope.$apply();
    		expect(rsvpService.getEvent).toHaveBeenCalledWith(scope.token);
    		expect(scope.event).toEqual({
				activity: 'Tennis',
				event_type: 'Social',
				start_date: 'Apr 1, 18',
				start_time: '2:00 PM',
				available_start_times: [ '14:00:00', '15:00:00', '16:00:00' ]
			});
    		expect(scope.availableStartTimes).toEqual([{
    			start_time: '14:00:00',
				start_time_formatted: '2:00 PM'
			}, {
    			start_time: '15:00:00',
				start_time_formatted: '3:00 PM'
			}, {
    			start_time: '16:00:00',
				start_time_formatted: '4:00 PM'
			}]);
    		expect(scope.getEventSuccess).toBeTruthy();
    		expect(scope.getEventInProgress).toBeFalsy();
		});
	});

    describe('rsvp Test', function(){
    	it('should set scope.rsvpInProgress to its correct value.  It should then set scope.rsvpSuccess to its correct value and call scope.emailChallenger and window.open() ' +
		   'after rsvpService.rsvp() returns success', function(){
    		scope.token = 'abcd';
    		scope.response = {
    			preferredStartTime: '12:00:00'
			};
    		scope.action = 'challenge';
    		scope.actionId = 5;
    		scope.rsvpInProgress = false;
    		scope.rsvpSuccess = false;
    		spyOn(scope, 'emailChallenger');
    		spyOn(window, 'open');
    		spyOn(helperService, 'parseTime').and.returnValue('2:00 AM');
    		spyOn(scope, 'getEvent');
    		scope.rsvp();
    		expect(scope.rsvpInProgress).toBeTruthy();
    		scope.$apply();
    		expect(rsvpService.rsvp).toHaveBeenCalledWith('abcd', '12:00:00', scope.action, scope.actionId);
    		expect(scope.rsvpSuccess).toBeTruthy();
    		expect(scope.emailChallenger).toHaveBeenCalled();
    		expect(window.open).toHaveBeenCalledWith('https://www.paypal.me/aaa/32.22');
    		expect(scope.rsvpInProgress).toBeFalsy();
		});
	});

});