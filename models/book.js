// Creating Mongoose models
var config = require('../config/config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crate = require('mongoose-crate'),
    S3 = require('mongoose-crate-s3');

var BookSchema = new Schema({

    bookName: {
    	type: String,
    	trim: true
    },
    authorName: String,
    reviews: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Review'
    }]

});

BookSchema.set('toJSON', { getters: true });

BookSchema.plugin(crate, {
  storage: new S3({
    key: config.s3.key,
    secret: config.s3.secret,
    bucket: config.s3.bucket,
    acl: 'public-read', // defaults to public-read
    region: 'us-standard', // defaults to us-standard
    // path: function(attachment) { // where the file is stored in the bucket - defaults to this function
    //   return '/' + path.basename(attachment.path)
    // }
    path: function(attachment) { // where the file is stored in the bucket - defaults to this function
      return '/' + attachment.name
    }
  }),
  fields: {
    image: {}
  }
})

// export Book model
module.exports = mongoose.model('Book', BookSchema);

// datePublished: String,
// isbn: String,
// publisher: String,
// genre: String,