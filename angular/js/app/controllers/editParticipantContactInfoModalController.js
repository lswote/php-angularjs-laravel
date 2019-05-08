teamsRIt.controller('editParticipantContactInfoModalController', function($scope, $rootScope, editParticipantContactInfoModalService){

	$scope.all_participants=[];
	$scope.participants=[];
	$scope.field_type_values=[['Name', 'name'],
							  ['Gender', 'gender'],
							  ['Username', 'username'],
							  ['Email', 'email'],
							  ['Phone', 'phone']
							 ];
	$scope.field_type = "name";
	$scope.sort_field = "name";

	// needed for typeahead widget
	$scope.items=[];
	$scope.name="";
	$scope.roster_editable = $rootScope.showModalView.editParticipantContactInfoFlag;

	$scope.event_sub_type = function(event, sub_type){
		return event.event_sub_type === sub_type;
	};  

	match = function(record, field, value){
		var field_value;
		if(value === ''){
			return true;
		}
		field_value = record[field].toLowerCase();
		if(field_value.indexOf(value.toLowerCase()) !== -1){
			return true;
		}
		else{
			return false;
		}
	};  

	$scope.$watch('name', function(newValue, oldValue){
		getParticipantsByType($scope.field_type, $scope.name);
	});

	$scope.change_search_field = function(){
		$scope.name = "";
		getParticipantsByType($scope.field_type, $scope.name);
	}

	// Get our particpants based on field_type
	getParticipantsByType = function(field_type, value){
		if($scope.all_participants.length == 0){
			return;
		}
		items={};
		participants=[];
		for(var i=0; i < $scope.all_participants.length; i++){
			if  (match($scope.all_participants[i], field_type, value)){
				participants.push($scope.all_participants[i]);
			}
		}

		items_unsorted = [];
		angular.forEach(items, function(value, key) {
			items_unsorted.push(key);
		});
		$scope.items=[];
		items_unsorted.sort().forEach(function(value){
			$scope.items.push({'name': value});
		});
		$scope.participants = participants;
	}

	getConfirmedParticipants = function(){
		editParticipantContactInfoModalService.getCaptain($rootScope.selectedEvent.id).then(function(data){ 
			$scope.captain = data.captain;
		}).finally(function(){
			$scope.getParticipantsInProgress = true;
			editParticipantContactInfoModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
				participants = [];
				for(var i=0; i < data.participants.users.length; i++){
					participants.push({'name': data.participants.users[i].first_name + ' ' + data.participants.users[i].last_name,
									   'gender': data.participants.users[i].sex == 'male' ? 'M' : 'F',
									   'username': data.participants.users[i].username,
									   'email': data.participants.users[i].email,
									   'phone': data.participants.users[i].phone,
									   'id': data.participants.users[i].id,
									   'index': data.participants.users[i].id === $scope.captain.id ? -1 : i});
				}
				$scope.all_participants = participants;
				getParticipantsByType($scope.field_type_values[0][1], '');
			}).finally(function(){
				$scope.getParticipantsInProgress = false;
			});
		});
	}   
	getConfirmedParticipants();

	$scope.deleteRequest = function(index){
		editParticipantContactInfoModalService.delete_participant($rootScope.selectedEvent.id, $scope.all_participants[index].id).then(function(data){
		}).finally(function(){
			getConfirmedParticipants();
		});
	}

	$scope.saveTeamSettings = function(){
		editParticipantContactInfoModalService.update_participants($rootScope.selectedEvent.id, $scope.all_participants).then(function(data){
		}).finally(function(){
			$scope.toggleModal();
		});
	}

});
