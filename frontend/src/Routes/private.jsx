import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user-auth`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setOk(res.data.ok === true);
        if (auth?.user?.role === "employee") {
          navigate("/employee/home");
        }
      } catch (error) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    // Only run auth check if token exists
    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
      setLoading(false);
    }
  }, [auth?.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
