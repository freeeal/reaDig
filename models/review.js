// Creating Mongoose models
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({

    bookName: {
        type: String,
        trim: true
    },
    reviewId: Schema.Types.ObjectId,
    reviewer: String,
    reviewBody: String,
    ratingValue: Number,
    // datePublished: {
    //     type: Date, 
    //     default: Date.now 
    // }
    aggregateRating: {
        ratingValue: Number,
        bestRating: Number,
        ratingCount: Number
    }

});

ReviewSchema.set('toJSON', { getters: true });

// export Review model
module.exports = mongoose.model('Review', ReviewSchema); 