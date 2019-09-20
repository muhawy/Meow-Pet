var express 	= require("express"),
	app 	    = express(),
	bodyParser  = require("body-parser"),
	mongoose	= require("mongoose")

mongoose.connect("mongodb://localhost/pet_meow", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var petSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Pet = mongoose.model("Pet", petSchema);

// Pet.create(
// 	{
// 		name: "KochengItam", 
// 		image: "https://svaspets.com/wp-content/uploads/2018/11/cat-250x250.jpg"
// 	}, function(err, pet){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED PET: ");
// 			console.log(pet);
// 		}
// 	});


var pets = [
		{name: "KochengOren", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/250px-Cat03.jpg"},
		{name: "Gely", image: "http://www.gocatrescue.org/wp-content/uploads/2018/12/cat-in-the-christmas-tree-250x250.jpg"},
		{name: "Micik", image: "https://svaspets.com/wp-content/uploads/2018/11/cat-250x250.jpg"},
		{name: "KochengOren", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/250px-Cat03.jpg"},
		{name: "Gely", image: "http://www.gocatrescue.org/wp-content/uploads/2018/12/cat-in-the-christmas-tree-250x250.jpg"},
		{name: "Micik", image: "https://svaspets.com/wp-content/uploads/2018/11/cat-250x250.jpg"},
		{name: "Gely", image: "http://www.gocatrescue.org/wp-content/uploads/2018/12/cat-in-the-christmas-tree-250x250.jpg"},
		{name: "Micik", image: "https://svaspets.com/wp-content/uploads/2018/11/cat-250x250.jpg"}
	];

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/pets", function(req, res){
	// Get all pets from DB
	Pet.find({}, function(err, allPets){
		if(err){
			console.log(err);
		} else {
			res.render("pets",{pets:allPets});
		}
	});
});

app.post("/pets", function(req, res){
	// get data from form and add to pets array
	var name = req.body.name;
	var image = req.body.image;
	var newPet = {name: name, image: image}
	// Create a new pet and save to DB
	Pet.create(newPet, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to pets page
			res.redirect("/pets");
		}
	});
});

app.get("/pets/new", function(req, res){
	res.render("new.ejs");
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
