const mongoose = require("mongoose");

const institutionAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (e) {
        return /\.(edu|edu\.in|ac\.in)$/i.test(e);
      },
      message: (props) => `${props.value} is not a valid academic email.`,
    },
  },
  password: {
    type: String,
    required: true,
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
});

const InstitutionAdmin = mongoose.model(
  "InstitutionAdmin",
  institutionAdminSchema
);
module.exports = InstitutionAdmin;
