/* jshint: node=true */

(function() {
    'use strict';

    var temp = require('temp').track();
    var filter_base = require( '../filter_base' );
    var Promise = require('bluebird');
    var fs = require( 'fs' );

    var filter_name = 'none';
    // keep track of all the pathes we request
    var temp_path = [];

    exports.inspect = filter_base.inspect( filter_name );

    exports.filter = filter_base.execCmd( filter_name, null, {
        parameters: [],
        resultFilename : ''
    }, function ( filename, options ) {
        options.resultFilename = temp.path( { suffix : '.png' } );
        temp_path.push( options.resultFilename );

        console.log('filter-none: returning original image' );

        return new Promise( function( resolve, reject ) {
            var in_file = fs.createReadStream( filename );
            var out_file = fs.createWriteStream( options.resultFilename );
            in_file.on( 'error', reject );
            out_file.on( 'error', reject );
            in_file.pipe( out_file );
            resolve( [ '', '' ]);
        } );
    });

    exports.cleanup = filter_base.cleanup( filter_name, function() {
        console.log('filter-none: cleaning up');
        // we used temp.path, this is not tracked by temp
        temp_path.forEach( function( path ) {
            if ( fs.existsSync( path ) ) {
                fs.unlinkSync( path );
            }
        } );
        temp_path = [];
    });


}());
