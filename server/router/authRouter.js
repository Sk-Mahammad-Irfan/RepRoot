const express = require("express");
const {
  registerUserController,
  loginUserController,
  testController,
  registerInstitutionController,
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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/redirect-with-user",
    failureRedirect: "/api/auth/failure",
    session: true,
  })
);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/test", requireSignIn, isSuperAdmin, testController);

module.exports = router;
