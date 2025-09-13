const { hashPassword, comparePassword } = require("../helper/authHelper");
const InstitutionAdmin = require("../models/institutionAdminModel");
const UserDetails = require("../models/userDetailsModel");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

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
    // console.log("Fetching user with ID:", userId);
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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
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

    userExists.username = username;
    await userExists.save();

    // Check if user already has a UserDetails entry
    const existingDetails = await UserDetails.findOne({ user: userId });

    let updatedProfile;

    if (existingDetails) {
      // Update existing
      existingDetails.userBio = userBio;
      existingDetails.userLocation = userLocation;
      existingDetails.education = education;
      updatedProfile = await existingDetails.save();
    } else {
      // Create new
      updatedProfile = await UserDetails.create({
        user: userId,
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

exports.institutionAdminAssignmentController = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { approvalStatus } = req.body;
    // console.log(institutionId, approvalStatus);

    // Validate approvalStatus
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(approvalStatus)) {
      return res.status(400).json({
        message:
          "Invalid approval status. Must be one of: pending, approved, rejected.",
      });
    }

    const updatedUser = await InstitutionAdmin.findByIdAndUpdate(
      institutionId,
      { approvalStatus },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating approval status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update approval status.",
      error,
    });
  }
};

exports.testController = (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "Test route is working this is super admin" });
  } catch (error) {
    console.error("Error in testController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in testController",
      error,
    });
  }
};
