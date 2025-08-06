import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PrivateRoutes from "./Routes/private";
import AdminRoute from "./Routes/AdminRoute";
import HomePage from "./pages/HomePage";
import NotApproved from "./pages/NotApproved";
import UserProfileForm from "./pages/userDetails/UserProfileForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/not-approved" element={<NotApproved />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* Protected routes wrapped inside PrivateRoutes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-profile/:id" element={<UserProfileForm />} />
        </Route>

        {/* Admin routes wrapped inside AdminRoute */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
