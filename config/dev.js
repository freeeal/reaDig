// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'local-config' environment configuration object -- for development
module.exports = {
	db: 'mongodb://localhost/readig-dev',
	sessionSecret: 'abc123',
	facebook: {
		clientID: '1604953749721962',
		clientSecret: '42633f4024a1d9fa7b892082ed5ee7e7',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: 'zysvFuRjMFyEbsoN9TGQal4z1',
		clientSecret: 's5MGTcpBpcw41uQBmN95PMp2FHXNoEMZsgCCe1sHZLWxyQeFZC',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: '1013545179125-9qn822mi0soajckqmfa91ak70l9p0r6b.apps.googleusercontent.com',
		clientSecret: 'vCdne_D9_t4HJ7rm9kNO57NG',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	s3: {
	    key: 'AKIAIPEGXFB7BGWQRA3Q',
	    secret: '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',
	    bucket: 'readigs-bucket-dev'
	},
	adminToken: '559c84e0e43c90302256d46b'

};