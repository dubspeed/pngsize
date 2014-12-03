/* jshint: node=true */

(function() {
    'use strict';

    var optipng = require('optipng-bin').path;
    var _ = require('lodash');
    var path = require('path');
    var os = require('os');
    var fs = require('fs');
    var util = require('util');
    var Promise = require('bluebird');
    var temp = require('temp');
    var exec = Promise.promisifyAll( require('child_process') );

    /**
     * Inspect the filename given and return a valid filesize
     */
    //exports.getResults = function( task_output ) {
        //var filesize = 0,
            //error = '';

        //if ( !fs.existsSync( filename ) ) {
            //error = 'File does not exists: ' + filename;
        //} else {
            //filesize = util.inspect( fs.statSync( filename ) ).size;
        //}

        //return {
            //filesize : filesize,
            //error: error
        //};
    //};

    module.exports = function ( filename, options ) {
        var filesize;

        options = options || {};

        _.defaults( options, {
            parameters: [],
            resultFilename : temp.path( { suffix : '.png' } )
        } );

        var commandLine = [].concat( options.parameters, [ '-out', options.resultFilename, filename ] );

        /*
         */
        var promise = exec.execFileAsync( optipng, commandLine );

        promise = promise.then( function( output ) {
            return [ options.resultFilename, output ];
        } );

        return promise;
    };

}());
