teamsRIt.controller('printToDosModalController', function($scope, $rootScope, $window, eventService, eventToDosService, printToDosModalService, helperService){

	// Get all events where our user is a leader
	$scope.taskFilter = 'all';
	$scope.size = 'small';

	$scope.tasks = [];
	$scope.minId = 0;
	$scope.maxId = 0;
	$scope.minNum = 0;
	$scope.maxNum = 0;
	$scope.startDate = '';
	$scope.endDate = '';
	$scope.dates = [];

	$scope.getDate = function(date){
		var date = new Date(date);
		var parts = date.toLocaleDateString('en-US', {year:'numeric',month:"2-digit", day:"2-digit"}).split('/');
		var temp = parts[2];
		parts[2] = parts[1];
		parts[1] = parts[0];
		parts[0] = temp;
		return parts.join('-');
	};

	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if($rootScope.selectedEvent.id &&
			   ($rootScope.user.privilege === 'facility leader' ||
				($rootScope.selectedEvent.id && helperService.findArrayIndex(data.events, 'id', $rootScope.selectedEvent.id) !== false))){
				$scope.displayEventForm = true;
			}
			else{
				eventService.getEventsAsCaptain().then(function(data){
					if($rootScope.selectedEvent.id && helperService.findArrayIndex(data.events, 'id', $rootScope.selectedEvent.id) !== false){
						$scope.displayEventForm = true;
					}
					else{
						$scope.displayEventForm = false;
					}
				}, function(){
					$scope.displayEventForm = false;
				});
			}
		});
	};
	$scope.getEventsAsLeader();

	function stringify(arr){
		return arr.map(function(i){
			i = i != null ? i : '';
			return i.toString();
		});
	}

	function toTaskId(primary, secondary){
		if(primary != null && secondary != null){
			return stringify([primary, secondary]).join('.');
		}else{
			return null;
		}
	}

	function fromApi(apiTodo){
		return{
			description: apiTodo.description,
			id: toTaskId(apiTodo.primary_id, apiTodo.secondary_id),
			prevTask: toTaskId(apiTodo.previous_to_do_primary_id, apiTodo.previous_to_do_secondary_id),
			daysOffset: apiTodo.days_from_previous_to_do || 0,
			_id: apiTodo.id,
			status: apiTodo.status,
			assigned_user: apiTodo.assigned_user
		};
	}

	$scope.getEventTodos = function(){
		eventToDosService.getEventTodos($rootScope.selectedEvent.id).then(function(res){
			$scope.todos = res.event_to_dos;
			var allTasks = res.event_to_dos.map(fromApi);
			$scope.tasks = $scope.tasks.concat(allTasks.filter(function(t){return t.id[0] === '1';}),
										   	   allTasks.filter(function(t){return t.id[0] === '2';}),
										   	   allTasks.filter(function(t){return t.id[0] === '3';}));

			if($scope.tasks.length){
				$scope.minNum = $scope.minId = parseFloat($scope.tasks[0].id);
				$scope.maxNum = $scope.maxId = parseFloat($scope.tasks[$scope.tasks.length-1].id);
				all_dates = {};
				$scope.tasks.forEach(function(task){
					all_dates[$scope.getDate($scope.calculateDueDate(task))] = 1;
				});
				angular.forEach(all_dates, function(value, date) {
					$scope.dates.push(date);
				});
				$scope.startDate = $scope.dates[0];
				$scope.endDate = $scope.dates[$scope.dates.length-1];
			}
	
		});
	}
	$scope.getEventTodos();

	function findById(tasks, id){
		var task = tasks.find(function(t){
			return t.id === id;
		});
		return task;
	}

	function findPrevious(tasks, task){
		var prevTask = findById(tasks, task.prevTask);
		return prevTask;
	}
	function incrementId(id){
		if(id && id.indexOf('.') > -1){
			var splitId = id.split('.');
			var newTaskSecondaryId = parseInt(splitId[1], 10) + 1;
			return splitId[0] + '.' + newTaskSecondaryId;
		}else{
			return'';
		}
	}
	function decrementId(id){
		if(id && id.indexOf('.') > -1){
			var splitId = id.split('.');
			var newTaskSecondaryId = parseInt(splitId[1], 10) - 1;
			return splitId[0] + '.' + newTaskSecondaryId;
		}else{
			return'';
		}
	}

	$scope.calculateOffset = function(task){
		if(task.id === '1.0' || task.prevTask == '0.0' || task.prevTask == task.id){
			return parseInt(task.daysOffset, 10) || 0;
		}
		var sum = 0;
		if(task.prevTask){
				var prevTask = findPrevious($scope.tasks, task);
				var offset = task.daysOffset || 0;

				if(prevTask != null){
					if(prevTask){
						sum += parseInt(offset, 10) + $scope.calculateOffset(prevTask);
					}
				}
		}
		return sum;
	};


	$scope.calculateDueDate = function(task){
		var due = new Date($rootScope.selectedEvent.start_date);
		due.setDate(due.getDate() + $scope.calculateOffset(task));
		return due;
	};

	$scope.calculateDaysRemaining = function(task){
		var diff = $scope.calculateDueDate(task) - new Date();
		return Math.floor(diff / (24 * 60 * 60 * 1000));
	};

	$scope.filterFn = function(task){
		var shouldShow = true;
		if($scope.taskFilter != 'all'){
			if($scope.taskFilter[0] == '!'){
				var invertedFilter = $scope.taskFilter.substring(1);
				shouldShow = shouldShow && task.status != invertedFilter;
			}else{
				shouldShow = shouldShow && task.status == $scope.taskFilter;
			}
		}
		shouldShow = shouldShow && parseFloat(task.id) >= $scope.minNum;
		shouldShow = shouldShow && parseFloat(task.id) <= $scope.maxNum;
		shouldShow = shouldShow && $scope.getDate($scope.calculateDueDate(task)) >= $scope.startDate;
		shouldShow = shouldShow && $scope.getDate($scope.calculateDueDate(task)) <= $scope.endDate;
		return shouldShow;
	};

	$scope.getColor = function(task){
		var daysRemaining = $scope.calculateDaysRemaining(task);
		if(daysRemaining < 0){
			return'red';
		}
		if(daysRemaining < 5){
			return'yellow';
		}
		if(daysRemaining >= 5){
			return'green';
		}
	};

	$scope.printToDos = function(){
		tasks = [];
		$scope.tasks.forEach(function(task){
			if($scope.filterFn(task)){
				task['date'] = $scope.getDate($scope.calculateDueDate(task));
				task['days_remaining'] = $scope.calculateDaysRemaining(task);
				tasks.push(task);
			}
		});
		printToDosModalService.printToDos($rootScope.selectedEvent.id, tasks, $scope.taskFilter, $scope.size).then(function(data){
			var blob = new Blob([data], {
				type: 'application/pdf'
			});
			if(navigator.vendor.indexOf("Apple Computer, Inc.") != -1){
				var reader = new FileReader();
				reader.onload = function(e){
					$window.location.href = reader.result;
				}
				reader.readAsDataURL(blob)
			}
			else{
				var url = URL.createObjectURL(blob);
				$window.open(url);
			}
		}).finally(function(){
			//$rootScope.toggleModal();
		});
	};

});