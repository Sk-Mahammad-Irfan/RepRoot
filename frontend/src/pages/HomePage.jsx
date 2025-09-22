import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to the Home Page</CardTitle>
          <p className="text-muted-foreground">
            This is the main page of the application.
          </p>
        </CardHeader>
        <CardContent>
          {user?.user?.role == "super_admin" ? (
            <>
              <Link to="/admin/dashboard">GO SUPER ADMIN</Link>
            </>
          ) : user?.user?.role == "institution_admin" ? (
            <>
              <Link to="/institute/dashboard">GO Institute ADMIN</Link>
            </>
          ) : (
            <></>
          )}
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
  );
};

export default HomePage;
