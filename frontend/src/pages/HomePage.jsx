import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import toast from "react-hot-toast";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);

      // If username exists, use it directly
      if (parsedAuth?.user?.username) {
        setUser(parsedAuth);
        setLoading(false);
      } else if (parsedAuth?.user?._id) {
        const controller = new AbortController();

        const fetchUser = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/users/get-user/${
                parsedAuth.user._id
              }`,
              { withCredentials: true, signal: controller.signal }
            );
            setUser(response.data);
          } catch (error) {
            if (!axios.isCancel(error)) {
              toast.error("Error fetching user");
              console.error("Error fetching user:", error);
            }
          } finally {
            setLoading(false);
          }
        };

        fetchUser();

        return () => {
          controller.abort();
        };
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogOut = () => {
    try {
      localStorage.removeItem("auth");
      setUser(null);
      toast.success("Logout successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  // console.log(user);
  const isLoggedIn = !!user?.user?.username;
  const userId = user?.user?._id;
  return (
    <>
      {user?.user?.role == "super_admin" ? (
        <>
          <Link to="/admin/dashboard">GO SUPER ADMIN</Link>
          <div className="p-6 max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome to the Home Page
                </CardTitle>
                <p className="text-muted-foreground">
                  This is the main page of the application.
                </p>
              </CardHeader>
              <CardContent>
                {user?.user?.username ? (
                  <p className="text-lg font-semibold mt-2">
                    Logged in as:{" "}
                    <span className="text-primary">{user.user.username}</span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-2">
                    You are not logged in. Please{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      log in
                    </Link>
                    .
                  </p>
                )}

                {user?.user?._id && (
                  <>
                    <p className="text-sm text-gray-600 mt-4">
                      Make your profile{" "}
                      <Link
                        to={`/create-profile/${user.user._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Create Profile
                      </Link>
                    </p>

                    <div className="mt-6 flex flex-col gap-3 max-w-xs">
                      <Link to={`/profile/${user.user._id}`}>
                        <Button variant="outline" className="w-full">
                          Go to Profile
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogOut}
                      >
                        Log Out
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : user?.user?.role == "institution_admin" ? (
        <>
          <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center px-4 py-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1950&q=80')`,
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-blue-900/60 backdrop-blur-sm z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 bg-white/90 backdrop-blur-lg shadow-2xl rounded-xl max-w-3xl w-full p-10 border border-gray-200">
              {/* Top Right Admin Link */}
              <div className="mb-6 text-right">
                <Link
                  to="/institute/dashboard"
                  className="text-sm font-semibold text-blue-700 hover:underline transition duration-150"
                >
                  Go to Institute Admin
                </Link>
              </div>

              {/* Card Content */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-2">
                  🎓 Welcome to the Institute Portal
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Centralized dashboard for users and administrators
                </p>

                {/* Auth Status */}
                {user?.user?.username ? (
                  <p className="text-lg font-medium text-gray-800 mb-6">
                    Logged in as:{" "}
                    <span className="text-blue-700 font-semibold">
                      {user.user.username}
                    </span>
                  </p>
                ) : (
                  <p className="text-md text-gray-700 mb-6">
                    You are not logged in. Please{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      log in
                    </Link>
                    .
                  </p>
                )}

                {/* Profile Actions */}
                {user?.user?._id && (
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-4">
                      Don’t have a profile yet?{" "}
                      <Link
                        to={`/create-profile/${user.user._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Create Profile
                      </Link>
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link
                        to={`/profile/${user.user._id}`}
                        className="w-full sm:w-auto"
                      >
                        <button className="w-full px-6 py-2 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm hover:shadow-md transition duration-200">
                          View Profile
                        </button>
                      </Link>

                      <button
                        onClick={handleLogOut}
                        className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition duration-200"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-8 max-w-2xl mx-auto">
            <Card className="rounded-xl shadow-md border border-muted bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
                  Welcome 👋
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {isLoggedIn
                    ? "Here's your personalized dashboard."
                    : "This is the main page of the application."}
                </p>
              </CardHeader>

              <CardContent className="mt-4 space-y-4">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <p className="text-lg font-medium">
                      Logged in as:{" "}
                      <span className="text-primary font-semibold">
                        {user.user.username}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      You are not logged in. Please{" "}
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                      >
                        log in
                      </Link>
                      .
                    </p>
                  </div>
                )}

                {userId && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Don’t have a profile yet?{" "}
                      <Link
                        to={`/create-profile/${userId}`}
                        className="text-blue-600 hover:underline"
                      >
                        Create Profile
                      </Link>
                    </p>

                    <div className="mt-6 space-y-3">
                      <Link to={`/profile/${userId}`}>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogOut}
                      >
                        Log Out
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
