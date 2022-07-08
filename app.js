//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const saltRounds = 10
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password:String
    // whatever else
});


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home")
});

app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const userName = req.body.username;
        const password = req.body.password;
 User.findOne({email:userName},(err,foundUser)=>{
    if(err){
        console.log(err);
    }
    else{
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result === true){
                res.render("secrets")}
           });

        }
    }
 })
    });

app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        
        newUser.save((err)=>{
            if (err) {
                console.log(err);
            }
            else{
                res.render("secrets")
            }
        });
    });
        

    });


app.listen(3000, () => {
    console.log("server started at port3 000");
})