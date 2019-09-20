var express = require("express");
var router = express.Router();
var Pet = require("../models/pet");
var middleware = require("../middleware");

// INDEX - show all pets
router.get("/", function(req, res){
	// Get all pets from DB
	Pet.find({}, function(err, allPets){
		if(err){
			console.log(err);
		} else {
			res.render("pets/index",{pets:allPets});
		}
	});
});

// CREATE - add new pets to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to pets array
	var name = req.body.name;
	var age = req.body.age;
	var image = req.body.image;	
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newPet = {name: name, age: age, image: image, description: desc, author:author}
	// Create a new pet and save to DB
	Pet.create(newPet, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to pets page
			console.log(newlyCreated);
			res.redirect("/pets");
		}
	});
});

// NEW - show form to create new pets
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("pets/new");
});

// SHOW - shows more info about one pet
router.get("/:id", function(req, res){
	//find the pet with provided ID
	Pet.findById(req.params.id).populate("comments").exec(function(err, foundPet){
		if(err || !foundPet){
			req.flash("error", "Pet not found");
			res.redirect("back");
		} else {
			console.log(foundPet);
			//render show template with that pet
			res.render("pets/show", {pet: foundPet});
		}
	});
});

// EDIT PET ROUTE
router.get("/:id/edit", middleware.checkPetOwnership, function(req, res){
	Pet.findById(req.params.id, function(err, foundPet){
		res.render("pets/edit", {pet: foundPet});	
	}); 
});

// UPDATE PET ROUTE
router.put("/:id", middleware.checkPetOwnership, function(req, res){
	// find and update the correct pet
	Pet.findByIdAndUpdate(req.params.id, req.body.pet, function(err, updatedPet){
		if(err){
			res.redirect("/pets");
		} else {
			res.redirect("/pets/" + req.params.id);
		}
	})
	// redirect somewhere (show page)
});

// DESTROY PET ROUTE
router.delete("/:id", middleware.checkPetOwnership, function(req, res){
	Pet.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/pets");
		} else {
			res.redirect("/pets");
		}
	});
});


module.exports = router;