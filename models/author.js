// // Creating Mongoose models
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// // import Book schema
// var BookSchema = mongoose.model('Book').schema;

// var AuthorSchema = new Schema({

//     // authorId: Schema.Types.ObjectId,
//     authorName: String,
//     books: [BookSchema]
//     // books: [{type: Schema.Types.ObjectId, ref: 'Book'}]

// });

// AuthorSchema.set('toJSON', { getters: true });

// // export Author schema
// module.exports = mongoose.model('Author', AuthorSchema);