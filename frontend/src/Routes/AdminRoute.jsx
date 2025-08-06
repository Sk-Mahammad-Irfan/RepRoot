import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/admin-auth`
        );
        setOk(res?.data?.ok === true);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return ok ? <Outlet /> : <Navigate to="/login" />;
}
