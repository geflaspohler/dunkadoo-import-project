node_cj = require("node-csv-json");
var prompt = require('prompt');
var RSVP = require('rsvp');
var fs = require('fs');
var async = require('async');

prompt.message = '';
prompt.start();

var userColumns = {};
var species= {};
var studySpecific = [];
var speciesSpecific = [];

var readTaxonomy = new Promise(function(resolve, reject){
	console.log('Reading taxonomy!');
	var x = 0;
	var fileContents = fs.readFileSync("HWI.csv");
	var lines = fileContents.toString().split('\r');
	for (var i = 0; i < lines.length; i++) {
		var entry = lines[i].toString().split(',');
		var common_name = entry[1].substring(0, entry[1].indexOf('(')-1);//-1 to account for space
		species[(entry[0] + " - " + common_name)] = ++x;
	}
	resolve(species);
});

var readCSV = new Promise(function(resolve, reject){
	console.log('Reading CSV!');
	node_cj({
		input: "Grand Canyon 2015 v_ 2 - Default Questions.csv",
		output: "output.json"
	}, function(err, result){
		if(err){
			console.log(err); throw err;	
			reject(err);
		}
		else{
			resolve(result);
		}
	});
});

function printJSON(data){
	console.log("Starting to print JSON");
	console.log(userColumns);
	var observations = data[0];
	var taxonomies = data[1];
	var json_data = [];
	observations.forEach(function(currentValue, index, array){
		var json_packet = '';
		var uuid = generateUUID();
		//For this to work, curentValue must be a JSON entry with a hash-mapped
		//"Year", "Month", "Day", "Hour", "Minute", "Second", "Time Zone" fields
		var timestamp = getTimestamp(currentValue);

		json_packet +="{ " + '\n';
		json_packet += " 'uuid': " + uuid + ', \n';
		json_packet += " 'projectid': " + "temp" + ', \n';
		json_packet += " 'speciesid': " + taxonomies[currentValue[userColumns['Observed']]] + ', \n';
		json_packet += " 'count': " + currentValue[userColumns['Count']] + ', \n';
		json_packet += " 'user': " + currentValue[userColumns["Technician"]] + ', \n';
		json_packet += " 'timestamp': " + timestamp + ', \n';
		json_packet += " 'latitude': " + currentValue[userColumns["Longitude"]] + ', \n';
		json_packet += " 'longitude': " + currentValue[userColumns["Latitude"]] + ', \n';
		json_packet += " 'gps_at': " + timestamp + ', \n';
		if(studySpecific[0] !== ''){
			json_packet += " 'data:' { " + '\n';
			for(var i = 0; i < studySpecific.length; i++){
				json_packet += '\t' + "'" + studySpecific[i] + "': " + currentValue[studySpecific[i]] + ', \n';
			}
			json_packet += "  }" + ', \n';
		}
		if(speciesSpecific[0] !== ''){
			json_packet += " 'SpeciesData:' { " + '\n';
			for(var i = 0; i < studySpecific.length; i++){
				json_packet += '\t' + "'" + speciesSpecific[i] + "': " + currentValue[speciesSpecific[i]] + ', \n';
			}
			json_packet += "  }" + ', \n';
		}
		json_packet += " 'device': " + "temp" + '\n';
		json_packet +=" }";
		console.log(currentValue);
		console.log(json_packet);
		json_data.push(json_packet);
	});
}

var generateUUID = function(){
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});	
	return uuid;
}

var getTimestamp = function(t){
	return t['Year'] + '-' + t['Month'] + '-' +  t['Day']
		+ 'T' + ((t['Hour'].length === 2) ? t['Hour'] : ('0'+t['Hour'])) 
		+ ':' + t['Minute'] + ':' + t['Second'] + t['Time Zone'] + '.00'; 
}

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


async.series([
	getUserTaxonomy, 
	getUserColumn
], function(error, results){
	if(error) throw error;
	Promise.all([readCSV, readTaxonomy]).then(function(result){
		printJSON(result);
		console.log("printed json");
	}, function(err){console.log(err)});
});

function onErr(err) {console.log(err);throw err;}
