import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const isAcademicEmail = (email) => {
    return /\.(edu|edu\.in|ac\.in)$/i.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Email validation
    if (!isAcademicEmail(email)) {
      setError(
        "Please enter a valid academic email (e.g., .edu, .edu.in, .ac.in)"
      );
      return;
    } else {
      setError("");
    }

    try {
      const userData = { username, email, password, role };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        userData
      );

      if (res.data.success) {
        console.log("Successfully registered and logged in");

        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("auth", JSON.stringify(res.data));

        // ✅ Start redirect countdown
        setRedirecting(true);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  // ⏱ Handle countdown redirect
  useEffect(() => {
    if (!redirecting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(location.state || "/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirecting, navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Join JobPortal
          </h2>
          <p className="text-sm text-gray-500">
            Create your free account and start applying today
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="student">Student</option>
                <option value="institution_admin">Institution Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>

            {redirecting && (
              <p className="text-green-600 text-center mt-2">
                Account created! Redirecting in {countdown} seconds...
              </p>
            )}

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
