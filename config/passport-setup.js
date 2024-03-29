const passport = require("passport");
const WindowsLiveStrategy = require("passport-outlook").Strategy;
const keys = require("./keys");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new WindowsLiveStrategy(
    {
      // options for google strategy
      clientID: keys.outlook.clientID,
      clientSecret: keys.outlook.clientSecret,
      callbackURL:
        "http://localhost:3000/coursedirectory/auth/outlook/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({ outlookID: profile.emails[0].value }).then(
        (currentUser) => {
          if (currentUser) {
            // already have this user
            console.log("user is: ", currentUser);
            done(null, currentUser);
          } else {
            // if not, create user in our db
            console.log(profile);
            new User({
              outlookID: profile.emails[0].value,
              username: profile.displayName,
            })
              .save()
              .then((newUser) => {
                console.log("created new user: ", newUser);
                done(null, newUser);
              });
          }
        }
      );
    }
  )
);
