import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast from "react-hot-toast";

const JobDetails = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getJobDetails = async () => {
      setLoading(true);
      try {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setUser(parsedAuth.user);
        }

        const token = JSON.parse(storedAuth)?.token;
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/get-job/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setJobs(res.data?.jobDetails || []);
      } catch (err) {
        // console.error(err);
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  const handleApply = async (jobId) => {
    try {
      const storedAuth = localStorage.getItem("auth");
      const token = JSON.parse(storedAuth)?.token;
      const userId = JSON.parse(storedAuth)?.user?._id;

      if (!token || !userId) {
        alert("You must be logged in to apply.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/apply`,
        { jobId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (error)
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container mx-auto p-6 bg-slate-900 min-h-screen text-slate-200">
      <h1 className="text-3xl font-bold mb-10 text-center text-slate-100">
        Job Details
      </h1>

      {loading ? (
        <div className="flex flex-col items-center space-y-6">
          {[jobs].map((i) => (
            <Card
              key={i}
              className="w-full max-w-2xl bg-slate-800 border border-slate-700 animate-pulse"
            >
              <CardHeader>
                <Skeleton className="h-6 w-40 bg-slate-700" />
                <Skeleton className="h-4 w-28 bg-slate-700 mt-2" />
              </CardHeader>

              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full bg-slate-700" />
                <Skeleton className="h-4 w-3/4 bg-slate-700" />
                <Skeleton className="h-4 w-2/3 bg-slate-700" />
                <Skeleton className="h-4 w-1/2 bg-slate-700" />

                <div className="mt-4">
                  <Skeleton className="h-4 w-32 bg-slate-700 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 bg-slate-700 rounded-full" />
                    <Skeleton className="h-6 w-16 bg-slate-700 rounded-full" />
                    <Skeleton className="h-6 w-16 bg-slate-700 rounded-full" />
                  </div>
                </div>

                <Skeleton className="h-4 w-40 bg-slate-700 mt-4" />

                <Skeleton className="h-5 w-20 bg-slate-700 mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        // --- REAL JOB CARDS ---
        <div className="flex flex-col items-center space-y-6">
          {jobs.map((job) => (
            <Card
              key={job._id}
              className="w-full max-w-2xl bg-slate-800 border border-slate-700 hover:shadow-xl hover:shadow-slate-700/40 transition-all"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-100">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {job.companyName}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>
                  <strong className="text-slate-400">Description:</strong>{" "}
                  {job.description}
                </p>
                <p>
                  <strong className="text-slate-400">Location:</strong>{" "}
                  {job.location}
                </p>
                <p>
                  <strong className="text-slate-400">Salary:</strong>{" "}
                  {job.salary}
                </p>
                <p>
                  <strong className="text-slate-400">Industry:</strong>{" "}
                  {job.industry}
                </p>
                <p>
                  <strong className="text-slate-400">Employment Type:</strong>{" "}
                  {job.employmentType}
                </p>
                <p>
                  <strong className="text-slate-400">
                    Experience Required:
                  </strong>{" "}
                  {job.experienceRequired}
                </p>
                <p>
                  <strong className="text-slate-400">Education Level:</strong>{" "}
                  {job.educationLevel}
                </p>

                <p>
                  <strong className="text-slate-400">
                    Application Deadline:
                  </strong>{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString(
                    "en-GB"
                  )}
                </p>

                <div>
                  <strong className="text-slate-400">Required Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.requiredSkills?.length > 0 ? (
                      job.requiredSkills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-slate-700 text-slate-200 border border-slate-600"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500">None listed</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 pt-2">
                  <em>
                    Posted on:{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-GB")}
                  </em>
                </p>

                <button
                  onClick={() => handleApply(job._id)}
                  className="text-blue-400 hover:text-blue-300 hover:underline mt-3"
                >
                  Apply
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center mt-10">
          No job details available.
        </p>
      )}
    </div>
  );
};

export default JobDetails;
