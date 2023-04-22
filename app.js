require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose
  .connect(
    process.env.MONGO_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));
  
  
  
  app.get("/", function(req,res){
    res.render("index");
  });
  
  
  app.get("/addUser", function(req,res){
    res.render("register");
  });
  app.post("/addUser", function(req,res){
    const userSchema = new mongoose.Schema({
      email: String,
      password: String
    });
    const User = new mongoose.model("User", userSchema);
    bcrypt
    .hash(req.body.password, parseInt(process.env.SALT_ROUNDS))
    .then((hash) => {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser
        .save()
        .then(() => {
          alert("User Created")
          res.render("login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  });
  
  app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      bcrypt.compare(password, foundUser.password).then((result) => {
        if (result == true) {
          res.render("secrets");
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });