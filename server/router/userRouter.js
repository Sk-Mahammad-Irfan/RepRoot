const express = require("express");
const { getAllUsersController } = require("../controller/userController");
const { requireSignIn } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/get-users", requireSignIn, getAllUsersController);

module.exports = router;
