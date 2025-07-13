const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  userBio: {
    type: String,
    trim: true,
    default: "No bio provided",
    maxLength: 150,
    required: true,
  },
  userLocation: {
    type: String,
    trim: true,
    default: "Unknown",
    maxLength: 100,
    required: true,
  },
  userSchoolName: {
    type: String,
    trim: true,
    default: "Not specified",
    maxLength: 100,
    required: true,
  },
  userSchoolLocation: {
    type: String,
    trim: true,
    default: "Unknown",
    maxLength: 100,
    required: true,
  },
  userSchoolStartYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
    default: new Date().getFullYear(),
    required: true,
  },
  userSchoolEndYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
    default: new Date().getFullYear(),
    required: true,
  },
});
