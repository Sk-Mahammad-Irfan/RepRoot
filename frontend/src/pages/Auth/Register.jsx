import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const endpoint =
      role === "student"
        ? `${import.meta.env.VITE_API_URL}/api/auth/student/register`
        : `${import.meta.env.VITE_API_URL}/api/auth/institution/register`;

    const data =
      role === "student"
        ? { username, email, password }
        : { name: username, email, password };

    try {
      const res = await axios.post(endpoint, data);

      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user || res.data.institution,
          token: res.data.token || "",
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        setRedirecting(true);
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

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

  // Google login via redirect
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Join RepRoot</h2>
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              type="button"
              variant={role === "student" ? "default" : "outline"}
              onClick={() => setRole("student")}
            >
              Student
            </Button>
            <Button
              type="button"
              variant={role === "institution_admin" ? "default" : "outline"}
              onClick={() => setRole("institution_admin")}
            >
              Institution Admin
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">
                {role === "student" ? "Full Name" : "Institution Name"}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                placeholder={role === "student" ? "Jane Doe" : "IIT Delhi"}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="example@university.edu"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Register as {role === "student" ? "Student" : "Institution Admin"}
            </Button>

            {redirecting && (
              <p className="text-green-600 text-center mt-2">
                Registered! Redirecting in {countdown} seconds...
              </p>
            )}

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
            {role === "student" && (
              <div className="text-center">
                <p className="text-sm text-gray-500 my-2">or</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
