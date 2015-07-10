// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');
var User = require('../models/user');
// create application/x-www-form-urlencoded parser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer = require('multer');
var done = false;


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
        res.render('profile', { 
            user : req.user,                  // get the user out of session and pass to template
            message : req.flash('message'),
            book : req.book
        }); 
    });

    // CONFIGURE THE MULTER ====================

    router.use(multer({ dest: './public/images/user-photos/',
        rename: function (fieldname, filename) {
            return filename+Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            done = true;
        }
    }));

    // EDIT PROFILE SECTION =====================
    router.post('/account', function(req, res, user) {
        var user = req.user;

        if (done == true) {
            console.log(req.files);
            user.userPhoto = req.files.userPhoto;
            user.save(function(err) {
                if (err) throw err;  
                return user;
            });
            res.redirect('/profile');
        }
    });

    // EDIT PROFILE SECTION =====================
    router.get('/account', function(req, res) {
        res.render('edit-profile', { user : req.user });
    });


    // ACCEPT REVIEW POSTS TO PROFILE PAGE ======
    router.post('/profile', function(req, res, bookName) {

        var bookName = req.body.bookName;
            // find if the book is in db
            Book.findOne({ 'bookName' : bookName }, function(err, book, review, user, rating) {

                var user = req.user;

                if (err) {
                    console.log('error while finding book');
                    throw err;
                }

                if (!book) {
                    console.log('cannot find the book: ' + bookName);
                    req.flash('message', 'could not find that book. try again!');
                    res.redirect('/profile');
                }

                else {
                    // see if user has already reviewed the book before
                    var query = Review.where({
                        'bookName' : bookName,
                        'reviewer' : req.user.local.fullName || req.user.facebook.fullName || req.user.twitter.fullName || req.user.google.fullName
                    });

                    query.findOne(function(err, review) {
                        if (err) {
                            console.log('error while finding review');
                            throw err;
                        }

                        if (review) {
                            console.log('you have already reviewed this book');
                            req.flash('message', 'you have already reviewed that book! click the reviews tab in the navbar above to see your review');
                            res.redirect('/profile');
                        }

                        else {

                            var newReview = new Review();

                            newReview.reviewer = req.user.local.fullName || req.user.facebook.fullName || req.user.twitter.fullName || req.user.google.fullName;
                            newReview.reviewBody = req.body.reviewBody;
                            newReview.bookName = book.bookName;
                            newReview.ratingValue = req.body.rating
                        

                            // newReview.datePublished = Date.now;

                            newReview.save(function(err) {
                                if (err) {
                                    console.log('error in saving review: ' + err);  
                                    throw err;  
                                }

                                console.log('book review complete.');    
                                console.log('book reviewer is ' + newReview.reviewer);
                                console.log('book review: ' + newReview.reviewBody);
                                console.log('book rating is ' + newReview.ratingValue);

                                user.update(
                                    { $push: { reviews: newReview }},
                                    { upsert: true }, function(err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            console.log('review added to user collection reviews array');
                                        }
                                    }
                                )

                                book.update(
                                    { $push: { reviews: newReview }},
                                    { upsert: true }, function(err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            console.log('review added to book collection reviews array');
                                        }
                                    }
                                )
                                
                                return user, book;
                            });

                            res.redirect('/reviews');
                        }
                    })
                }
            })

    });

    // RENDER REVIEWS LIST ===================================
    router.get('/reviews', function(req, res) {
        res.render('reviews', {
            user: req.user,
            reviews : req.user.reviews,
            book: req.book
        });
    });

    // RENDER FRIENDS LIST ===================================
    router.get('/friends', function(req, res) {

        var user = req.user;
        var requestedFriends = [];
        var pendingFriends = [];
        var acceptedFriends = [];

        User.getFriends(user, function (err, friends) {
             // friends looks like:
             // [{status: "requested", added: <Date added>, friend: user2}]
            for (var i = 0; i<friends.length; i++) {
                if (friends[i].status === "requested") {
                    requestedFriends.push(friends[i]);
                    console.log(requestedFriends);
                }
                if (friends[i].status === "pending") {
                    pendingFriends.push(friends[i]);
                    console.log(pendingFriends);
                }
                if (friends[i].status === "accepted") {
                    acceptedFriends.push(friends[i]);
                    console.log(acceptedFriends);
                }    
            }

            res.render('friends', { 
                user: user,
                requestedFriends: requestedFriends,
                pendingFriends: pendingFriends,
                acceptedFriends: acceptedFriends
            });
        });

    })

    // ADD FRIENDS POST /friends (gets urlencoded bodies) ================
    router.post('/friends', urlencodedParser, function(req, res, friendName) {
        
        var friendFullName = req.body.friendName;
        // console.log(friendFullName);
        var friendFirstName, friendLastName;

        function splitName (fullName) {
            var splitName = fullName.split(' ');
            return splitName;
        };

        var arrFullName = splitName(friendFullName);
        friendFirstName = arrFullName[0];
        friendLastName = arrFullName[1];

        // requesting a friend
        process.nextTick(function() {
            User.findOne({$or: [ 
                            { 'facebook.fullName' : friendFullName },
                            { 'twitter.fullName' : friendFullName },
                            { 'google.fullName' : friendFullName },
                            { $and: [{ 'local.firstName' : friendFirstName }, { 'local.lastName' : friendLastName }] } 
                        ]}, function(err, user) {

                if (err) throw err;

                if (!user) {
                    console.log('blah');
                    res.send({ success : false });
                } //no such users.

                else {
                    console.log('user found with name ' + friendFullName);
                    var user1 = req.user;
                    var user2 = user;

                    User.requestFriend(user1._id, user2._id, function() {
                        console.log('you requested friend: ' + user2._id);
                        
                    });

                    res.send({ success : true });
                } //user already exists

            });
        });

    });

    // // ACCEPT FRIEND REQUESTS PAGE =================================
    // router.post('/friends/accept', function(req, res, pendingFriend, user) {

    //     var pendingFriend = req.body.pendingFriend;
    //     console.log(pendingFriend);

    //     if (pendingFriend != undefined) {
    //         var user1 = req.user;
    //         var user2 = pendingFriend;

    //         User.requestFriend(user1._id, user2._id, function() {
    //             console.log('you accepted friend: ' + user2._id);           
    //         });

    //         res.send({ success : true });
    //     }

    //     else {
    //         res.send({ success : false });
    //     }
    // })

    // catch-all route, redirects all invalid paths to the profile
    router.get('/*', function(req, res) {
        res.redirect('/profile');
    });

}