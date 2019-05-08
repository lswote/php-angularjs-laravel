describe('roundRobinEventLinesServiceTests Test Suite', function(){

    var roundRobinEventLinesService;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_roundRobinEventLinesService_){
        roundRobinEventLinesService = _roundRobinEventLinesService_;
    }));

    describe('calculateCombLines Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(roundRobinEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(3);
		});
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '0'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(roundRobinEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(0);
		});
	});

    describe('calculateLinesGenderPerTeam Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1',
				singleWomenLines: 1,
				singleMenLines: 1
			};
			var femaleCount = 12;
			var maleCount = 13;
			var teamCount = 4;
			var womenSitting = 1;
			var menSitting = 0;
			spyOn(roundRobinEventLinesService, 'calculateCombLines').and.returnValue(1);
			expect(roundRobinEventLinesService.calculateLinesGenderPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 4,
				womenLines: 1,
				menLines: 2,
				combLines: 1,
				totalLines: 4,
				additionalWomen: 3,
				additionalMen: 0,
				additionalPlayers: 3,
				womenDoubles: 0,
				menDoubles: 1,
				womenSingles: 1,
				menSingles: 1,
				mixedDoubles: 1
			});
		});
	});

    describe('calculateLinesGender Test', function(){
    	it('should return the correct value', function(){
    		var eventConfig = 'sandwich';
    		var femaleCount = 4;
    		var maleCount = 6;
    		var womenSitting = 0;
    		var menSitting = 0;
    		spyOn(roundRobinEventLinesService, 'calculateLinesGenderPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(roundRobinEventLinesService.calculateLinesGender(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
		});
	});

	describe('calculateLinesGenderSinglesOnlyPerTeam Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var femaleCount = 11;
			var maleCount = 9;
			var teamCount = 2;
			var womenSitting = 0;
			var menSitting = 0;
			expect(roundRobinEventLinesService.calculateLinesGenderSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 2,
				womenLines: 5,
				menLines: 4,
				additionalWomen: 1,
				additionalMen: 1,
				combLines: 0,
				totalLines: 9,
				additionalPlayers: 2,
				womenDoubles: 0,
				menDoubles: 0,
				womenSingles: 5,
				menSingles: 4,
				mixedDoubles: 0
			});
		});
	});

	describe('calculateLinesGenderSinglesOnly Test', function(){
    	it('should return the correct value', function(){
    		var eventConfig = 'sandwich';
    		var femaleCount = 4;
    		var maleCount = 6;
    		var womenSitting = 0;
    		var menSitting = 0;
    		spyOn(roundRobinEventLinesService, 'calculateLinesGenderSinglesOnlyPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(roundRobinEventLinesService.calculateLinesGenderSinglesOnly(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
		});
	});

	describe('calculateLinesMixedPerTeam Test', function(){
		it('should return the correct values', function(){
			var eventConfig = {
				singleWomenLines: 2,
				singleMenLines: 1,
				combPlay: '1'
			};
			var femaleCount = 2;
			var maleCount = 6;
			var teamCount = 2;
			var womenSitting = 0;
			var menSitting = 0;
			expect(roundRobinEventLinesService.calculateLinesMixedPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 2,
				womenLines: '-',
				menLines: '-',
				combLines: 1,
				totalLines: 1,
				additionalWomen: 0,
				additionalMen: 4,
				additionalPlayers: 4,
				mixedSingles: 0,
				mixedDoubles: 1
			});
		});
	});

	describe('calculateLinesMixed Test', function(){
    	it('should return the correct value', function(){
    		var eventConfig = 'sandwich';
    		var femaleCount = 4;
    		var maleCount = 6;
    		var womenSitting = 0;
    		var menSitting = 0;
    		spyOn(roundRobinEventLinesService, 'calculateLinesMixedPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(roundRobinEventLinesService.calculateLinesMixed(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
		});
	});

	describe('calculateLinesMixedSinglesOnlyPerTeam Test', function(){
		it('should return the correct values', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var femaleCount = 8;
			var maleCount = 4;
			var teamCount = 2;
			var womenSitting = 0;
			var menSitting = 0;
			expect(roundRobinEventLinesService.calculateLinesMixedSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 2,
				womenLines: '-',
				menLines: '-',
				combLines: 4,
				totalLines: 4,
				additionalWomen: 4,
				additionalMen: 0,
				additionalPlayers: 4,
				womenDoubles: 0,
				menDoubles: 0,
				womenSingles: 0,
				menSingles: 0,
				mixedSingles: 4,
				mixedDoubles: 0
			});
		});
	});

	describe('calculateLinesMixedSinglesOnly Test', function(){
    	it('should return the correct value', function(){
    		var eventConfig = 'sandwich';
    		var femaleCount = 4;
    		var maleCount = 6;
    		var womenSitting = 0;
    		var menSitting = 0;
    		spyOn(roundRobinEventLinesService, 'calculateLinesMixedSinglesOnlyPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(roundRobinEventLinesService.calculateLinesMixedSinglesOnly(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
		});
	});

});