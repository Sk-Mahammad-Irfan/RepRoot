import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotApproved = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Account Not Approved
        </h2>
        <p className="text-gray-700 mb-6">
          Your institution admin account has not been approved yet by the
          SuperAdmin. Please wait until approval is granted.
        </p>
        <Button onClick={() => navigate("/login")}>Back to Login</Button>
      </div>
    </div>
  );
};

export default NotApproved;
