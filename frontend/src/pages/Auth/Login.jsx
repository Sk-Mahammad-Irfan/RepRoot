import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  // Email/password login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

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

  // Google login handler (after OAuth redirect)
  const fetchGoogleUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/user`,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        setAuth({
          ...auth,
          user: res.data,
          token: "session", // or handle it differently if using JWT
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: res.data, token: "session" })
        );
        navigate("/");
      }
    } catch (err) {
      console.error("Google auth failed:", err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    } else {
      // On OAuth redirect, try to fetch user if session exists
      const query = new URLSearchParams(window.location.search);
      if (query.get("from") === "google") {
        fetchGoogleUser();
      }
    }
  }, [auth, navigate]);

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  };

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

            <div className="flex items-center justify-center mt-4">
              <div className="w-full border-t" />
              <span className="px-2 text-sm text-gray-400">or</span>
              <div className="w-full border-t" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>

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
