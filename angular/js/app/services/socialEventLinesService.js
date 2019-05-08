teamsRIt.service('socialEventLinesService', function(){

	// Calculate combined lines given the number of additional guys and gals
	this.calculateCombLines = function(eventConfig, additionalWomen, additionalMen){
		if(additionalWomen >= 2 && additionalMen >= 2 && eventConfig.combPlay === '1'){
			var possibleWomenDuos = Math.floor(additionalWomen / 2);
			var possibleMenDuos = Math.floor(additionalMen / 2);
			return Math.min(possibleWomenDuos, possibleMenDuos);
		}
		return 0;
	};
	
	// Calculates lines for gender play
	this.calculateLinesGender = function(eventConfig, femaleCount, maleCount){
		if(eventConfig.combPlay !== null && (eventConfig.singleWomenLines || eventConfig.singleWomenLines === 0) &&
		   (eventConfig.singleMenLines || eventConfig.singleMenLines === 0)){
			var womenSingles = Math.min(Math.floor(femaleCount / 2), eventConfig.singleWomenLines);
			var menSingles = Math.min(Math.floor(maleCount / 2), eventConfig.singleMenLines);
			var womenDoubles = Math.max(0, Math.floor((femaleCount - (eventConfig.singleWomenLines * 2)) / 4));
			var menDoubles = Math.max(0, Math.floor((maleCount - (eventConfig.singleMenLines * 2)) / 4));
			var womenLines =  womenSingles + womenDoubles;
			var menLines = menSingles + menDoubles;
			var additionalWomen = Math.max(0, (femaleCount - (eventConfig.singleWomenLines * 2)) % 4);
			var additionalMen = Math.max(0, (maleCount - (eventConfig.singleMenLines * 2)) % 4);
			var combLines = this.calculateCombLines(eventConfig, additionalWomen, additionalMen);
			var totalLines = womenLines + menLines + combLines;
			var additionalPlayers = (additionalWomen + additionalMen) - (combLines * 4);
		}
		return [{
			totalTeams: 1,
			womenLines: womenLines || womenLines === 0 ? womenLines : '-',
			menLines: menLines || menLines === 0 ? menLines : '-',
			additionalWomen: additionalWomen || additionalWomen === 0 ? additionalWomen : '-',
			additionalMen: additionalMen || additionalMen === 0 ? additionalMen : '-',
			combLines: combLines || combLines === 0 ? combLines : '-',
			totalLines: totalLines || totalLines === 0 ? totalLines : '-',
			additionalPlayers: additionalPlayers || additionalPlayers === 0 ? additionalPlayers : '-',
			womenDoubles: womenDoubles,
			menDoubles: menDoubles,
			womenSingles: womenSingles,
			menSingles: menSingles,
			mixedDoubles: combLines
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
		}];
	};

	// Calculate lines for gender play if it's a singles only event
	this.calculateLinesGenderSinglesOnly = function(eventConfig, femaleCount, maleCount){
		var extraWomen = femaleCount % 2;
		var extraMen = maleCount % 2;
		var combSingles;
		if(eventConfig.combPlay === '1'){
			combSingles = extraWomen === 1 && extraMen === 1 ? 1 : 0;
		}
		else{
			combSingles = 0;
		}
		var womenLines =  Math.floor(femaleCount / 2);
		var menLines = Math.floor(maleCount / 2);
		var additionalWomen = combSingles === 0 ? extraWomen : 0;
		var additionalMen = combSingles === 0 ? extraMen : 0;
		var combLines = combSingles;
		var totalLines = womenLines + menLines + combLines;
		var additionalPlayers = additionalWomen + additionalMen;
		return [{
			totalTeams: 1,
			womenLines: womenLines,
			menLines: menLines,
			additionalWomen: additionalWomen,
			additionalMen: additionalMen,
			combLines: combLines,
			totalLines: totalLines,
			additionalPlayers: additionalPlayers,
			womenDoubles: 0,
			menDoubles: 0,
			womenSingles: womenLines,
			menSingles: menLines,
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
		}];
	};
	
	// Calculates lines for mixed play
	this.calculateLinesMixed = function(eventConfig, femaleCount, maleCount){
		var singleLines = Math.min(femaleCount, maleCount, eventConfig.singleWomenLines, eventConfig.singleMenLines);
		var womenLeftAfterSingles = femaleCount - singleLines;
		var menLeftAfterSingles = maleCount - singleLines;
		var mostOfGenderAvailableForDoubles = Math.min(womenLeftAfterSingles, menLeftAfterSingles);
		var extraWomen = womenLeftAfterSingles - mostOfGenderAvailableForDoubles;
		var extraMen = menLeftAfterSingles - mostOfGenderAvailableForDoubles;
		var doubleLines = Math.floor(mostOfGenderAvailableForDoubles / 2);
		var totalLines = singleLines + doubleLines;
		var womenLines = '-';
		var menLines = '-';
		var womenAndMenLeftAfterDoubles = mostOfGenderAvailableForDoubles % 2;
		var additionalWomen = extraWomen + womenAndMenLeftAfterDoubles;
		var additionalMen = extraMen + womenAndMenLeftAfterDoubles;
		return [{
			totalTeams: 1,
			womenLines: womenLines,
			menLines: menLines,
			additionalWomen: additionalWomen,
			additionalMen: additionalMen,
			combLines: '-',
			totalLines: totalLines,
			additionalPlayers: additionalWomen + additionalMen,
			mixedSingles: singleLines,
			mixedDoubles: doubleLines
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
		}];
	};
	
	// Calculates lines for mixed play if it's a singles only event
	this.calculateLinesMixedSinglesOnly = function(eventConfig, femaleCount, maleCount){
		var totalLines = Math.min(femaleCount, maleCount);
		var extraWomen = femaleCount - totalLines;
		var extraMen = maleCount - totalLines;
		var womenLines = '-';
		var menLines = '-';
		return [{
			totalTeams: 1,
			womenLines: womenLines,
			menLines: menLines,
			additionalWomen: extraWomen,
			additionalMen: extraMen,
			combLines: '-',
			totalLines: totalLines,
			additionalPlayers: extraWomen + extraMen,
			mixedSingles: totalLines,
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
		}];
	};
	
});