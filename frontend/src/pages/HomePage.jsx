import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserInfo(parsedUser);

      // If username already exists in localStorage, use it
      if (parsedUser?.user?.username) {
        setCurrentUser(parsedUser);
      }
    }
  }, []);

  useEffect(() => {
    // Only fetch from API if no username is present
    if (currentUserInfo?.user?._id && !currentUserInfo?.user?.username) {
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/get-user/${
              currentUserInfo.user._id
            }`,
            { withCredentials: true }
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      };

      fetchCurrentUser();
    }
  }, [currentUserInfo]);

  const handleLogOut = () => {
    try {
      localStorage.removeItem("auth");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
          {currentUser?.user?.username && (
            <p className="text-lg font-semibold mt-2">
              Logged in as:{" "}
              <span className="text-primary">{currentUser.user.username}</span>
            </p>
          )}

          {currentUserInfo?.user?._id && (
            <>
              <p className="text-sm text-gray-600 mt-4">
                Make your profile{" "}
                <Link
                  to={`/create-profile/${currentUserInfo.user._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Create Profile
                </Link>
              </p>

              <div className="mt-6 flex flex-col gap-3 max-w-xs">
                <Link to={`/profile/${currentUserInfo.user._id}`}>
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
