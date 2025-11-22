import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (!newPassword || !confirmPassword) {
        toast.error("Please fill in all fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password/${email}`,
        { newPassword, confirmPassword }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully!");
        localStorage.setItem("auth", JSON.stringify(res.data));

        navigate("/login");
      }
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to change password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Change Password
      </h1>
      <form onSubmit={handleChangePassword} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
