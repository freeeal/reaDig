var locallogin = require('./local-login');
var localsignup = require('./local-signup');
var User = require('../../models/user');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        // console.log('serializing user: ', user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            // console.log('deserializing user:', user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    locallogin(passport);
    localsignup(passport);
    require('../strategies/facebook.js')(passport);
    require('../strategies/twitter.js')(passport);
    require('../strategies/google.js')(passport);

}