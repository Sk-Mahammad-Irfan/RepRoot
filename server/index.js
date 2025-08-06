const express = require("express");
const authRoutes = require("./router/authRouter");
const userRoutes = require("./router/userRouter");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./google_auth/passport")(passport);
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 8080;

connectDB();

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the RepRoot API");
});

//app listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
