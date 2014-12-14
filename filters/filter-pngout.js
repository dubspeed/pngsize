/* jshint: node=true */

(function() {
    'use strict';

    var pngout = require('pngout-bin').path;
    var filter_base = require( '../filter_base' );
    var temp = require('temp');
    var fs = require( 'fs' );

    var filter_name = 'pngout';
    // keep track of all the pathes we request
    var temp_path = [];

    exports.inspect = filter_base.inspect( filter_name );

    exports.filter = filter_base.execCmd( filter_name, pngout, {
        parameters: [],
        resultFilename : ''
    }, function ( filename, options ) {
        options.resultFilename = temp.path( { suffix : '.png' } );
        temp_path.push( options.resultFilename );
        console.log('filter-pngout: running with', JSON.stringify( options ) );
        return [].concat( [ filename, options.resultFilename ], options.parameters );
    });

    exports.cleanup = filter_base.cleanup( filter_name, function() {
        console.log('filter-pngout: cleaning up pngout');
        // we used temp.path, this is not tracked by temp
        temp_path.forEach( function( path ) {
            if ( fs.existsSync( path ) ) {
                fs.unlinkSync( path );
            }
        } );
        temp_path = [];
    });

}());
