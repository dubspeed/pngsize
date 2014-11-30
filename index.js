/* jshint: node=true, esnext=true */

/**
 * Pngsize helps you determine the optimal filesize and quality of your png
 * Images are run through a set of tools and their file sizes are compared.
 *
 * The tools must be installed on your system (for now) - in the future npm can do $(this)
 */

(function() {
    'use strict';

    var d=console.log;

    // Scan dir for filters and require them all
    var optipng = require('filters/filter-optipng.js');

    //TODO do I still need this? wouln´d os.tmpdir + random not be enough
    //Maybe the deletion at the end of the process is awesome!

    var temp = require('temp');
    //TODO when we create a web process, does this still make sense?
    temp.track();

    d(optipng);
    // TODO filters may be submodules with their own dependency, so they can care for themselves
    // if we do so we can make this registry a json -> or just add it to package json
    var filters = {
        optipng : optipng,
        //pngquant : pngquant
    };

    /*
     * this is the generator equivalent of
     * [ filterResult1, filterResult2, ...]
     */
    module.exports = function *( filename ) {
        console.log( 'checking file', filename );
        for ( var filter in filters ) {
            var ffunc = filters[ filter ];

            //TODO pass in a temp file for the output for every process
            if ( typeof ffunc === 'function' ) {
                /* yields a promise upwards */
                yield ffunc( filename, {}, false );
            }
        }
    };

    var create_tmpfile = function() {
        return temp.openSync('pngsize-');
    };

    //TODO make it run on command line
    //if ( require.main === module ) {
        //var filename = process.argv[ process.argv.length - 1 ];
        //check( filename );
    //}
}());
