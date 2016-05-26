var express = require('express');
var mysql = require('mysql');
var async = require('async');
var INIT = false;

console.log('Starting program...');

var connection = mysql.createConnection({
	host: '192.168.57.10',
	port: 3306,
	user: 'gflaspohler',
	password: 'password',
	database: 'SpecteoRaptor',
	multipleStatements: true
});

async.series([
	getData,
	printData
], function (error, results){
	if(error) throw error;
	console.log('Done!');	
	connection.end(function(err){
		if(err) throw err
		console.log('Session Ended!');
	});//End close connection
});

function printData(callback){
	callback();
}

function getData(callback){
	connection.connect(function(err){
		if(err) throw err
		console.log('You are now connected...')
		console.log('Getting data');
		connection.query(
		"SELECT * FROM (" + 
		"SELECT * FROM (" + 
		"SELECT SUBSTRING(Species, INSTR(Species, ' - ') + 3 ,100) AS Clean_Species, " + 
		"FROM_UNIXTIME(Timestamp + (3600*Timezone),'%Y-%m-%dT%H:%i:%s0Z') AS ISO_Timestamp, " + 
		"Study_ID, " + 
		"Count " + 
		"FROM (" + 
		"SELECT Species,Count,Study_ID,Timestamp,Timezone " + 
		"FROM observations " + 
		"WHERE Species NOT LIKE 'Species'" + 
		") AS species_free" + 
		") AS clean_observations " + 
		"INNER JOIN taxonomy " + 
		"WHERE clean_observations.Clean_Species = taxonomy.common_name) AS species_observations " + 
		"LEFT JOIN sites ON species_observations.Study_ID = sites.Study_ID; " , 
		function(err, query_data) {
			if(err) throw err
/*			connection.query(
			"SELECT id, atr_species, CONCAT_WS('', atr_adult, NULL, atr_imm) AS Attributes FROM ( " + 
			"SELECT id, atr_species, atr_adult, SUBSTRING(atr_species, INSTR(atr_species, 'Immature') ,100) AS atr_imm FROM (" + 
			"SELECT id, atr_species, SUBSTRING(atr_species, INSTR(atr_species, 'Adult') ,100) AS atr_adult FROM (" + 
			"SELECT id, SUBSTRING(Species, INSTR(Species, " - ") + 3 ,100) AS atr_species FROM (" + 
			"SELECT * FROM observations " + 
			") AS atr_species_table" + 
			") AS adult_atr" + 
			") AS atr_imm" + 
			") AS attributes ",
			function(err, attribute_data) {
				if(err) throw err
				console.log('...and sucessfully got data');
				console.log(attribute_data);
			});*/
			for (var row in query_data){
				console.log('Species: ' + query_data[row].Clean_Species);
				console.log('Species ID: ' + query_data[row].id);
				console.log('Time Observed: ' + query_data[row].ISO_Timestamp);
				console.log('Count: ' + query_data[row].Count);
				console.log('Site: ' + query_data[row].Site_Name);
				//console.log('Attribute: ' + attribute_data[row].Attribute);
			}//End for loop
			callback();
		});//End get data
	});//End start connection
}//End getData

