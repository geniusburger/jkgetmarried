
loadOrder = [
    '3p/jquery-1.11.0.min.js',
    'bg.js',
    'gallery.js',
    'util.js',
    'countdownTimer.js',
    'game.js',
    'main.js',
    '3p/bootstrap.min.js'
];

// check if not in node
if( typeof exports !== 'undefined' && this.exports !== exports) {
    var fs = require("fs");
    var outputFile = '../../public_html/js/master.min.js';

    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    String.prototype.insert = function( index, stringToInsert ) {
        return this.slice(0,index) + stringToInsert + this.slice(index);
    };

    var files = loadOrder.map(function(name){   // remove 'js/' from the beginning of the file names
        if( name.startsWith('js/')) {
            return name.substring(name.indexOf('/')+1);
        } else {
            return name;
        }
    }).filter(function(name) {  // remove non .js files
        return name.endsWith('.js');
    }).map(function(name) { // check for a minified version of .js files
        if( name.endsWith('.min.js')) {
            return name;
        } else if(false) {
            //debug
            return name;
        } else {
            var minName = name.insert(name.lastIndexOf('.'), '.min');
            if( fs.existsSync(minName)) {
                return minName;
            } else {
                return name;
            }
        }
    });

    if( fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);  // delete the output file
    }

    files.forEach(function(name){
        fs.appendFileSync(outputFile, fs.readFileSync(name));
        fs.appendFileSync(outputFile, '\n');
    });

} else {
    loadOrder.forEach(function(name) {
        document.writeln('<script src="../src/js/' + name + '"></script>')
    });
}
