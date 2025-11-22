import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setStatus("Email verified successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus(
            res.data.message || "Verification failed. Please try again."
          );
        }
      } catch (error) {
        // console.log(error);
        setStatus("Verification failed. Please try again.");
      }
    };
    verifyEmail();
  }, [token, navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="mt-2">{status}</p>
      </div>
    </div>
  );
};

export default Verify;
