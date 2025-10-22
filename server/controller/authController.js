const { sendOtpMail } = require("../emailVerify/sendOtpMail");
const { verifyMail } = require("../emailVerify/verifyMail");
const { sendWelcomeMail } = require("../emailVerify/welcomeMail");
const { hashPassword, comparePassword } = require("../helper/authHelper");
const Employee = require("../models/employeeModel");
const InstitutionAdmin = require("../models/institutionAdminModel");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

exports.registerUserController = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "student",
    });

    const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    newUser.token = token;

    const emailResult = await verifyMail(token, email);

    if (!emailResult.success) {
      return res.status(400).json({
        success: false,
        message: `${emailResult.message}`,
      });
    }
    await newUser.save();

    await sendWelcomeMail(newUser.email);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully and verification email sent.",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: newUser.token,
      },
    });
  } catch (error) {
    console.error("❌ Error registering student:", error);

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

exports.verificationController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const user =
      (await User.findById(decoded._id)) ||
      (await InstitutionAdmin.findById(decoded._id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Email verification failed",
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
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Check approval status for institution admins
    if (
      user.role === "institution_admin" &&
      user.approvalStatus !== "approved"
    ) {
      return res.status(200).json({
        success: false,
        redirect: "not-approved",
        message: `Account is ${user.approvalStatus}. Awaiting SuperAdmin approval.`,
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    if (user.isVerified !== true) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email to login",
      });
    }
    // Generate JWT
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "Welcome " + (user.username || user.name),
        user: {
          _id: user._id,
          name: user.username || user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful" + (user.username || user.name),
      user: {
        _id: user._id,
        name: user.username || user.name,
        email: user.email,
        role: user.role,
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

exports.registerInstitutionController = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    const token = JWT.sign({ _id: institution._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    verifyMail(token, email);
    institution.token = token;

    await sendWelcomeMail(institution.email);

    await institution.save();

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

exports.forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    if (user.isVerified !== true) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before requesting OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in forgetPasswordController",
      error: error.message || error,
    });
  }
};

exports.verifyOtpController = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified !== true) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before verifying OTP",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in verifyOtp",
      error: error.message || error,
    });
  }
};

exports.changePasswordController = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    if (!newPassword || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified !== true) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before verifying OTP",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in changePasswordController",
      error: error.message || error,
    });
  }
};

exports.successGoogleLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated",
      });
    }

    // Generate JWT token for the user
    const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

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

// For Employee Registration
exports.registerEmployeeController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).send({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
    });
    await newEmployee.save();
    return res.status(201).send({
      success: true,
      message: "Employee registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registerEmployeeController",
      error,
    });
  }
};

exports.loginEmployeeController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).send({
        success: false,
        message: "Employee not found",
      });
    }

    const isMatch = await comparePassword(password, employee.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = JWT.sign({ _id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res.status(200).send({
      success: true,
      message: "Employee logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in loginEmployeeController",
      error,
    });
  }
};
