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
	getSites,
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

function getSites(callback){
	connection.connect(function(err){
		if(err) throw err
		console.log('You are now connected...')

		console.log('Getting site names');
		connection.query(
		"SELECT a.Site_Name FROM sites a, observations b " + 
		"WHERE b.Study_ID = a.Study_ID",
		function(err, location_names) {
			if(err) throw err
			console.log('...and sucessfully got site names');
			
			console.log('Getting species id');
			connection.query(
			//"SELECT Clean_Species FROM observations; " ,  
			"SELECT a.id FROM taxonomy a, observations b " + 
			"WHERE b.Clean_Species = a.common_name ",
			function(err, taxonomies) {
				if(err) throw err
				console.log('...and sucessfully got species id');
				//console.log(taxonomies[0].Clean_Species);
				console.log(taxonomies);
				console.log('Getting general data');
				connection.query(
				"SELECT *, " +
				"FROM_UNIXTIME(Timestamp,'%Y-%m-%dT%H:%i:%s0Z') AS ISO_Timestamp " +  
				"FROM observations; ", 
				function(err, query_data) {
					if(err) throw err
					console.log('...and sucessfully queried data');
					for (var row in query_data){
						console.log('Species: ' + (query_data[row].Species).substring(7));
						//console.log('Species ID: ' + taxonomies.id[row]);
						console.log('Species ID: ' + taxonomies[row].Clean_Species);
						console.log('Time Observed: ' + query_data[row].ISO_Timestamp);
						console.log('Count: ' + query_data[row].Count);
						console.log('Site: ' + location_names[row].Site_Name);
					}//End for loop
					callback();
				});
			});
		});
	});
}

/*function getTaxonomy(callback){
	connection.connect(function(err){
		if(err) throw err
		console.log('You are now connected...')

		console.log('Getting species id');
		connection.query(
		"SELECT Clean_Species FROM observations; " ,  
		//"SELECT a.id FROM taxonomy a, observations b " + 
		//"WHERE b.Clean_Species = a.common_name ",
		function(err, taxonomies) {
			if(err) throw err
			console.log(taxonomies[0].Clean_Species);
			console.log('...and sucessfully got species id');
			connection.end(function(err){
				if(err) throw err
				console.log('Session Ended!');
			});//End close connection
		});
	});
}

function getQuery(callback){
	connection.connect(function(err){
		if(err) throw err
		console.log('You are now connected...')

	});//End get connection
}//End getData*/
		/*connection.end(function(err){
			if(err) throw err
			console.log('Session Ended!');
		});//End close connection*/

