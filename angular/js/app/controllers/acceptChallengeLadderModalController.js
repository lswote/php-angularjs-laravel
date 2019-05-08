teamsRIt.controller('acceptChallengeLadderModalController', function($scope, $rootScope, $window, ladderModalService){

	$scope.challenges = [];
	$scope.showAcceptChallengeLadderErrors = [
		no_selection = false
	];

	// Hide all add event leader errors
	$scope.resetAcceptChallengeLadderErrors = function(){
		$scope.callSuccess = false;
		for(i in $scope.showAcceptChallengeLadderErrors){
			if($scope.showAcceptChallengeLadderErrors.hasOwnProperty(i)){
				$scope.showAcceptChallengeLadderErrors[i] = false;
			}
		}

	};

	$scope.init = function(){
		ladderModalService.getRules($rootScope.selectedEvent.id).then(function(data){
			$scope.rules = data.rules_event[0];
			$scope.getData();
		});
	};
	$scope.init();

	$scope.getData = function(){
		ladderModalService.getUnacceptedChallenges($rootScope.selectedEvent.id, $rootScope.user.id).then(function(data){
			$scope.challenges = [];
			data.challenges.forEach(function(challenge){
				if($rootScope.selectedEvent.event_sub_type === 'singles'){
					// only want to display challenges where user is the challengee
					if(challenge.challengee.id != $rootScope.user.id){
						return;
					}
					var challenger = challenge.challenger.first_name + ' ' + challenge.challenger.last_name;
					var challengee = challenge.challengee.first_name + ' ' + challenge.challengee.last_name;
					var email_ids = [{'id': challenge.challenger.id}];
				}
				else{
					// only want to display challenges where user is the challengee
					if((challenge.challengee[0].id != $rootScope.user.id) &&
						(challenge.challengee[1].id != $rootScope.user.id)){
						return;
					}

					challenger = challenge.challenger[0].first_name + ' ' + challenge.challenger[0].last_name + '/' +
						challenge.challenger[1].first_name + ' ' + challenge.challenger[1].last_name;
					challengee = challenge.challengee[0].first_name + ' ' + challenge.challengee[0].last_name + '/' +
						challenge.challengee[1].first_name + ' ' + challenge.challengee[1].last_name;
					email_ids = [{'id': challenge.challenger[0].id},
						{'id': challenge.challenger[1].id}];
				}
				$scope.challenges.push({
					'challenger': challenger,
					'challengee': challengee,
					'expires': challenge.accept_by_date,
					'accept_deny': '',
					'email_ids': email_ids,
					'id': challenge.id
				});
			});
		});

	}

	$scope.clearSelections = function(){

		$scope.resetAcceptChallengeLadderErrors();
		$scope.challenges.forEach(function(challenge){
			challenge.accept_deny = '';
		});

	}

	getPlayByDate = function(){

		// JavaScript date defaults to MM/DD/YYYY and it needs to be converted
		// to YYYY-MM-DD
		var today = new (Date);
		today.setDate(today.getDate() + $scope.rules.days_play_challenge);
		parts = today.toLocaleDateString('en-US', {
			year: 'numeric',
			month: "2-digit",
			day: "2-digit"
		}).split('/');
		temp = parts[2];
		parts[2] = parts[1];
		parts[1] = parts[0];
		parts[0] = temp;
		return parts.join('-');

	}

	$scope.accept_or_deny_challenge = function(){

		$scope.resetAcceptChallengeLadderErrors();
		if($scope.challenges.length == 0){
			$scope.toggleModal();
			return;
		}
		response_data = [];
		play_by_date = getPlayByDate();
		$scope.challenges.forEach(function(challenge){
			if(challenge.accept_deny != ''){
				response_data.push({
					'challenge_id': challenge.id,
					'preferred_start_time': challenge.accept_deny,
					'challenger': challenge.challenger,
					'challengee': challenge.challengee,
					'play_by_date': play_by_date,
					'recipients': challenge.email_ids
				});
			}
		});
		if(response_data.length == 0){
			$scope.showAcceptChallengeLadderErrors.no_selection = true;
			return;
		}
		$scope.saveData(response_data);

	}

	$scope.saveData = function(response_data){

		ladderModalService.challengeResponses($rootScope.selectedEvent.id, response_data).then(function(data){
		}).finally(function(){
			$scope.emailChallengers(response_data);
		});

	}

	$scope.emailChallengers = function(response_data){

		ladderModalService.notifyChallengers($rootScope.selectedEvent.id, response_data).then(function(data){
		}).finally(function(){
			$scope.toggleModal();
		});

	}

});
