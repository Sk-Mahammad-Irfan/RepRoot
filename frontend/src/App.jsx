import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ChangePassword from "./pages/Auth/ChangePassword";
import PrivateRoutes from "./Routes/private";
import AdminRoute from "./Routes/AdminRoute";
import HomePage from "./pages/HomePage";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import NotApproved from "./pages/NotApproved";
import UserProfileForm from "./pages/userDetails/UserProfileForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminInstitution from "./pages/Admin/AdminInstitution";
import ApproveInstitute from "./pages/Admin/ApproveInstitute";
import OAuthCallback from "./pages/OAuthCallback";
import InstituteAdminRoute from "./Routes/InstituteAdminRoute";
import InstituteAdminDashboard from "./pages/InstituteAdmin/AdminDashboard";
import ApproveStudent from "./pages/InstituteAdmin/ApproveStudent";
import MyStudents from "./pages/InstituteAdmin/MyStudents";
import EmployerRegister from "./pages/forEmployee/EmployerRegister";
import EmployerLogin from "./pages/forEmployee/EmployerLogin";
import EmployerHomePage from "./pages/forEmployee/EmployerHomePage";
import EmployerDetailsPage from "./pages/forEmployee/EmployerDetailsPage";
import EmployerJobPost from "./pages/forEmployee/EmployerJobPost";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/not-approved" element={<NotApproved />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/verify-otp/:email" element={<VerifyOtp />} />
        <Route path="/change-password/:email" element={<ChangePassword />} />
        <Route path="/employer/register" element={<EmployerRegister />} />
        <Route path="/employer/login" element={<EmployerLogin />} />

        {/* Protected routes wrapped inside PrivateRoutes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-profile/:id" element={<UserProfileForm />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>

        {/* Admin routes wrapped inside AdminRoute */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="all-users" element={<AdminUsers />} />
          <Route path="all-instituteAdmin" element={<AdminInstitution />} />
          <Route path="approve-instituteAdmin" element={<ApproveInstitute />} />
        </Route>

        {/* Admin Institute route */}
        <Route path="/institute" element={<InstituteAdminRoute />}>
          <Route path="dashboard" element={<InstituteAdminDashboard />} />
          <Route path="students" element={<ApproveStudent />} />
          <Route path="approve-students" element={<MyStudents />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/employee/home" element={<EmployerHomePage />} />
          <Route
            path="/employee/details/:id"
            element={<EmployerDetailsPage />}
          />
        </Route>
        <Route path="/employee/post-job" element={<EmployerJobPost />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
