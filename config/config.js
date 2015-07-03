// ENVIRONMENTAL CONFIGURATION FILE

// Invoke 'strict' JavaScript mode
'use strict';

try {
  var dev = require('./dev.js');
} catch(e) {
  var dev = {};
}

module.exports = {
	db: process.env.MONGOLAB_URI || dev['db'],
	secretSecret: process.env.SESSION_SECRET || dev['sessionSecret'],
	facebook: {
		clientID: process.env.FACEBOOK_ID || dev.facebook.clientID,
		clientSecret: process.env.FACEBOOK_SECRET || dev.facebook.clientSecret,
		callbackURL: process.env.FACEBOOK_URL || dev.facebook.callbackURL
	},
	twitter: {
		clientID: process.env.TWITTER_ID || dev.twitter.clientID,
		clientSecret: process.env.TWITTER_SECRET || dev.twitter.clientSecret,
		callbackURL: process.env.TWITTER_URL || dev.twitter.callbackURL
	},
	google: {
		clientID: process.env.GOOGLE_ID || dev.google.clientID,
		clientSecret: process.env.GOOGLE_SECRET || dev.google.clientSecret,
		callbackURL: process.env.GOOGLE_URL || dev.google.callbackURL
	}

};