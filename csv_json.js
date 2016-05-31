node_cj = require("node-csv-json");
var prompt = require('prompt');
var RSVP = require('rsvp');

prompt.message = '';
prompt.start();

var userColumns = {};

var readCSV = function () {
	console.log('calling caclualte with: ' );
    return new Promise((resolve, reject) => {
		node_cj({
			input: "Grand Canyon 2015 v_ 2 - Default Questions.csv",
			output: "output.json"
		}, function(err, result){
			if(err){
				console.log(err); throw err;	
				reject(err);
			}
			else{
				console.log('Fufiling!');
				adaptColumns(result);
				//resolve(result);
			}
		});
    });
};

readCSV()
    .then(adaptColumns)
    .then(checkCSV);
	
function adaptColumns(data){
    return new Promise((resolve, reject) => {
		console.log("Please enter your custom title for the following columns : " );
		if(data[0]['Counts'] == undefined){
			prompt.get(['Species Count'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns["Count"] = result.Count;
			});
		}
		if(data[0]['Technician'] == undefined){
			prompt.get(['User'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns['Technician'] = result.Technician;
			});
		}
		if(data[0]['Latitude'] == undefined){
			prompt.get(['Latitude'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns['Latitude'] = result.Latitude;
			});
		}
		if(data[0]['Longitude'] == undefined){
			prompt.get(['Longitude'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns['Longitude'] = result.Longitude;
			});
		}
		if(data[0]['Longitude'] == undefined){
			prompt.get(['Longitude'], function (err, result) {
				if (err) { return onErr(err); }
				userColumns['Longitude'] = result.Longitude;
			});
		}
		resolve(userColumns);
	});
}


function callback(resolve, userColumns){
	console.log('Calling callback');
	resolve(userColumns);
}

function checkCSV(result) {
	console.log("Printing result");
	console.log(result);
}; 

function printJSON(data){
	data.forEach(function(currentValue, index, array){
		console.log(index);
	});
}

function onErr(err) {
	console.log(err);
	throw err;
}

