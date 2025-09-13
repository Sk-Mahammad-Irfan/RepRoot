const express = require("express");
const {
  testController,
  institutionAdminAssignmentController,
} = require("../controller/userController");
const passport = require("passport");
const dotenv = require("dotenv").config();
const {
  isSuperAdmin,
  isAuthenticated,
} = require("../middlewares/authMiddlewares");

const {
  registerUserController,
  loginUserController,
  registerInstitutionController,
  forgetPasswordController,
  verifyOtpController,
  changePasswordController,
  verificationController,
} = require("../controller/authController");

const router = express.Router();

router.post("/student/register", registerUserController);
router.post("/verify", verificationController);
router.post("/login", loginUserController);

router.post("/institution/register", registerInstitutionController);

router.put(
  "/institution_admin/:institutionId",
  isAuthenticated,
  isSuperAdmin,
  institutionAdminAssignmentController
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      // console.log(req.user);
      res.redirect(
        `${process.env.CLIENT_URL}/oauth-callback?token=${
          req.user.token
        }&user=${JSON.stringify(req.user)}`
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Google authentication failed",
      });
    }
  }
);

router.get("/login/failure", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "Google authentication successful",
      user: req.user,
    });
  } else {
    res.status(403).json({ message: "User not authenticated" });
  }
});

router.post("/forgot-password", forgetPasswordController);
router.post("/verify-otp/:email", verifyOtpController);
router.post("/change-password/:email", changePasswordController);

router.get("/user-auth", isAuthenticated, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", isSuperAdmin, (req, res) => {
  return res.status(200).send({ ok: true });
});

router.get("/test", isAuthenticated, isSuperAdmin, testController);

module.exports = router;
