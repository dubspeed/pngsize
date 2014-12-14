/* jshint: node=true */

(function() {
    'use strict';

    var optipng = require('optipng-bin').path;
    var temp = require('temp').track();
    var fs = require( 'fs' );
    var filter_base = require( '../filter_base' );

    // keep track of all the pathes we request
    var temp_path = [];
    var filter_name = 'optipng';

    exports.inspect = filter_base.inspect( filter_name );

    exports.filter = filter_base.execCmd( filter_name, optipng, {
        parameters: [],
        resultFilename : ''
    }, function ( filename, options ) {
        options.resultFilename = temp.path( { suffix : '.png' } );
        temp_path.push( options.resultFilename );
        console.log('filter-optipng: running with', JSON.stringify( options ) );
        return [].concat( options.parameters, [ '-out', options.resultFilename, filename ] );
    });

    exports.cleanup = filter_base.cleanup( filter_name, function() {
        console.log('filter-optipng: cleaning up optipng');
        // we used temp.path, this is not tracked by temp
        temp_path.forEach( function( path ) {
            if ( fs.existsSync( path ) ) {
                fs.unlinkSync( path );
            }
        } );
        temp_path = [];
    });

}());
