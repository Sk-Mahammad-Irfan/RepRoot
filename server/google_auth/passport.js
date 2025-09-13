const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { sendWelcomeMail } = require("../emailVerify/welcomeMail");
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
          const email = profile.emails[0].value;

          let user = await User.findOne({ email });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isVerified = true;
              await user.save();
            }
          } else {
            user = await new User({
              username: profile.displayName,
              email,
              role: "student",
              googleId: profile.id,
              isVerified: true,
            }).save();

            // Sending welcome email
            await sendWelcomeMail(user.email);
          }

          // Generate token
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
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
