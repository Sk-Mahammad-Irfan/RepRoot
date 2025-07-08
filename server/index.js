const express = require("express");
const authRoutes = require("./router/authRouter");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the RepRoot API");
});

//app listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
