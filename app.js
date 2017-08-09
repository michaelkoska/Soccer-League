var express = require("express");
var app = express();
var passport = require("passport");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var User = require("./models/newPlayer");
var Team = require("./models/newTeam");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

//method override



mongoose.connect("mongodb://localhost/league");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set("port", process.env.PORT || 3000);

app.use(require("express-session")({
	secret: "Generic Secret Password",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//landing page
app.get("/", function(req, res){
	res.render("home");
});

//Individual Player Page
app.get("/player", function(req, res){
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("player", {user: allUsers});
		}
	});
});

//Player Create Page from /player/new
app.post("/player", function(req, res){
	var newUser = new User({ username: req.body.user.username });
	User.register(newUser, req.body.user.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("new");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/player");
		});
	});
/*	User.create(req.body.user, function(err, newUser){
		if(err){
			console.log(err);
		} else {
			res.redirect("/player");
		}
	});*/
});

//Player Signup
app.get("/player/new", function(req, res){
	res.render("new");
});

//Show Teams page------------NEEDS PAGE
app.get("/team/list", function(req, res){
	Team.find().sort({ team: 1 }).exec(function(err, allTeams){
		if(err){
			console.log(err);
		} else {
			res.render("teamlist", { allTeams: allTeams } );
		}
	});
});

//Team signup page------------NEEDS PAGE
app.get("/team/new", function(req, res){
	res.render("teamRegister");
});

//Show single team roster--------------NEEDS PAGE
app.get("/team/:id", function(req, res){
	Team.findById(req.params.id, function(err, foundTeam){
		if(err){
			console.log(err);
		} else {
			res.render("teampage", { team: foundTeam } );
		}
	});
});

//Create Team---------NEEDS PAGE
app.post("/team", function(req, res){
	Team.create(req.body.team, function(err, newTeam){
		if(err){
			console.log(err);
		} else {
			res.redirect("/team/list");
		}
	});
});


//List all Players
app.get("/playerlist", function(req,res){
	User.find().sort({ lastName: 1 }).exec(function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("playerlist", { allUsers: allUsers } );
		}
	});
});

//LOGIN ROUTES
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/player",
	failureRedirect: "/login"
}), function(req, res){

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