import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");
    setLoading(true);

    const loginPromise = axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password }
    );

    toast.promise(loginPromise, {
      loading: "Logging in...",
      // success: "Login successful!",
      error: "Login failed. Please try again.",
    });

    try {
      const res = await loginPromise;
      if (res?.data?.success) {
        setAuth({
          ...auth,
          user: res?.data?.user,
          token: res?.data?.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        toast.success(res?.data?.message);
        navigate(location.state || "/");
      } else if (res?.data?.redirect === "not-approved") {
        navigate("/not-approved");
      } else {
        // toast.error(res?.data?.message)
        // setError(res?.data?.message || "Login failed");
      }
    } catch (err) {
      // setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    }, 500);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      const registerEmail = JSON.parse(localStorage.getItem("auth") || "{}")
        ?.user?.email;

      if (!registerEmail && !email) {
        toast.error("Please enter your email first.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email: registerEmail || email }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Password reset link sent.");
        navigate(`/verify-otp/${registerEmail || email}`);
      } else {
        toast.error(res?.data?.message || "Failed to send reset link.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md border shadow-md rounded-lg bg-white">
        <CardHeader className="text-center space-y-1 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm">Sign in to continue</p>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10" // add padding for the icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="text-sm p-0 h-auto"
              >
                {forgotLoading ? (
                  <div className="flex items-center gap-1 text-sm">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Forgot Password?"
                )}
              </Button>
            </div>

            {/* Error
            {error && (
              <p className="text-center text-sm text-red-500 font-medium">
                {error}
              </p>
            )} */}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex-grow h-px bg-border" />
              or
              <div className="flex-grow h-px bg-border" />
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </>
              )}
            </Button>

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground mt-2">
              New here?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline transition-colors"
              >
                Create an account
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
