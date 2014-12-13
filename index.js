/* jshint node:true, esnext:true */

/**
 * Pngsize helps you determine the optimal filesize and quality of your png
 * Images are run through a set of tools and their file sizes are compared.
 *
 * The tools must be installed on your system (for now) - in the future npm can do $(this)
 */

(function() {
    'use strict';

    var Promise = require( 'bluebird' );
    var fs = Promise.promisifyAll( require( 'fs' ) );
    var temp = require( 'temp' ).track();
    var path = require( 'path' );

    var filters = {};

    fs.readdirAsync( 'filters' ).then( function( files ) {
        files.forEach( function( file ) {
            filters[ file ] = require( path.join( 'filters', file ) );
            console.log( 'pngsize: adding filter', file );
        } );
    } ).catch( function( e ) {
        console.error( 'pngsize: unable to read directory "filters".');
        throw e;
    });

    var check;
    /*
     * this is the generator equivalent of
     * [ filterResult1, filterResult2, ...]
     */
    module.exports = check = function *( filename ) {

        console.log( 'checking file', filename );

        for ( var filterName in filters ) {
            var filter = filters[ filterName ],
                filterFunc = filter.filter,
                inspectFunc = filter.inspect;

            if ( typeof filterFunc === 'function' ) {
                /* yields a promise upwards */
                var start_time = Date.now();

                yield filterFunc( filename ).then( function() {
                    var time_diff = Date.now() - start_time;

                    // smuggle the time into the arguments list
                    arguments.length += 1;
                    arguments[ arguments.length - 1 ] = time_diff;

                    return inspectFunc.apply( null, arguments );
                } );
            }
        }
    };

    process.on('exit', function() {
        for ( var filterName in filters ) {
            var filterFunc = filters[ filterName ].cleanup;
            filterFunc();
        }
    });

    if ( require.main === module ) {
        var filename = process.argv[ process.argv.length - 1 ];

        for ( var promise of check( filename ) ) {
            promise.then( function( result ) {
                console.log( 'resultFilename', result[0] );
                console.log( 'stderr', result[1][0] );
                console.log( 'stdout', result[1][1] );
            } );
        }
    }
}());
