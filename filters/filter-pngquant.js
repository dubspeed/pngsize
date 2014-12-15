/* jshint: node=true */

(function() {
    'use strict';

    var bin = require('pngquant-bin').path;
    var filter_name = 'pngquant';

    var filter_base = require( '../filter_base' );
    var temp = require('temp');
    var fs = require( 'fs' );

    // keep track of all the pathes we request
    var temp_path = [];

    exports.inspect = filter_base.inspect( filter_name );

    exports.filter = filter_base.execCmd( filter_name, bin, {
        parameters: [ '128' ],
        resultFilename : ''
    }, function ( filename, options ) {
        options.resultFilename = temp.path( { suffix : '.png' } );
        temp_path.push( options.resultFilename );
        console.log( filter_name + ': running with', JSON.stringify( options ) );
        return [].concat( [ '--output', options.resultFilename ], options.parameters, [ filename ] );
    });

    exports.cleanup = filter_base.cleanupManualTemps( filter_name, temp_path, function() {
        temp_path = [];
    });

}());
