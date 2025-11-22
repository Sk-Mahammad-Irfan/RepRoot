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

// Skeleton Loader Component
const SkeletonBox = ({ height = "20px", width = "100%" }) => (
  <div
    className="animate-pulse bg-gray-300 rounded-md"
    style={{ height, width }}
  ></div>
);

const EmployerHomePage = () => {
  const [user, setUser] = useState(null);
  const [empDetails, setEmpDetails] = useState(null);
  const [recentJobs, setRecentJobs] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    try {
      localStorage.removeItem("auth");
      setUser(null);
      toast.success("Logout successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  // Load User from LocalStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth.user);
    }
  }, []);

  // Fetch Employer Details
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
        toast.error("Something went wrong");
      }
    };

    fetchEmployerDetails();
  }, [user?._id]);

  // Fetch Recent Jobs
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
        toast.error(error.response?.data?.message || "Error fetching jobs");
      }
    };

    fetchRecentJobs();
  }, [user?._id]);

  // Check if profile is incomplete
  const isProfileIncomplete =
    !empDetails ||
    Object.keys(empDetails).length === 0 ||
    !empDetails.companyName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8 fade-in">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name || "Employer"} 👋
            </h1>
            <p className="text-gray-600">
              Manage your company details and job postings.
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

        {isProfileIncomplete && (
          <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 rounded-md fade-in">
            <p className="text-yellow-800 font-medium">
              ⚠️ Please complete your employer profile before posting a job.
            </p>
            <Button
              className="mt-3"
              onClick={() => navigate(`/employee/details/${user?._id}`)}
            >
              Complete Profile
            </Button>
          </div>
        )}

        {!empDetails ? (
          <Card className="p-6 space-y-4">
            <SkeletonBox height="28px" width="200px" />
            <SkeletonBox height="18px" width="70%" />
            <SkeletonBox height="40px" width="100%" />
          </Card>
        ) : (
          !isProfileIncomplete && (
            <Card className="shadow-md border border-gray-200 fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  {empDetails?.companyName}
                </CardTitle>
                <CardDescription>{empDetails?.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {user?.email}
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
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (isProfileIncomplete) {
                        toast.error(
                          "Complete your employer profile before posting a job!"
                        );
                        navigate(`/employee/details/${user?._id}`);
                        return;
                      }
                      navigate(`/employee/post-job/${user?._id}`);
                    }}
                  >
                    <PlusCircle size={18} /> Post New Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Job Posts
          </h2>

          {!recentJobs ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="p-6 space-y-3">
                  <SkeletonBox height="22px" width="60%" />
                  <SkeletonBox height="18px" width="40%" />
                  <SkeletonBox height="60px" width="100%" />
                </Card>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <Card
                  key={job._id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow fade-in"
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
              <Button
                onClick={() => {
                  if (isProfileIncomplete) {
                    toast.error("Complete your profile first!");
                    navigate(`/employee/details/${user?._id}`);
                    return;
                  }
                  navigate(`/employee/post-job/${user?._id}`);
                }}
                variant="outline"
                className="mt-4"
              >
                Post a Job
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployerHomePage;
