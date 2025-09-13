const express = require("express");
const {
  getAllUsersController,
  updateUserProfileController,
  getSingleUserController,
} = require("../controller/userController");
const {
  isAuthenticated,
  isSuperAdmin,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/get-users", isAuthenticated, isSuperAdmin, getAllUsersController);

router.get("/get-user/:id", isAuthenticated, getSingleUserController);

router.put("/update-user/:id", isAuthenticated, updateUserProfileController);

module.exports = router;
