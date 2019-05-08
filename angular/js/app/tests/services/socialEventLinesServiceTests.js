describe('socialEventLinesServiceTests Test Suite', function(){

    var socialEventLinesService;

    // Initiliaze the Teams R It module
    beforeEach(function(){
        module('teamsRIt');
        module('ngRoute');
    });

    // Assign service and httpBackend references
    beforeEach(inject(function(_socialEventLinesService_){
        socialEventLinesService = _socialEventLinesService_;
    }));

    describe('calculateCombLines Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(socialEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(1);
		});
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '0'
			};
			var additionalWomen = 3;
			var additionalMen = 5;
			expect(socialEventLinesService.calculateCombLines(eventConfig, additionalWomen, additionalMen)).toEqual(0);
		});
	});

    describe('calculateLinesGender Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1',
				singleWomenLines: 1,
				singleMenLines: 1
			};
			var femaleCount = 12;
			var maleCount = 13;
			spyOn(socialEventLinesService, 'calculateCombLines').and.returnValue(1);
			expect(socialEventLinesService.calculateLinesGender(eventConfig, femaleCount, maleCount)).toEqual([{
				totalTeams: 1,
				womenLines: 3,
				menLines: 3,
				additionalWomen: 2,
				additionalMen: 3,
				combLines: 1,
				totalLines: 7,
				additionalPlayers: 1,
				womenDoubles: 2,
				menDoubles: 2,
				womenSingles: 1,
				menSingles: 1,
				mixedDoubles: 1
			}, {
				totalTeams: 2
			}, {
				totalTeams: 4
			}, {
				totalTeams: 6
			}, {
				totalTeams: 8
			}, {
				totalTeams: 9
			}, {
				totalTeams: 16
			}, {
				totalTeams: 25
			}]);
		});
	});

	describe('calculateLinesGenderSinglesOnly Test', function(){
		it('should return the correct value', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var femaleCount = 11;
			var maleCount = 9;
			expect(socialEventLinesService.calculateLinesGenderSinglesOnly(eventConfig, femaleCount, maleCount)).toEqual([{
				totalTeams: 1,
				womenLines: 5,
				menLines: 4,
				additionalWomen: 0,
				additionalMen: 0,
				combLines: 1,
				totalLines: 10,
				additionalPlayers: 0,
				womenDoubles: 0,
				menDoubles: 0,
				womenSingles: 5,
				menSingles: 4,
				mixedDoubles: 0
			}, {
				totalTeams: 2
			}, {
				totalTeams: 4
			}, {
				totalTeams: 6
			}, {
				totalTeams: 8
			}, {
				totalTeams: 9
			}, {
				totalTeams: 16
			}, {
				totalTeams: 25
			}]);
		});
	});

	describe('calculateLinesMixed Test', function(){
		it('should return the correct values', function(){
			var eventConfig = {
				singleWomenLines: 2,
				singleMenLines: 1,
				combPlay: '1'
			};
			var femaleCount = 2;
			var maleCount = 6;
			expect(socialEventLinesService.calculateLinesMixed(eventConfig, femaleCount, maleCount)).toEqual([{
				totalTeams: 1,
				womenLines: '-',
				menLines: '-',
				additionalWomen: 1,
				additionalMen: 5,
				combLines: '-',
				totalLines: 1,
				additionalPlayers: 6,
				mixedSingles: 1,
				mixedDoubles: 0
			}, {
				totalTeams: 2
			}, {
				totalTeams: 4
			}, {
				totalTeams: 6
			}, {
				totalTeams: 8
			}, {
				totalTeams: 9
			}, {
				totalTeams: 16
			}, {
				totalTeams: 25
			}]);
		});
	});

	describe('calculateLinesMixedSinglesOnly Test', function(){
		it('should return the correct values', function(){
			var eventConfig = {
				combPlay: '1'
			};
			var femaleCount = 8;
			var maleCount = 4;
			expect(socialEventLinesService.calculateLinesMixedSinglesOnly(eventConfig, femaleCount, maleCount)).toEqual([{
				totalTeams: 1,
				womenLines: '-',
				menLines: '-',
				additionalWomen: 4,
				additionalMen: 0,
				combLines: '-',
				totalLines: 4,
				additionalPlayers: 4,
				mixedSingles: 4,
				mixedDoubles: 0
			}, {
				totalTeams: 2
			}, {
				totalTeams: 4
			}, {
				totalTeams: 6
			}, {
				totalTeams: 8
			}, {
				totalTeams: 9
			}, {
				totalTeams: 16
			}, {
				totalTeams: 25
			}]);
		});
	});

});