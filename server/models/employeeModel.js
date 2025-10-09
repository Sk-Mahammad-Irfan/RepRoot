const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
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
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
