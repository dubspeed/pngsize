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

app.use( logger() );

// custom 404
app.use( function *( next ) {
    yield next;
    if ( this.body || !this.idempotent ) return;
    this.redirect( '/views/404.html' );
});

// serve static files
app.use( serve( __dirname + '/views' ) );

// handle uploads
app.use( function *( next ) {
    // ignore non-POSTs
    if ( 'POST' != this.method ) return yield next;
    // multipart upload
    var parts = parse( this );
    var part;
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
                this.body = filter_result;
            }.bind( this ) );
        }

    }
});
// listen
app.listen( 3000 );
console.log( 'listening on port 3000' );
