var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	phone: String,
	freeAgent: {
		type: Boolean,
		default: true
	},
	captain: {
		type: Boolean,
		default: false
	},
	hasInvite: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Teams"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);