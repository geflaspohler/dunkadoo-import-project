var express = require('express');
var mysql = require('mysql');

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

/*async.series([
	getSites,
	printData
], function (error, results){
	if(error) throw error;
	console.log('Done!');	
	connection.end(function(err){
		if(err) throw err
		console.log('Session Ended!');
	});//End close connection
});*/

connection.connect(function(err){
	if(err) throw err
	console.log('You are now connected...')

	console.log('Deleting bad data');	
	connection.query(
	"DELETE FROM observations WHERE Species NOT LIKE '%-%'",
	function(err, query_data) {
		if(err) throw err
		console.log('...and sucessfully deleted data');

		console.log('Getting general data');
		connection.query(
		"SELECT * FROM observations; ", 
		function(err, query_data) {
			if(err) throw err
			console.log('...and sucessfully queried data');
			for(var row in query_data){
				var str = query_data[row].Species;
				var n = str.indexOf(" - ");
				if (n === -1) throw err

				query_data[row].Species = query_data[row].Species.substring(n+3);
				str = query_data[row].Species;
				var k = str.indexOf("'");
				if(k !== -1){
					console.log("Found a tick!...Replacing: " + str + " with ");
					query_data[row].Species= str.slice(0, k) + "'" + str.slice(k); 
					console.log(query_data[row].Species);
				}//End if k != -1
			}//End for

			console.log("Updating species! ");	
			connection.query(
			"ALTER TABLE observations ADD Clean_Species VARCHAR(60) after Species;",
			function(err, taxonomies) {
				if(err) //Ignore throw here, becuase we are creating a duplicate column
				console.log("...added new column to table");
				console.log(query_data[0].Species);
				for(var x in query_data){
					console.log("UPDATE observations SET Clean_Species ='" + query_data[x].Species+ "' " + 
					"WHERE id = " + query_data[x].id+ "; ");
					connection.query(
					"UPDATE observations SET Clean_Species ='" + query_data[x].Species+ "' " + 
					"WHERE id = " + query_data[x].id+ "; ",
					function(err, taxonomies) {if(err) throw err; });
				}//End for
			});//End ALTER TABLE
		});//End query data
	});//End delete data
});//End get connection

