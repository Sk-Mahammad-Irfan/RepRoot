import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn Button component
import { ArrowLeft } from "lucide-react"; // optional icon
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminEmployees = () => {
  const [users, setUsers] = useState(null);
  const statusOptions = ["pending", "approved", "rejected"];

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/get-employees`
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Unable to get users");
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  //   console.log(users);

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/delete-employee/${userId}`
      );
      if (data.success) {
        toast.success("Successfully deleted");
      }
      getAllUsers();
      users;
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/employee-status/${userId}`,
        { approvalStatus: newStatus }
      );

      setUsers((prev) => ({
        ...prev,
        employee: prev.employee.map((user) =>
          user._id === userId ? { ...user, approvalStatus: newStatus } : user
        ),
      }));

      toast.success("Status updated successfully!");
    } catch (error) {
      //   console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-start">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/admin/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </Button>
      </div>

      <div className="p-4 sm:p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">List of Users</h1>

        {users?.employee?.length ? (
          <div className="w-full overflow-x-auto rounded-md border bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm text-left divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 min-w-[50px] font-medium text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 min-w-[150px] font-medium text-gray-700">
                    ID
                  </th>
                  <th className="px-4 py-3 min-w-[150px] font-medium text-gray-700">
                    Username
                  </th>
                  <th className="px-4 py-3 min-w-[200px] font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 min-w-[200px] font-medium text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Verified
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Approval Status
                  </th>
                  <th className="px-4 py-3 min-w-[160px] font-medium text-gray-700">
                    Created At
                  </th>
                  <th className="px-4 py-3 min-w-[160px] font-medium text-gray-700">
                    Updated At
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.employee.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 font-mono text-gray-700">
                      {user._id}
                    </td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            user.approvalStatus === "approved"
                              ? "bg-green-500"
                              : user.approvalStatus === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <Select
                          defaultValue={user.approvalStatus}
                          onValueChange={(value) =>
                            handleStatusChange(user._id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px] capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className="capitalize"
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(user.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(user.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </>
  );
};

export default AdminEmployees;
