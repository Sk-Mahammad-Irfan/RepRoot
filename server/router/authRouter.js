const express = require("express");
const {
  registerUserController,
  loginUserController,
  testController,
  registerInstitutionController,
  institutionAdminAssignmentController,
} = require("../controller/userController");
const passport = require("passport");
const dotenv = require("dotenv").config();
const {
  requireSignIn,
  isSuperAdmin,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/student/register", registerUserController);
router.post("/login", loginUserController);
router.post("/institution/register", registerInstitutionController);

router.put(
  "/institution_admin/:institutionId",
  requireSignIn,
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
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-callback?token=${
        req.user.token
      }&user=${JSON.stringify(req.user)}`
    );
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

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isSuperAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/test", requireSignIn, isSuperAdmin, testController);

module.exports = router;
