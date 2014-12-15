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
        resultFilename : ''
    }, function ( filename, options ) {
        options.resultFilename = temp.path( { suffix : '.png' } );
        temp_path.push( options.resultFilename );
        console.log('filter-pngcrush: running with', JSON.stringify( options ) );

        return [].concat( options.parameters, [ filename, options.resultFilename ] );
    });

    exports.cleanup = filter_base.cleanupManualTemps( filter_name, temp_path, function() {
        temp_path = [];
    });

}());
