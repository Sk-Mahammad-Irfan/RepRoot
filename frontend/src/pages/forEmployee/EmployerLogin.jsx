import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [auth, setAuth] = useAuth();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (auth?.token) {
      navigate("/employee/home");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }

      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // console.log("Form submitted:", { email, password });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/employee/login`,
        { email: formData.email, password: formData.password }
      );

      if (response?.data?.success) {
        // console.log(response);
        setAuth({
          ...auth,
          user: response?.data?.user,
          token: response?.data?.token,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        navigate("/employee/home");
        toast.success("Login successfull");
      } else if (response?.data?.redirect === "not-approved") {
        navigate("/not-approved");
      } else {
        toast.error("Something went wrong");
      }
      setFormData({ email: "", password: "" });
    } catch (error) {
      alert(error?.response?.data?.message || "Login Failed");
    }
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Employer Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="text-center">
          <Link
            to="/employer/register"
            className="text-sm text-blue-600 hover:underline"
          >
            New here? Register as an Employer
          </Link>
        </div>
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Continue as a User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
