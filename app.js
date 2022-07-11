//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
    // whatever else
});
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
// passport.serializeUser(User.serializeUsers());//encrypt
// passport.deserializeUser(User.deserializeUser()); //decrypt



app.get("/", (req, res) => {
    res.render("home")
});
app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets")
    }
    else {
        res.redirect("/login")
    }
});


app.get('/logout', function(req, res, next) {
        req.logout((err)=> {
          if (err) {
             return next(err);
             }
          res.redirect('/');
        });
      });
      


app.route("/login")
    .get((req, res) => {
        res.render("login")
    })

    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                passport.authenticate("local")(req, res, () => {
                    res.render("secrets")
                })
            }

        })
    });

app.route("/register")
    .get((req, res) => {
        res.render("register")
    })

    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err)
                res.redirect("/register")
            }
            else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets")
                })
            }
        })
    });


app.listen(3000, () => {
    console.log("server started at port 3000");
})