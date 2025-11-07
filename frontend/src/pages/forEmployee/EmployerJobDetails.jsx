import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const EmployerJobDetails = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
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
        console.error(err);
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Loading job details...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      </div>
    );

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {job.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Description:</strong> {job.description}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
                <p>
                  <strong>Industry:</strong> {job.industry}
                </p>
                <p>
                  <strong>Employment Type:</strong> {job.employmentType}
                </p>
                <p>
                  <strong>Experience Required:</strong> {job.experienceRequired}
                </p>
                <p>
                  <strong>Education Level:</strong> {job.educationLevel}
                </p>
                <p>
                  <strong>Application Deadline:</strong>{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>

                <div>
                  <strong>Required Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.requiredSkills?.length > 0 ? (
                      job.requiredSkills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">None listed</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  <em>Posted on: {new Date(job.createdAt).toLocaleString()}</em>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8">
          No job details available.
        </p>
      )}
    </div>
  );
};

export default EmployerJobDetails;
