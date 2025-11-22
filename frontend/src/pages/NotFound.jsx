import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-destructive">404</h1>
      <p className="text-lg text-muted-foreground mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
