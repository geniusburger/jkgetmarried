var path = require('path');
var fs = require('fs');
var os = require('os');
var args = require('minimist')(process.argv.slice(2), {
    string : ['inDir', 'outFile'],
    alias : {
        inDir : 'i',
        outFile : 'o'
    }
});

var imageExtensions = ['bmp', 'gif', 'jpg', 'png'];

function isImage(file) {
	var stats = fs.statSync(path.join(dir, file));
	if( stats.isFile()) {
		var extension = path.extname(file);
		if( extension.length >= 2) {
			return imageExtensions.indexOf(extension.toLowerCase().substring(1)) > -1;
		}
	}
	return false;
}

console.dir(args);

if( !args.inDir) {
    throw new Error("inDir arg is missing");
}

if( !args.outFile) {
    throw new Error('outFile arg is missing');
}

var images = 0;
var dir = args.inDir;
var files = fs.readdirSync(dir);

var now = new Date();
var data = [
	'bg = {',
	'\tcreated: "' + now.toLocaleDateString() + " " + now.toLocaleTimeString() + '",',
	'\tfilenames: ['
];

for( var i = 0; i < files.length; i++) {
	if( isImage(files[i])) {
		images++;
		data.push('\t\t"' + files[i] + '",');
	}
}
if( images) {
    var last = data.pop();
    data.push(last.substr(0, last.length-1));
}

data.push('\t]');
data.push('};');

console.log('Found ' + images + ' images');
fs.writeFileSync(args.outFile, data.join(os.EOL));