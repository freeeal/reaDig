// this registers Schema globally (Schema: used so that an app understands how to map data from MongoDB into JS objects
// Schema is part of an application, has nothing to do with database.

// Creating Mongoose Model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
// Local Authentication Strategy of Passport and authenticate the users against a 
// locally configured Mongo DB instance, storing the user details in the database.
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({

	local            : {
		id 			 : String, 
		username	 : String,
		password     : String,
        email        : String,
        firstName	 : String,
   		lastName	 : String
    },
    facebook         : {
        id           : String,
        token        : String,
        fullName	 : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        username     : String,
        fullName     : String
    },
    google           : {
        id           : String,
        token        : String,
        email	     : String,
        fullName	 : String
    }

});

// Set the 'fullName' virtual property for local acct
UserSchema.virtual('local.fullName').get(function() {
	return this.local.firstName + ' ' + this.local.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.local.firstName = splitName[0] || '';
	this.local.lastName = splitName[1] || '';
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

UserSchema.set('toJSON', { getters: true, virtuals: true});	// forces Mongoose to include getters (def: which modify existing data before outputting the documents to the next layer)
// when converting the MongoDB document to a JSON representation and will allow the output of documents using res.json()
// to include the getter's behavior


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

	


	// email: {
	// 	type: String,
	// 	match: [/.+\@.+\..+/, "Please fill in valid email address."],
	// 	// This match validator ensures email field value matches the given regex expression
	// 	// thus preventing the saving of any document where the email does not conform to the right pattern'
	// },


// // Find possible not used username
// UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
// 	var _this = this;

// 	// Add a 'username' suffix
// 	var possibleUsername = username + (suffix || '');

// 	// Use the 'User' model 'findOne' method to find an available unique username
// 	_this.findOne({
// 		username: possibleUsername
// 	}, function(err, user) {
// 		// If an error occurs call the callback with a null value, otherwise find find an available unique username
// 		if (!err) {
// 			// If an available unique username was found call the callback method, otherwise call the 'findUniqueUsername' method again with a new suffix
// 			if (!user) {
// 				callback(possibleUsername);
// 			} else {
// 				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
// 			}
// 		} else {
// 			callback(null);
// 		}
// 	});
// };
