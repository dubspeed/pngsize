/* jshint: node=true */

(function() {
    'use strict';

    var execFile = require('child_process').execFile;
    var optipng = require('optipng-bin').path;
    var _ = require('lodash');

    var check = function( filename, options, overwrite ) {
        var resultFilename, filesize;
        overwrite = overwrite || false;

        _.defaults( options, {
            parameter: ''
        } );

        console.log( 'running filter optipng on', filename, 'with', options, 'and overwrite', overwrite );
        var child = execFile(optipng, ['-out', 'out_optipng.png', filename], function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });

        if ( overwrite ) {
            resultFilename = filename;
        } else {
            resultFilename = filename + '.opti';
        }

        var result = {
            filename : resultFilename,
            filesize : filesize
        };

        return result;
    };

    exports.check = check;
}());
