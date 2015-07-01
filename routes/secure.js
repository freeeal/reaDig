// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');

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
            user : req.user,                            // get the user out of session and pass to template
            message : req.flash('message'),
            author : req.author,
            book : req.book

        }); 
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
                                            console.log('success');
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
                                            console.log('success');
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

    router.get('/reviews', function(req, res) {
        res.render('reviews', {
            user: req.user,
            reviews : req.user.reviews
        });
    });

    // catch-all route, redirects all invalid paths to the profile
    router.get('/*', function(req, res) {
        res.redirect('/profile');
    });

}