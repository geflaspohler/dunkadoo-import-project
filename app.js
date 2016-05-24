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
		"SELECT a.Site_Name, a.Study_ID FROM sites a, observations b " + 
		"WHERE b.Study_ID = a.Study_ID",
		function(err, location_names) {
			if(err) throw err
			console.log('...and sucessfully got site names');
			
			console.log('Getting species id');
			connection.query(
			//"SELECT Clean_Species FROM observations; " ,  
			"SELECT a.id, a.common_name FROM taxonomy a, observations b " + 
			"WHERE b.Clean_Species = a.common_name ",
			function(err, taxonomies) {
				if(err) throw err
				console.log('...and sucessfully got species id');
				console.log('Getting general data');
				connection.query(
				"SELECT *, " +
				"FROM_UNIXTIME(Timestamp,'%Y-%m-%dT%H:%i:%s0Z') AS ISO_Timestamp " +  
				"FROM observations; ", 
				function(err, query_data) {
					if(err) throw err
					console.log('...and sucessfully queried data');	
					var tax_counter = 0; var site_counter = 0;
	 				for (var row in query_data){
						console.log('Row: ' + row);
						console.log('Species: ' + (query_data[row].Clean_Species));
						//console.log('Species ID: ' + taxonomies.id[row]);
						if(taxonomies[tax_counter].common_name === query_data[row].Clean_Species){
							console.log('Species ID: ' + taxonomies[tax_counter].id);
							tax_counter++;
						}
						console.log('Time Observed: ' + query_data[row].ISO_Timestamp);
						console.log('Count: ' + query_data[row].Count);

						if(location_names[site_counter].Study_ID === query_data[row].Study_ID){
							console.log('Site: ' + location_names[site_counter].Site_Name);
							site_counter++;
						}
					}//End for loop
					callback();
				});
			});
		});
	});
}
