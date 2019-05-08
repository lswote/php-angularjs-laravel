teamsRIt.service('helperService', function(){

	// Month reference array
	var monthReference = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // Find the index of an array item where its property value matches the property value given
    this.findArrayIndex = function(arrayOfObjects, propertyKey, propertyValue, fuzzyMatch){
		for(var i = 0; i < arrayOfObjects.length; i++){
			if(!fuzzyMatch){
				if(arrayOfObjects[i][propertyKey] == propertyValue){
					return i;
				}
			}
			else{
				if(arrayOfObjects[i][propertyKey].indexOf(propertyValue) != -1){
					return i;
				}
			}
		}
		return false;
	};

    // Find the indices of array items where its property value matches the property value given
    this.findArrayIndices = function(arrayOfObjects, propertyKey, propertyValue, fuzzyMatch){
		var matches = [];
    	for(var i = 0; i < arrayOfObjects.length; i++){
			if(!fuzzyMatch){
				if(arrayOfObjects[i][propertyKey] == propertyValue){
					matches.push(i);
				}
			}
			else{
				if(arrayOfObjects[i][propertyKey].indexOf(propertyValue) != -1){
					matches.push(i);
				}
			}
		}
		return matches;
	};

    // Find the index of an array item where its property values matches the property values given
    this.findArrayIndexMultipleKeys = function(arrayOfObjects, propertyKeys, propertyValues){
    	var propertyKeysLength = propertyKeys.length;
    	for(var i = 0; i < arrayOfObjects.length; i++){
    		var matchedKeysCount = 0;
    		for(var y = 0; y < propertyKeys.length; y++){
    			if(arrayOfObjects[i][propertyKeys[y]] == propertyValues[y]){
    				matchedKeysCount = matchedKeysCount + 1;
				}
				else{
    				break;
				}
			}
			if(propertyKeysLength === matchedKeysCount){
    			return i;
			}
		}
		return false;
	};

    // Parse our time into 4:00 PM format
    this.parseTime = function(time){
		var timeWithoutSeconds = time.substring(0, time.length - 3);
		var parsedHour, amOrPm;
		var unparsedHour = time.substring(0, 2);
		if(unparsedHour === '00'){
			parsedHour = 12;
			amOrPm = ' AM';
		}
		else if(unparsedHour === '12'){
			parsedHour = unparsedHour;
			amOrPm = ' PM';
		}
		else if(unparsedHour > 12){
			parsedHour = unparsedHour - 12;
			amOrPm = ' PM';
		}
		else{
			parsedHour = parseInt(unparsedHour);
			amOrPm = ' AM';
		}
		return parsedHour + timeWithoutSeconds.substring(2) + amOrPm;
	};

    // Parse our 4:00 PM formatted time to 16:00
    this.reverseParseTime = function(time){
    	var d = new Date('1/1/2013 ' + time);
    	return d.getHours() + ':' + d.getMinutes();
	};

    // Format time into 4:00 PM format
    this.formatTime = function(datetime){
    	datetime = new Date(datetime);
		var timezoneOffset = datetime.getTimezoneOffset() * 60000;
		datetime = new Date(datetime.getTime() + timezoneOffset);
		var hour = ('0' + datetime.getHours()).slice(-2);
		var minute = datetime.getMinutes();
		var second = ('0' + datetime.getSeconds()).slice(-2);
		return this.parseTime(hour + ':' + minute + ':' + second);
	};

    // Format date into Jan 19, 18 format
    this.formatDate = function(datetime){
    	datetime = new Date(datetime);
		var timezoneOffset = datetime.getTimezoneOffset() * 60000;
		datetime = new Date(datetime.getTime() + timezoneOffset);
		var month = monthReference[datetime.getMonth()];
		var dayOfMonth = datetime.getDate();
		var year = datetime.getFullYear().toString().substring(2, 4);
		return month + ' ' + dayOfMonth + ', ' + year;
	};

    // Convert 24 hour clock to minutes since start of day
    this.convertMilitaryTimeToMinutes = function(time){
    	var timeWithoutSeconds = time.slice(0, -3);
		var hour = Number(timeWithoutSeconds.slice(0, -3));
		var minute = Number(timeWithoutSeconds.slice(-2));
		var hourMinutes = hour * 60;
		return hourMinutes + minute;
	};

    // Convert minutes to 24 hour clock
	this.convertMinutesToMilitaryTime = function(minutes){
    	var hours = ('0' + Math.floor(minutes / 60)).slice(-2);
		minutes = ('0' + minutes % 60).slice(-2);
		return hours + ':' + minutes + ':00'
	};

	// Capitalize every word in a string
	this.capitalizeWords = function(string){
		return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	// Shuffles the values of an array
	this.shuffleArray = function(array){
  		var currentIndex = array.length, temporaryValue, randomIndex;
	  	while(0 !== currentIndex){
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
	  	}
	  	return array;
	};

	// Return today's date in 2018-04-11 format
	this.getTodaysDate = function(){
		var d = new Date();
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
		if(month.length < 2){
			month = '0' + month;
		}
    	if(day.length < 2){
			day = '0' + day;
		}
    	return [year, month, day].join('-');
	};

});