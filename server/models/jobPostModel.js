const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    companyName: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
    experienceRequired: {
      type: String,
      enum: ["entry", "mid", "senior"],
      required: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    salary: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    educationLevel: {
      type: String,
      enum: ["high-school", "associate", "bachelor", "master"],
      required: true,
    },
  },
  { timestamps: true }
);
const JobPost = mongoose.model("JobPost", jobPostSchema);
module.exports = JobPost;
