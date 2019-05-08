teamsRIt.service('leagueEventLinesService', function(){

	// Standard team counts
	var teamCounts = [1, 2, 4, 6, 8, 9, 16, 25];
	var standardTeamCounts = [2, 4, 6, 8, 16];
	var irregularTeamCounts = [1, 9, 25];

	// Calculate combined lines given the number of additional guys and gals
	this.calculateCombLines = function(eventConfig, additionalWomen, additionalMen){
		if(additionalWomen >= 1 && additionalMen >= 1 && eventConfig.combPlay === '1'){
			return Math.min(additionalWomen, additionalMen);
		}
		return 0;
	};
	
	// Calculates lines for gender play for a specific number of teams config
	this.calculateLinesGenderPerTeam = function(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting){
		if(standardTeamCounts.indexOf(teamCount) > -1){
			if(eventConfig.combPlay !== null && (eventConfig.singleWomenLines || eventConfig.singleWomenLines === 0) &&
			   (eventConfig.singleMenLines || eventConfig.singleMenLines === 0)){
				var womenPerTeam = Math.floor(femaleCount / teamCount) - (womenSitting ? womenSitting : 0);
				var menPerTeam = Math.floor(maleCount / teamCount) - (menSitting ? menSitting : 0);
				var additionalWomen = femaleCount % teamCount;
				var additionalMen = maleCount % teamCount;
				var womenSingles = Math.min(womenPerTeam, eventConfig.singleWomenLines);
				var menSingles = Math.min(menPerTeam, eventConfig.singleMenLines);
				var womenDoubles = Math.max(0, Math.floor((womenPerTeam - womenSingles) / 2));
				var menDoubles = Math.max(0, Math.floor((menPerTeam - menSingles) / 2));
				var womenLines =  womenSingles + womenDoubles;
				var menLines = menSingles + menDoubles;
				var extraWomenPerTeam = womenPerTeam - (womenDoubles * 2) - womenSingles;
				var extraMenPerTeam = menPerTeam - (menDoubles * 2) - menSingles;
				var combLines = this.calculateCombLines(eventConfig, extraWomenPerTeam, extraMenPerTeam);
				var totalLines = womenLines + menLines + combLines;
				var additionalPlayers = additionalWomen + additionalMen;
			}
			else{
				womenLines = '-';
				menLines = '-';
				additionalWomen = '-';
				additionalMen = '-';
				combLines = '-';
				totalLines = '-';
				additionalPlayers = '-';
			}
		}
		else{
			totalLines = null;
			womenLines = null;
			menLines = null;
			additionalWomen = null;
			additionalMen = null;
			combLines = null;
			totalLines = null;
			additionalPlayers = null;
		}
		return {
			totalTeams: teamCount,
			womenLines: womenLines,
			menLines: menLines,
			additionalWomen: additionalWomen,
			additionalMen: additionalMen,
			combLines: combLines,
			totalLines: totalLines,
			additionalPlayers: additionalPlayers,
			womenDoubles: womenDoubles,
			menDoubles: menDoubles,
			womenSingles: womenSingles,
			menSingles: menSingles,
			mixedDoubles: combLines
		}
	};
	
	// Calculates lines for gender play
	this.calculateLinesGender = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){
		var perTeamLines = [];
		for(var i = 0; i < teamCounts.length; i++){
			var linesPerTeamsConfig = this.calculateLinesGenderPerTeam(eventConfig, femaleCount, maleCount, teamCounts[i], womenSitting, menSitting);
			perTeamLines.push(linesPerTeamsConfig);
		}
		return perTeamLines;
	};
	
	// Calculates lines for gender play if it's a singles only event for a specific number of teams config
	this.calculateLinesGenderSinglesOnlyPerTeam = function(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting){
		var currentTeamCounts = eventConfig.teamsPerLine > 2 ? [eventConfig.teamsPerLine * eventConfig.teamsPerLine] : standardTeamCounts;
		if(currentTeamCounts.indexOf(teamCount) > -1){
			var womenPerTeam = Math.floor(femaleCount / teamCount) - (womenSitting ? womenSitting : 0);
			var menPerTeam = Math.floor(maleCount / teamCount) - (menSitting ? menSitting : 0);
			var additionalWomen = femaleCount % teamCount;
			var additionalMen = maleCount % teamCount;
			var womenLines = womenPerTeam;
			var menLines = menPerTeam;
			var totalLines = womenPerTeam + menPerTeam;
			var combLines = 0;
			var additionalPlayers = additionalWomen + additionalMen;
		}
		return {
			totalTeams: teamCount,
			womenLines: womenLines || womenLines === 0 ? womenLines : null,
			menLines: menLines || menLines === 0 ? menLines : null,
			additionalWomen: additionalWomen || additionalWomen === 0 ? additionalWomen : null,
			additionalMen: additionalMen || additionalMen === 0 ? additionalMen : null,
			combLines: combLines || combLines === 0 ? combLines : null,
			totalLines: totalLines || totalLines === 0 ? totalLines : null,
			additionalPlayers: additionalPlayers || additionalPlayers === 0 ? additionalPlayers : null,
			womenDoubles: 0,
			menDoubles: 0,
			womenSingles: womenLines,
			menSingles: menLines,
			mixedDoubles: combLines
		}
	};

	// Calculate lines for gender play if it's a singles only event
	this.calculateLinesGenderSinglesOnly = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){
		var perTeamLines = [];
		for(var i = 0; i < teamCounts.length; i++){
			var linesPerTeamsConfig = this.calculateLinesGenderSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCounts[i], womenSitting, menSitting);
			perTeamLines.push(linesPerTeamsConfig);
		}
		return perTeamLines;
	};
	
	// Calculates lines for mixed play for a specific number of teams config
	this.calculateLinesMixedPerTeam = function(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting){
		if(standardTeamCounts.indexOf(teamCount) > -1){
			var womenPerTeam = Math.floor(femaleCount / teamCount) - (womenSitting ? womenSitting : 0);
			var menPerTeam = Math.floor(maleCount / teamCount) - (menSitting ? menSitting : 0);
			var doubleLines = Math.min(womenPerTeam, menPerTeam);
			var combLines = doubleLines;
			var totalLines = doubleLines;
			var additionalWomen = femaleCount % teamCount;
			var additionalMen = maleCount % teamCount;
			var additionalPlayers = additionalWomen + additionalMen;
		}
		return {
			totalTeams: teamCount,
			womenLines: standardTeamCounts.indexOf(teamCount) > - 1 ? '-' : null,
			menLines: standardTeamCounts.indexOf(teamCount) > - 1 ? '-' : null,
			additionalWomen: additionalWomen || additionalWomen === 0 ? additionalWomen : null,
			additionalMen: additionalMen || additionalMen === 0 ? additionalMen : null,
			combLines: combLines || combLines === 0 ? combLines : null,
			totalLines: totalLines || totalLines === 0 ? totalLines : null,
			additionalPlayers: additionalPlayers || additionalPlayers === 0 ? additionalPlayers : null,
			mixedSingles: 0,
			mixedDoubles: doubleLines
		}
	};
		
	// Calculates lines for mixed play
	this.calculateLinesMixed = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){
		var perTeamLines = [];
		for(var i = 0; i < teamCounts.length; i++){
			var linesPerTeamsConfig = this.calculateLinesMixedPerTeam(eventConfig, femaleCount, maleCount, teamCounts[i], womenSitting, menSitting);
			perTeamLines.push(linesPerTeamsConfig);
		}
		return perTeamLines;
	};
	
	// Calculates lines for mixed play if it's a singles only event for a specific number of teams config
	this.calculateLinesMixedSinglesOnlyPerTeam = function(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting){
		var currentTeamCounts = eventConfig.teamsPerLine > 2 ? [eventConfig.teamsPerLine * eventConfig.teamsPerLine] : standardTeamCounts;
		if(currentTeamCounts.indexOf(teamCount) > -1){
			var womenPerTeam = Math.floor(femaleCount / teamCount) - (womenSitting ? womenSitting : 0);
			var menPerTeam = Math.floor(maleCount / teamCount) - (menSitting ? menSitting : 0);
			var additionalWomen = femaleCount % teamCount;
			var additionalMen = maleCount % teamCount;
			var womenHalfOfMixedSingles = Math.min(womenPerTeam, menPerTeam);
			var menHalfOfMixedSingles = Math.min(womenPerTeam, menPerTeam);
			var totalLines = womenHalfOfMixedSingles + menHalfOfMixedSingles;
			var combLines = totalLines;
			var additionalPlayers = additionalWomen + additionalMen;
		}
		return {
			totalTeams: teamCount,
			womenLines: currentTeamCounts.indexOf(teamCount) > - 1 ? '-' : null,
			menLines: currentTeamCounts.indexOf(teamCount) > - 1 ? '-' : null,
			additionalWomen: additionalWomen || additionalWomen === 0 ? additionalWomen : null,
			additionalMen: additionalMen || additionalMen === 0 ? additionalMen : null,
			combLines: combLines || combLines === 0 ? combLines : null,
			totalLines: totalLines || totalLines === 0 ? totalLines : null,
			additionalPlayers: additionalPlayers || additionalPlayers === 0 ? additionalPlayers : null,
			womenDoubles: 0,
			menDoubles: 0,
			womenSingles: 0,
			menSingles: 0,
			mixedSingles: totalLines || totalLines === 0 ? totalLines : null,
			mixedDoubles: 0
		}
	};
	
	// Calculates lines for mixed play if it's a singles only event
	this.calculateLinesMixedSinglesOnly = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){
		var perTeamLines = [];
		for(var i = 0; i < teamCounts.length; i++){
			var linesPerTeamsConfig = this.calculateLinesMixedSinglesOnlyPerTeam(eventConfig, femaleCount, maleCount, teamCounts[i], womenSitting, menSitting);
			perTeamLines.push(linesPerTeamsConfig);
		}
		return perTeamLines;
	};
	
});