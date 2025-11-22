import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-user/${id}`
        );
        setUser(response.data);
      } catch (error) {
        // console.error("Error fetching user:", error);
        toast.error("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setEducation(user?.userDetails?.education || []);
  }, [user?.userDetails?.education]);

  // console.log(education);

  // console.log(user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100 px-4 sm:px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              User Profile
            </h1>
            <p className="text-zinc-400 mt-1">
              View and manage your personal information.
            </p>
          </div>

          {user && (
            <Link to={`/create-profile/${user?.user?._id}`}>
              <Button
                variant="outline"
                className="border-zinc-700 text-black hover:bg-zinc-800 hover:text-white transition"
              >
                Edit / Create Profile
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full bg-zinc-800" />
            <Skeleton className="h-20 w-full bg-zinc-800" />
            <Skeleton className="h-20 w-full bg-zinc-800" />
          </div>
        ) : user ? (
          <>
            <Card className="bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-sm hover:border-zinc-700 transition-all">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="h-24 w-24 border border-zinc-700">
                  <AvatarImage
                    src={user?.user?.profile_img}
                    alt={user?.user?.username}
                  />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300">
                    {user?.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="text-2xl font-semibold text-white">
                    {user.user.username}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {user.user.email}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-zinc-300">
                <p>
                  <span className="font-medium text-zinc-400">Institute:</span>{" "}
                  {user.user.institute || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-zinc-400">Username:</span>{" "}
                  {user.user.username}
                </p>

                <Separator className="my-6 bg-zinc-800" />

                <h3 className="text-xl font-semibold text-white">
                  User Details
                </h3>

                <p>
                  <span className="font-medium text-zinc-400">Bio:</span>{" "}
                  {user?.userDetails?.userBio || "No bio provided."}
                </p>
                <p>
                  <span className="font-medium text-zinc-400">Location:</span>{" "}
                  {user?.userDetails?.userLocation || "Unknown"}
                </p>
                <div>
                  <span className="font-medium text-zinc-400">Skills:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user?.userDetails?.skillSet?.length ? (
                      user.userDetails.skillSet.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded-full text-zinc-200 hover:bg-zinc-700 transition"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm">No skills added.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-10 space-y-6">
              <h3 className="text-2xl font-bold text-white border-l-4 border-zinc-700 pl-3">
                Education
              </h3>

              {education?.length ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {education.map((edu) => (
                    <Card
                      key={edu._id}
                      className="bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-lg"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">
                          {edu.institutionName}
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                          {edu.degree || "Degree not specified"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-white">
                          <span className="font-medium text-zinc-400">
                            Location:
                          </span>{" "}
                          {edu.institutionLocation || "Unknown"}
                        </p>
                        {edu.startYear && (
                          <p className="text-white">
                            <span className="font-medium text-zinc-400">
                              Year:
                            </span>{" "}
                            {edu.endYear}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-lg">
                  No education history found.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-zinc-500 text-lg">No user found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
