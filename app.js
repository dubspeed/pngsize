/* jshint esnext:true */

var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-busboy');
var koa = require('koa.io');
var fs = require('fs');
var app = koa();
var os = require('os');
var path = require('path');
var pngsize = require('./index.js');
var Promise = require('bluebird');
var readFile = Promise.promisify( fs.readFile );
var temp = Promise.promisifyAll( require('temp') );
/*
 * all tmp file we have a registerd here
 */
temp.track();
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
        yield readFile( file ).then( function( data ) {
            this.body = data;
        }.bind( this ) );
    } else {
        yield next;
    }
});

/*
 * serve static views on get
 */
app.use( serve( __dirname + '/views' ) );

// middleware for scoket.io's connect and disconnect
app.io.use( function* ( next ) {
    // on connect
    this.emit( 'hello', pngsize.filters );
    yield *next;
    // on disconnect
} );

var run_filter = function( filter_result ) {
    // we get a full filename like /tmp/e84h8h43/...png
    // save both in the file registry
    var full_tmp = filter_result.filename,
        tmp_file = full_tmp.split( '/' );
        file_url = '/images/' + tmp_file[ tmp_file.length - 1 ];

    tmp_file = tmp_file[ tmp_file.length - 1 ];

    // do not expose internal filenames
    delete filter_result.filename;
    filter_result.url = file_url;

    file_registry[ file_url ] = full_tmp;

    // emit the results
    this.emit( 'filter update', filter_result );
};

app.io.route( 'filter', function* ( next, image_binary ) {
    var image_buffer = new Buffer( image_binary, 'binary' );

    var tmp = temp.createWriteStream();
    tmp.write( image_buffer );
    tmp.end();
    yield next;
    console.log('got message filter', tmp.path);
    setTimeout(function() {
        for ( var promise of pngsize.check( tmp.path ) ) {
            promise.then( run_filter.bind( this ) );
        }
    }.bind(this), 1000);
} );

// listen
app.listen( 3000, function() {
    console.log( '*** pngsize: listening on port 3000' );
} );

process.on( 'SIGINT', function() {
    console.log( '*** pngsize: shutting down and cleaning up' );
    temp.cleanupSync();
    process.exit( 0 );
} );
