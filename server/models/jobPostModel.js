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
      enum: ["Full-time", "Part-time", "Contract"],
      required: true,
    },
    experienceRequired: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level"],
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
      required: true,
    },
    appliedCandidates: {
      type: [String],
    },
  },
  { timestamps: true }
);
const JobPost = mongoose.model("JobPost", jobPostSchema);
module.exports = JobPost;
