import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

const VerifyEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <MailCheck className="h-10 w-10 text-primary" />
          <CardTitle className="text-center text-2xl">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            We’ve sent a verification link to your email. Please check your
            inbox to complete the process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
