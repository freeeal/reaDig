// Creating Mongoose models
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// import Review schema
// var ReviewSchema = mongoose.model('Review').schema;
var crate = require('mongoose-crate'),
    S3 = require('mongoose-crate-s3');
    // GraphicsMagic = require('mongoose-crate-gm');
var env = process.env.NODE_ENV || 'development';

var BookSchema = new Schema({

    bookName: {
    	type: String,
    	trim: true
    },
    authorName: String,
    // reviews: [ReviewSchema]
    reviews: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Review'
    }]

});

BookSchema.set('toJSON', { getters: true });

BookSchema.plugin(crate, {
  storage: new S3({
    key: 'AKIAIPEGXFB7BGWQRA3Q',
    secret: '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',
    bucket: 'readigs-bucket',
    acl: 'public-read', // defaults to public-read
    region: 'us-standard', // defaults to us-standard
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