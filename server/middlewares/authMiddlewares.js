const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");
const verifyToken = promisify(JWT.verify);

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing or invalid",
      });
    }
    JWT.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).send({
              success: false,
              message: "Access token has expired",
            });
          }
          return res.status(401).send({
            success: false,
            message: "Access token is missing or invalid",
          });
        }
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.log("error in auth middleware:", error);
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = await verifyToken(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({
          success: false,
          message: "Access token has expired",
        });
      }
      return res.status(401).send({
        success: false,
        message: "Access token is missing or invalid",
      });
    }

    req.user = decoded;

    const user = await User.findById(req.user._id);

    if (!user || user.role !== "super_admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in super admin middleware",
      error: error.message || error,
    });
  }
};
