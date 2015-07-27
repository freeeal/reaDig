// ROUTER THAT HANDLES ALL SECURE PAGES, WHERE USER IS AUTHENTICATED
var Review = require('../models/review');
var Book = require('../models/book');
var User = require('../models/user');

// CONFIGURE THE MULTER ===============================================
  /*
    Multer handles parsing multipart/form-data requests.
    This instance is configured to store images in memory and re-name to avoid
    conflicting with existing objects. This makes it straightforward to upload
    to Cloud Storage.
  */
  // [START multer]
var config = require('../config/config');
var fs = require('fs');
var multer = require('multer'),
    s3 = require('multer-s3'),
    upload = multer({
    storage: s3({
        accessKeyId: config.s3.key,
        secretAccessKey: config.s3.secret,
        bucket: config.s3.bucket,
        acl: 'public-read', // defaults to public-read
        region: 'us-east-1', // defaults to us-standard
        dirname: 'uploads/book-photos'
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

    router.use(passport.authenticate('bearer', { session: false }));

    router.use(function(req, res, next) {
        fs.appendFile('logs.txt', req.path + " token: " + req.query.access_token + "\n",
        function(err) {
            next();
        });
    });

    // make secured admin route for uploading books to database (add "?access_token=559c8615e43c90302256d46d" to route)
    router.get('/upload', function(req, res) {
        res.render('admin-uploads', { 
            user : req.user
        }); 
    });

    router.post('/upload', upload.single('bookPhoto'), function(req, res, next) {
        console.log(req.file);
        console.log(req.body);

        var newBook = new Book();
        newBook.bookName = req.body.bookName;
        newBook.authorName = req.body.authorName;
        newBook.bookPhoto = req.file;
        console.log(newBook.bookPhoto)
        if (process.env.NODE_ENV === 'dev') {
            newBook.imageUrl = 'https://s3.amazonaws.com/readigs-bucket-dev/' + req.file.key;
            console.log(newBook.imageUrl);
        }
        else {
            newBook.imageUrl = 'https://s3.amazonaws.com/readigs-bucket' + req.file.key;
            console.log(newBook.imageUrl);
        }
        newBook.save(function(err) {
            if(err) return next(err);
            res.send('Book has been saved with file!')
        });

    });
};