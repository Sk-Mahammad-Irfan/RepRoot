import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [auth] = useAuth();
  const [education, setEducation] = useState([]);

  const getToken = () =>
    auth?.token || JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  useEffect(() => {
    const token = getToken();

    if (!token) {
      toast.error("No auth token found.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [auth?.token, id]);

  useEffect(() => {
    setEducation(user?.userDetails?.education);
  }, [user?.userDetails?.education]);
  console.log(education);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-xl space-y-8">
      <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
        User Profile
      </h1>

      <p className="text-center text-gray-600 mb-6">
        View and edit your profile details below.
      </p>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading...</div>
      ) : user ? (
        <>
          <Card className="mb-8 bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-indigo-800">
                {user.user.username}
              </h2>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-gray-500">{user.user.email}</span>
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Username:</span>{" "}
                <span className="text-gray-500">{user.user.username}</span>
              </p>

              <h3 className="text-xl font-semibold mt-6 text-indigo-800">
                User Details
              </h3>
              <p className="text-lg text-gray-700 mt-2">
                <span className="font-semibold">User Bio:</span>{" "}
                <span className="text-gray-500">
                  {user?.userDetails?.userBio}
                </span>
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <span className="font-semibold">User Location:</span>{" "}
                <span className="text-gray-500">
                  {user?.userDetails?.userLocation}
                </span>
              </p>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-indigo-900 mb-6">
              Education
            </h3>
            {education?.length ? (
              education?.map((edu) => (
                <Card
                  key={edu._id}
                  className="mb-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="p-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-700">
                      {edu.institutionName}
                    </h4>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span>{" "}
                      {edu.institutionLocation}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-lg text-gray-500">
                No education history found.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 text-lg">No user found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
