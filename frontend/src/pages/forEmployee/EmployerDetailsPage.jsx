import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import toast from "react-hot-toast";

const EmployerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    others: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
      if (!token) {
        toast.error("No auth token found.");
        return;
      }
      const res = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/users/create-employee-details/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res?.data?.message);
      navigate(`/employee/home`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
        if (!token) {
          toast.error("No auth token found.");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res?.data?.success) {
          setFormData({
            companyName: res?.data?.employeeDetails?.companyName || "",
            description: res?.data?.employeeDetails?.description || "",
            others: res?.data?.employeeDetails?.others || "",
          });
        }
      } catch (error) {
        // console.log(error);
        toast.error(error.response.data.message);
      }
    };
    if (id) {
      getEmployeeDetails();
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle>Employer Details</CardTitle>
          <CardDescription>
            Here you can view and manage your details as an employer.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your company"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="others">Other Information</Label>
              <Textarea
                id="others"
                name="others"
                value={formData.others}
                onChange={handleInputChange}
                placeholder="Any additional details (E.g linkedIn, website)"
                className="min-h-[100px]"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Save Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDetailsPage;
