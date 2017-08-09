var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
	name: String,
	season: String,
	captain: String,
	roster: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
});

module.exports = mongoose.model("Teams", teamSchema);