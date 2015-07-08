// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object. This queries the database...

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../../models/user');

module.exports = function(passport) {

    passport.use('local-login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            User.findOne({ 'local.username' :  username }, function(err, user) {
                    // In case of any error, return using the done method. This is a server exception in which err is set to a non-null value
                    if (err) 
                        return done(err);
                    // The following two are authentication failures, not server errors:
                    // Username does not exist, log the error and redirect back
                    if (!user) {
                        console.log('user not found with username ' + username);
                        return done(null, false, req.flash('message', 'username does not exist.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!user.validPassword(password)) {
                        console.log('invalid password');
                        return done(null, false, req.flash('message', 'invalid password.')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );  
}