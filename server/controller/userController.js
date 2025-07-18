const { hashPassword, comparePassword } = require("../helper/authHelper");
const InstitutionAdmin = require("../models/institutionAdminModel");
const UserDetails = require("../models/userDetailsModel");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

exports.registerUserController = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate academic email domain
    const isValidAcademicEmail = (email) =>
      /\.(edu|edu\.in|ac\.in)$/i.test(email);

    if (!isValidAcademicEmail(email)) {
      return res.status(400).json({ message: "Invalid academic email domain" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with role "student"
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering student:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message || error,
    });
  }
};

exports.loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check both collections
    let user = await User.findOne({ email: normalizedEmail });
    let role = "student";

    if (!user) {
      user = await InstitutionAdmin.findOne({ email: normalizedEmail });
      role = "institution_admin";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check approval status for institution admins
    if (role === "institution_admin" && user.approvalStatus !== "approved") {
      return res.status(200).json({
        success: false,
        redirect: "not-approved",
        message: `Account is ${user.approvalStatus}. Awaiting SuperAdmin approval.`,
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = JWT.sign({ _id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.username || user.name,
        email: user.email,
        role,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message || error,
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

exports.getSingleUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching user with ID:", userId);
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    const userDetails = await UserDetails.findOne({ user: userId });

    res.status(200).send({
      success: true,
      message: "User and userDetails fetched successfully",
      user,
      userDetails,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch user",
      error,
    });
  }
};

exports.updateUserProfileController = async (req, res) => {
  try {
    const { username, userBio, userLocation, education = [] } = req.body;
    const userId = req.params.id;

    // Basic validation
    if (
      !username ||
      !userBio ||
      !userLocation ||
      !Array.isArray(education) ||
      education.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each education entry
    const currentYear = new Date().getFullYear();
    for (const edu of education) {
      const {
        level,
        institutionName,
        institutionLocation,
        startYear,
        endYear,
        degree,
      } = edu;

      if (
        !level ||
        !institutionName ||
        !institutionLocation ||
        !startYear ||
        !endYear
      ) {
        return res.status(400).json({ message: "Incomplete education entry" });
      }

      if (level !== "School" && !degree) {
        return res
          .status(400)
          .json({ message: "Degree is required for non-School levels" });
      }

      if (
        startYear < 1900 ||
        startYear > currentYear ||
        endYear < 1900 ||
        endYear > currentYear ||
        startYear > endYear
      ) {
        return res
          .status(400)
          .json({ message: "Invalid startYear or endYear" });
      }
    }

    // Check if user exists in User collection
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a UserDetails entry
    const existingDetails = await UserDetails.findOne({ user: userId });

    let updatedProfile;

    if (existingDetails) {
      // Update existing
      existingDetails.username = username;
      existingDetails.userBio = userBio;
      existingDetails.userLocation = userLocation;
      existingDetails.education = education;
      updatedProfile = await existingDetails.save();
    } else {
      // Create new
      updatedProfile = await UserDetails.create({
        user: userId,
        username,
        userBio,
        userLocation,
        education,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userDetails: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message || error,
    });
  }
};

exports.registerInstitutionController = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate academic email domain
    const isValidAcademicEmail = (email) =>
      /\.(edu|edu\.in|ac\.in)$/i.test(email);

    if (!isValidAcademicEmail(email)) {
      return res.status(400).json({ message: "Invalid academic email domain" });
    }

    // Check if institution already exists
    const existingInstitution = await InstitutionAdmin.findOne({ email });
    if (existingInstitution) {
      return res
        .status(400)
        .json({ message: "Institution with this email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create institution admin
    const institution = await InstitutionAdmin.create({
      name,
      email,
      password: hashedPassword,
      role: "institution_admin",
    });

    return res.status(201).json({
      success: true,
      message:
        "Institution registered successfully. Awaiting approval by SuperAdmin.",
      institution: {
        _id: institution._id,
        name: institution.name,
        email: institution.email,
        role: institution.role,
        approvalStatus: institution.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Error registering institution:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Institution registration failed",
      error: error.message || error,
    });
  }
};

exports.successGoogleLogin = async (req, res) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated",
      });
    }

    // Generate JWT token for the user
    const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create user object with token
    const userWithToken = {
      ...(typeof req.user.toObject === "function"
        ? req.user.toObject()
        : req.user),
      token: token,
    };

    res.status(200).send({
      success: true,
      message: "success login using google",
      user: userWithToken,
    });
  } catch (error) {
    console.error("Error in successGoogleLogin:", error);
    res.status(500).send({
      success: false,
      message: "Error in successGoogleLogin",
      error: error.message || error,
    });
  }
};

exports.failureGoogleLogin = async (req, res) => {
  try {
    res.status(401).send({
      success: false,
      message: "failure login using google",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in failureGoogleLogin",
      error,
    });
  }
};

exports.testController = (req, res) => {
  res.status(200).send({ message: "Test route is working" });
};
