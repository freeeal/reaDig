// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
	BearerStrategy = require('passport-http-bearer').Strategy,
	config = require('../config'),
	User = require('../../models/user');

// Create the Facebook strategy configuration method
module.exports = function(passport) {

	passport.use(new BearerStrategy({},
		function(token, done){
			User.findOne({ _id: token }, function(err, user){
				if (!user)
					return done(null, false);
				return done(null, user);
			})
		}
	));


}