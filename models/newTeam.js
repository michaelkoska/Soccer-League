var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
	name: String,
	season: String,
	captain: String, //needs to be referenced instead
	roster: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	captainId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Teams", teamSchema);