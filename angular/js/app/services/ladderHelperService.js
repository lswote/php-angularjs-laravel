teamsRIt.service('ladderHelperService', function(){

	this.reportChallengeScore = function(challenge_data, id, ladderObject, event_sub_type){
		challenger = '';
		challengee = '';
		num_sets = '';
		ladderObject.match = {
			matches: [],
		};
		challenge_data.some(function(challenge){
			if(challenge.id == id){
				if(event_sub_type === 'singles'){
					ladderObject.match['challenger'] = challenge.challenger.first_name + ' ' + challenge.challenger.last_name;
					ladderObject.match['challengee'] = challenge.challengee.first_name + ' ' + challenge.challengee.last_name;
				}
				else{
					ladderObject.match['challenger'] = challenge.challenger[0].first_name + ' ' + challenge.challenger[0].last_name + '/' +
												 challenge.challenger[1].first_name + ' ' + challenge.challenger[1].last_name;
					ladderObject.match['challengee'] = challenge.challengee[0].first_name + ' ' + challenge.challengee[0].last_name + '/' +
												 challenge.challengee[1].first_name + ' ' + challenge.challengee[1].last_name;
				}
				for(i = 0; i < challenge.num_sets; i++){
					if(i < challenge.matches.length){
						match = challenge.matches[i];
						// don't display nulls
						pair_one_score = match.pair_one_score ? match.pair_one_score : 0;
						pair_two_score = match.pair_two_score ? match.pair_two_score : 0;
						if(challenge.winner === challenge.challenger_id){
							ladderObject.match.matches.push({
								id: match.id,
								one: pair_one_score,
								two: pair_two_score
							});
						}
						else{
							ladderObject.match.matches.push({
								id: match.id,
								one: pair_two_score,
								two: pair_one_score
							});
						}
					}
					else {
						ladderObject.match.matches.push({id: -1, one: 0, two: 0});
					}
				}
				ladderObject.match['responded'] = challenge.responded;
				ladderObject.match['event_id'] = challenge.event_id;
				ladderObject.match['id'] = challenge.id;
				ladderObject.match['num_sets'] = challenge.id;
				ladderObject.match['challenger_id'] = challenge.challenger_id.toString(); 
				ladderObject.match['challengee_id'] = challenge.challengee_id.toString(); 
				ladderObject.match['winner'] = challenge.winner ? challenge.winner.toString() : '0';
				ladderObject.match['winner_disabled'] = challenge.winner ? 1 : 0;
				ladderObject.match['match_status'] = challenge.result_status;
				ladderObject.match['played_date'] = challenge.played_date;
				ladderObject.match['played_date_display'] = challenge.played_date+'T24:00:00.000Z';
			}
		});

		// display the page last so it will incorporate the entered values
		ladderObject.src = 'views/edit-ladder-score.html';

	};

	this.saveChallengeScore = function(ladderObject){

		if (!ladderObject.match.played_date){
			ladderObject.errors.played_date = true;
			return false;
		}
		if(ladderObject.match.winner == 0){
			ladderObject.errors.winner = true;
			return false;
		}
		if(ladderObject.match.match_status === "completed"){
			count = 0;
			for(i = 0; i < ladderObject.match.matches.length; i++){
				if (ladderObject.match.matches[i].one > ladderObject.match.matches[i].two){
					count++;
				}
				// don't need to check any mores scores after the match is clearly won
				if(count > ladderObject.match.matches.length/2){
					break;
				}
			}
			if(count <= ladderObject.match.matches.length/2){
				ladderObject.errors.winner_too_few = true;
				return false;
			}
		}
		// scores do not need to be entered for games that are won
		// by reasons other than playing through
		else if(ladderObject.match.match_status !== ""){
			for(i = 0; i < ladderObject.match.matches.length; i++){
				ladderObject.match.matches[i].one = null;
				ladderObject.match.matches[i].two = null;
			}
		}
		if(ladderObject.match.match_status == ""){
			ladderObject.errors.match_status = true;
			return false;
		}
		return true;

	};

});