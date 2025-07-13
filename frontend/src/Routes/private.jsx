import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 to prevent premature navigation
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user-auth`
        );
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
      setLoading(false);
    }
  }, [auth?.token]);

  if (loading) return null; // or return a loader/spinner

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
