// ENVIRONMENTAL CONFIGURATION FILE

// Invoke 'strict' JavaScript mode
'use strict';

// loads correct configuration file according to process.env.NODE_ENV environment variable
module.exports = require('./env/' + process.env.NODE_ENV + '.js');