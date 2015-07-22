// Creating Mongoose models
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({

    bookName: {         // to add: use book below as ref
        type: String,
        trim: true
    },
    authorName: String,
    imageUrl: String,
    reviewId: Schema.Types.ObjectId,
    reviewer: String,
    reviewBody: String,
    ratingValue: Number,
    datePublished: {
        type: Date, 
        default: Date.now()
    }
    // aggregateRating: {
    //     ratingValue: Number,
    //     bestRating: Number,
    //     ratingCount: Number
    // }

});

ReviewSchema.set('toJSON', { getters: true });

// export Review model
module.exports = mongoose.model('Review', ReviewSchema); 