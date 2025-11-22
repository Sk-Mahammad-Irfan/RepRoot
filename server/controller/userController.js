const EmployeeDetails = require("../models/employeeDetailsModel");
const Employee = require("../models/employeeModel");
const InstitutionAdmin = require("../models/institutionAdminModel");
const JobPost = require("../models/jobPostModel");
const UserDetails = require("../models/userDetailsModel");
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

exports.getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-googleId -otp -otpExpiry -profile_img -token -password"
    );

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
    const user =
      (await User.findById(userId).populate("institution", "name")) ||
      (await InstitutionAdmin.findById(userId));

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
        username: user.username || user.name,
        email: user.email,
        role: user.role,
        institute: user.institution?.name || null,
        profile_img: user.profile_img,
        skillSet: user.skillSet,
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
    const { username, userBio, userLocation } = req.body;

    let { education, skillSet } = req.body;
    const userId = req.params.id;

    console.log(skillSet);

    if (typeof education === "string") education = JSON.parse(education);
    if (typeof skillSet === "string") skillSet = JSON.parse(skillSet);

    if (!username || !userBio || !userLocation || !Array.isArray(education)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(skillSet)) {
      return res.status(400).json({ message: "skillSet must be an array" });
    }

    if (skillSet.some((s) => !s.trim())) {
      return res.status(400).json({ message: "Skill fields cannot be empty" });
    }

    if (skillSet.some((s) => s.length > 50)) {
      return res.status(400).json({
        message: "Each skill must be under 50 characters",
      });
    }

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
        startYear > currentYear + 10 ||
        endYear < 1900 ||
        endYear > currentYear + 10 ||
        startYear > endYear
      ) {
        return res
          .status(400)
          .json({ message: "Invalid startYear or endYear" });
      }
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });

      userExists.profile_img = result.secure_url;

      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }

    userExists.username = username;
    await userExists.save();

    const existingDetails = await UserDetails.findOne({ user: userId });

    let updatedProfile;

    if (existingDetails) {
      existingDetails.userBio = userBio;
      existingDetails.userLocation = userLocation;
      existingDetails.education = education;
      existingDetails.skillSet = skillSet;
      updatedProfile = await existingDetails.save();
    } else {
      updatedProfile = await UserDetails.create({
        user: userId,
        userBio,
        userLocation,
        education,
        skillSet,
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

exports.getAllInstitutionAdminController = async (req, res) => {
  try {
    const users = await InstitutionAdmin.find({});
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

exports.approveStatusController = async (req, res) => {
  try {
    const { instituteAdminId } = req.params;
    const { approvalStatus } = req.body;
    const status = await InstitutionAdmin.findByIdAndUpdate(
      instituteAdminId,
      { approvalStatus },
      { new: true }
    );
    res.json(status);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to approve institution admin",
      error,
    });
  }
};

exports.approveStudentStatusController = async (req, res) => {
  const { email } = req.body;
  const institutionAdminId = req.user._id;

  try {
    const institutionAdmin = await InstitutionAdmin.findById(
      institutionAdminId
    );
    // console.log(institutionAdmin);
    if (!institutionAdmin) {
      return res.status(404).send({
        success: false,
        message: "InstitutionAdmin not found",
      });
    }

    if (institutionAdmin.approvalStatus !== "approved") {
      return res.status(400).send({
        success: false,
        message: "Institute Admin is not approved",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.approvalStatus === "approved") {
      return res.status(400).send({
        success: false,
        message: "User is already approved",
      });
    }

    user.institution = institutionAdmin._id;
    user.approvalStatus = "approved";
    user.isVerified = true;
    await user.save();

    res.status(200).send({
      success: true,
      message: "User approved and institution set",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to approve right now",
      error,
    });
  }
};

exports.deleteUserController = async (req, res) => {
  try {
    await InstitutionAdmin.findByIdAndDelete(req.params.uid);
    await User.findByIdAndDelete(req.params.uid);

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to delete user",
      error,
    });
  }
};

exports.getAllApprovedStudentsByInstitutionAdmin = async (req, res) => {
  try {
    const instituteAdminId = req.user._id;
    const instituteAdmin = await InstitutionAdmin.findById(instituteAdminId);
    if (!instituteAdmin) {
      return res.status(404).send({
        success: false,
        message: "InstitutionAdmin not found",
      });
    }
    const users = await User.find({
      institution: instituteAdminId,
      approvalStatus: "approved",
    });
    res.status(200).send({
      success: true,
      message: "Approved students fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to fetch users",
      error,
    });
  }
};

exports.createEmployeeDetailsController = async (req, res) => {
  try {
    const { companyName, description, others } = req.body;

    if (!companyName || !description || others == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const empId = req.params.id;
    const userExists = await Employee.findById(empId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    userExists.companyName = companyName;
    await userExists.save();

    const existingEmpDetails = await EmployeeDetails.findOne({
      employee: empId,
    });

    let updatedEmpDetails;
    if (existingEmpDetails) {
      existingEmpDetails.companyName = companyName;
      existingEmpDetails.description = description;
      existingEmpDetails.others = others;
      updatedEmpDetails = await existingEmpDetails.save();
    } else {
      updatedEmpDetails = await EmployeeDetails.create({
        employee: empId,
        companyName,
        description,
        others,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Employee details created successfully",
      employeeDetails: updatedEmpDetails,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to create employee details",
      error,
    });
  }
};

exports.getEmployeeDetailsController = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeDetails = await EmployeeDetails.findOne({
      employee: employeeId,
    });
    if (!employeeDetails) {
      return res.status(404).json({ message: "Employee details not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Employee details fetched successfully",
      employeeDetails,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to fetch employee details",
      error,
    });
  }
};

exports.createJobPostController = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      employmentType,
      experienceLevel,
      industry,
      requiredSkills,
      applicationDeadline,
      educationLevel,
      salary,
    } = req.body;

    const employerId = req.params.id;

    if (
      !title ||
      !description ||
      !location ||
      !employmentType ||
      !experienceLevel ||
      !industry ||
      !requiredSkills ||
      !applicationDeadline ||
      !educationLevel ||
      !salary
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const employeeDetails = await EmployeeDetails.findOne({
      employee: employerId,
    }).lean();

    const companyName = employeeDetails?.companyName || null;

    if (!companyName) {
      return res.status(500).send({
        success: false,
        message: "Company name is missing",
      });
    }

    const jobPost = await JobPost.create({
      employer: employerId,
      title,
      description,
      location,
      experienceRequired: experienceLevel,
      employmentType,
      salary,
      requiredSkills,
      applicationDeadline,
      educationLevel,
      industry,
      ...(companyName && { companyName }),
    });

    return res.status(201).json({
      success: true,
      message: "Job post created successfully",
      jobPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create job post",
      error: error.message,
    });
  }
};

exports.getJobPostsController = async (req, res) => {
  try {
    const empId = req.params.id;
    const jobPosts = await JobPost.find({ employer: empId }).populate(
      "employer",
      " name email "
    );
    if (!jobPosts) {
      return res.status(404).json({ message: "No job posts found" });
    }
    const jobDetails = await JobPost.find({ _id: empId });
    if (!jobDetails) {
      return res.status(404).json({ message: "No job details found" });
    }

    return res.status(200).json({
      success: true,
      message: "Job posts fetched successfully",
      jobPosts,
      jobDetails,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to fetch job posts",
      error,
    });
  }
};

exports.getAllJobPostsController = async (req, res) => {
  try {
    const jobPosts = await JobPost.find({});
    if (!jobPosts) {
      return res.status(404).json({ message: "No job posts found" });
    }
    return res.status(200).json({
      success: true,
      message: "Job posts fetched successfully",
      jobPosts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to fetch job posts",
      error,
    });
  }
};

exports.appJobController = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    if (!jobId || !userId) {
      return res.status(400).json({
        success: false,
        message: "jobId and userId are required.",
      });
    }

    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.appliedCandidates.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }
    job.appliedCandidates.push(userId);
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Successfully applied for the job.",
      job,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to apply",
      error,
    });
  }
};

exports.getAppliedCandidatesController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required.",
      });
    }

    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (!job.appliedCandidates || job.appliedCandidates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No candidates have applied yet.",
        candidates: [],
      });
    }

    const candidates = await User.find({
      _id: { $in: job.appliedCandidates },
    }).select("-password -googleId -otp -otpExpiry -token");

    const candidateDetails = await UserDetails.find({
      user: { $in: job.appliedCandidates },
    });

    const mergedCandidates = candidates.map((user) => {
      const details = candidateDetails.find(
        (detail) => detail.user.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        details: details || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Applied candidates fetched successfully.",
      totalCandidates: mergedCandidates.length,
      candidates: mergedCandidates,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to get candidates name",
      error,
    });
  }
};

exports.getAllEmployeeController = async (req, res) => {
  try {
    const employee = await Employee.find({}).select("-password");

    res.status(200).send({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to get employee",
      error,
    });
  }
};

exports.approveEmployeeStatusController = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { approvalStatus } = req.body;
    const status = await Employee.findByIdAndUpdate(
      employeeId,
      { approvalStatus },
      { new: true }
    );
    res.json(status);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to approve institution admin",
      error,
    });
  }
};

exports.deleteEmployeeController = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.uid);

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Unable to delete user",
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
