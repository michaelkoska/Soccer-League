var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	user: String,
	password: String,
	phone: String,
	freeAgent: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model("Player", playerSchema);