teamsRIt.controller('viewParticipantsLadderModalController', function($scope, $rootScope, ladderModalService){

    $scope.all_participants=[];
    $scope.participants=[];
    $scope.field_type_values=[['First Name', 'first_name'],
                              ['Last Name', 'last_name'],
                              ['Gender', 'sex'],
                              ['Email', 'email'],
                              ['Username', 'username'],
                              ['Phone', 'phone'],
                              ['Status', 'status']
                             ];
    $scope.field_type = "first_name";

    // needed for typeahead widget
    $scope.items=[];
    $scope.name="";

    $scope.event_sub_type = function(event, sub_type){
        return event.event_sub_type === sub_type;
    };  

    get_status = function(user){
        if(user.pivot.confirmed && !user.pivot.unavailable){
            return 'Active';
        }
        else{
            return 'Temporarily Withdrawn';
        }
    };  

    match = function(record, field, value){
        var field_value;
        if(value === ''){
            return true;
        }
        if(field === 'status'){
            field_value = get_status(record);
        }
        else{
            field_value = record[field].toLowerCase();
        }
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
        if($scope.all_participants.length == 0 || $scope.all_participants.users.length === 0){
            return;
        }
        items={};
        participants=[];
        for(var i=0; i < $scope.all_participants.users.length; i++){
            if  (match($scope.all_participants.users[i], field_type, value)){
                participants.push({'first_name': $scope.all_participants.users[i].first_name,
                                   'last_name': $scope.all_participants.users[i].last_name,
                                   'sex': $scope.all_participants.users[i].sex,
                                   'email': $scope.all_participants.users[i].email,
                                   'username': $scope.all_participants.users[i].username,
                                   'phone': $scope.all_participants.users[i].phone,
                                   'status': get_status($scope.all_participants.users[i])});
            }
            if(field_type === 'status'){
                items[get_status($scope.all_participants.users[i])] = 1;
            }
            else{
                items[$scope.all_participants.users[i][field_type]] = 1;
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
		$scope.getParticipantsInProgress = true;
        ladderModalService.getNonDroppedParticipants($rootScope.selectedEvent.id).then(function(data){
            $scope.all_participants = angular.copy(data.participants);
            getParticipantsByType($scope.field_type_values[0][1], '');
		}).finally(function(){
			$scope.getParticipantsInProgress = false;
		});
    }   
    getConfirmedParticipants();


});
