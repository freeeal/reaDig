// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');
var User = require('../models/user');
var multer = require('multer'); // for parsing multipart/form-data
// CONFIGURE THE MULTER ===============================================
var done = false;
var multer2 = multer({ dest: './public/images/book-photos/',
    rename: function(fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        done = true;
    }
});

module.exports = function(router, passport){
	// make admin.js route
    router.get('/upload', function(req, res) {
        res.render('admin-uploads', { 
            // user : req.user,                 // get the user out of session and pass to template
            // // message : req.flash('message'),
            // book : req.book
        }); 
    });

    router.post('/upload', multer2, function(req, res, next) {
        
        console.log(req.files);
        if (done == true) {
        	var newBook = new Book();
	        newBook.bookName = req.body.bookName;
	        newBook.authorName = req.body.authorName;
	        newBook.attach('image', req.files.bookPhoto, function(err) {
	            if(err) return next(err);
	            newBook.save(function(err) {
	                if(err) return next(err)
                    Review.find({ bookName : req.body.bookName}, function(err, review) {
                                if (err) throw err;
                                if (review) {
                                    review.bookPhoto = req.files.bookPhoto;
                                    console.log(req.files.bookPhoto);
                                    review.save(function(err) {
                                        if(err) return next(err);
                                        res.send('Book/review has been saved with file!');
                                    })
                                }
                                else {
                                	res.send('no such reviews found!');
                                }
                    });
	                // res.send('Book has been saved with file!')
	            });
        	})
		}

		else {
            console.log('write something');
            res.redirect('/upload');
        }
        // var guille = new Person({ name: 'Guillermo' });
        // guille.save(function (err) {
        //   if (err) return handleError(err);
          
        //   story._creator = guille;
        //   console.log(story._creator.name);
        //   // prints "Guillermo" in mongoose >= 3.6
        //   // see https://github.com/Automattic/mongoose/wiki/3.6-release-notes
          
        //   story.save(function (err) {
        //     if (err) return handleError(err);
            
        //     Story
        //     .findOne({ title: /timex/i })
        //     .populate({ path: '_creator', select: 'name' })
        //     .exec(function (err, story) {
        //       if (err) return handleError(err);
              
        //       console.log('The creator is %s', story._creator.name)
        //       // prints "The creator is Guillermo"
        //     })
        //   })
        // })
    });
};
