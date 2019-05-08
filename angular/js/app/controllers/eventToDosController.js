teamsRIt.controller('eventToDosController', function($scope, $rootScope, $routeParams, eventToDosService, eventService, ladderModalService, helperService){

	// Get all events where our user is a leader
	var eventId = $routeParams.id;
	$scope.taskFilter = 'all';
	$scope.daysFilter = 'all';

	// events will need a "daysBeforeFirstTask"
	$scope.tasks = [[], [], []];

	ladderModalService.getEvent(eventId).then(function(data){
		$scope.selectedEvent = data.event;
	});
	$scope.getEventsAsLeader = function(){
		eventService.getEventsAsLeader().then(function(data){
			if(
				$routeParams.id &&
				($rootScope.user.privilege === 'facility leader' ||
					($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false))
			){
				$scope.displayEventForm = true;
			}
			else{
				eventService.getEventsAsCaptain().then(function(data){
					if($routeParams.id && helperService.findArrayIndex(data.events, 'id', $routeParams.id) !== false){
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
		}
		else{
			return null;
		}
	}

	function fromApi(apiTodo){
		return {
			description: apiTodo.description,
			id: toTaskId(apiTodo.primary_id, apiTodo.secondary_id),
			prevTask: toTaskId(apiTodo.previous_to_do_primary_id, apiTodo.previous_to_do_secondary_id),
			daysOffset: apiTodo.days_from_previous_to_do || 0,
			_id: apiTodo.id,
			status: apiTodo.status,
			assigned_user: apiTodo.assigned_user
		};
	}

	eventToDosService.getEventTodos(eventId).then(function(res){
		var allTasks = res.event_to_dos.map(fromApi);
		$scope.tasks[0] = allTasks.filter(function(t){
			return t.id[0] === '1';
		});
		$scope.tasks[1] = allTasks.filter(function(t){
			return t.id[0] === '2';
		});
		$scope.tasks[2] = allTasks.filter(function(t){
			return t.id[0] === '3';
		});

		$scope.addBefore = [
			incrementId($scope.getLastTask(0).id),
			incrementId($scope.getLastTask(1).id),
			incrementId($scope.getLastTask(2).id)
		];
	});

	$scope.update = function(){
		$scope.$apply();
	};

	function findById(tasks, id){
		return tasks.find(function(t){
			return t.id === id;
		});
	}

	function findPrevious(tasks, task){
		return findById(tasks, task.prevTask);
	}

	function incrementId(id){
		if(id && id.indexOf('.') > -1){
			var splitId = id.split('.');
			var newTaskSecondaryId = parseInt(splitId[1], 10) + 1;
			return splitId[0] + '.' + newTaskSecondaryId;
		}
		else{
			return '';
		}
	}

	function decrementId(id){
		if(id && id.indexOf('.') > -1){
			var splitId = id.split('.');
			var newTaskSecondaryId = parseInt(splitId[1], 10) - 1;
			return splitId[0] + '.' + newTaskSecondaryId;
		}
		else{
			return '';
		}
	}

	$scope.calculateOffset = function(task){
		if(task.id === '1.0' || task.prevTask == '0.0' || task.prevTask == task.id){
			return parseInt(task.daysOffset, 10) || 0;
		}
		var sum = 0;
		if(task.prevTask){
			var prevTaskSection = parseInt(task.prevTask[0], 10) - 1;
			if(prevTaskSection > -1){
				var prevTask = findPrevious($scope.tasks[prevTaskSection], task);
				var offset = task.daysOffset || 0;

				if(prevTask != null){
					if(prevTask){
						sum += parseInt(offset, 10) + $scope.calculateOffset(prevTask);
					}
				}
			}
		}
		return sum;
	};

	$scope.calculateDueDate = function(task){
		if($scope.selectedEvent){
			var due = new Date($scope.selectedEvent.start_date);
			due.setDate(due.getDate() + $scope.calculateOffset(task));
			return due;
		}
	};

	$scope.calculateDaysRemaining = function(task){
		var diff = $scope.calculateDueDate(task) - new Date();
		return Math.floor(diff / (24 * 60 * 60 * 1000));
	};

	$scope.getLastTask = function(section){
		var taskCount = $scope.tasks[section].length;
		return $scope.tasks[section][taskCount - 1] || {};
	};

	function reassociateTasks(oldId, newId){
		for(var section = 0; section < 3; section++){
			for(var i = 0; i < $scope.tasks[section].length; i++){
				var task = $scope.tasks[section][i];
				if(task.prevTask == oldId && !task._changed){
					$scope.tasks[section][i].prevTask = newId;
					$scope.tasks[section][i]._changed = true;
				}
			}
		}
	}

	function clearChanged(){
		for(var section = 0; section < 3; section++){
			for(var i = 0; i < $scope.tasks[section].length; i++){
				$scope.tasks[section][i]._changed = false;
			}
		}
	}

	$scope.addTask = function(section, addBeforeId){
		var newTaskId;
		$scope.tasks[section] = $scope.tasks[section] || [];
		var tasks = $scope.tasks[section];
		var lastTask = $scope.getLastTask(section);

		// find the task by addBeforeId
		var insertingBeforeTask = findById(tasks, addBeforeId);
		var beforeTaskIndex = $scope.tasks[section].indexOf(insertingBeforeTask);
		beforeTaskIndex = beforeTaskIndex > -1 ? beforeTaskIndex : null;
		// if we have a task we're inserting before
		// get it's secondary id and add one
		if(insertingBeforeTask && insertingBeforeTask.id){
			newTaskId = insertingBeforeTask.id;
		}
		else if(lastTask.id){
			// else take the secondary id of the last task
			newTaskId = incrementId(lastTask.id);
		}
		else{
			newTaskId = section + 1 + '.0';
		}

		$scope.addBefore[section] = incrementId(newTaskId);
		beforeTaskIndex = beforeTaskIndex != null ? beforeTaskIndex : tasks.length;
		var prevTaskId = beforeTaskIndex > 0 ? tasks[beforeTaskIndex - 1].id : '';
		var newTask = {
			id: newTaskId,
			description: '',
			prevTask: prevTaskId,
			daysOffset: 0
		};

		if(beforeTaskIndex < tasks.length){
			for(var i = beforeTaskIndex; i < $scope.tasks[section].length; i++){
				var id = $scope.tasks[section][i].id;
				var newId = incrementId(id);
				$scope.tasks[section][i].id = newId;
				reassociateTasks(id, newId);
			}
		}
		clearChanged();

		// add the new task to the array
		$scope.tasks[section].splice(beforeTaskIndex, 0, newTask);
	};

	$scope.deleteTodo = function(task){
		var section = parseInt(task.id[0], 10) - 1;
		var taskIndex = $scope.tasks[section].indexOf(task);
		if(taskIndex >= 0){
			eventToDosService
				.deleteEventTodo(eventId, $scope.tasks[section][taskIndex]._id)
				.then(function(){
					// clear out dependencies
					reassociateTasks(task.id, '0.0');
					for(var i = taskIndex; i < $scope.tasks[section].length; i++){
						var id = $scope.tasks[section][i].id;
						$scope.tasks[section][i].id = decrementId(id);
					}
					return $scope.tasks[section].splice(taskIndex, 1);
				})
				.then(function(){
					return $scope.submit();
				});
		}
	};

	function toApi(todo){
		var ids = todo.id.split('.');
		var primary_id = ids[0];
		var secondary_id = ids[1];

		var previousIds;
		var prev_primary;
		var prev_secondary;
		if(todo.prevTask){
			previousIds = todo.prevTask.split('.');
			prev_primary = previousIds[0];
			prev_secondary = previousIds[1];
		}

		return {
			description: todo.description,
			primary_id: primary_id,
			secondary_id: secondary_id,
			previous_to_do_primary_id: prev_primary,
			previous_to_do_secondary_id: prev_secondary,
			days_from_previous_to_do: todo.daysOffset,
			status: todo.status,
			assigned_user: todo.assigned_user
		};
	}

	$scope.submit = function(){
		var allTodos = []
			.concat($scope.tasks[0])
			.concat($scope.tasks[1])
			.concat($scope.tasks[2]);
		var apiTodos = allTodos.map(toApi);
		eventToDosService.updateEventTodos(eventId, apiTodos).then(function(){
			$scope.callSuccess = true;
		});
	};

	$scope.filterFn = function(task){
		var shouldShow = true;
		if($scope.taskFilter != 'all'){
			if($scope.taskFilter[0] == '!'){
				var invertedFilter = $scope.taskFilter.substring(1);
				shouldShow = shouldShow && task.status != invertedFilter;
			}
			else{
				shouldShow = shouldShow && task.status == $scope.taskFilter;
			}
		}
		if($scope.daysFilter != 'all'){
			var dayRequirement = parseInt($scope.daysFilter, 10);
			shouldShow = shouldShow && $scope.calculateDaysRemaining(task) < dayRequirement;
		}
		return shouldShow;
	};

	$scope.getColor = function(task){
		var daysRemaining = $scope.calculateDaysRemaining(task);
		if(daysRemaining < 0){
			return 'red';
		}
		if(daysRemaining < 5){
			return 'yellow';
		}
		if(daysRemaining >= 5){
			return 'green';
		}
	};

});