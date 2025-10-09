import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

const MyStudents = () => {
  const [authToken, setAuthToken] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/student/my-students`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // console.log(res);
        setStudents(res?.data?.users);
      } catch (error) {
        console.log(error);
      }
    };
    if (authToken) {
      fetchStudents();
    }
  }, [authToken]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.token) {
      setAuthToken(authData.token);
    } else {
      setError("You must be logged in to access this page.");
    }
  }, []);

  console.log(students);
  return (
    <>
      <Link to="/">Go Home</Link>
      <div className="mb-4 flex justify-start">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/institute/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </Button>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              My Approved Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {students?.map((student) => (
                <li
                  key={student._id}
                  className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-muted hover:bg-muted/50 transition"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-lg">{student.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={student.isVerified ? "default" : "destructive"}
                      >
                        {student.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                      <Badge variant="secondary">
                        {student.approvalStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-right text-muted-foreground mt-2 sm:mt-0">
                    Joined: {formatDate(student.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MyStudents;
