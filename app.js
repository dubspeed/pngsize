/* jshint esnext:true */
var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-busboy');
var koa = require('koa');
var fs = require('fs');
var app = koa();
var os = require('os');
var path = require('path');
var pngsize = require('./index.js');
var temp = require('temp').track();

/*
 * all tmp file we have a registerd here
 */
var file_registry = {};

app.use( logger() );

// custom 404
app.use( function *( next ) {
    yield next;
    if ( this.body || !this.idempotent ) return;
    this.redirect( '/views/404.html' );
});

/**
 * send a png if we have a tmp file with this url in the file_registry
 */
app.use( function *( next ) {
    var file = file_registry[ this.url ];
    if ( file ) {
        this.type = 'image/png';
        this.body = fs.readFileSync( file );
    } else {
        yield next;
    }
});

/*
 * serve static views on get
 */
app.use( serve( __dirname + '/views' ) );

/*
 * if it is a POST, handle the upload and run the filters
 */
app.use( function *( next ) {
    // ignore non-POSTs
    if ( 'POST' != this.method ) return yield next;
    // multipart upload
    var parts = parse( this );
    var part;
    var result_cache = {};

    while ( part = yield parts ) {
        var stream = temp.createWriteStream();
        part.pipe( stream );
        yield stream.on.bind( stream, 'finish' );

        /* pngsize is a generator that can be looped over with 'for of'
         * this is equal to calling next().value all the time manually:
         *   var gen = pngsize(stream.path);
         *   var promise = gen.next().value,
         *       promise2 = gen.next().value;
         */
        for ( var promise of pngsize( stream.path ) ) {
            yield promise.then( function( filter_result ){
                // we get a full filename like /tmp/e84h8h43/...png and make it /images/...png,
                // save both in the file registry
                var full_tmp = filter_result[ 0 ],
                    tmp_file = full_tmp.split( '/' );
                    file_url = '/images/' + tmp_file[ tmp_file.length - 1 ],
                    command_output = filter_result[ 1 ];

                tmp_file = tmp_file[ tmp_file.length - 1 ];

                file_registry[ file_url ] = full_tmp;

                // tODO trigger a proper view
                // send json ?
                result_cache['filter_name' + Math.random()] = file_url;

            }.bind( this ) );
        }
    }

    this.body = JSON.stringify(result_cache);
});


// listen
app.listen( 3000 );
console.log( 'listening on port 3000' );
