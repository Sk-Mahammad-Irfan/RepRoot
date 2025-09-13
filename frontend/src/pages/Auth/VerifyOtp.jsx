import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// framer-motion
import { motion } from "framer-motion";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const { email } = useParams();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Timer Countdown Effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = pastedData[i];
        }
      }
      setOtp(newOtp);
      if (inputRefs.current[pastedData.length - 1]) {
        inputRefs.current[pastedData.length - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    console.log(email);
    e.preventDefault();
    try {
      const enteredOtp = otp.join("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp/${email}`,
        { otp: enteredOtp }
      );
      if (res.data.success) {
        toast.success(res.data.message || "OTP verified successfully");
        navigate(`/change-password/${email}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsResending(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email }
      );
      if (res.data.success) {
        toast.success(res.data.message || "OTP resent successfully");
        setOtp(new Array(6).fill(""));
        setTimer(60); // restart timer
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">
            OTP Verification
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            We've sent a 6-digit OTP to your email. Enter it below.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <CardContent>
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="text-center text-lg font-medium h-12 w-12"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                </motion.div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 text-center">
            <p className="text-xs text-muted-foreground">
              Didn't receive the OTP?{" "}
              <span className="font-medium">
                {timer > 0 ? `Resend in ${timer}s` : ""}
              </span>
            </p>
            <Button
              type="button"
              variant="link"
              onClick={handleResendOtp}
              disabled={timer > 0 || isResending}
              className="text-blue-600 text-sm"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VerifyOtp;
