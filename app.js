//jshint esversion:6
require("dotenv").config(); //securing APIs and other keys.
const express =require("express");
const bodyParser =require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt= require("mongoose-encryption"); //encrypttion of password.

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

//.env trial:
console.log(process.env.API_KEY);
//connectiong t DB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//setting up the schema:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//From mongoose-encryption docs:


userSchema.plugin(encrypt, { secret: process.env.SECRET,  encryptedFields: ["password"] });


//creating a model based on the userSchema:
const User = new mongoose.model("User", userSchema);

//home page:
app.get("/", function(req,res){
  res.render("home");
});

//login page:
app.get("/login", function(req,res){
  res.render("login");
});

//optional by me:
app.get("/logout", function(req,res){
  res.render("home");
});

//register page:
app.get("/register", function(req,res){
  res.render("register");
});

//New Registration:
app.post("/register", function(req,res){
  const newUser= new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

//Logging in to the account:

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server active on Port 3000.");
});
