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
var methodOverride = require("method-override");



mongoose.connect("mongodb://localhost/league");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//app.use("/scripts", express.static(__dirname + "assets"));
app.set("port", process.env.PORT || 3000);
app.use(methodOverride("_method"));

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

//passing user to each request
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//landing page
app.get("/", function(req, res){
	res.render("home");
});

//finds all players and lists them alphabetically
app.get("/player", function(req,res){
	User.find().sort({ lastName: 1 }).exec(function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("playerlist", { allUsers: allUsers } );
		}
	});
});

//Player Create Page from /player/new
app.post("/player", function(req, res){
	var newUser = new User({ 
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone
		});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("new");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/player/"+ currentUser._id);
		});
	});
});

//Player Signup
app.get("/player/new", function(req, res){
	res.render("new");
});

//Individual Player Page
app.get("/player/:id", function(req, res){
	User.findById(req.params.id, function(err, user){
		if(err){
			console.log(err);
		} else {
			res.render("player", {user: user});
		}
	});
});

//find user by id and allow user to edit
app.get("/player/:id/edit", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			res.redirect("/player");
		} else {
			res.render("editplayer", { user: foundUser });
		}
	});
});

//sends request to update user
app.put("/player/:id", function(req, res){
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone,
		freeAgent: req.body.freeAgent,
		captain: req.body.captain
	}
	User.findByIdAndUpdate(req.params.id, newUser, function(err, updateUser){
		if(err){
			res.redirect("/player");
		} else {
			res.redirect("/player/" + req.params.id);
		}
	});
});

//Show Teams page
app.get("/team/list", function(req, res){
	Team.find().sort({ team: 1 }).exec(function(err, allTeams){
		if(err){
			console.log(err);
		} else {
			res.render("teamlist", { allTeams: allTeams } );
		}
	});
});

//Team signup page
app.get("/team/new", isLoggedIn, function(req, res){
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

//Create Team
app.post("/team", function(req, res){
	Team.create(req.body.team, function(err, newTeam){
		if(err){
			console.log(err);
		} else {
			res.redirect("/team/list");
		}
	});
});


//LOGIN ROUTES
app.get("/login", function(req, res){
	res.render("login");
});

//logs user in
app.post("/login", passport.authenticate("local", {
	failureRedirect: "/login"
}), function(req, res){
	res.redirect("player/" + req.user._id);
});

//Logout Route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
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




//middleware

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

