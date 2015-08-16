var path = require('path');
var fs = require('fs');
var os = require('os');
var sizeOf = require('image-size');
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
var maxRatio = 0;
var minRatio = 10;
var dir = args.inDir;
var files = fs.readdirSync(dir);

var now = new Date();
var data = [
    'gallery = {',
    '\timages : ['
];

for( var i = 0; i < files.length; i++) {
    if( isImage(files[i])) {
        images++;
        var dimensions = sizeOf(path.join(dir, files[i]));
        var ratio = dimensions.height / dimensions.width;
        if( ratio > maxRatio) {
            maxRatio = ratio;
        }
        if( ratio < minRatio) {
            minRatio = ratio;
        }
        data.push("\t\t{name: '" + files[i] + "', caption: '" + "caption" + i + "'},");
    }
}

data.push("\t],");
data.push("\tmaxRatio: " + maxRatio + ",");
data.push("\tminRatio: " + minRatio);
data.push("};");

console.log('Found ' + images + ' images');
fs.writeFileSync(args.outFile, data.join(os.EOL));
