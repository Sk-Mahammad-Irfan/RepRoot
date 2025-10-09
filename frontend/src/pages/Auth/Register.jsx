import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

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
        toast.success("Registration successful");
        // localStorage.setItem("auth", JSON.stringify(res.data));
        setRedirecting(true);
        navigate("/verify");
      } else {
        toast.error(err.response?.data?.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  useEffect(() => {
    document.title = "Register - RepRoot";
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <Card className="w-full max-w-md shadow-lg border relative z-0">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Join RepRoot</h2>
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              type="button"
              variant={role === "student" ? "default" : "outline"}
              onClick={() => setRole("student")}
              disabled={loading}
            >
              Student
            </Button>
            <Button
              type="button"
              variant={role === "institution_admin" ? "default" : "outline"}
              onClick={() => setRole("institution_admin")}
              disabled={loading}
            >
              Institution Admin
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset disabled={loading} className="space-y-5">
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="********"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </fieldset>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </div>
              ) : (
                `Register as ${
                  role === "student" ? "Student" : "Institution Admin"
                }`
              )}
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
                  disabled={loading}
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
