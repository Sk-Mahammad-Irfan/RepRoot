const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  userBio: {
    type: String,
    trim: true,
    minLength: 10,
    maxLength: 150,
    required: true,
  },
  userLocation: { type: String, trim: true, maxLength: 100, required: true },

  education: [
    {
      level: {
        type: String,
        enum: ["School", "Undergraduate", "Postgraduate"],
        required: true,
      },
      institutionName: {
        type: String,
        trim: true,
        maxLength: 100,
        required: true,
      },
      institutionLocation: {
        type: String,
        trim: true,
        maxLength: 100,
        required: true,
      },
      startYear: { type: Number, min: 1900, max: currentYear, required: true },
      endYear: { type: Number, min: 1900, max: currentYear, required: true },
      degree: {
        type: String,
        trim: true,
        maxLength: 100,
        required: function () {
          return this.level !== "School";
        },
      },
      degreeSource: {
        type: String,
        enum: ["predefined", "custom"],
        default: "predefined",
      },
    },
  ],
});

userDetailsSchema.path("education").validate(function (educations) {
  return educations.every((edu) => edu.startYear <= edu.endYear);
}, "Education startYear must be less than or equal to endYear");

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;
