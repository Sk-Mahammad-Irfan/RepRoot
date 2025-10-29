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
    experienceRequired: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    employmentType: {
      type: String,
      enum: ["permanent", "temporary", "contract"],
      required: true,
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
