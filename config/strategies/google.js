// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
	User = require('../../models/user');

// Create the Google strategy configuration method
module.exports = function(passport) {
	// Use the Passport's Google strategy 
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
	    function(req, token, refreshToken, profile, done) {

	        // make the code asynchronous
	        // User.findOne won't fire until we have all our data back from Google
	        process.nextTick(function() {

	        	// check if user is already logged on
	        	if (!req.user) {

		            // try to find the user based on their google id
		            User.findOne({ 'google.id' : profile.id }, function(err, user) {
		                if (err)
		                    return done(err);

		                if (user) {

		                	// if there is a user id already but no token (user was linked at one point and then removed)
	                        if (!user.google.token) {
	                            user.google.token = token;
	                            user.google.fullName = profile.name.givenName + ' ' + profile.name.familyName;
	                            user.google.email = profile.emails[0].value; // pull the first email
	                            user.google.url = 'https://plus.google.com/' + profile.id;

	                            user.save(function(err) {
	                                if (err)
	                                    throw err;
	                                return done(null, user);
	                            });
	                        }

		                    // if a user is found, log them in
		                    return done(null, user);
		                } 

		                else {
		                    // if the user isnt in our database, create a new user
		                    var newUser = new User();

		                    // set all of the relevant information
		                    newUser.google.id = profile.id;
		                    newUser.google.token = token;
		                    newUser.google.fullName = profile.name.givenName + ' ' + profile.name.familyName;
		                    newUser.google.email = profile.emails[0].value; // pull the first email
		                    newUser.google.url = 'https://plus.google.com/' + profile.id;

		                    // save the user
		                    newUser.save(function(err) {
		                        if (err)
		                            throw err;
		                        return done(null, newUser);
		                    });
		                }
		            });
			
				}	

				else {
	                // user already exists and is logged in, we have to link accounts
	                var user = req.user; // pull the user out of the session

	                user.google.id = profile.id;
	                user.google.token = token;
	                user.google.fullName = profile.name.givenName + ' ' + profile.name.familyName;
	                user.google.email = profile.emails[0].value; // pull the first email
	                user.google.url = 'https://plus.google.com/' + profile.id;

	                user.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, user);
	                });
            	}
	        });
   		}
	))
};