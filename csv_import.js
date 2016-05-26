var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputCSVs = [
'Grand Canyon 2015 v_ 2 - Default Questions.csv',
'Grand Canyon 2015 v_ 2 - AK.csv', 
'Grand Canyon 2015 v_ 2 - BW_ RT_ FH.csv', 
'Grand Canyon 2015 v_ 2 - Metadata Report.csv', 
'Grand Canyon 2015 v_ 2 - NG_CH_SS_PG.csv', 
'Grand Canyon 2015 v_ 2 - NH.csv', 
'Grand Canyon 2015 v_ 2 - RL_ SW_ UB.csv'];

var inputFile='Grand Canyon 2015 v_ 2 - Default Questions.csv';
var firstRow = false;

var columnTitles; var columnData = []; 

var totalTitles = [];
var totalData = [];
var start_of_study_questions = []; var length_of_study_questions = [];


async.series([
	readData,
	processData	
], function (err, results){
	if (err) throw err;
	console.log('Done!');
});
var itemsProcessed = 0;

function readData(topCallback){	
	async.eachSeries(inputCSVs, function (inputfile, bigCallback) {
		var parser = parse({delimiter: ','}, function (err, data) {
			async.eachSeries(data, function (line, callback) {
				if(firstRow === false){
					firstRow = true;
					columnTitles = line;
				}	
				else{
					columnData.push(line);
				}
				callback();
			});
			totalTitles.push(columnTitles);
			totalData.push(columnData);
			firstRow = false;
			console.log("Finished " + inputfile);
			processColumnTitles(topCallback);
		});
		
		console.log("Creating stream: " + inputfile);
		fs.createReadStream(inputfile).pipe(parser);
		bigCallback();
	});
}

function processColumnTitles(topCallback){
	console.log("Size of table: " + columnTitles.length);
	var start = (columnTitles.indexOf("Count"));
	start_of_study_questions.push(start);
	length_of_study_questions.push(columnTitles.length - start - 1);//1 for zero based indexing
	itemsProcessed++;
	if(itemsProcessed === inputCSVs.length) topCallback();
}


function processData(topCallback){
	console.log('Got column titles and data');
	console.log(totalTitles);
	console.log(totalData);
	console.log(start_of_study_questions);	
	console.log(length_of_study_questions);	
//	console.log(columnData);
	topCallback();
}
