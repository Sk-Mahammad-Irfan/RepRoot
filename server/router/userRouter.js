const express = require("express");
const {
  getAllUsersController,
  updateUserProfileController,
  getSingleUserController,
} = require("../controller/userController");
const { requireSignIn } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/get-users", requireSignIn, getAllUsersController);

router.get("/get-user/:id", requireSignIn, getSingleUserController);

router.put("/update-user/:id", requireSignIn, updateUserProfileController);

module.exports = router;
