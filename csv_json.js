//Includes 
node_cj = require("node-csv-json");//CSV to JSON 
var prompt = require('prompt');//For user input
var RSVP = require('rsvp');//For promises
var fs = require('fs');//For reading from filesystem
var async = require('async');//For async requests
//var $ = require('jQuery');
var $ = jQuery = require('jquery'); // In Node.js
var _ = require("lodash");
var http = require('http');
var request = require('request');

//Default values for each packet
var json_bird_data = 
{
	"local_id":3,
	"gps_at":"2016-06-07T13:46:04-04:00",
	"device":"e17092ac5955022e",
	"last_updated":"2016-06-07T13:46:04-04:00",
	"ready_submit":"2016-06-07T13:46:04-04:00"
}

//Change user input prompt defaults
prompt.message = '';
prompt.start();

var userColumns = {};//Stores user specific names for data columns
var species= {};//Stores study specific taxonomy data
var studySpecific = [];//Stores user specific names for study specific columns
var speciesSpecific = [];//Stores user sepcific names for species specific columns

//Reads in a CSV containing taxonomy, assumeing species code and species 
//common name are in seperate columns with parenthese enclosed junk
//ex. BE, Bald Eagle (JUNK); final taxonomy stored in the species hash should
//be in the form "BE - Bald Eagle". Species are also assigned random IDs
var readTaxonomy = new Promise(function(resolve, reject){
	var x = 0;
	var fileContents = fs.readFileSync("HWI.csv");//Read the taxonomy csv
	var lines = fileContents.toString().split('\r');//First split into rows
	for (var i = 0; i < lines.length; i++) {//For each row
		var entry = lines[i].toString().split(',');//Split into entires
		var common_name = entry[1].substring(0, entry[1].indexOf('(')-1);//-1 to account for space
		species[(entry[0] + " - " + common_name)] = ++x;//Assign a speciesID
	}
	//species.forEach(function(currentValue, index, array){
	resolve(species);//Fufill the promise
});

// print process.argv
//Read in the CSV of the user observations in JSON format
var readCSV = new Promise(function(resolve, reject){
	console.log(process.argv);
	node_cj({
		//input: "Grand Canyon 2015 v_ 2 - Default Questions.csv",
		//input: 'Grand Canyon 2015 v_ 2 - AK.csv',  
		//input: "Grand Canyon 2015 v_ 2 - BW_ RT_ FH.csv",
		input: process.argv[2],
		output: "output.json" //Output is unused
	}, function(err, result){
		if(err){//If error occurs, throw
			console.log(err); throw err;	
			reject(err);
		}
		else{
			resolve(result);//Resolve the promise and return the JSON result
		}//End else
	});//End node_cj
});//End promise

