import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PrivateRoutes from "./Routes/private"; // Your PrivateRoute component
import HomePage from "./pages/HomePage";
import NotApproved from "./pages/NotApproved";
import UserProfileForm from "./pages/userDetails/UserProfileForm";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/not-approved" element={<NotApproved />} />

        {/* Protected routes wrapped inside PrivateRoutes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-profile/:id" element={<UserProfileForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
