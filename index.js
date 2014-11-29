/* jshint: node=true */

/**
 * Pngsize helps you determine the optimal filesize and quality of your png
 * Images are run through a set of tools and their file sizes are compared.
 *
 * The tools must be installed on your system (for now) - in the future npm can do $(this)
 */

(function() {
    'use strict';

    var d=console.log;
    var _ = require('lodash');

    // Scan dir for filters and require them all
    var optipng = require('filters/filter-optipng.js').check;

    d(optipng);
    // TODO filters may be submodules with their own dependency, so they can care for themselves
    // if we do so we can make this registry a json -> or just add it to package json
    var filters = {
        optipng : optipng,
        //pngquant : pngquant
    };

    var check = function( filename ) {
        console.log( 'checking file', filename );
        for ( var filter in filters ) {
            var ffunc = filters[ filter ];
            if ( typeof ffunc === 'function' ) {
                ffunc( filename, {}, false );
            }
        }
    };

    if ( require.main === module ) {
        var filename = process.argv[ process.argv.length - 1 ];
        check( filename );
    }

    exports.check = check;
}());
