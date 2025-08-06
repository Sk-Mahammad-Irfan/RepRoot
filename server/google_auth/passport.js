const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          // console.log(profile);

          if (!user) {
            user = await new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              role: "student",
              googleId: profile.id,
            }).save();
          }

          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
          });

          const userPayload = {
            _id: user._id,
            name: user.username,
            email: user.email,
            role: user.role,
          };

          return done(null, { ...userPayload, token });
        } catch (err) {
          console.error("Google Strategy Error:", err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};
