import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Employer Home Page
          </CardTitle>
          <CardDescription>
            Welcome back! Manage your employer account below.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-700">
              <span className="font-semibold">Welcome, </span>@
              {user?.name || "Employer"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              {user?.email || "No email provided"}
            </p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link to={`/employee/details/${user?._id}`}>View Details</Link>
            </Button>

            <Button
              onClick={handleLogOut}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerHomePage;
