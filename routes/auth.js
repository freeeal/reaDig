// ROUTER THAT HANDLES ALL AUTHENTICATION PAGES

// define routes for application in this module which takes the instance of Passport created in app.js
module.exports = function(router, passport, db){

    // show the home page (will also have our login links)
    // localhost:3000/auth/
    router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});

// =============================================================================
// AUTHENTICATICATION (FOR FIRST LOGIN) ========================================
// =============================================================================

  	// locally --------------------------------
        // LOGIN ===============================
        // render the login form
        // localhost:3000/auth/login
		router.get('/login', function(req, res) {
			res.render('login', { message: req.flash('message') });
		});
		// handle login POST
		router.post('/login', passport.authenticate('local-login', { // this is the static authenticate method of model in LocalStrategy, used as middleware to authenticate the request
			successRedirect: '/profile', 
			failureRedirect: '/auth/login',
			failureFlash : true  
		}));

		// SIGNUP =================================
		// render the signup form
		// localhost:3000/auth/signup
		router.get('/signup', function(req, res){
			res.render('signup', {message: req.flash('message')});
		});
		// handle signup POST
		router.post('/signup', passport.authenticate('local-signup', {
			successRedirect: '/profile',
			failureRedirect: '/auth/signup',
			failureFlash : true  
		}));

	// facebook -------------------------------
		// Set up the Facebook OAuth routes 
		// passport.authenticate() method starts user authentication process
		router.get('/facebook', passport.authenticate('facebook', {					
			failureRedirect: '/auth',
			scope: ['email']
		}));
		// finishes authentication once user has linked their FB profile
		router.get('/facebook/callback', passport.authenticate('facebook', {			
			failureRedirect: '/',
			successRedirect: '/profile',
			scope: ['email']
		}));

	// twitter -------------------------------
		// Set up the Twitter OAuth routes 
		router.get('/twitter', passport.authenticate('twitter', {
			failureRedirect: '/'
		}));
		router.get('/twitter/callback', passport.authenticate('twitter', {
			failureRedirect: '/',
			successRedirect: '/profile'
		}));

	// google -------------------------------
		// Set up the Google OAuth routes 
		router.get('/google', passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			],
			failureRedirect: '/'
		}));
		router.get('/google/callback', passport.authenticate('google', {
			failureRedirect: '/',
			successRedirect: '/profile'
		}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        router.get('/connect/local', function(req, res) {
            res.render('local-connect', { message: req.flash('message') });
        });
        router.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/account', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication 						// request for email
        router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }, function(req, res){
				console.log("account" + req.account)
			}
		)); 

    // twitter --------------------------------

        // send to twitter to do the authentication
        router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));


    // google ---------------------------------

        // send to google to do the authentication
        router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token // for local account, remove all info
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	router.get('/unlink/local', function(req, res) {
		var user = req.user;
		user.local.firstName = null;
		user.local.lastName = null;
		user.local.email = null;
		user.local.username = null;
		user.local.password = null;
		user.save(function(err) {
			if (err)
				throw err;
			res.redirect('/account');
		});
	});

	// facebook -------------------------------
	router.get('/unlink/facebook', function(req, res) {
		var user = req.user;
		user.facebook.token = null;
		user.save(function(err) {
			if (err)
				throw err;
			res.redirect('/account');
		});
	});

	// twitter --------------------------------
	router.get('/unlink/twitter', function(req, res) {
		var user = req.user;
		user.twitter.token = null;
		user.save(function(err) {
			if (err)
				throw err;
			res.redirect('/account');
		});
	});

	// google ---------------------------------
	router.get('/unlink/google', function(req, res) {
		var user = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			if (err)
				throw err;
			res.redirect('/account');
		});
	});

	// return router;

	// HANDLE LOGOUT ==============================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}