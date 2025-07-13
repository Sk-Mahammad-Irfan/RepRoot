const { hashPassword, comparePassword } = require("../helper/authHelper");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

exports.registerUserController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Validate email domain
    const isValidAcademicEmail = (email) =>
      /\.(edu|edu\.in|ac\.in)$/i.test(email);

    if (!isValidAcademicEmail(email)) {
      return res.status(400).json({ message: "Invalid email domain" });
    }
    // Validate role
    const validRoles = ["student", "institution_admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Generate JWT token
    const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send({
      success: false,
      message: "Registration failed",
      error,
    });
  }
};

exports.loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

exports.getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch users",
      error,
    });
  }
};

exports.updateUserProfileController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.email = email;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).send({
      success: false,
      message: "Profile update failed",
      error,
    });
  }
};
