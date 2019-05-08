teamsRIt.service('ladderEventLinesService', function(){

	// Standard team counts
	var teamCounts = [1, 2, 4, 6, 8, 9, 16, 25];
	var standardTeamCounts = [2, 4, 6, 8, 16];
	var irregularTeamCounts = [1, 9, 25];

	// Calculate combined lines given the number of additional guys and gals
	this.calculateCombLines = function(eventConfig, additionalWomen, additionalMen){

	};
	
	// Calculates lines for gender play for a specific number of teams config
	this.calculateLinesGenderPerTeam = function(eventConfig, femaleCount, maleCount, teamCount, womenSitting, menSitting){

	};
	
	// Calculates lines for gender play
	this.calculateLinesGender = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){

	};
	
	// Calculates lines for gender play if it's a singles only event for a specific number of teams config
	this.calculateLinesGenderSinglesOnlyPerTeam = function(eventConfing, femaleCount, maleCount, teamCount, womenSitting, menSitting){

	};

	// Calculate lines for gender play if it's a singles only event
	this.calculateLinesGenderSinglesOnly = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){

	};
	
	// Calculates lines for mixed play for a specific number of teams config
	this.calculateLinesMixedPerTeam = function(eventConfing, femaleCount, maleCount, teamCount, womenSitting, menSitting){

	};
		
	// Calculates lines for mixed play
	this.calculateLinesMixed = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){

	};
	
	// Calculates lines for mixed play if it's a singles only event for a specific number of teams config
	this.calculateLinesMixedSinglesOnlyPerTeam = function(eventConfing, femaleCount, maleCount, teamCount, womenSitting, menSitting){

	};
	
	// Calculates lines for mixed play if it's a singles only event
	this.calculateLinesMixedSinglesOnly = function(eventConfig, femaleCount, maleCount, womenSitting, menSitting){

	};
	
});