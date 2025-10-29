const express = require("express");
const {
  getAllUsersController,
  updateUserProfileController,
  getSingleUserController,
  getAllInstitutionAdminController,
  approveStatusController,
  deleteUserController,
  approveStudentStatusController,
  getAllApprovedStudentsByInstitutionAdmin,
  createEmployeeDetailsController,
  getEmployeeDetailsController,
  createJobPostController,
} = require("../controller/userController");
const {
  isAuthenticated,
  isSuperAdmin,
  isInstitutionAdmin,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/get-users", isAuthenticated, isSuperAdmin, getAllUsersController);
router.get(
  "/get-institute_admin",
  isAuthenticated,
  isSuperAdmin,
  getAllInstitutionAdminController
);

router.get("/get-user/:id", isAuthenticated, getSingleUserController);

router.put("/update-user/:id", isAuthenticated, updateUserProfileController);

router.put(
  "/instAdmin-status/:instituteAdminId",
  isAuthenticated,
  isSuperAdmin,
  approveStatusController
);

router.post(
  "/student/approve-student",
  isInstitutionAdmin,
  approveStudentStatusController
);

router.delete(
  "/delete-user/:uid",
  isAuthenticated,
  isSuperAdmin,
  deleteUserController
);

router.get(
  "/student/my-students",
  isInstitutionAdmin,
  getAllApprovedStudentsByInstitutionAdmin
);

router.post(
  "/create-employee-details/:id",
  isAuthenticated,
  createEmployeeDetailsController
);

router.get("/get-employee/:id", isAuthenticated, getEmployeeDetailsController);

router.post("/create-job-post", isAuthenticated, createJobPostController);

module.exports = router;
