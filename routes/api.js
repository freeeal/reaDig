// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');
var User = require('../models/user');
var multer = require('multer'); // for parsing multipart/form-data
// var s3 = require('multer-s3');
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

	// router.use(passport.authenticate('bearer', { session: false }));
	// router.get('/testAPI', function(req, res) {
	// 	res.json({SecretData: 'abc123'});	
	// })
	// make admin.js route
    router.get('/upload', function(req, res) {
        res.render('admin-uploads', { 
            user : req.user,                 // get the user out of session and pass to template
            // // message : req.flash('message'),
            book : req.book
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
	                if(err) return next(err);
	                res.send('Book has been saved with file!')
	            });
        	})
		}

		else {
            console.log('write something');
            res.redirect('/upload');
        }
        
    });
};
