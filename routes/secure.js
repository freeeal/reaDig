// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');
var User = require('../models/user');
// CONFIGURE THE MULTER =============================================== for parsing multipart/form-data
var config = require('../config/config');
var multer = require('multer'),
    s3 = require('multer-s3'),
    upload = multer({
    storage: s3({
        accessKeyId: config.s3.key,
        secretAccessKey: config.s3.secret,
        bucket: config.s3.bucket,
        acl: 'public-read', // defaults to public-read
        region: 'us-east-1', // defaults to us-standard
        dirname: 'uploads/user-photos'
    }),
    fileFilter: function fileFilter (req, file, cb) {
     
      // The function should call `cb` with a boolean 
      // to indicate if the file should be accepted 
      
      // To reject this file pass `false`, like so: 
      if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          cb(null, false)
      }
      else {
      // To accept the file pass `true`, like so: 
          cb(null, true)
      }
     
      // // You can always pass an error if something goes wrong: 
      // cb(new Error('I don\'t have a clue!'))
     
    }, 
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
    
});


module.exports = function(router, passport){
    // make sure a user is logged in
    router.use(function(req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler; Passport adds this method to request object. 
        if (req.isAuthenticated())
            return next();
        // if the user is not authenticated then redirect him to the auth/login page
        res.redirect('/auth');
    });

    // working here....
    // PROFILE SECTION =========================
    router.get('/profile', function(req, res) {
        res.render('profile', { 
            user : req.user,                  // get the user out of session and pass to template
            message : req.flash('message')
        }); 
    });

    // // PROFILE SECTION =========================
    // router.get('/profile', function(req, res) {
    //     res.redirect('/:username');
    // });
    router.param('username', function (req, res, next, username) {
        // perform database query that returns user w/ username when done
        User.findOne({$or: [ 
                                { 'local.username' : username },
                                { 'twitter.username' : username }
                            ]
                    }, function(err, user) {

                        if (err) return next(err);

                        if (!user) {
                            console.log('blah');
                            res.end();
                        } //no such users.

                        else {
                            req.user = user;
                            console.log('user found with username ', username);
                            return next();
                        } 
                    }
        );

    });

    router.get('/users/:username', function(req, res, next) {
        return res.render('user', { user: req.user });
    });

    // router.get('/admin/:username',
    //   function(request, response, next){
    //     return response.render('admin', request.user);
    //   }
    // );

    // router.put('/:username/edit');
    // router.delete('/:username/delete');
    // working above........

    // EDIT PROFILE SECTION =====================
    router.get('/account', function(req, res) {
        res.render('edit-profile', { 
            user : req.user,
            message : req.flash('message')
        });
    });

    // EDIT PROFILE SECTION =====================
    router.post('/account', upload.single('userPhoto'), function(req, res, user) {
        var user = req.user;
        console.log(req.file);
        console.log(req.body);

        if (req.file && req.body.aboutMe == "") {

            if (process.env.NODE_ENV === 'dev') {
                user.imageUrl = 'https://s3.amazonaws.com/readigs-bucket-dev/' + req.file.key;
                console.log(user.imageUrl);
            }
            else {
                user.imageUrl = 'https://s3.amazonaws.com/readigs-bucket/' + req.file.key;
                console.log(user.imageUrl);
            }

            user.save(function(err) {
                if (err) throw err;  
                return user;
            });

            res.redirect('/profile');

        }

        else if (req.file && req.body.aboutMe != "") {
            
            if (process.env.NODE_ENV === 'dev') {
                user.imageUrl = 'https://s3.amazonaws.com/readigs-bucket-dev/' + req.file.key;
                console.log(user.imageUrl);
            }
            else {
                user.imageUrl = 'https://s3.amazonaws.com/readigs-bucket/' + req.file.key;
                console.log(user.imageUrl);
            }

            user.aboutMe = req.body.aboutMe;
            user.save(function(err) {
                if (err) throw err;  
                return user;
            });

            res.redirect('/profile');
        }

        else if (!req.file && req.body.aboutMe != "") {

            user.aboutMe = req.body.aboutMe;
            user.save(function(err) {
                if (err) throw err;  
                return user;
            });

            res.redirect('/profile');

        }

        else {
            console.log('write something');
            req.flash('message', 'tell us something about yourself before you submit!');
            res.redirect('/account');
        }
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
                            newReview.ratingValue = req.body.rating;
                            newReview.imageUrl = book.imageUrl;
                            newReview.authorName = book.authorName;

                            newReview.save(function(err) {
                                if (err) {
                                    console.log('error in saving review: ' + err);  
                                    throw err;  
                                }

                                console.log('book review complete.');    
                                console.log('book reviewer is ' + newReview.reviewer);
                                console.log('book review: ' + newReview.reviewBody);
                                console.log('book rating is ' + newReview.ratingValue);
                                console.log('book image url is ' + newReview.imageUrl);

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
            reviews : req.user.reviews
        });
    });

    // RENDER FRIENDS LIST ===================================
    router.get('/friends', function(req, res) {

        var user = req.user;
        var requestedFriends = [];
        var pendingFriends = [];
        var acceptedFriends = [];
        var countAcceptedFriends = 0;

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
                    countAcceptedFriends++;
                    // update user's numFriends key
                    user.update({ numFriends: countAcceptedFriends }, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('numFriends updated to ' + countAcceptedFriends);
                        }
                    });
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

    // ADD FRIENDS POST /friends ================
    router.post('/friends',  function(req, res) {
        
        var friendFullName = req.body.friendName;
        // console.log(friendFullName);
        var friendFirstName, friendLastName;

        function splitName (fullName) {
            var splitName = fullName.split(' ');
            return splitName;
        };

        if (friendFullName != undefined) {
            var arrFullName = splitName(friendFullName);
            friendFirstName = arrFullName[0];
            friendLastName = arrFullName[1];
        }

        var pendingFriendId = req.body.pendingFriendId;

        process.nextTick(function() {

            // SEND FRIEND REQUEST ==============
            if (friendFullName != undefined) {
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
                    } //user exists

                });
            }
            
            // ACCEPT FRIEND REQUEST =============
            else {
            
                if (pendingFriendId != undefined) {

                    var user1 = req.user;
                    console.log(user1._id);
                    console.log(pendingFriendId);

                    User.requestFriend(user1._id, pendingFriendId, function() {
                        console.log('you accepted friend: ' + pendingFriendId);           
                    });

                    res.redirect('/friends');
                }

                else {
                    alert('error in accepting request!');
                }
            }

        });

    });

    // HOME PAGE SECTION =========================
    // live feed and reverse populate by date all friends' reviews
    router.get('/home', function(req, res) {

        var user = req.user;
        var acceptedFriends = [];

        User.getFriends(user, function (err, friends) {
            for (var i = 0; i<friends.length; i++) {
                if (friends[i].status === "accepted") {
                    acceptedFriends.push(friends[i]);
                }    
            }

            console.log(acceptedFriends);

            res.render('home', { 
                user: user,
                reviews: user.reviews,
                acceptedFriends: acceptedFriends
            });
        });

    });

    // catch-all route, redirects all invalid paths to the profile
    router.get('/*', function(req, res) {
        res.redirect('/profile');
    });

}