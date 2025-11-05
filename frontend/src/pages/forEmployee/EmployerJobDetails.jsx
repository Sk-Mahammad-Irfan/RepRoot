import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
  console.log(jobs);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Job Details</h1>
      {jobs.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {jobs.map((job) => (
            <div
              key={job._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#fafafa",
              }}
            >
              <h1>Company: {job.companyName}</h1>
              <h2>Title: {job.title}</h2>
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
                <ul>
                  {job.requiredSkills?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <p>
                <em>Posted on: {new Date(job.createdAt).toLocaleString()}</em>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No job details available.</p>
      )}
    </div>
  );
};

export default EmployerJobDetails;
