var LocalStrategy   = require('passport-local').Strategy;
var User = require('../../models/user');

module.exports = function(passport) {

    passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            process.nextTick(function() { // execute function in the next tick of the event loop
                // find a user in Mongo with provided username
                User.findOne({ 'local.username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('error in sign up: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('user already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'user already exists.'));
                    } 

                    if (!req.user) {
                        // not logged in, creating brand new user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.email = req.body.email;
                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('error in saving user: ' + err);  
                                throw err;  
                            }
                            console.log('user registration successful.');    
                            return done(null, newUser);
                        });
                    }

                    else {
                        // logged in, connecting a new local account
                        var user = req.user;
                        user.local.firstName = req.body.firstName;
                        user.local.lastName = req.body.lastName;
                        user.local.email = req.body.email;
                        user.local.username = username;
                        user.local.password = user.generateHash(password);
                        
                        user.save(function(err) {
                            if (err){
                                throw err;  
                            } 
                            return done(null, user);
                        });

                    }
                });
            });
        })
    );
}