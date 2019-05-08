describe('emailController Test Suite', function(){

    var q, deferred, scope, rootScope, location, window, emailService, dashboardService, editEventModalService, helperService;

    // Initialize the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
        module(function($provide){
        	$provide.value('$window', {
                alert: function(){},
        		location: {
                	href: ''
                }
            });
		});
    });

    // Mock out fake service
    beforeEach(function(){
        emailService = {
        	getPotentialParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					participants: 'apple'
				});
                return deferred.promise;
            },
			getPotentialAdditionalParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					participants: 'peach'
				});
                return deferred.promise;
            },
			getConfirmedParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					confirmed_participants: 'orange'
				});
                return deferred.promise;
            },
			getConfirmedParticipantsWithLines: function(){
                deferred = q.defer();
                deferred.resolve({
					confirmed_participants_with_lines: 'spider'
				});
                return deferred.promise;
            },
			getNotRespondedParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					unconfirmed_participants: 'grape'
				});
                return deferred.promise;
            },
			getWaitlistedParticipants: function(){
                deferred = q.defer();
                deferred.resolve({
					waitlisted_participants: 'pear'
				});
                return deferred.promise;
            },
        	potentialParticipants: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			participants: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
			participantsReminder: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
            notRespondedParticipants: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
            waitlistedParticipants: function(){
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(emailService, 'getPotentialParticipants').and.callThrough();
        spyOn(emailService, 'getPotentialAdditionalParticipants').and.callThrough();
        spyOn(emailService, 'getConfirmedParticipants').and.callThrough();
        spyOn(emailService, 'getConfirmedParticipantsWithLines').and.callThrough();
        spyOn(emailService, 'getNotRespondedParticipants').and.callThrough();
        spyOn(emailService, 'getWaitlistedParticipants').and.callThrough();
        spyOn(emailService, 'potentialParticipants').and.callThrough();
        spyOn(emailService, 'participants').and.callThrough();
        spyOn(emailService, 'participantsReminder').and.callThrough();
        spyOn(emailService, 'notRespondedParticipants').and.callThrough();
        spyOn(emailService, 'waitlistedParticipants').and.callThrough();
        dashboardService = {
        	getFacilityInfo: function(){
        		deferred = q.defer();
                deferred.resolve({
					facility: {
						users: [{
							first_name: 'sarah',
							last_name: 'smith'
						}, {
							first_name: 'mika',
							last_name: 'hogan'
						}]
					}
				});
                return deferred.promise;
			}
		};
		spyOn(dashboardService, 'getFacilityInfo').and.callThrough();
		editEventModalService = {
			getEvent: function(){
				deferred = q.defer();
                deferred.resolve({
					event: 'aaa'
				});
                return deferred.promise;
			}
		};
		spyOn(editEventModalService, 'getEvent').and.callThrough();
		helperService = {
			findArrayIndex: function(){
				return 0;
			}
		};
		spyOn(helperService, 'findArrayIndex').and.callThrough();
    });

    // Assign controller scope and service reference
    beforeEach(inject(function($controller, $rootScope, $q, $location, $window, $injector){
    	rootScope = $rootScope;
    	rootScope.user = {
    		first_name: 'Beth',
			last_name: 'Chen',
			privilege: 'admin'
		};
    	scope = $rootScope.$new();
    	location = $location;
    	q = $q;
    	window = $window;
        $injector.get('$httpBackend').whenGET(/\/pages\//).respond(200);
        $controller('emailController', {
            $scope: scope,
			emailService: emailService,
			dashboardService: dashboardService,
			editEventModalService: editEventModalService,
			helperService: helperService
        });
    }));

    describe('getEvent Test', function(){
    	it('should set scope.event to its correct value and call scope.getSubjectandBody() after editEventModalService.getEvent() returns success', function(){
    		scope.urlParams = {
    			event_id: 5
			};
    		scope.event = 'bbbb';
    		spyOn(scope, 'getSubjectandBody');
    		scope.getEvent();
    		scope.$apply();
    		expect(editEventModalService.getEvent).toHaveBeenCalledWith(scope.urlParams.event_id);
    		expect(scope.event).toEqual('aaa');
    		expect(scope.getSubjectandBody).toHaveBeenCalled();
		});
	});

    describe('getSubjectandBody Test', function(){
    	it('should set scope.emailObject to its correct value', function(){
    		scope.urlParams = {
    			type: 'email-participants'
			};
    		scope.event = {
    			name: 'Hilltop 2018',
				start_date: '2018-02-08'
			};
    		scope.emailObject = {};
    		spyOn(scope, 'getDate').and.returnValue('2018-02-08');
    		scope.getSubjectandBody();
    		expect(scope.emailObject).toEqual({
				subject: 'TeamsRIt - Message About Hilltop 2018 Starting/On 2018-02-08',
				bodyTop: '<RECEIVER-FNAME>, we wanted to provide you a quick update on the status of Hilltop 2018 starting/on 2018-02-08',
				bodyBottom: "Please don't reply to this email, if you want to contact us regarding the event, please contact <SENDER-EMAIL-LINK>.\n\nSincerely,\nBeth Chen"
			})
		});
	});

  	describe('getAndParseUrlParams Test', function(){
  		it('should set scope.urlParams, scope.validEmailType, and scope.emailType to their correct values', function(){
  			scope.emailTypes = [{
  				name: 'fire',
				displayName: 'Fire'
			}];
  			scope.urlParams = 'fear';
  			scope.validEmailType = false;
  			scope.emailType = 'self';
  			spyOn(location, 'search').and.returnValue('ha');
  			scope.getAndParseUrlParams();
  			expect(scope.urlParams).toEqual('ha');
  			expect(scope.validEmailType).toBeTruthy();
  			expect(scope.emailType).toEqual('Fire');
		});
	});

  	describe('getFacilityParticipants Test', function(){
  		it('should set scope.participants to its correct values after dashboardService.getFacilityInfo() returns success', function(){
  			scope.participants = 'fly';
  			scope.getFacilityParticipants();
  			scope.$apply();
  			expect(scope.participants).toEqual([{
  				first_name: 'sarah',
				last_name: 'smith'
			}, {
  				first_name: 'mika',
				last_name: 'hogan'
			}]);
		});
	});

  	describe('getRecipients Test', function(){
  		it('should set scope.recipients to its correct value after emailService.getPotentialParticipants() returns success', function(){
  			scope.recipients = 'aaaa';
  			scope.urlParams = {
  				event_id: 3,
  				type: 'email-potential-participants'
			};
  			scope.getRecipients();
  			scope.$apply();
  			expect(emailService.getPotentialParticipants).toHaveBeenCalledWith(scope.urlParams.event_id);
  			expect(scope.recipients).toEqual('apple');
		});
  		it('should set scope.recipients to its correct value after emailService.getConfirmedParticipants() returns success', function(){
  			scope.recipients = 'aaaa';
  			scope.urlParams = {
  				event_id: 3,
  				type: 'email-participants'
			};
  			scope.getRecipients();
  			scope.$apply();
  			expect(emailService.getConfirmedParticipants).toHaveBeenCalledWith(scope.urlParams.event_id);
  			expect(scope.recipients).toEqual('orange');
		});
	});

  	describe('toggleFoundRecipient Test', function(){
  		it('should set scope.recipients, scope.searchRecipientsTerm, scope.foundRecipients, and scope.emailObject.showRecipients to their correct values', function(){
  			var userId = 25;
  			scope.recipients = [];
  			scope.foundRecipients = [{
  				name: 'attention'
			}];
  			scope.searchRecipientsTerm = 'find';
  			scope.emailObject = {
  				showRecipients: false
			};
  			helperService.findArrayIndex = jasmine.createSpy('findArrayIndex').and.returnValues(false, 0);
  			scope.toggleFoundRecipient(userId);
			expect(scope.recipients).toEqual([{
				name: 'attention'
			}]);
			expect(scope.searchRecipientsTerm).toEqual('');
			expect(scope.foundRecipients).toEqual([]);
			expect(scope.emailObject.showRecipients).toBeTruthy();
		});
  		it('should set scope.recipients, scope.searchRecipientsTerm, and scope.foundRecipients to their correct values', function(){
  			var userId = 8342;
  			scope.emailTypesWithFixedRecipients = [];
  			scope.recipients = [{
  				name: 'sarah'
			}];
  			scope.searchRecipientsTerm = 'adsf';
  			scope.foundRecipients = 'ie';
  			scope.emailObject = {
  				showRecipients: false
			};
  			helperService.findArrayIndex = jasmine.createSpy('findArrayIndex').and.returnValues(0, 0);
  			scope.toggleFoundRecipient(userId);
  			expect(scope.recipients).toEqual([]);
  			expect(scope.searchRecipientsTerm).toEqual('');
  			expect(scope.foundRecipients).toEqual([]);
  			expect(scope.emailObject.showRecipients).toBeTruthy();
		});
	});

  	describe('$watch searchRecipientsTerm Test', function(){
  		it('should set scope.foundRecipients to its correct value', function(){
  			scope.participants = [{
  				first_name: 'sarah',
				last_name: 'smith'
			}, {
  				first_name: 'mika',
				last_name: 'hogan'
			}];
  			scope.foundRecipients = 'eggs';
  			scope.searchRecipientsTerm = 'a';
  			helperService.findArrayIndex = jasmine.createSpy('findArrayIndex').and.returnValues(1);
  			scope.$apply();
  			expect(scope.foundRecipients).toEqual('eggs');
  			scope.searchRecipientsTerm = 's';
  			spyOn(scope, 'getFacilityParticipants');
  			scope.$apply();
  			expect(scope.foundRecipients).toEqual([{
  				first_name: 'sarah',
				last_name: 'smith',
				alreadySelected: true
			}]);
		});
	});

  	describe('sendPotentialParticipantsEmail Test', function(){
  		it('should set window.location.href and scope.callInProgress to their correct values and call window.alert() after emailService.potentialParticipants() returns ' +
		   'success', function(){
  			scope.urlParams = {
  				event_id: 5
			};
  			scope.recipients = 'eggnog';
			scope.emailObject = {
				showRecipients: true,
				emailTop: true,
				emailBottom: true,
				subject: '',
				bodyTop: 'monday',
				customBody: 'blonde',
				bodyBottom: 'corvette'
			};
  			scope.callInProgress = true;
  			spyOn(window, 'alert');
  			scope.sendPotentialParticipantsEmail();
  			scope.$apply();
  			expect(emailService.potentialParticipants).toHaveBeenCalledWith(scope.urlParams.event_id, scope.recipients, scope.emailObject);
  			expect(window.alert).toHaveBeenCalledWith('E-mail was successfully sent!');
			expect(window.location.href).toEqual('/');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

  	describe('sendParticipantsEmail Test', function(){
  		it('should set window.location.href and scope.callInProgress to their correct value and call window.alert() after emailService.participants() returns ' +
		   'success', function(){
  			scope.urlParams = {
  				event_id: 5
			};
  			scope.recipients = 'eggnog';
			scope.emailObject = {
				showRecipients: true,
				emailTop: true,
				emailBottom: true,
				subject: '',
				bodyTop: 'monday',
				customBody: 'blonde',
				bodyBottom: 'corvette'
			};
  			scope.callInProgress = true;
  			spyOn(window, 'alert');
  			scope.sendParticipantsEmail();
  			scope.$apply();
  			expect(emailService.participants).toHaveBeenCalledWith(scope.urlParams.event_id, scope.recipients, scope.emailObject);
  			expect(window.alert).toHaveBeenCalledWith('E-mail was successfully sent!');
			expect(window.location.href).toEqual('/');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

  	describe('sendParticipantsReminderEmail Test', function(){
  		it('should set window.location.href and scope.callInProgress to their correct value and call window.alert() after emailService.participantsReminder() returns ' +
		   'success', function(){
  			scope.urlParams = {
  				event_id: 5
			};
  			scope.recipients = 'eggnog';
			scope.emailObject = {
				showRecipients: true,
				emailTop: true,
				emailBottom: true,
				subject: '',
				bodyTop: 'monday',
				customBody: 'blonde',
				bodyBottom: 'corvette'
			};
  			scope.callInProgress = true;
  			spyOn(window, 'alert');
  			scope.sendParticipantsReminderEmail();
  			scope.$apply();
  			expect(emailService.participantsReminder).toHaveBeenCalledWith(scope.urlParams.event_id, scope.recipients, scope.emailObject);
  			expect(window.alert).toHaveBeenCalledWith('E-mail was successfully sent!');
			expect(window.location.href).toEqual('/');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

  	describe('sendNotRespondedParticipantsEmail Test', function(){
  		it('should set window.location.href and scope.callInProgress to their correct value and call window.alert() after emailService.notRespondedParticipants() returns ' +
		   'success', function(){
  			scope.urlParams = {
  				event_id: 5
			};
  			scope.recipients = 'eggnog';
			scope.emailObject = {
				showRecipients: true,
				emailTop: true,
				emailBottom: true,
				subject: '',
				bodyTop: 'monday',
				customBody: 'blonde',
				bodyBottom: 'corvette'
			};
  			scope.callInProgress = true;
  			spyOn(window, 'alert');
  			scope.sendNotRespondedParticipantsEmail();
  			scope.$apply();
  			expect(emailService.notRespondedParticipants).toHaveBeenCalledWith(scope.urlParams.event_id, scope.recipients, scope.emailObject);
  			expect(window.alert).toHaveBeenCalledWith('E-mail was successfully sent!');
			expect(window.location.href).toEqual('/');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

  	describe('sendWaitlistedParticipantsEmail Test', function(){
  		it('should set window.location.href and scope.callInProgress to their correct value and call window.alert() after emailService.waitlistedParticipants() returns ' +
		   'success', function(){
  			scope.urlParams = {
  				event_id: 5
			};
  			scope.recipients = 'eggnog';
			scope.emailObject = {
				showRecipients: true,
				emailTop: true,
				emailBottom: true,
				subject: '',
				bodyTop: 'monday',
				customBody: 'blonde',
				bodyBottom: 'corvette'
			};
  			scope.callInProgress = true;
  			spyOn(window, 'alert');
  			scope.sendWaitlistedParticipantsEmail();
  			scope.$apply();
  			expect(emailService.waitlistedParticipants).toHaveBeenCalledWith(scope.urlParams.event_id, scope.recipients, scope.emailObject);
  			expect(window.alert).toHaveBeenCalledWith('E-mail was successfully sent!');
			expect(window.location.href).toEqual('/');
			expect(scope.callInProgress).toBeFalsy();
		});
	});

  	describe('sendEmail Test', function(){
  		it('should set scope.callInProgress to its correct value and call scope.sendPotentialParticipantsEmail()', function(){
  			scope.recipients = 'aaa';
  			scope.emailType = 'E-Mail Potential Participants';
  			scope.callInProgress = false;
  			spyOn(scope, 'sendPotentialParticipantsEmail');
  			scope.sendEmail();
  			expect(scope.callInProgress).toBeTruthy();
  			expect(scope.sendPotentialParticipantsEmail).toHaveBeenCalled();
		});
  		it('should set scope.callInProgress to its correct value and call scope.sendWaitlistedParticipantsEmail()', function(){
  			scope.recipients = 'aaa';
  			scope.emailType = 'E-Mail Waitlisted Participants';
  			scope.callInProgress = false;
  			spyOn(scope, 'sendWaitlistedParticipantsEmail');
  			scope.sendEmail();
  			expect(scope.callInProgress).toBeTruthy();
  			expect(scope.sendWaitlistedParticipantsEmail).toHaveBeenCalled();
		});
	});

});