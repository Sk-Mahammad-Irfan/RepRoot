import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const loginPromise = axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password }
    );

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: "Login failed. Please try again.",
    });

    try {
      const res = await loginPromise;

      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else if (res.data.redirect === "not-approved") {
        navigate("/not-approved");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  // Google login via redirect
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  // Redirect if already logged in
  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Sign in to apply for your next opportunity
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@doe.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Sign In
            </Button>

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

            <p className="text-sm text-center text-gray-600 mt-4">
              New to RepRoot?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Create an account
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
