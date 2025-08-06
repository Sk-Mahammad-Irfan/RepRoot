const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// exports.isInstitutionAdmin = async (req, res, next) => {
//   try {
//     if (req.user.role !== "institution_admin") {
//       return res.status(403).json({
//         message:
//           "Access denied. You do not have permission to perform this action.",
//       });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

exports.isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "super_admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      // console.log(user.role);
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
