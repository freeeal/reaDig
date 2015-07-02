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

	// Create seed data
	var seedBookData = [
	  	{
		    "bookName" : "Harry Potter and the Sorcerer's Stone (#1)",
		    "authorName" : "J.K. Rowling",
		    "reviews" : []
		},
		{
			"bookName" : "Divergent (#1)",
		    "authorName" : "Veronica Roth",
		    "reviews" : []
		},
		{
			"bookName" : "Twilight (#1)",
   			"authorName" : "Stephenie Meyer",
   			"reviews" : []
   		}
	];
	
	var reviews = require('../models/review');
	var books = require('../models/book');
	
	// Load the 'User' model 
	var users = require('../models/user');

	// Attach listener to connected event
	mongoose.connection.once('connected', function (err) {
		if (err) throw err;

		books.collection.insertMany(seedBookData, function(err) {
			if (err) throw err;
		});

	  	console.log("Connected to readig-" + process.env.NODE_ENV + " database...");
	});

	// Return the Mongoose connection instance
	return db;
}

