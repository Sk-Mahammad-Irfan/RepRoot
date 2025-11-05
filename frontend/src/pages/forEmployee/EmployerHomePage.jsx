import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, PlusCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const EmployerHomePage = () => {
  const [user, setUser] = useState(null);
  const [empDetails, setEmpDetails] = useState([]);
  const [recentJobs, setRecentJobs] = useState({});
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

  useEffect(() => {
    if (!user?._id) return;

    const fetchEmployerDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-employee/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res?.data?.success) {
          setEmpDetails(res.data.employeeDetails);
        }
      } catch (error) {
        console.error("Error fetching employer details:", error);
      }
    };

    fetchEmployerDetails();
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchRecentJobs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/get-job/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res?.data?.success) {
          setRecentJobs(res.data.jobPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentJobs();
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name || "Employer"} 👋
            </h1>
            <p className="text-gray-600">
              Manage your company’s postings and stay updated with your recent
              job listings.
            </p>
          </div>
          <Button
            onClick={handleLogOut}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </header>

        {/* Company Overview */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {empDetails?.companyName || "Your Company"}
            </CardTitle>
            <CardDescription>
              {empDetails?.description || "No description provided yet."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {user?.email || "Not provided"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="default"
                className="flex items-center gap-2"
              >
                <Link to={`/employee/details/${user?._id}`}>
                  <Briefcase size={18} /> View Profile
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link to={`/employee/post-job/${user?._id}`}>
                  <PlusCircle size={18} /> Post New Job
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Job Posts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Job Posts
          </h2>

          {recentJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <Card
                  key={job._id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-800">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {job.location} • {job.industry}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/employee/job/${job._id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-center py-8 border rounded-md bg-white">
              <p>No jobs posted yet. Start by posting a new one!</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to={`/employee/post-job/${user?._id}`}>Post a Job</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployerHomePage;
