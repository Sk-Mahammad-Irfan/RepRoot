import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmployerHomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    try {
      localStorage.removeItem("auth");
      setUser(null);
      toast.success("Logout successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth.user);
    }
  }, []);

  return (
    <div>
      <h1>Employer Home Page</h1>
      <p>
        Welcome, @{user?.name} !<br /> email: {user?.email}
      </p>
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
};

export default EmployerHomePage;
