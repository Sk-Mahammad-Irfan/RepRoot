import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const userId = currentUser?.user?._id;
  const userName = currentUser?.user?.name;
  // console.log(userName);
  const handleLogOut = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of the application.</p>

      {userName && (
        <p className="text-lg font-semibold mt-4">
          Logged in as: <span className="text-blue-700">{userName}</span>
        </p>
      )}

      {userId && (
        <>
          <p className="text-sm text-center text-gray-600 mt-4">
            Make your profile{" "}
            <Link
              to={`/create-profile/${userId}`}
              className="text-blue-600 hover:underline"
            >
              Create Profile
            </Link>
          </p>
          <Button
            type="submit"
            className="mt-6 w-full max-w-xs bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 cursor-pointer"
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
