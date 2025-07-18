import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  console.log(currentUser?.user);

  const userId = currentUser?.user?._id;
  const userName = currentUser?.user?.name;
  console.log(userId);

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
        <p className="text-sm text-center text-gray-600 mt-4">
          Make your profile{" "}
          <Link
            to={`/create-profile/${userId}`}
            className="text-blue-600 hover:underline"
          >
            Create Profile
          </Link>
        </p>
      )}
    </div>
  );
};

export default HomePage;
