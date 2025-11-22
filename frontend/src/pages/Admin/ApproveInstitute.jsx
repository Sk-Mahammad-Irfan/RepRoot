import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ApproveInstitute = () => {
  const [status] = useState(["pending", "approved", "rejected"]);
  const [instituteAdminUser, setInstituteAdminUser] = useState([]);
  const [auth] = useAuth();

  const getInstituteAdmins = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/get-institute_admin`
      );
      setInstituteAdminUser(data?.users || []);
    } catch (error) {
      // console.error("Error fetching institute admins:", error);
      toast.error("Failed to load institute admins");
    }
  };

  useEffect(() => {
    if (auth?.token) getInstituteAdmins();
  }, [auth?.token]);

  const handleChange = async (instituteAdminId, value) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/users/instAdmin-status/${instituteAdminId}`,
        { approvalStatus: value }
      );
      toast.success("Successfully updated");
      getInstituteAdmins();
    } catch (error) {
      // console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/admin/all-instituteAdmin"
          className="text-blue-600 hover:underline"
        >
          ← Go Back to Institute Admin List
        </Link>
        <h1 className="text-3xl font-bold mt-4">
          Manage Institute Admin Approvals
        </h1>
        <p className="text-muted-foreground mt-1">
          Change the approval status of each Institute Admin.
        </p>
      </div>

      <div className="space-y-6">
        {instituteAdminUser?.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p>
                  Current Status:{" "}
                  <span className="font-medium text-primary">
                    {user.approvalStatus}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  defaultValue={user.approvalStatus}
                  onValueChange={(value) => handleChange(user._id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApproveInstitute;
