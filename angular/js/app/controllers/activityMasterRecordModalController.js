teamsRIt.controller('activityMasterRecordModalController', function($scope, activityMasterRecordModalService, helperService){

	// View to show
	$scope.selectedView = 'add';

	// Object that determines which activity master record input error to show
	$scope.showActivityMasterRecordErrors = {
		id: false,
		name: false,
		twoTeamsPerLine: false,
		threeTeamsPerLine: false,
		fourTeamsPerLine: false,
		fiveTeamsPerLine: false,
		doubles: false,
		competitionScoringFormat: false,
		lineScoringFormat: false,
		pointHighLow: false,
		surfaceType: false,
		setOrGame: false
	};

	// Our activity master record object
	$scope.activityMasterRecordObject = {
		id: null,
		name: null,
		twoTeamsPerLine: null,
		threeTeamsPerLine: null,
		fourTeamsPerLine: null,
		fiveTeamsPerLine: null,
		doubles: null,
		competitionScoringFormat: null,
		lineScoringFormat: null,
		pointHighLow: null,
		surfaceType: null,
		setOrGame: null
	};

	// Clears our activity object
	$scope.clearActivityValues = function(){
		$scope.activityMasterRecordObject = {
			id: null,
			name: null,
			twoTeamsPerLine: null,
			threeTeamsPerLine: null,
			fourTeamsPerLine: null,
			fiveTeamsPerLine: null,
			doubles: null,
			competitionScoringFormat: null,
			lineScoringFormat: null,
			pointHighLow: null,
			surfaceType: null,
			setOrGame: null
		};
	};

	// Select view ot show
	$scope.selectView = function(view){
		$scope.clearActivityValues();
		$scope.selectedView = view;
	};

	// Get all activities
	$scope.getActivities = function(){
		activityMasterRecordModalService.getActivities().then(function(data){
			$scope.activities = data.activities;
		});
	};
	$scope.getActivities();

	// Set our activity object to its correct value when we select a particular activity
	$scope.$watch('activityMasterRecordObject.id', function(newValue, oldValue){
		if(newValue !== oldValue && newValue && $scope.selectedView === 'edit'){
			var index = helperService.findArrayIndex($scope.activities, 'id', newValue);
			var activity = $scope.activities[index];
			$scope.activityMasterRecordObject = {
				id: activity['id'].toString(),
				name: activity['name'],
				twoTeamsPerLine: activity['two_teams_per_line'].toString(),
				threeTeamsPerLine: activity['three_teams_per_line'].toString(),
				fourTeamsPerLine: activity['four_teams_per_line'].toString(),
				fiveTeamsPerLine: activity['five_teams_per_line'].toString(),
				doubles: activity['doubles'].toString(),
				competitionScoringFormat: activity['competition_scoring_format'].toString(),
				lineScoringFormat: activity['line_scoring_format'],
				pointHighLow: activity['point'],
				surfaceType: activity['surface_type'],
				setOrGame: activity['line_type']
			};
		}
	});

	// If line scoring format is win / loss, then reset object point property
	$scope.$watch('activityMasterRecordObject.lineScoringFormat', function(newValue, oldValue){
		if(newValue !== oldValue && newValue === 'wl'){
			$scope.activityMasterRecordObject.pointHighLow = ''
		}
	});

	// Check our inputs
	$scope.checkActivityMasterRecordInput = function(){
		var noErrors = true;
		if($scope.selectedView === 'add'){
			if(!$scope.activityMasterRecordObject.name){
				$scope.showActivityMasterRecordErrors.name = true;
				noErrors = false;
			}
		}
		else if($scope.selectedView === 'edit'){
			if(!$scope.activityMasterRecordObject.id){
				$scope.showActivityMasterRecordErrors.id = true;
				noErrors = false;
			}
		}
		if(!$scope.activityMasterRecordObject.twoTeamsPerLine){
			$scope.showActivityMasterRecordErrors.twoTeamsPerLine = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.threeTeamsPerLine){
			$scope.showActivityMasterRecordErrors.threeTeamsPerLine = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.fourTeamsPerLine){
			$scope.showActivityMasterRecordErrors.fourTeamsPerLine = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.fiveTeamsPerLine){
			$scope.showActivityMasterRecordErrors.fiveTeamsPerLine = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.doubles){
			$scope.showActivityMasterRecordErrors.doubles = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.competitionScoringFormat){
			$scope.showActivityMasterRecordErrors.competitionScoringFormat = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.lineScoringFormat){
			$scope.showActivityMasterRecordErrors.lineScoringFormat = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.pointHighLow && $scope.activityMasterRecordObject.lineScoringFormat !== 'wl'){
			$scope.showActivityMasterRecordErrors.pointHighLow = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.surfaceType){
			$scope.showActivityMasterRecordErrors.surfaceType = true;
			noErrors = false;
		}
		if(!$scope.activityMasterRecordObject.setOrGame){
			$scope.showActivityMasterRecordErrors.setOrGame = true;
			noErrors = false;
		}
		return noErrors;
	};

	// Hide all activity master record errors
	$scope.resetshowActivityMasterRecordErrors = function(){
		for(var i in $scope.showActivityMasterRecordErrors){
			if($scope.showActivityMasterRecordErrors.hasOwnProperty(i)){
				$scope.showActivityMasterRecordErrors[i] = false;
			}
		}
	};

	// Add activity master record
	$scope.addActivity = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetshowActivityMasterRecordErrors();
		if($scope.checkActivityMasterRecordInput() === true){
			activityMasterRecordModalService.addActivity($scope.activityMasterRecordObject).then(function(){
				$scope.getActivities();
				$scope.clearActivityValues();
				$scope.callSuccess = true;
			}, function(){
				alert('Something went wrong.  Activity record not updated');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

	// Updates activity master record
	$scope.updateActivity = function(){
		$scope.callInProgress = true;
		$scope.callSuccess = false;
		$scope.resetshowActivityMasterRecordErrors();
		if($scope.checkActivityMasterRecordInput() === true){
			activityMasterRecordModalService.updateActivity($scope.activityMasterRecordObject).then(function(){
				$scope.getActivities();
				$scope.clearActivityValues();
				$scope.callSuccess = true;
			}, function(){
				alert('Something went wrong.  Activity record not updated');
			}).finally(function(){
				$scope.callInProgress = false;
			});
		}
		else{
			$scope.callInProgress = false;
		}
	};

});