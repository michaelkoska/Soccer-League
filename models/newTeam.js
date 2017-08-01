var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
	name: String,
	season: String,
	roster: [
		type: mongoose.Schema.Types.ObjectId,
		ref: "Player"
	]
});

module.exports = mongoose.model("Teams", teamSchema);