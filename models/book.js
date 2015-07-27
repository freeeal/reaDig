// Creating Mongoose models
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({

    bookName: {
    	type: String,
    	trim: true
    },
    authorName: String,
    reviews: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Review'
    }],
    imageUrl: String

});

BookSchema.set('toJSON', { getters: true });

// export Book model
module.exports = mongoose.model('Book', BookSchema);

// datePublished: String,
// isbn: String,
// publisher: String,
// genre: String,