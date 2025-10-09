import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
const ApproveStudent = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authToken, setAuthToken] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleApproveStudent = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    const result = await Swal.fire({
      title: "Approve Email?",
      text: `Are you sure you want to approve this ${email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/student/approve-student`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage(res.data.message || "Student approved successfully.");
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.token) {
      setAuthToken(authData.token);
    } else {
      setError("You must be logged in to access this page.");
    }
  }, []);

  return (
    <>
      <Link to="/">Go Home</Link>
      <div className="mb-4 flex justify-start">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/institute/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Institute Admin Dashboard
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Approve User</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleApproveStudent} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Approve User
              </Button>

              {message && (
                <p className="text-green-600 text-sm font-medium pt-2">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-600 text-sm font-medium pt-2">{error}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApproveStudent;
