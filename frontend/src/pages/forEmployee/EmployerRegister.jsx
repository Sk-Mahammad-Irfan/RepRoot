import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    try {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }

      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      // console.log("Form submitted:", formData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/employee/register`,
        formData
      );

      if (response?.data?.success) {
        alert("Registration Successful");
      } else {
        alert("Registration Failed");
      }
      setFormData({ name: "", email: "", password: "" });
      navigate("/employer/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration Failed");
      console.log("error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 shadow-xl rounded-xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Employer Register
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Create an account to start posting jobs and managing applicants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full Name
            </Label>
            <p className="text-xs text-gray-500">
              Use your full name as an HR representative.
            </p>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Johnson"
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Work Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters long.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            Create Account
          </Button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Want to find a job instead?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register as Job Seeker
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/employer/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;
