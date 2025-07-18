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
      validate: {
        validator: function (e) {
          return /\.(edu|edu\.in|ac\.in)$/i.test(e);
        },
        message: (props) => `${props.value} is not a valid academic email.`,
      },
      maxLength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
      trim: true,
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
      ref: "Institution",
      required: false,
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
