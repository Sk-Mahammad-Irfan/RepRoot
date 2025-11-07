import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, LogOut, User, Building2 } from "lucide-react";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return setLoading(false);

    const parsedAuth = JSON.parse(storedAuth);

    if (parsedAuth?.user?.username) {
      setUser(parsedAuth);
      setLoading(false);
      return;
    }

    if (parsedAuth?.user?._id) {
      const controller = new AbortController();
      const fetchUser = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/get-user/${
              parsedAuth.user._id
            }`,
            { withCredentials: true, signal: controller.signal }
          );
          setUser(res.data);
        } catch (err) {
          if (!axios.isCancel(err)) {
            toast.error("Error fetching user");
            console.error(err);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
      return () => controller.abort();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
    if (!token || user?.user?.role !== "student") return;

    const fetchRecentJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/get-jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res?.data?.success) setRecentJobs(res.data.jobPosts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecentJobs();
  }, [user?.user?.role]);

  const handleLogOut = () => {
    localStorage.removeItem("auth");
    setUser(null);
    toast.success("Logout successful");
    navigate("/login");
    window.location.reload();
  };

  const isLoggedIn = !!user?.user?.username;
  const userId = user?.user?._id;
  const role = user?.user?.role;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Skeleton className="h-32 w-64 rounded-lg" />
      </div>
    );
  }

  const Navbar = () => (
    <nav className="w-full bg-gray-900 border-b border-gray-800 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-purple-400">
        CareerConnect
      </Link>
      {isLoggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar className="h-9 w-9 border border-gray-700">
                <AvatarImage
                  src={
                    user?.user?.profile_img || "https://github.com/shadcn.png"
                  }
                  alt={user?.user?.username}
                />
                <AvatarFallback>
                  {user?.user?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-200 font-medium hidden sm:block">
                {user?.user?.username}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-gray-900 border-gray-800 text-gray-200"
          >
            <DropdownMenuLabel className="text-gray-400 text-sm">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate(`/profile/${userId}`)}
              className="cursor-pointer hover:bg-gray-800"
            >
              <User size={16} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogOut}
              className="cursor-pointer hover:bg-gray-800 text-red-400"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );

  const Header = ({ title, subtitle }) => (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center py-10 px-6">
        <Card className="bg-gray-900 border-gray-800 w-full max-w-3xl p-8">
          <CardHeader>
            <CardTitle>
              <Header
                title={
                  isLoggedIn
                    ? `Welcome back, ${user?.user?.username} 👋`
                    : "Welcome to CareerConnect"
                }
                subtitle={
                  isLoggedIn
                    ? "Here's your personalized dashboard."
                    : "Please log in to access more features."
                }
              />
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Profile Image */}
            {/* {user?.user?.profile_img && (
              <img
                src={user.user.profile_img}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-6 border border-gray-700 object-cover"
              />
            )} */}

            {/* Role-specific section */}
            {role === "super_admin" && (
              <Link to="/admin/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Go to Admin Dashboard
                </Button>
              </Link>
            )}

            {role === "institution_admin" && (
              <Link to="/institute/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Go to Institute Dashboard
                </Button>
              </Link>
            )}

            {/* Student Recent Jobs */}
            {role === "student" && (
              <>
                <Separator className="my-8 bg-gray-700" />
                <section>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <Briefcase size={20} /> Recent Jobs
                  </h3>
                  {recentJobs.length > 0 ? (
                    <ul className="space-y-3">
                      {recentJobs.map((job) => (
                        <li
                          key={job._id}
                          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
                        >
                          <h4 className="font-semibold text-white">
                            {job.title}
                          </h4>
                          <p className="text-gray-400">{job.companyName}</p>
                          <p className="text-gray-500">{job.location}</p>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-purple-400 text-sm hover:underline"
                          >
                            View Details
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No recent jobs found.</p>
                  )}
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default HomePage;
