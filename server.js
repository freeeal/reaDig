// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
var mongoose = require('./config/mongoose'),
	express = require('./config/express');
	passport = require('./config/passport');

var db = mongoose(); 		// create new MongoDB connection instance
var app = express(); 		// create new Express application instance
var passport = passport();  // create new Passport instance

app.listen(3000);

module.exports = app;	// use the module.exports property to expose our Express application instance for external usage

console.log('Server running at http://localhost:3000/');






// // mounts middleware function (with specific path) that will respond to any HTTP request made to the root path
// app.use('/', function(req, res) { 
// 	res.send('Hello World');
// })