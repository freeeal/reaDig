// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	User = require('../../models/user');

// Create the Twitter strategy configuration method
module.exports = function(passport) {
	// Use the Passport's Twitter strategy 
	passport.use(new TwitterStrategy({				// two arguments for TwitterStrategy constructor: Twitter app info & callback function during authentication
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {

        // make the code asynchronous
    	// User.findOne won't fire until we have all our data back from Twitter
	        process.nextTick(function() {

	           // check if the user is already logged in
	            if (!req.user) {

		            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

		                // if there is an error, stop everything and return that
		                // ie an error connecting to the database
		                if (err)
		                    return done(err);

		                // if the user is found then log them in
		                if (user) {

		                	// if there is a user id already but no token (user was linked at one point and then removed)
	                        if (!user.twitter.token) {
	                            user.twitter.token = token;
	                            user.twitter.username = profile.username;
	                            user.twitter.fullName = profile.displayName;
	                            user.twitter.url = 'https://twitter.com/intent/user?user_id=' + profile.id;

	                            user.save(function(err) {
	                                if (err)
	                                    throw err;
	                                return done(null, user);
	                            });
	                        }

		                    return done(null, user); // user found, return that user
		                } 

		                else {
		                    // if there is no user, create them
		                    var newUser = new User();

		                    // set all of the user data that we need
		                    newUser.twitter.id = profile.id;
		                    newUser.twitter.token = token;
		                    newUser.twitter.username = profile.username;
		                    newUser.twitter.fullName = profile.displayName;
		                    newUser.twitter.url = 'https://twitter.com/intent/user?user_id=' + profile.id;

		                    // save our user into the database
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

	                user.twitter.id = profile.id;
	                user.twitter.token = token;
	                user.twitter.username = profile.username;
	                user.twitter.fullName = profile.displayName;
		            user.twitter.url = 'https://twitter.com/intent/user?user_id=' + profile.id;

	                user.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, user);
	                });
				}
    		});
		}
	));
};