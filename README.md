PNGSize
-------

PNGSize helps you to compare various image compressors against each other to determine the best filesize and / or quality.
Image compressors are included as simple filters, using existing node.js plugins or command line tools. 
You can extend the tool easily.

## Installation

The tool is based on ES6 harmony features which are currently only in node 0.11.x 

The easiest way is to use ‘n’ (a node version manager), and switch to node 0.11.x:

### Install node 0.11
    npm install -g n
    n latest            # Install latest node version
    n 0.11.<xx>         # and use it

### Install dependencies
    npm install         # Install all node deps 
    cd views
    bower install       # Install frontend deps

### Run the app

    node --harmony app.js   

connect your browser to `http://localhost:3000`
 
## TODOs

 * refactor code duplication in the filters
 * send partial results: when a filter is done, send some stuff but tell the client we are not done yet

## License

Copyright (c) 2014 Michael Lennartz and contributors.
Licensed under GPL V3 see LICENSE for details.

