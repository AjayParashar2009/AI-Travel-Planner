import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { CheckCircle2 } from "lucide-react"; // Add this icon

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(3);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`,
        );

        if (res.data.success && res.data.token) {
          localStorage.setItem("wander_token", res.data.token);
          localStorage.setItem("wander_user", JSON.stringify(res.data.user));

          setUser(res.data.user);
          setStatus("success");

          // Signal to the CheckEmail tab that verification is done
          localStorage.setItem("email_verified", "true");

          // Start a countdown timer for the redirect
          let timeLeft = 3;
          const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft <= 0) {
              clearInterval(timer);
              navigate("/dashboard");
            }
          }, 1000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };
    verify();
  }, [token, navigate, setUser]);

  if (status === "verifying") return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center text-white px-6">
      <div className="max-w-md w-full bg-[#08080a] p-10 rounded-[40px] border border-white/5 text-center shadow-2xl">
        {status === "success" ? (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-emerald-500">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-6">Your account is now active.</p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting you to the dashboard in{" "}
              <strong className="text-white">{countdown}</strong> seconds...
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Go to Dashboard Now
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-red-500">✕</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-red-500">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
