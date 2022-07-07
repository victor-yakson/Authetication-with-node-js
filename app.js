//jshint esversion:6
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })


const userSchema = mongoose.Schema({
    email: String,
    password: String
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
            if(foundUser.password === password){
                res.render("secrets")
            }
            else{
                res.send("wrong password")
            }

        }
    }
 })
    });

app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save((err)=>{
            if (err) {
                console.log(err);
            }
            else{
                res.render("secrets")
            }
        })

    });


app.listen(3000, () => {
    console.log("server started at port3 000");
})