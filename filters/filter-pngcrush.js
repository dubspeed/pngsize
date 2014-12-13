/* jshint: node=true */

(function() {
    'use strict';

    var pngcrush = require('pngcrush-bin').path;
    var temp = require('temp').track();
    var fs = require( 'fs' );
    var filter_base = require( '../filter_base' );

    // keep track of all the pathes we request
    var temp_path = [];
    var filter_name = 'pngcrush';

    exports.inspect = filter_base.inspect( filter_name );

    exports.filter = filter_base.execCmd( filter_name, pngcrush, {
        parameters: [ '-brute', '-reduce' ],
        resultFilename : temp.path( { suffix : '.png' } )
    }, function ( filename, options ) {
        temp_path.push( options.resultFilename );
        console.log('filter-pngcrush: running with', JSON.stringify( options ) );

        return [].concat( options.parameters, [ filename, options.resultFilename ] );
    });

    exports.cleanup = filter_base.cleanup( filter_name, function() {
        console.log('filter-pngcrush: cleaning up pngcrush');
        // we used temp.path, this is not tracked by temp
        temp_path.forEach( function( path ) {
            if ( fs.existsSync( path ) ) {
                fs.unlinkSync( path );
            }
        } );
        temp_path = [];
    });

}());
