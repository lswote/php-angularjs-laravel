teamsRIt.controller('viewCompletedLadderResultsModalController', function($scope, $rootScope, ladderModalService){

$scope.time_frame = "30";
	$scope.selected_id = -1;
	$scope.saved_search = "";

	$scope.getDate = function(delta){
		if(delta === 'all'){
			return('0000-00-00');
		}

		// JavaScript date defaults to MM/DD/YYYY and it needs to be converted
		// to YYYY-MM-DD
		var today = new Date();
		today.setDate(today.getDate() - parseInt(delta));
		parts = today.toLocaleDateString('en-US', {year:'numeric',month:"2-digit", day:"2-digit"}).split('/');
		temp = parts[2];
		parts[2] = parts[1];
		parts[1] = parts[0];
		parts[0] = temp;
		return parts.join('-');
	};

	$scope.begin_range_date = $scope.getDate($scope.time_frame);
	$scope.begin_range_date_display = $scope.begin_range_date+'T24:00:00.000Z';
	$scope.end_range_date = $scope.getDate(0);
	$scope.end_range_date_display = $scope.end_range_date+'T24:00:00.000Z';
	min_played_date = $scope.getDate($scope.time_frame);

	// viewCompletedLadderResultsFlag = 2 - set date range - all participants
	// viewCompletedLadderResultsFlag = 1 - set minimum date - all participants
	// viewCompletedLadderResultsFlag = 0 - set minimum date - 1 participant
	if($rootScope.showModalView.viewCompletedLadderResultsFlag === 2){
		$scope.show_selection = false;
		$scope.show_date_range = true;
	}
	else{
		$scope.show_selection = true;
		$scope.show_date_range = false;
	}

	user_id = 0; // view matches for all participants

	// needed for typeahead widget
	$scope.items=[];
	$scope.name="";

	$scope.$watch('name', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.getChallenges(newValue);
		}
	});

	isMatch = function(challenge, value){
		if(value === ''){
			return true;
		}
		if($rootScope.selectedEvent.event_sub_type === 'singles'){
			challenger = challenge.challenger.first_name + ' ' +  challenge.challenger.last_name;
			challengee = challenge.challengee.first_name + ' ' +  challenge.challengee.last_name;
			if(challenger.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
			   challengee.toLowerCase().indexOf(value.toLowerCase()) > -1){
				return true;
			}
		}
		else{
			challenger = challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name;
			challengee = challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name;
			if(challenger.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
			   challengee.toLowerCase().indexOf(value.toLowerCase()) > -1){
				return true;
			}
		}
		return false;
	};

	$scope.getChallenges = function(search){
		if(typeof(search) === "undefined"){
			search = $scope.saved_search;
		}
		$scope.saved_search = search;
		$scope.selected_id = -1;
		$scope.challenges=[];
		played_dates = [];
		min_played_date = $scope.getDate($scope.time_frame);
		$scope.challenge_data.forEach(function(challenge){
			if(!isMatch(challenge, search)){
				return;
			}

			if($rootScope.showModalView.viewCompletedLadderResultsFlag === 2){
				// limit by a date range
				if(($scope.begin_range_date && ($scope.begin_range_date > challenge.played_date)) ||
				   ($scope.end_range_date && ($scope.end_range_date < challenge.played_date))){
					return;
				}
			}
			else{
				// limit by a minimum date
				if(challenge.played_date < min_played_date){
					return;
				}
			}

			results=[];
			if(challenge.result_status === "completed"){
				challenge.matches.forEach(function(match){
					// don't display nulls
					pair_one_score = match.pair_one_score ? match.pair_one_score : 0;
					pair_two_score = match.pair_two_score ? match.pair_two_score : 0;
					// skip any 0-0 score as they are filler
					if((pair_one_score === 0) && (pair_two_score === 0)){
						return;
					}
					if(challenge.winner === challenge.challenger_id){
						results.push(pair_one_score+'-'+pair_two_score);
					}
					else{
						results.push(pair_two_score+'-'+pair_one_score);
					}
				});
			}
			else{
				if(challenge.result_status === "injury_forfeit"){
					results.push('Injury/Forfeit');
				}
			}
			matchname='';
			if($rootScope.selectedEvent.event_sub_type === 'singles'){
				if(challenge.winner === challenge.challenger_id){
					matchname = challenge.challenger.first_name+' '+challenge.challenger.last_name + ' def. ' +
								challenge.challengee.first_name+' '+challenge.challengee.last_name;
				}
				else{
					matchname = challenge.challengee.first_name+' '+challenge.challengee.last_name + ' def. ' +
								challenge.challenger.first_name+' '+challenge.challenger.last_name;
				}
			}
			else{
				if(challenge.winner === challenge.challenger_id){
					matchname = challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name + ' def. ' +
								challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name;
				}
				else{
					matchname = challenge.challengee[0].last_name + '/' + challenge.challengee[1].last_name + ' def. ' +
								challenge.challenger[0].last_name + '/' + challenge.challenger[1].last_name;
				}
			}
			played_dates.push(challenge.played_date);
			$scope.challenges.push({
				id: challenge.id,
				date: challenge.played_date,
				name: matchname,
				results: results.join(', ')
			});
		});

		played_dates.sort();
	};

	$scope.getData = function(){
		$scope.getChallengesInProgress = true;
		ladderModalService.getPlayedChallenges($rootScope.selectedEvent.id, user_id).then(function(data){
			$scope.challenge_data = angular.copy(data.challenges);
			$scope.getChallenges("");
		}, function(data){
			alert('Something went wrong. '+data.error);
		}).finally(function(){
			$scope.getChallengesInProgress = false;
		});
	};
	$scope.getData();

});
