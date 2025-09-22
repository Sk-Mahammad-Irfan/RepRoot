const mongoose = require("mongoose");

const institutionAdminSchema = new mongoose.Schema(
  {
    name: {
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
    role: {
      type: String,
      default: "institution_admin",
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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
  },
  { timestamps: true }
);

const InstitutionAdmin = mongoose.model(
  "InstitutionAdmin",
  institutionAdminSchema
);
module.exports = InstitutionAdmin;
