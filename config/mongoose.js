// UPDATE configuration file to use Mongoose

// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	mongoose = require('mongoose');	// require Mongoose module

// Define the Mongoose configuration method
module.exports = function() {
	// Use Mongoose to connect to MongoDB
	var db = mongoose.connect(config.db); // connect to MongoDB instance using db property of configuration object

	// // Get an instance of the connection to our database
	// var db = mongoose.connection;

	// db.on('error', console.error.bind(console, 'Connection error:'));
	
	var reviews = require('../models/review');
	var books = require('../models/book');
	
	// Load the 'User' model 
	var users = require('../models/user');

	// Attach listener to connected event
	mongoose.connection.once('connected', function() {
	  console.log("Connected to readig-" + process.env.NODE_ENV + " database...");
	});

	// Return the Mongoose connection instance
	return db;
}

// var config = require('./config');
// // mongoose 3.8.x
// var mongoose = require('mongoose');
// // mongodb-uri 0.9.x
// var uriUtil = require('mongodb-uri');

// module.exports = function() {
// 	// Use Mongoose to connect to MongoDB

// 	/*
// 	 * Mongoose uses a different connection string format than MongoDB's standard.
// 	 * Use the mongodb-uri library to help you convert from the standard format to
// 	 * Mongoose's format.
// 	 */
// 	var options = {
// 		// db: { native_parser: true },
// 		user: 'myUserName',
// 		pass: 'myPassword'
// 	}

// 	var mongodbUri = config.db;
// 	var mongooseUri = uriUtil.formatMongoose(mongodbUri);

// 	mongoose.connect(mongooseUri, options);

// 	// 	, function (err, res) {
// 	// 	if (err) { 
// 	// 	  console.log ('ERROR connecting to: ' + mongooseUri + '. ' + err);
// 	// 	} else {
// 	// 	  console.log ('Succeeded connected to: ' + mongooseUri);
// 	// 	}
// 	// });
// 	// Get an instance of the connection to our database
// 	var db = mongoose.connection; 

// 	db.on('error', console.error.bind(console, 'connection error:')); 
	
// 	// load models
// 	var reviews = require('../models/review');
// 	var books = require('../models/book');
// 	var users = require('../models/user');

// 	// Attach listener to connected event
// 	db.once('open', function() {
// 		console.log("Connected to readig-" + process.env.NODE_ENV + " database...");
//   	// Wait for the database connection to establish, then start the app.                         
// 	});

	
// 	// mongoose.connection.once('connected', function() {
// 	//   console.log("Connected to readig-" + process.env.NODE_ENV + " database...");
// 	// });

// 	// Return the Mongoose connection instance
// 	return db;
// }