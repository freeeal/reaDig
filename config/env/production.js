// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'production' environment configuration object
module.exports = {
	db: 'mongodb://localhost/readig-production',
	sessionSecret: 'productionSessionSecret',
	facebook: {
		clientID: '1599725633578107',
		clientSecret: '44a15d2e796d44b76917f2b645d750f0',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: 'Zyx7VUfF3dEf4xhXQUyz62SmZ',
		clientSecret: 'Voi9kaqPzJzj7Tpayc8k1z2oQcXScXGBgUAjl5X46zQWrLwZsO',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: '1013545179125-9qn822mi0soajckqmfa91ak70l9p0r6b.apps.googleusercontent.com',
		clientSecret: 'vCdne_D9_t4HJ7rm9kNO57NG',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	}
};