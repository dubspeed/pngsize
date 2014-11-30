/* jshint: node=true */

(function() {
    'use strict';

    var optipng = require('optipng-bin').path;
    var _ = require('lodash');
    var path = require('path');
    var os = require('os');
    var Promise = require('bluebird');

    var exec = Promise.promisifyAll( require('child_process') );

    module.exports = function ( filename, options ) {
        var resultFilename, filesize;

        _.defaults( options, {
            parameter: ''
        } );
        resultFilename = path.join( os.tmpdir(), Math.random().toString() + '.png' );

        console.log( 'running filter optipng on', filename, 'with', options, 'and overwrite', overwrite );

        /*
         * returns a promise of the execution
         */
        return exec.execFileAsync( optipng, [ '-out', resultFilename, filename ] );
    };

}());