//Builds and prints the JSON packets from taxnomy and observation data
function printJSON(data){
	return new Promise(function(resolve, reject){
		//"data" is an array containing the [observations taxonomy] data from
		//previous promises. We create refernces for clarity
		var observations = data[0];
		var taxonomies = data[1];

		var json_data = [];//Stores the array of final JSON packets
		
		var total_processed = 0;
		//For each entry in observations
		observations.forEach(function(currentValue, index, array){
			var json_packet = {};
			var uuid = generateUUID();
			//For this to work, curentValue must be a JSON entry with a hash-mapped
			//"Year", "Month", "Day", "Hour", "Minute", "Second", "Time Zone" fields
			var timestamp = getTimestamp(currentValue);
			json_bird_data["uuid"] = uuid;
			json_bird_data["projectId"] = 8;
			json_bird_data["speciesId"] =  taxonomies[currentValue[userColumns['Observed']]];
			json_bird_data["count"] = currentValue[userColumns['Count']];
			json_bird_data["user"] = currentValue[userColumns["Technician"]];
			json_bird_data["timestamp"] = timestamp;
			json_bird_data["latitude"] = currentValue[userColumns["Latitude"]];
			json_bird_data["longitude"] = currentValue[userColumns["Longitude"]];
			//json_bird_data["gps_at"] = timestamp;
			//Only print study specific information if user has provided 
			if(studySpecific && studySpecific[0] !== '' && studySpecific[0] !== ' '){
				var data_printed = false;
				var data = {};
				for(var i = 0; i < studySpecific.length; i++){
					if(currentValue[studySpecific[i]] && currentValue[studySpecific[i]] !== '' && currentValue[studySpecific[i]] !== " "){
						if(data_printed === false){
							data_printed = true;
						}
						data[studySpecific[i]]  = currentValue[studySpecific[i]];
					}
				}
				if(data_printed === true){
					json_bird_data["data"] = data;
				}
			}
			//Only print species specific information if user has provided 
			if(speciesSpecific && speciesSpecific[0] !== '' && speciesSpecific[0] !== ' '){
				var species_data_printed = false;
				var speciesData = {};
				for(var i = 0; i < speciesSpecific.length; i++){
					var cname = speciesSpecific[i];
					var cdata = currentValue[speciesSpecific[i]];
					if(cdata && cdata !== '' && cdata !== " "){
						if(species_data_printed === false){
							species_data_printed = true;
						}

						if(cname.toLowerCase().includes('age')){
							speciesData["age"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else if(cname.toLowerCase().includes('gender')){
							speciesData["sex"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else if(cname.toLowerCase().includes('age')){
							speciesData["age"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else if(cname.toLowerCase().includes('key')){
							speciesData["key"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else if(cname.toLowerCase().includes('morph')){
							speciesData["morph"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else if(cname.toLowerCase().includes('molt')){
							speciesData["molt"] = currentValue[speciesSpecific[i]];
						}//End inner if
						else{
							speciesData["raw attribute"] = currentValue[speciesSpecific[i]];
						}	
					}//End outer if
				}
				if(species_data_printed === true){
					json_bird_data["data"] = speciesData;//TODO: note, this should be "SpeciesData", as this data is species specific
				}
			}
			json_data[total_processed] = _.cloneDeep(json_bird_data);
			total_processed++;
			console.log("Proccessed " + total_processed + " out of " + observations.length);
			if(total_processed === observations.length){
				resolve(json_data);
			}
		});
	});
	//console.log("Species: "  + speciesSpecific + ", " + speciesSpecific[0].toLowerCase().includes('gender'));
}

//Generate a random unique id for each observation
var generateUUID = function(){
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});	
	return uuid;
}

//Get an ISO 8601 timestamp from an obejct that has date information
var getTimestamp = function(t){
	var test = t['Year'] + '-' + t['Month'] + '-' +  t['Day']
		+ 'T' + ((t['Hour'].length === 2) ? t['Hour'] : ('0'+t['Hour'])) 
		+ ':' + t['Minute'] + ':' + t['Second']  
		+ ((t['Time Zone'].length === 3) ? t['Time Zone'] : (t['Time Zone'].slice(0, 1) + "0" + t['Time Zone'].slice(1)))
		+ '.00'; 
	console.log(test);
	return test;
}

//Get user input for study and species specific column names. Should be 
//entered as a comma seperated list. eg. name,age,gender
var getUserTaxonomy= function(callback){
	console.log("Enter the names of your study specific columns as a comma seperated list:");
	prompt.get(['Columns'], function (err, result) {
		if (err) { return onErr(err); }
		studySpecific = result.Columns.toString().split(',');
		console.log('Study specific results: ' + studySpecific);
		console.log("Enter the names of your species specific columns as a comma seperated list:");
		prompt.get(['Columns'], function (err, result) {
			if (err) { return onErr(err); }
			speciesSpecific = (result.Columns.toString()).split(',');
			console.log('Species specific columns: ' + speciesSpecific);
			callback();
		});
	});
}
//Get user input for custom column names; should be entered as prompted
var getUserColumn= function(callback){
	console.log("Getting user input for column!");
	prompt.get(['Species Count'], function (err, result) {
		if (err) { return onErr(err); }
		userColumns["Count"] = result["Species Count"];
		prompt.get(['User'], function (err, result) {
			if (err) { return onErr(err); }
			userColumns['Technician'] = result.User;
			prompt.get(['Latitude'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns['Latitude'] = result.Latitude;
				prompt.get(['Longitude'], function (err, result) {
					if (err) { return onErr(err); }
					userColumns['Longitude'] = result.Longitude;
					prompt.get(['Species identification'], function (err, result) {
						if (err) { return onErr(err); }
						userColumns['Observed'] = result['Species identification'];
						callback();
					});
				});
			});
		});
	});
}
//Error fucntion
function onErr(err) {console.log(err);throw err;}

var sendObservations = function (observationJSON, submission_reflects_time){

	console.log(json_bird_data);
	console.log(observationJSON);
	var uploadAddress = 'https://app-dev.dunkadoo.org/api/v1/observations/?apikey=003ae3b9c7b1b00b2e85888ab6f3501d';
	request({
		url: uploadAddress,
		method: "POST",
		json: observationJSON 
	}, function (error, response, body) {
        if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
            console.log(body)
        }
        else {
            console.log("error: " + error)
            console.log("response.statusCode: " + response.statusCode)
            console.log("response.statusText: " + response.statusText)
        }
    })
}
 
/*var sendObservations = function (observationJSON, submission_reflects_time){
	console.log("Enteriting send obs");	
	//console.log('POST:[' + JSON.stringify(json_data) + ']'); 

	//var uploadAddress = $rootScope.apiProtocol + $rootScope.apibase + '/api/v1/observations?apikey=' + $rootScope.apikey;

	var uploadAddress = 'https://app-dev.dunkadoo.org/api/v1/observations/?apikey=003ae3b9c7b1b00b2e85888ab6f3501d';
	var options = {
		method: "POST",
		url: uploadAddress,
		success: function (data) { console.log(data);
		},
		headers: {
			'Content-Type': 'application/json'
		},
		data: string_data,
		dataType: 'json'
	};

	function callback(error, response, body){
		if(!error){
			console.log("error: " + error);
			console.log(response);
			console.log("body: " + body);
			console.log('Request without error!');
			//observationSubmitted(APIResponse, APIStatus, APIXHR, submission_reflects_time);
			//observationSubmitted(response, error, submission_reflects_time);
		}
		else{ console.log('Error: ' + error);}
	}

	request(options, callback);
}*/

//Main functionatily 
async.series([
	getUserTaxonomy, 
	getUserColumn, 
], function(error, results){
	if(error) throw error;
	console.log("Got to promise all");
	Promise.all([readCSV, readTaxonomy]).then(function(result){
		console.log("Printing JSON");
		printJSON(result).then(function(observationPayload){
			try{sendObservations(observationPayload, "2016-06-07T13:46:04-04:00");}
			catch(err){console.log(err)}
		}, function(err){console.log(err);});
	}, function(err){console.log(err)});
});

var observationSubmitted = function (APIResponse, APIStatus, APIXHR, submission_reflects_time) {
        console.log('API Response'); 
         console.log(APIResponse); 
         console.log(APIStatus); 
         console.log(APIXHR); 
         console.log(submission_reflects_time); /*

        var curTimeTempt = moment();

        var submissionResults = [curTimeTempt.format(), APIXHR.status, submission_reflects_time];

        $rootScope.db.executeSql('INSERT INTO submissions ("timestamp","result","last_observation_at") VALUES (?,?,?)', submissionResults, function (res) {
            if (submitDebug) { console.log(submissionResults) };
        }, function (error) {
            console.log('Unable to Update Submissions Table');
        });

        var APIObservationInfo = [];

        for (var this_obs = 0; this_obs < APIResponse.length; this_obs++) {
            
            var this_obs_uuid = Object.keys(APIResponse[this_obs])[0];
            var this_obs_id = APIResponse[this_obs][this_obs_uuid]['id'];

            APIObservationInfo.push(['UPDATE observations set `id`=? WHERE `uuid`=?', [this_obs_id, this_obs_uuid]]);
        }

        if (submitDebug) { console.log('APIObservationInfo') };
        if (submitDebug) { console.log(APIObservationInfo) };

        $rootScope.db.sqlBatch(APIObservationInfo, function () {
            if (submitDebug) { console.log('Successfully Updated Observations with API Response') };
            //$rootScope.db.executeSql('SELECT * FROM observations', [], function (res) {
            //    //console.log('Sample column value: ' + res.rows.item(0));
            //});
        }, function (error) {
            console.log('Unable to Update Observations with IDs from API');
            console.log(error);
        });
	*/
};
