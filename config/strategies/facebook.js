// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config'),
	User = require('../../models/user');

// Create the Facebook strategy configuration method
module.exports = function(passport) {
	// Use the Passport's Facebook strategy 
	passport.use('facebook', new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},

		// facebook will send back the tokens and profile
		function(req, access_token, refresh_token, profile, done) {
		    // asynchronous
		    process.nextTick(function() {
		        
		        // check if the user is already logged in
            	if (!req.user) {
			      	// find the user in the database based on their facebook id
			      	User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
			 
				        // if there is an error, stop everything and return that
				        // ie an error connecting to the database
				        if (err)
				          return done(err);
				 
				        // if the user is found, then log them in
				        if (user) {
					            // if there is a user id already but no token (user was linked at one point and then removed)
	                        if (!user.facebook.token) {
	                            user.facebook.token = access_token;
	                            user.facebook.fullName = profile.name.givenName + ' ' + profile.name.familyName;
	                            user.facebook.email = profile.emails[0].value;
	                            user.facebook.url = profile.profileUrl;

	                            user.save(function(err) {
	                                if (err)
	                                    throw err;
	                                return done(null, user);
	                            });
	                        }

	                        return done(null, user); // user found, return that user
				        } 

				        else {
				            // if there is no user found with that facebook id, create them
				            var newUser = new User();
				 
				            // set all of the facebook information in our user model
				            newUser.facebook.id = profile.id; // set the users facebook id                 
				            newUser.facebook.token = access_token; // we will save the token that facebook provides to the user                    
				            newUser.facebook.fullName = profile.name.givenName + ' ' + profile.name.familyName
				            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
				 			newUser.facebook.url = profile.profileUrl;

				            // save our user to the database
				            newUser.save(function(err) {
				              if (err)
				                throw err;
				 
				              // if successful, return the new user
				              return done(null, newUser);
			           		});
			        	} 
			      	});
				}

				// user already exists and is logged in, we have to link accounts
				else {
	               	var user = req.user; // pull the user object out of the session

	                // update the current users facebook credentials
	                user.facebook.id = profile.id;
	                user.facebook.token = access_token;
	                user.facebook.fullName  = profile.name.givenName + ' ' + profile.name.familyName;
	                user.facebook.email = profile.emails[0].value;
	                user.facebook.url = profile.profileUrl;

	                // save the user
	                user.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, user);
	                });
           		}			
		    });
		}
	));
}