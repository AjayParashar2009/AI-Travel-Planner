import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  useEffect(() => {
    // Set a flag that this user is waiting for verification
    localStorage.setItem("awaiting_verification", "true");

    // Check every 2 seconds if the email has been verified
    const interval = setInterval(() => {
      const isVerified = localStorage.getItem("email_verified");

      if (isVerified === "true") {
        // Clear the flags
        localStorage.removeItem("email_verified");
        localStorage.removeItem("awaiting_verification");
        clearInterval(interval);

        // Wait 1 second to let the AuthContext update, then redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center text-white px-6">
      <div className="max-w-md w-full bg-[#08080a] p-10 rounded-[40px] border border-white/5 text-center shadow-2xl">
        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Mail size={40} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
          Check Your Email
        </h2>
        <p className="text-gray-400 mb-6">
          We have sent a verification link to{" "}
          <strong className="text-white">{email}</strong>. Please click the link
          to verify your account.
        </p>
        <p className="text-xs text-gray-600 mb-8">
          This page will automatically redirect once your email is verified.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
