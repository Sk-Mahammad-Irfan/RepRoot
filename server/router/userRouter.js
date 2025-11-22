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
  getAllEmployeeController,
  deleteEmployeeController,
  approveEmployeeStatusController,
} = require("../controller/userController");
const {
  isAuthenticated,
  isSuperAdmin,
  isInstitutionAdmin,
  isEmployee,
} = require("../middlewares/authMiddlewares");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/get-users", isAuthenticated, isSuperAdmin, getAllUsersController);

router.get(
  "/get-employees",
  isAuthenticated,
  isSuperAdmin,
  getAllEmployeeController
);

router.get(
  "/get-institute_admin",
  isAuthenticated,
  isSuperAdmin,
  getAllInstitutionAdminController
);

router.get("/get-user/:id", getSingleUserController);

router.put(
  "/update-user/:id",
  isAuthenticated,
  upload,
  updateUserProfileController
);

router.put(
  "/instAdmin-status/:instituteAdminId",
  isAuthenticated,
  isSuperAdmin,
  approveStatusController
);

router.put(
  "/employee-status/:employeeId",
  isAuthenticated,
  isSuperAdmin,
  approveEmployeeStatusController
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

router.delete(
  "/delete-employee/:uid",
  isAuthenticated,
  isSuperAdmin,
  deleteEmployeeController
);

router.get(
  "/student/my-students",
  isInstitutionAdmin,
  getAllApprovedStudentsByInstitutionAdmin
);

router.put(
  "/create-employee-details/:id",
  isAuthenticated,
  isEmployee,
  createEmployeeDetailsController
);

router.get(
  "/get-employee/:id",
  isAuthenticated,
  isEmployee,
  getEmployeeDetailsController
);

router.post(
  "/create-job-post/:id",
  isAuthenticated,
  isEmployee,
  createJobPostController
);

module.exports = router;
