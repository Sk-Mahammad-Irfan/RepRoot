const mongoose = require("mongoose");
const employeeDetailsSchema = new mongoose.Schema({
  employee: {
    type: mongoose.ObjectId,
    ref: "Employee",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  others: {
    type: String,
    trim: true,
    maxLength: 500,
  },
});

const EmployeeDetails = mongoose.model(
  "EmployeeDetails",
  employeeDetailsSchema
);
module.exports = EmployeeDetails;
