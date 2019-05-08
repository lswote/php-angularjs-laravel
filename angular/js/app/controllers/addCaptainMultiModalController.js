teamsRIt.controller('addCaptainMultiModalController', function($scope, $rootScope, $window, multiModalService, dashboardService, addEventParticipantModalService){

	// Default values
	$scope.items=[];
	$scope.name="";
	$scope.email="";

	// Errors object
	$scope.showAddCaptainMultiErrors = {
		username: false,
		usernameNotFound: false
	};

	// Hide all errors
	$scope.resetAddCaptainMultiErrors = function(){
		for(i in $scope.showAddCaptainMultiErrors){
			if($scope.showAddCaptainMultiErrors.hasOwnProperty(i)){
				$scope.showAddCaptainMultiErrors[i] = false;
			}
		}
	};

	// look for any typing
	$scope.$watch('name', function(newValue, oldValue){
		if(newValue !== oldValue){
			$scope.email = '';
			for(var i=0; i < $scope.items.length; i++){
				if($scope.items[i].name.toLowerCase() === newValue.toLowerCase()){
					$scope.email = $scope.items[i].email;
					break;
				}
			}
		}
	});

	// Get potential captains
	$scope.getData = function(){
		var items =[];
		dashboardService.getFacilityInfo().then(function(data){
			data.facility.users.forEach(function(participant){
				items.push({
					'name': participant.first_name + ' ' + participant.last_name,
					'email': participant.email,
					'username': participant.username
				});
			});
			$scope.items = angular.copy(items);
		}).finally(function(){
			multiModalService.getCaptain($rootScope.selectedEvent.id).then(function(data){
				// get captain's name if already defined
				if(data.captain){
					$scope.name = data.captain.first_name+' '+data.captain.last_name;
				}
			});
		});
	};
	$scope.getData();

	// Convert a name into a user id
    $scope.getUsernameFromName = function(name){
        for(i = 0; i < $scope.items.length; i++){
            if($scope.items[i]['name'] === name){
                return($scope.items[i]['username']);
            }
        }
        return -1;
    };

	// Check our inputs
	$scope.checkInput = function(){
		var noErrors = true;
		if($scope.getUsernameFromName($scope.name) === -1){
			$scope.showAddCaptainMultiErrors.username = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Adds or modifys captain
	$scope.editCaptain = function(){
		if($scope.checkInput() === true){
			addEventParticipantModalService.addEventParticipant($rootScope.selectedEvent.id, $scope.getUsernameFromName($scope.name), 'captain').then(function(){
				$rootScope.getEvents();
				$rootScope.toggleModal();
			}, function(data){
				if(data.error === 'User with username not found'){
					$scope.showAddCaptainMultiErrors.usernameNotFound = true;
				}
				else{
					$window.alert('Something went wrong.  Captain not added');
				}
			});
		}
	};

});