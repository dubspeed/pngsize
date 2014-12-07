/* jshint: node=true */

(function() {
    'use strict';

    var pngout = require('pngout-bin').path;
    var _ = require('lodash');
    var Promise = require('bluebird');
    var temp = require('temp').track();
    var exec = Promise.promisifyAll( require('child_process') );
    var fs = require( 'fs' );

    // keep track of all the pathes we request
    var temp_path = [];

    /**
     * Inspect the input data and may return usefull
     * interpreation of them
     */
    exports.inspect = function( data ) {
        if ( fs.existsSync( data.filename ) ) {
            var stats = fs.statSync( data.filename );
        }

        data.size = stats.size;
        data.filter = 'pngout';
        return data;

    };

    exports.filter = function ( filename, options ) {
        options = options || {};

        _.defaults( options, {
            parameters: [],
            resultFilename : temp.path( { suffix : '.png' } )
        } );

        temp_path.push( options.resultFilename );

        console.log('filter-pngout: running with', JSON.stringify( options ) );

        var cmd = [].concat( [ filename, options.resultFilename ], options.parameters );

        /*
         */
        var promise = exec.execFileAsync( pngout, cmd );

        promise = promise.then( function( output ) {
            return {
                filename : options.resultFilename,
                output : {
                    stderr : output[ 0 ],
                    stdout : output[ 1 ]
                },
                parameters : options.parameters
            };
        } );

        return promise;
    };

    exports.cleanup = function() {
        console.log('filter-pngout: cleaning up pngout');
        temp.cleanup();

        // we used temp.path, this is not tracked by temp
        temp_path.forEach( function( path ) {
            if ( fs.existsSync( path ) ) {
                fs.unlinkSync( path );
            }
        } );
        temp_path = [];
    };

}());
