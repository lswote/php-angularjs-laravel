describe('leagueEventLinesServiceTests Test Suite', function(){

    var leagueEventLinesService;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_leagueEventLinesService_){
        leagueEventLinesService = _leagueEventLinesService_;
    }));

    describe('calculateCombLines Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(leagueEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(3);
		});
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '0'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(leagueEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(0);
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
			spyOn(leagueEventLinesService, 'calculateCombLines').and.returnValue(1);
			expect(leagueEventLinesService.calculateLinesGenderPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 4,
				womenLines: 1,
				menLines: 2,
				additionalWomen: 0,
				additionalMen: 1,
				combLines: 1,
				totalLines: 4,
				additionalPlayers: 1,
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
    		spyOn(leagueEventLinesService, 'calculateLinesGenderPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(leagueEventLinesService.calculateLinesGender(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
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
			expect(leagueEventLinesService.calculateLinesGenderSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
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
    		spyOn(leagueEventLinesService, 'calculateLinesGenderSinglesOnlyPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(leagueEventLinesService.calculateLinesGenderSinglesOnly(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
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
			expect(leagueEventLinesService.calculateLinesMixedPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 2,
				womenLines: '-',
				menLines: '-',
				additionalWomen: 0,
				additionalMen: 0,
				combLines: 1,
				totalLines: 1,
				additionalPlayers: 0,
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
    		spyOn(leagueEventLinesService, 'calculateLinesMixedPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(leagueEventLinesService.calculateLinesMixed(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
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
			expect(leagueEventLinesService.calculateLinesMixedSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting)).toEqual({
				totalTeams: 2,
				womenLines: '-',
				menLines: '-',
				additionalWomen: 0,
				additionalMen: 0,
				combLines: 4,
				totalLines: 4,
				additionalPlayers: 0,
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
    		spyOn(leagueEventLinesService, 'calculateLinesMixedSinglesOnlyPerTeam').and.returnValues('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight');
    		expect(leagueEventLinesService.calculateLinesMixedSinglesOnly(eventConfig, femaleCount, maleCount, womenSitting, menSitting)).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
		});
	});

});