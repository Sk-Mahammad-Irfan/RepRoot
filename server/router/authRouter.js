const express = require("express");
const {
  registerUserController,
  loginUserController,
} = require("../controller/userController");
const { requireSignIn } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
