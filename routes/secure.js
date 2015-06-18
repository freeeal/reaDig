  module.exports = function(router, passport){
    // make sure a user is logged in
    router.use(function(req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler; Passport adds this method to request object. 
        if (req.isAuthenticated())
            return next();
        // if the user is not authenticated then redirect him to the auth/login page
        res.redirect('/auth');
    });

    // PROFILE SECTION =========================
   	router.get('/profile', function(req, res) {
        res.render('profile', { user : req.user }); // get the user out of session and pass to template
    });

    // router.get('/*', function(req,res) {
    // 	res.render('profile', {user : req.user});
    // })
}