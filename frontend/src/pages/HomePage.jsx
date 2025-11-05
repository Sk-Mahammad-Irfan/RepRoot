import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
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

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
    if (!token) {
      return;
    }
    if (user?.user?.role === "student") {
      try {
        const fetchRecentJobs = async () => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/jobs/get-jobs`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(res?.data);
          if (res?.data?.success) {
            setRecentJobs(res.data.jobPosts);
          }
        };
        fetchRecentJobs();
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  }, [user?.user?.role]);

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
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {user?.user?.role === "super_admin" ? (
          <div className="max-w-4xl mx-auto p-6">
            {/* Super Admin Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Super Admin Dashboard
              </h1>
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-lg transition duration-200"
              >
                GO SUPER ADMIN
              </Link>
            </div>

            {/* Main Card */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to the Home Page
              </h2>
              <p className="text-gray-400 mb-6">
                This is the main page of the application.
              </p>

              {user?.user?.username ? (
                <p className="text-lg font-semibold mb-4">
                  Logged in as:{" "}
                  <span className="text-purple-400">{user.user.username}</span>
                </p>
              ) : (
                <p className="text-gray-500 mb-4">
                  You are not logged in. Please{" "}
                  <Link className="text-purple-400 hover:underline" to="/login">
                    log in
                  </Link>
                  .
                </p>
              )}

              {user?.user?._id && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Link to={`/profile/${user.user._id}`} className="flex-1">
                      <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition duration-200 font-semibold">
                        Go to Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition duration-200 font-semibold"
                    >
                      Log Out
                    </button>
                  </div>
                  <p className="text-gray-400">
                    Don’t have a profile yet?{" "}
                    <Link
                      to={`/create-profile/${user.user._id}`}
                      className="text-purple-400 hover:underline font-semibold"
                    >
                      Create Profile
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        ) : user?.user?.role === "institution_admin" ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="relative bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-xl max-w-3xl w-full p-10 border border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 to-blue-900/50 rounded-xl"></div>

              <div className="relative z-10 text-center">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    Institute Admin Portal
                  </h1>
                  <Link
                    to="/institute/dashboard"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-lg transition duration-200"
                  >
                    GO INSTITUTE ADMIN
                  </Link>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">
                  Welcome to the Institute Portal
                </h1>
                <p className="text-gray-300 mb-6">
                  Centralized dashboard for users and administrators
                </p>

                {user?.user?.username ? (
                  <p className="text-lg font-medium mb-6">
                    Logged in as:{" "}
                    <span className="text-purple-400 font-semibold">
                      {user.user.username}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-400 mb-6">
                    You are not logged in. Please{" "}
                    <Link
                      className="text-purple-400 hover:underline font-semibold"
                      to="/login"
                    >
                      log in
                    </Link>
                    .
                  </p>
                )}

                {user?.user?._id && (
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to={`/profile/${user.user._id}`}>
                      <button className="px-6 py-2 bg-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-600 transition duration-200 w-full sm:w-auto">
                        View Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="px-6 py-2 bg-red-600 rounded-lg shadow-md font-semibold hover:bg-red-700 transition duration-200 w-full sm:w-auto"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold mb-2 text-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
                Welcome 👋
              </h2>
              <p className="text-gray-400 mb-6">
                {isLoggedIn
                  ? "Here's your personalized dashboard."
                  : "This is the main page of the application."}
              </p>

              {isLoggedIn ? (
                <p className="text-lg font-semibold mb-4">
                  Logged in as:{" "}
                  <span className="text-purple-400">{user.user.username}</span>
                </p>
              ) : (
                <p className="text-gray-400 mb-4">
                  You are not logged in. Please{" "}
                  <Link className="text-purple-400 hover:underline" to="/login">
                    log in
                  </Link>
                  .
                </p>
              )}

              {userId && (
                <>
                  <p className="text-gray-400 mb-4">
                    Don’t have a profile yet?{" "}
                    <Link
                      to={`/create-profile/${userId}`}
                      className="text-purple-400 hover:underline font-semibold"
                    >
                      Create Profile
                    </Link>
                  </p>

                  <div className="flex flex-col gap-3">
                    <Link to={`/profile/${userId}`}>
                      <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition duration-200 font-semibold">
                        View Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition duration-200 font-semibold"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}

              {/* Bottom list section */}
              <div className="mt-10">
                {recentJobs.length > 0 ? (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Recent Jobs</h3>
                    <ul className="space-y-2">
                      {recentJobs.map((job) => (
                        <li
                          key={job?._id}
                          className="bg-gray-700 rounded-lg p-4 shadow-md"
                        >
                          <h4 className="font-semibold">{job?.title}</h4>
                          <p className="text-gray-400">{job?.companyName}</p>
                          <p className="text-gray-400">{job?.location}</p>
                          <p className="text-gray-400">
                            {job?.experienceRequired}
                          </p>
                          <p className="text-gray-400">{job?.industry}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400">No recent jobs found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
