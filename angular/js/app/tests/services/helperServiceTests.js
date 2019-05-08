describe('helperService Test Suite', function(){

    var helperService;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_helperService_){
        helperService = _helperService_;
    }));

    describe('findArrayIndex Test', function(){
		it("should return the correct value given it's not a fuzzy search", function(){
			var arrayOfObjects = [{
				tree: 'oak'
			}, {
				tree: 'maple'
			}];
			var properyKey = 'tree';
			var propertyValue = 'maple';
			expect(helperService.findArrayIndex(arrayOfObjects, properyKey, propertyValue)).toEqual(1);
		});
		it("should return the correct value given it's a fuzzy search", function(){
			var arrayOfObjects = [{
				tree: 'oak'
			}, {
				tree: 'maple'
			}, {
				tree: 'argon'
			}];
			var properyKey = 'tree';
			var propertyValue = 'gon';
			expect(helperService.findArrayIndex(arrayOfObjects, properyKey, propertyValue, true)).toEqual(2);
		});
	});

    describe('findArrayIndexMultipleKeys Test', function(){
    	it('should return the correct value', function(){
    		var arrayOfObjects = [{
    			id: 1,
				name: 'well'
			}, {
    			id: 2,
				name: 'week'
			}, {
    			id: 5,
				name: 'days'
			}, {
    			id: 1,
				name: 'smile'
			}];
    		var propertyKeys = ['id', 'name'];
    		var propertyValues = [1, 'well'];
    		expect(helperService.findArrayIndexMultipleKeys(arrayOfObjects, propertyKeys, propertyValues)).toEqual(0);
		});
	});

    describe('parseTime Test', function(){
    	it('should return the correct value', function(){
    		var time = '18:15:00';
    		expect(helperService.parseTime(time)).toEqual('6:15 PM');
		});
    	it('should return the correct value', function(){
			var time = '00:20:00';
			expect(helperService.parseTime(time)).toEqual('12:20 AM');
		});
	});

    describe('reverseParseTime Test', function(){
    	it('should return the correct value', function(){
    		var time = '6:45 PM';
    		expect(helperService.reverseParseTime(time)).toEqual('18:45');
		});
    	it('should return the correct value', function(){
			var time = '4:31 AM';
			expect(helperService.reverseParseTime(time)).toEqual('4:31');
		});
	});

    describe('formatTime Test', function(){
    	it('should return the correct value', function(){
			var datetime = '2018-04-28 13:14:16';
			spyOn(helperService, 'parseTime').and.returnValue('1:14 PM');
			expect(helperService.formatTime(datetime)).toEqual('1:14 PM');
		});
	});

    describe('formatDate Test', function(){
    	it('should return a date in the correct format', function(){
    		var datetime = '2018-02-20';
    		expect(helperService.formatDate(datetime)).toEqual('Feb 20, 18');
		});
	});

    describe('convertMilitaryTimeToMinutes Test', function(){
    	it('should return the correct value', function(){
    		var time = '14:06:00';
    		expect(helperService.convertMilitaryTimeToMinutes(time)).toEqual(846);
		});
	});

    describe('convertMinutesToMilitaryTime Test', function(){
    	it('should return the correct value', function(){
    		var minutes = 981;
    		expect(helperService.convertMinutesToMilitaryTime(minutes)).toEqual('16:21:00');
		});
	});

    describe('capitalizeWords Test', function(){
    	it('should return the correct value', function(){
    		var string = 'i got guns in my head';
    		expect(helperService.capitalizeWords(string)).toEqual('I Got Guns In My Head');
		});
	});

    describe('shuffleArray Test', function(){
    	it('should return an array that is different from the one passed in', function(){
    		var array = [1, 2, 3, 4, 5];
    		expect(helperService.shuffleArray(array)).not.toEqual([1, 2, 3, 4, 5]);
    		expect(helperService.shuffleArray(array)).not.toEqual([1, 2, 3, 4, 5]);
    		expect(helperService.shuffleArray(array)).not.toEqual([1, 2, 3, 4, 5]);
    		expect(helperService.shuffleArray(array)).not.toEqual([1, 2, 3, 4, 5]);
		});
	});

});