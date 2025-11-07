const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxLength: 100,
    },
    password: {
      type: String,
      require: function () {
        // Password is required only if googleId is not provided
        return !this.googleId;
      },
      minlength: 6,
      maxlength: 128,
      trim: true,
    },
    token: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
      required: false,
    },
    otpExpiry: {
      type: Date,
      default: null,
      required: false,
    },
    role: {
      type: String,
      default: "student",
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    institution: {
      type: mongoose.ObjectId,
      ref: "InstitutionAdmin",
      required: false,
    },
    googleId: { type: String },
    profile_img: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
