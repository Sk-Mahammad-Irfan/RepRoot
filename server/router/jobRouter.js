const express = require("express");
const { getJobPostsController, getAllJobPostsController } = require("../controller/userController");
const { isAuthenticated } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.get("/get-job/:id", isAuthenticated, getJobPostsController);
router.get("/get-jobs", isAuthenticated, getAllJobPostsController);

module.exports = router;
