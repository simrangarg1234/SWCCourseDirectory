//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/swccoursedirectory";
const authRoutes = require("./routes/auth.routes");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const methodOverride = require("method-override");
const keys = require("./config/keys");
const adminRoutes = require("./routes/auth.routes");

//Database Connection
mongoose.connect(
  url,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log(err.message);
    else console.log("Successfully connected to DB!");
  }
);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

app.use(methodOverride("_method"));
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/coursedirectory/auth", authRoutes);
app.use("/coursedirectory/admin", adminRoutes);

//home page
app.get("/coursedirectory", (req, res) => {
  res.render("home", { user: req.user });
});
app.get("/", (req, res) => {
  res.redirect("/coursedirectory");
});

// Server Connection
app.listen(3000, () => {
  console.log("App now listening on port 3000");
});
