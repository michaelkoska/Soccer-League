var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Player = require("./models/newPlayer");

mongoose.connect("mongodb://localhost/league");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set("port", process.env.PORT || 3000);


//landing page
app.get("/", function(req, res){
	res.render("home");
});

//Individual Player Page
app.get("/player", function(req, res){
	Player.find({}, function(err, allPlayers){
		if(err){
			console.log(err);
		} else {
			res.render("player", {player: allPlayers});
		}
	});
});

//Player Create Page from /player/new
app.post("/player", function(req, res){
	Player.create(req.body.player, function(err, newPlayer){
		if(err){
			console.log(err);
		} else {
			res.redirect("/player")
		}
	});
});

//Player Signup
app.get("/player/new", function(req, res){
	res.render("new");
});

//Show Teams page------------NEEDS PAGE
app.get("/teamslist", function(req, res){
	res.render("teamslist");
});

//Show single team roster--------------NEEDS PAGE
app.get("/team/:id", function(req, res){
	res.render("teampage");
});

//Team signup page------------NEEDS PAGE
app.get("/team/new", function(req, res){
	res.render("teamRegister")
})

//Create Team---------NEEDS PAGE
app.post("/team", function(req, res){
	Team.create(req.body.team, function(err, newTeam){
		if(err){
			console.log(err);
		} else {
			res.redirect("/team/id")
		}
	});
});


//List all Players
app.get("/playerlist", function(req,res){
	Player.find().sort({ lastName: 1 }).exec(function(err, allPlayers){
		if(err){
			console.log(err);
		} else {
			res.render("playerlist", { allPlayers: allPlayers } );
		}
	});
});

//Rules
app.get("/rules", function(req, res){
	res.render("rules");
});

//Schedule
app.get("/schedule", function(req, res){
	res.render("schedule");
});

//Error handling pages
app.use(function(req, res, next){
	res.status(404);
	res.render("404");
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.render("500");
});


app.listen(app.get("port"), function(){
	console.log("Server is running on " + app.get("port"));
});