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
var multer = require('multer');
// var upload = multer({
//     inMemory: true, // populate the buffer
//     fileSize: 5 * 1024 * 1024, // no larger than 5mb
//     dest: './public/images/book-photos/',
//     rename: function(fieldname, filename) {
//       // generate a unique filename
//       return filename+Date.now();
//       // return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
//     },
//     onFileUploadStart: function(file) {
//         console.log('Starting file upload process.');
//         if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//             return false;
//         }
//     },
//     onFileUploadComplete: function(file) {
//         console.log(file.fieldname + ' uploaded to  ' + file.path);
//         done = true;
//     }
// });
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


module.exports = function(router, passport){

    // router.use(passport.authenticate('bearer', { session: false }));
    // router.get('/testAPI', function(req, res) {
    //  res.json({SecretData: 'abc123'});   
    // })
    // make admin.js route
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
            newBook.attach('image', req.file, function(err) {
                if(err) return next(err);
                newBook.save(function(err) {
                    if(err) return next(err);
                    res.send('Book has been saved with file!')
                });
            })

    });
};