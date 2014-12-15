/* jshint: node=true */

(function() {
    'use strict';

    var fs = require( 'fs' );
    var _ = require('lodash');
    var Promise = require('bluebird');
    var exec = Promise.promisifyAll( require('child_process') );

    /**
     * Inspect the input data and may return usefull
     * interpreation of them
     */
    exports.inspect = function( filter_name, callback ) {

        return function( data, time ) {
            var stats;
            if ( fs.existsSync( data.filename ) ) {
                stats = fs.statSync( data.filename );
            }

            data.size = stats.size;
            data.filter = filter_name;
            data.time = time;

            if ( typeof callback === 'function' ) {
                data = callback( stats, data );
            }

            return data;
        };
    };

    exports.execCmd = function( filter_name, bin_path, default_options, callback ) {
        return function ( filename, options ) {
            options = options || {};
            var action, promise;

            _.defaults( options, default_options );

            if ( typeof callback === 'function' ) {
                action = callback( filename, options );
            }

            if ( _.isArray( action ) || typeof action === 'string' ) {
                promise = exec.execFileAsync( bin_path, action );
            } else if ( typeof action === 'function' ) {
                promise = action();
            } else if ( action ) { // not null, undefined
                promise = action;
            }

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
    };


    exports.cleanup = function( filter_name, callback ) {
        return function() {
            if ( typeof callback === 'function' ) {
                callback();
            }
        };
    };

    exports.cleanupManualTemps = function( filter_name, temp_files, callback ) {
        return function() {
            console.log( filter_name + ': cleaning up pngcrush' );

            temp_files.forEach( function( path ) {
                if ( fs.existsSync( path ) ) {
                    fs.unlinkSync( path );
                }
            } );

            if ( typeof callback === 'function' ) {
                callback();
            }
        };
    };

}());
