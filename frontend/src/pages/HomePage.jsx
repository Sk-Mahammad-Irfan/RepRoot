import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setCurrentUserInfo(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-user/${
            currentUserInfo?.user?._id
          }`,
          { withCredentials: true }
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    if (currentUserInfo?.user?._id) {
      fetchCurrentUser();
    }
  }, [currentUserInfo]);

  const handleLogOut = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome to the Home Page</h1>
      <p className="text-gray-600 mb-4">
        This is the main page of the application.
      </p>

      {currentUser?.user?.username && (
        <p className="text-lg font-semibold mt-4">
          Logged in as:{" "}
          <span className="text-blue-700">{currentUser?.user?.username}</span>
        </p>
      )}

      {currentUserInfo?.user?._id && (
        <>
          <p className="text-sm text-center text-gray-600 mt-4">
            Make your profile{" "}
            <Link
              to={`/create-profile/${currentUserInfo?.user?._id}`}
              className="text-blue-600 hover:underline"
            >
              Create Profile
            </Link>
          </p>
          <Button
            className="mt-6 w-full max-w-xs bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </>
      )}
    </div>
  );
};

export default HomePage;
