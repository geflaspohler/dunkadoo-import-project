var fs = require('fs');

var species= [];
var fileContents = fs.readFileSync("HWI.csv");
var lines = fileContents.toString().split('\r');
for (var i = 0; i < lines.length; i++) {
    var entry = lines[i].toString().split(',');
	var common_name = entry[1].substring(0, entry[1].indexOf('(')-1);//-1 to account for space
	species.push(entry[0] + " - " + common_name);
}
console.log(species);


