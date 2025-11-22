const express = require("express");
const {
  getJobPostsController,
  getAllJobPostsController,
  appJobController,
  getAppliedCandidatesController,
} = require("../controller/userController");
const { isAuthenticated } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.get("/get-job/:id", isAuthenticated, getJobPostsController);
router.get("/get-jobs", isAuthenticated, getAllJobPostsController);
router.post("/apply", isAuthenticated, appJobController);
router.get(
  "/applied-candidates/:jobId",
  isAuthenticated,
  getAppliedCandidatesController
);

module.exports = router;
